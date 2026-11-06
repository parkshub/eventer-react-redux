jest.mock('axios', () => ({ get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() }));
jest.mock('/app/backend/config/cloudinary', () => ({ uploader: { upload: jest.fn(), destroy: jest.fn() } }));
const axios = require('axios');
const { configureStore } = require('@reduxjs/toolkit');
const events = require('/app/frontend/src/features/events/eventSlice');
const serverFixtures = require('./server-fixtures.cjs');
const deferred = require('./deferred.cjs');
const cloudinary = require('/app/backend/config/cloudinary');
let prior, updated, fixture;
beforeAll(serverFixtures.start);
afterAll(serverFixtures.stop);
beforeEach(async () => {
  jest.resetAllMocks();
  const storage = new Map();
  global.localStorage = {
    getItem: key => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key)
  };
  cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });
  fixture = await serverFixtures.make();
  ({ prior, updated } = fixture);
});
afterEach(() => { delete global.localStorage; });
test('late detail failure cannot restore stale membership; invalidation is allowed', async () => {
  const state = configureStore({ reducer: { events: events.default,
    auth: (value = { user: fixture.user }) => value } });
  axios.get.mockResolvedValueOnce({ data: prior });
  await state.dispatch(events.getEvent(prior._id));
  const read = deferred();
  axios.get.mockReturnValueOnce(read.promise);
  const reading = state.dispatch(events.getEvent(prior._id));
  axios.put.mockResolvedValueOnce({ data: updated });
  await state.dispatch(events.attendEvent(prior._id));
  expect(state.getState().events.event.attending).toBe(2);
  read.reject(new Error('Late read failure'));
  const result = await reading;
  expect(events.getEvent.rejected.match(result)).toBe(true);
  const selected = state.getState().events.event;
  const cached = JSON.parse(localStorage.getItem('event'));
  if (selected) expect(selected.attending).toBe(2);
  if (cached) expect(cached.attending).toBe(2);
});
test('returning to event A does not let its first selection overwrite its latest selection response', async () => {
  const state = configureStore({ reducer: { events: events.default,
    auth: (value = { user: fixture.user }) => value } });
  const old = deferred();
  axios.get.mockReturnValueOnce(old.promise);
  const first = state.dispatch(events.getEvent(prior._id));
  axios.get.mockResolvedValueOnce({ data: fixture.other });
  await state.dispatch(events.getEvent(fixture.other._id));
  axios.get.mockResolvedValueOnce({ data: updated });
  await state.dispatch(events.getEvent(prior._id));
  expect(state.getState().events.event.attending).toBe(2);
  old.resolve({ data: prior });
  await first;
  expect(state.getState().events.event.attending).toBe(2);
  expect(JSON.parse(localStorage.getItem('event')).attending).toBe(2);
});
