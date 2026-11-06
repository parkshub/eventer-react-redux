jest.mock('axios', () => ({ get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() }));
jest.mock('/app/backend/config/cloudinary', () => ({ uploader: { upload: jest.fn(), destroy: jest.fn() } }));
const axios = require('axios');
const { configureStore } = require('@reduxjs/toolkit');
const events = require('/app/frontend/src/features/events/eventSlice');
const serverFixtures = require('./server-fixtures.cjs');
const deferred = require('./deferred.cjs');
const cloudinary = require('/app/backend/config/cloudinary');
let prior, updated, fixture;
function store() {
  return configureStore({
    reducer: {
      events: events.default,
      auth: (state = { user: fixture.user }) => state
    }
  });
}
beforeAll(serverFixtures.start);
afterAll(serverFixtures.stop);
beforeEach(async () => {
  jest.resetAllMocks();
  const storage = new Map();
  global.localStorage = {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key),
    clear: () => storage.clear()
  };
  cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });
  fixture = await serverFixtures.make();
  ({ prior, updated } = fixture);
});
afterEach(() => { delete global.localStorage; });
test('a pre-mutation detail response cannot replace the newer confirmed membership', async () => {
  const old = deferred();
  axios.get.mockReturnValueOnce(old.promise);
  const state = store();
  const pending = state.dispatch(events.getEvent(prior._id));
  axios.put.mockResolvedValue({ data: updated });
  await state.dispatch(events.attendEvent(prior._id));
  old.resolve({ data: prior });
  await pending;
  const selected = state.getState().events.event;
  if (selected) expect(selected.attending).toBe(2);
  const cached = JSON.parse(localStorage.getItem('event'));
  if (cached) expect(cached.attending).toBe(2);
});
test('a response for the previous selection cannot replace the selected event', async () => {
  const old = deferred();
  const other = fixture.other;
  axios.get.mockReturnValueOnce(old.promise).mockResolvedValueOnce({ data: other });
  const state = store();
  const pending = state.dispatch(events.getEvent(prior._id));
  await state.dispatch(events.getEvent(other._id));
  old.resolve({ data: prior });
  await pending;
  expect(state.getState().events.event._id).toBe(other._id);
  expect(JSON.parse(localStorage.getItem('event'))._id).toBe(other._id);
});
test('deletion removes detail/cache and a delayed detail request cannot resurrect it', async () => {
  axios.get.mockResolvedValueOnce({ data: prior });
  const state = store();
  await state.dispatch(events.getEvent(prior._id));
  const old = deferred();
  axios.get.mockReturnValueOnce(old.promise);
  const pending = state.dispatch(events.getEvent(prior._id));
  axios.delete.mockResolvedValue({ data: fixture.deletion });
  await state.dispatch(events.deleteEvent(prior._id));
  old.resolve({ data: prior });
  await pending;
  expect(state.getState().events.event).toBeFalsy();
  expect(JSON.parse(localStorage.getItem('event'))).toBeFalsy();
});
test('loaded list and profile copies do not retain outdated membership after joining', async () => {
  const state = store();
  axios.get.mockResolvedValueOnce({ data: [prior] });
  await state.dispatch(events.getAllEvents());
  axios.get.mockResolvedValueOnce({ data: [prior] });
  await state.dispatch(events.getHomeEvents());
  axios.get.mockResolvedValueOnce({ data: { userEvents: [prior], attendingEvents: [prior] } });
  await state.dispatch(events.getProfileEvents(fixture.user.id));
  axios.put.mockResolvedValue({ data: updated });
  await state.dispatch(events.attendEvent(prior._id));
  const slice = state.getState().events;
  const groups = [
    slice.events,
    slice.homeEvents,
    slice.profileEvents?.userEvents,
    slice.profileEvents?.attendingEvents,
    JSON.parse(localStorage.getItem('events'))
  ];
  for (const group of groups) {
    if (!Array.isArray(group)) continue;
    for (const event of group) {
      if (event._id === prior._id) expect(event.attending).toBe(2);
    }
  }
});
test('an update transport error is rejected, not reported as a successful undefined result', async () => {
  const state = store();
  localStorage.setItem('event', JSON.stringify(prior));
  axios.put.mockRejectedValue(new Error('Offline transport'));
  const result = await state.dispatch(events.updateEvent({ formData: prior, selectedFile: 'image' }));
  expect(events.updateEvent.rejected.match(result)).toBe(true);
  expect(state.getState().events.isRejected).toBe(true);
  const cached = JSON.parse(localStorage.getItem('event'));
  if (cached) expect(cached).toEqual(prior);
});
test('a detail read begun during a pending mutation cannot overwrite its successful completion', async () => {
  const state = store();
  const mutation = deferred();
  const read = deferred();
  axios.put.mockReturnValueOnce(mutation.promise);
  const changing = state.dispatch(events.attendEvent(prior._id));
  axios.get.mockReturnValueOnce(read.promise);
  const reading = state.dispatch(events.getEvent(prior._id));
  mutation.resolve({ data: updated });
  await changing;
  read.resolve({ data: prior });
  await reading;
  const selected = state.getState().events.event;
  if (selected) expect(selected.attending).toBe(2);
  const cached = JSON.parse(localStorage.getItem('event'));
  if (cached) expect(cached.attending).toBe(2);
});
test('a mutation of event A does not discard the pending selection response for unrelated event B', async () => {
  const state = store();
  const other = fixture.other;
  axios.get.mockResolvedValueOnce({ data: prior });
  await state.dispatch(events.getEvent(prior._id));
  const read = deferred();
  axios.get.mockReturnValueOnce(read.promise);
  const reading = state.dispatch(events.getEvent(other._id));
  axios.put.mockResolvedValueOnce({ data: updated });
  await state.dispatch(events.attendEvent(prior._id));
  read.resolve({ data: other });
  await reading;
  expect(state.getState().events.event._id).toBe(other._id);
  expect(JSON.parse(localStorage.getItem('event'))._id).toBe(other._id);
});
