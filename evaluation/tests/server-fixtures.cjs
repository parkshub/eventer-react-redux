const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const controller = require('/app/backend/controllers/eventController');
const Event = require('/app/backend/models/Events');
const User = require('/app/backend/models/User');
let database;

async function start() {
  database = await MongoMemoryReplSet.create({ binary: { version: '7.0.14' },
    replSet: { count: 1, storageEngine: 'wiredTiger' } });
  await mongoose.connect(database.getUri(), { dbName: 'frontend_contract_fixtures' });
}
async function stop() {
  await mongoose.disconnect();
  if (database) await database.stop();
}
async function invoke(method, user, id) {
  const res = {
    statusCode: 200, headersSent: false,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.payload = value; this.headersSent = true; return this; },
    send(value) { this.payload = value; this.headersSent = true; return this; },
    end() { this.headersSent = true; return this; }
  };
  let nextError;
  await controller[method]({ user, params: { id }, body: {} }, res, error => { nextError = error; });
  if (nextError) throw nextError;
  if (!res.headersSent || res.statusCode < 200 || res.statusCode >= 300) {
    throw new Error(`Real backend fixture request ${method} did not succeed: ${res.statusCode}`);
  }
  return res.payload === undefined ? undefined : JSON.parse(JSON.stringify(res.payload));
}
async function make() {
  await Promise.all([Event.deleteMany({}), User.deleteMany({})]);
  const [host, guest] = await User.create(['host', 'guest'].map(name => ({
    firstName: name, lastName: 'Person', email: `${name}@example.test`,
    password: 'fixture', image: '#112233', bio: 'Local fixture', attending: []
  })));
  const fields = {
    user: host.id, userName: 'host Person', title: 'Walk', caption: 'Local walk',
    description: 'Contract fixture', dateTime: '2030-06-15T12:00', street: '1 Park Road',
    city: 'Acton', imageUrl: 'https://images.example/image.png', cloudinaryId: 'fixture-image',
    maxAttendee: 4, attending: 1, attendee: [host.id]
  };
  const event = await Event.create(fields);
  const second = await Event.create({ ...fields, title: 'Other event' });
  await User.updateOne({ _id: host.id }, { $addToSet: { attending: { $each: [event._id, second._id] } } });
  const prior = await invoke('getEvent', guest, event.id);
  const other = await invoke('getEvent', guest, second.id);
  const updated = await invoke('attendEvent', guest, event.id);
  const deletion = await invoke('deleteEvent', host, event.id);
  return { prior, other, updated, deletion,
    user: { id: guest.id, _id: guest.id, token: 'fixture', attending: [] } };
}
module.exports = { start, stop, make };
