const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
jest.mock('/app/backend/config/cloudinary', () => ({ uploader: { upload: jest.fn(), destroy: jest.fn() } }));
const controller = require('/app/backend/controllers/eventController');
const Event = require('/app/backend/models/Events');
const User = require('/app/backend/models/User');
const cloudinary = require('/app/backend/config/cloudinary');
let database, users;
const ids = values => values.map(value => String(value._id || value));
function eventFields(overrides = {}) {
  return {
    user: users[0].id,
    userName: 'Host Person',
    title: 'Probe',
    caption: 'Probe',
    description: 'Local test',
    dateTime: '2030-06-15T12:00',
    street: '1 Park Road',
    city: 'Acton',
    imageUrl: 'https://images.example/image.png',
    cloudinaryId: 'image',
    maxAttendee: 5,
    attending: 1,
    attendee: [users[0].id],
    ...overrides
  };
}
async function createEvent(overrides = {}) {
  const event = await Event.create(eventFields(overrides));
  await User.updateMany({ _id: { $in: event.attendee } }, { $addToSet: { attending: event.id } });
  return event;
}
async function invoke(method, user, event, body = {}) {
  const result = {
    statusCode: 200,
    headersSent: false,
    payload: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.payload = value;
      this.headersSent = true;
      return this;
    },
    send(value) {
      this.payload = value;
      this.headersSent = true;
      return this;
    },
    end() {
      this.headersSent = true;
      return this;
    }
  };
  try {
    await controller[method]({ user, params: { id: event.id }, body }, result, error => {
      if (error) {
        result.error = error;
        result.statusCode = error.statusCode || error.status || 500;
      }
    });
  } catch (error) {
    result.error = error;
    result.statusCode = error.statusCode || error.status || 500;
  }
  return result;
}
async function expectConsistentAttendance(eventId) {
  const event = await Event.findById(eventId);
  const allUsers = await User.find();
  if (!event) {
    for (const user of allUsers) expect(ids(user.attending)).not.toContain(String(eventId));
    return;
  }
  const members = ids(event.attendee);
  expect(new Set(members).size).toBe(members.length);
  expect(event.attending).toBe(members.length);
  expect(event.attending).toBeGreaterThanOrEqual(0);
  expect(event.attending).toBeLessThanOrEqual(event.maxAttendee);
  for (const user of allUsers) {
    const refs = ids(user.attending).filter(id => id === String(eventId));
    expect(refs.length).toBe(members.includes(user.id) ? 1 : 0);
  }
}
beforeAll(async () => {
  database = await MongoMemoryReplSet.create({ binary: { version: '7.0.14' },
    replSet: { count: 1, storageEngine: 'wiredTiger' } });
  await mongoose.connect(database.getUri(), { dbName: 'attendance_probe' });
});
beforeEach(async () => {
  await Promise.all([Event.deleteMany({}), User.deleteMany({})]);
  users = await User.create(Array.from({ length: 8 }, (_, index) => ({ firstName: `Person${index}`,
    lastName: 'Test', email: `person${index}@example.test`, password: 'fixture', image: '#112233', bio: 'Test' })));
  cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'https://images.example/new.png', public_id: 'new-image' });
  cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());
afterAll(async () => {
  await mongoose.disconnect();
  if (database) await database.stop();
});

test('creation mirrors the host membership into the user record', async () => {
  const res = await invoke('createEvent', users[0], { id: 'unused' }, { formData: eventFields(), selectedFile: 'image' });
  expect(res.statusCode).toBeGreaterThanOrEqual(200);
  expect(res.statusCode).toBeLessThan(300);
  expect(res.headersSent).toBe(true);
  const event = await Event.findOne({ title: 'Probe' });
  expect(event).not.toBeNull();
  await expectConsistentAttendance(event.id);
});
test('duplicate joins and duplicate leaves do not change membership twice', async () => {
  const event = await createEvent();
  await invoke('attendEvent', users[1], event);
  await invoke('attendEvent', users[1], event);
  await expectConsistentAttendance(event.id);
  expect((await Event.findById(event.id)).attending).toBe(2);
  await invoke('unattendEvent', users[1], event);
  await invoke('unattendEvent', users[1], event);
  await expectConsistentAttendance(event.id);
  expect((await Event.findById(event.id)).attending).toBe(1);
});
test('concurrent duplicate joins and distinct last-seat claims remain bounded', async () => {
  const event = await createEvent({ maxAttendee: 2 });
  const joiners = [...users.slice(1), users[1], users[1]];
  await Promise.all(joiners.map(user => invoke('attendEvent', user, event)));
  await expectConsistentAttendance(event.id);
  expect((await Event.findById(event.id)).attending).toBe(2);
});
test('leaving as a nonmember preserves the count', async () => {
  const event = await createEvent();
  await invoke('unattendEvent', users[1], event);
  await expectConsistentAttendance(event.id);
  expect((await Event.findById(event.id)).attending).toBe(1);
});
test('capacity reduction below attendance is rejected', async () => {
  const event = await createEvent({ attendee: [users[0].id, users[1].id], attending: 2 });
  const result = await invoke('updateEvent', users[0], event, { selectedFile: event.imageUrl, formData: { maxAttendee: 1 } });
  expect(result.statusCode).toBeGreaterThanOrEqual(400);
  expect((await Event.findById(event.id)).maxAttendee).toBe(event.maxAttendee);
  await expectConsistentAttendance(event.id);
});
test('capacity updates racing with joins preserve the invariant', async () => {
  const event = await createEvent({ maxAttendee: 3 });
  await Promise.all([
    invoke('updateEvent', users[0], event, { selectedFile: event.imageUrl, formData: { maxAttendee: 1 } }),
    ...users.slice(1).map(user => invoke('attendEvent', user, event))
  ]);
  await expectConsistentAttendance(event.id);
});
test('nonowners cannot modify or delete events', async () => {
  const event = await createEvent();
  const edit = await invoke('updateEvent', users[1], event, { selectedFile: event.imageUrl, formData: { title: 'Unauthorized' } });
  expect(edit.statusCode).toBeGreaterThanOrEqual(400);
  expect((await Event.findById(event.id)).title).toBe('Probe');
  const deletion = await invoke('deleteEvent', users[1], event);
  expect(deletion.statusCode).toBeGreaterThanOrEqual(400);
  expect(await Event.findById(event.id)).not.toBeNull();
  await expectConsistentAttendance(event.id);
});
test('failed user-side writes cannot leave a half-committed join, and a retry succeeds', async () => {
  const event = await createEvent();
  let injectedFailures = 0;
  const writeMethods = ['updateOne', 'updateMany', 'findOneAndUpdate', 'findOneAndReplace', 'replaceOne', 'bulkWrite'];
  const spies = writeMethods
    .filter(name => typeof User.collection[name] === 'function')
    .map(name => jest.spyOn(User.collection, name).mockImplementation((...args) => {
      injectedFailures++;
      const error = new Error('Injected user write failure');
      const callback = args[args.length - 1];
      if (typeof callback === 'function') {
        process.nextTick(() => callback(error));
        return;
      }
      return Promise.reject(error);
    }));
  const result = await invoke('attendEvent', users[1], event);
  spies.forEach(spy => spy.mockRestore());
  expect(injectedFailures).toBeGreaterThan(0);
  expect(result.statusCode).toBeGreaterThanOrEqual(400);
  await expectConsistentAttendance(event.id);
  expect((await Event.findById(event.id)).attending).toBe(1);
  await invoke('attendEvent', users[1], event);
  await expectConsistentAttendance(event.id);
  expect((await Event.findById(event.id)).attending).toBe(2);
});
test('deletion racing with joins does not leave dangling memberships', async () => {
  const event = await createEvent({ maxAttendee: 8 });
  const unrelated = await createEvent({ title: 'Unrelated' });
  const results = await Promise.all([
    invoke('deleteEvent', users[0], event),
    ...users.slice(1).map(user => invoke('attendEvent', user, event))
  ]);
  if (await Event.findById(event.id)) {
    expect(results[0].statusCode).toBeGreaterThanOrEqual(400);
    const retry = await invoke('deleteEvent', users[0], event);
    expect(retry.statusCode).toBeGreaterThanOrEqual(200);
    expect(retry.statusCode).toBeLessThan(300);
  }
  expect(await Event.findById(event.id)).toBeNull();
  await expectConsistentAttendance(event.id);
  expect(await Event.findById(unrelated.id)).not.toBeNull();
  await expectConsistentAttendance(unrelated.id);
});
