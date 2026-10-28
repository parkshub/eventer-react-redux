const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

jest.mock('../../backend/config/cloudinary', () => ({
  uploader: { upload: jest.fn(), destroy: jest.fn() }
}));

const controller = require('../../backend/controllers/eventController');
const Event = require('../../backend/models/Events');
const User = require('../../backend/models/User');
const cloudinary = require('../../backend/config/cloudinary');

let database;
let host;
let guest;
let other;

function response() {
  return {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json: jest.fn(),
    send: jest.fn()
  };
}

function request(user, event, body = {}) {
  return { user, params: { id: event.id }, body };
}

function eventFields(overrides = {}) {
  return {
    user: host.id,
    userName: 'Host Person',
    title: 'Weekend walk',
    caption: 'Meet at the park',
    description: 'A local outdoor gathering.',
    dateTime: '2030-06-15T12:00',
    street: '1 Park Road',
    city: 'Acton',
    imageUrl: 'https://images.example/event.png',
    cloudinaryId: 'event-image',
    maxAttendee: 5,
    attending: 1,
    attendee: [host.id],
    ...overrides
  };
}

function ids(values) { return values.map(value => String(value._id || value)); }

beforeAll(async () => {
  database = await MongoMemoryReplSet.create({
    binary: { version: '7.0.14' },
    replSet: { count: 1, storageEngine: 'wiredTiger' }
  });
  await mongoose.connect(database.getUri(), { dbName: 'eventer_baseline' });
});

beforeEach(async () => {
  await Promise.all([Event.deleteMany({}), User.deleteMany({})]);
  [host, guest, other] = await User.create(['Host', 'Guest', 'Other'].map(name => ({
    firstName: name, lastName: 'Person', email: `${name.toLowerCase()}@example.test`,
    password: 'fixture-only', image: '#112233', bio: 'Test profile', attending: []
  })));
  cloudinary.uploader.upload.mockResolvedValue({
    secure_url: 'https://images.example/new.png', public_id: 'new-image'
  });
  cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

afterAll(async () => {
  await mongoose.disconnect();
  if (database) await database.stop();
});

test('creating an event persists its details and includes the host once', async () => {
  const formData = eventFields();
  const res = response();
  await controller.createEvent({ user: host, body: { formData, selectedFile: 'fixture-image' } }, res);
  expect(res.statusCode).toBe(200);
  const saved = await Event.findById(res.json.mock.calls[0][0].id);
  expect(saved.title).toBe(formData.title);
  expect(saved.maxAttendee).toBe(5);
  expect(saved.attending).toBe(1);
  expect(ids(saved.attendee)).toEqual([host.id]);
  expect(saved.imageUrl).toBe('https://images.example/new.png');
});

test('one normal join updates both membership records and returns attendee details', async () => {
  const event = await Event.create(eventFields());
  const res = response();
  await controller.attendEvent(request(guest, event), res);
  const saved = await Event.findById(event.id);
  expect(saved.attending).toBe(2);
  expect(ids(saved.attendee)).toEqual([host.id, guest.id]);
  expect(ids((await User.findById(guest.id)).attending)).toEqual([event.id]);
  expect(res.statusCode).toBe(200);
  expect(res.json.mock.calls[0][0].attendee.map(user => user.firstName)).toEqual(['Host', 'Guest']);
});

test('one normal leave removes only the departing guest from both records', async () => {
  const event = await Event.create(eventFields({ attendee: [host.id, guest.id, other.id], attending: 3 }));
  await User.updateMany({ _id: { $in: [guest.id, other.id] } }, { $push: { attending: event.id } });
  const res = response();
  await controller.unattendEvent(request(guest, event), res);
  const saved = await Event.findById(event.id);
  expect(saved.attending).toBe(2);
  expect(ids(saved.attendee)).toEqual([host.id, other.id]);
  expect((await User.findById(guest.id)).attending).toHaveLength(0);
  expect(ids((await User.findById(other.id)).attending)).toEqual([event.id]);
  expect(res.statusCode).toBe(200);
});

test('the host can edit details and increase capacity without losing attendees', async () => {
  const event = await Event.create(eventFields({ attendee: [host.id, guest.id], attending: 2 }));
  const res = response();
  await controller.updateEvent(request(host, event, {
    selectedFile: event.imageUrl, formData: { title: 'Updated walk', maxAttendee: 8 }
  }), res);
  const saved = await Event.findById(event.id);
  expect(saved.title).toBe('Updated walk');
  expect(saved.maxAttendee).toBe(8);
  expect(saved.attending).toBe(2);
  expect(ids(saved.attendee)).toEqual([host.id, guest.id]);
  expect(saved.imageUrl).toBe(event.imageUrl);
  expect(res.statusCode).toBe(200);
});

test('the host can replace the event image', async () => {
  const event = await Event.create(eventFields());
  const res = response();
  await controller.updateEvent(request(host, event, {
    selectedFile: 'replacement-image', formData: { title: 'New image walk' }
  }), res);
  const saved = await Event.findById(event.id);
  expect(saved.imageUrl).toBe('https://images.example/new.png');
  expect(saved.cloudinaryId).toBe('new-image');
  expect(saved.title).toBe('New image walk');
});

test('deleting an event removes its memberships while preserving unrelated events', async () => {
  const event = await Event.create(eventFields({ attendee: [host.id, guest.id], attending: 2 }));
  const retained = await Event.create(eventFields({
    title: 'Keep this event', attendee: [host.id, guest.id], attending: 2
  }));
  await User.updateMany({ _id: { $in: [host.id, guest.id] } }, {
    $set: { attending: [event.id, retained.id] }
  });
  const res = response();
  await controller.deleteEvent(request(host, event), res);
  expect(await Event.findById(event.id)).toBeNull();
  expect(await Event.findById(retained.id)).not.toBeNull();
  for (const user of [host, guest]) {
    expect(ids((await User.findById(user.id)).attending)).toEqual([retained.id]);
  }
  expect(res.statusCode).toBe(200);
});

test('event detail returns populated attendees', async () => {
  const event = await Event.create(eventFields());
  const res = response();
  await controller.getEvent(request(guest, event), res);
  expect(res.json.mock.calls[0][0].id).toBe(event.id);
  expect(res.json.mock.calls[0][0].attendee[0].firstName).toBe('Host');
});

test('profile separates hosted events from attended events', async () => {
  const hosted = await Event.create(eventFields({ user: guest.id, attendee: [guest.id] }));
  const attended = await Event.create(eventFields({ attendee: [host.id, guest.id], attending: 2 }));
  await Event.create(eventFields({ title: 'Unrelated' }));
  await User.findByIdAndUpdate(guest.id, { attending: [attended.id] });
  const res = response();
  await controller.getProfileEvents({ params: { id: guest.id } }, res);
  expect(ids(res.json.mock.calls[0][0].userEvents)).toEqual([hosted.id]);
  expect(ids(res.json.mock.calls[0][0].attendingEvents)).toEqual([attended.id]);
});

test('home returns the four most attended events in descending order', async () => {
  const additional = await User.create(['Fourth', 'Fifth', 'Sixth'].map(name => ({
    firstName: name, lastName: 'Person', email: `${name}@example.test`,
    password: 'fixture-only', image: '#112233', bio: 'Test profile'
  })));
  const participants = [host, guest, other, ...additional];
  const rankedEvents = await Event.create([2, 6, 3, 5, 1, 4].map(attending => eventFields({
    attending, maxAttendee: 10, attendee: participants.slice(0, attending).map(user => user.id)
  })));
  for (const user of participants) {
    await User.findByIdAndUpdate(user.id, {
      attending: rankedEvents.filter(event => ids(event.attendee).includes(user.id)).map(event => event.id)
    });
  }
  const res = response();
  await controller.getHomeEvents({}, res);
  expect(res.json.mock.calls[0][0].map(event => event.attending)).toEqual([6, 5, 4, 3]);
});

test('browse returns all existing events', async () => {
  const events = await Event.create([eventFields(), eventFields({ title: 'Second' })]);
  const res = response();
  await controller.getAllEvents({}, res);
  expect(ids(res.json.mock.calls[0][0]).sort()).toEqual(ids(events).sort());
});

test('hosted-event lookup excludes events owned by someone else', async () => {
  const owned = await Event.create(eventFields());
  await Event.create(eventFields({ user: guest.id }));
  const res = response();
  await controller.getUserEvents({ user: host }, res);
  expect(ids(res.json.mock.calls[0][0])).toEqual([owned.id]);
});
