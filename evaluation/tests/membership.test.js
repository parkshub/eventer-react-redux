jest.mock('axios', () => ({ get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() }));
jest.mock('/app/backend/config/cloudinary', () => ({ uploader: { upload: jest.fn(), destroy: jest.fn() } }));
const storage = new Map();
global.localStorage = {
  getItem: key => storage.get(key) || null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: key => storage.delete(key)
};
const axios = require('axios');
const { configureStore } = require('@reduxjs/toolkit');
const events = require('/app/frontend/src/features/events/eventSlice');
const auth = require('/app/frontend/src/features/auth/authSlice').default;
const cloudinary = require('/app/backend/config/cloudinary');
const serverFixtures = require('./server-fixtures.cjs');
const deferred = require('./deferred.cjs');
beforeAll(serverFixtures.start);
afterAll(serverFixtures.stop);
const ids = refs => refs.map(ref => String(ref && (ref._id || ref.id) || ref));

test('an old real API response cannot undo confirmed user membership', async () => {
  cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });
  const fixture = await serverFixtures.make();
  const state = configureStore({
    reducer: { events: events.default, auth },
    preloadedState: { auth: { user: fixture.user } }
  });
  const old = deferred();
  axios.get.mockReturnValueOnce(old.promise);
  const reading = state.dispatch(events.getEvent(fixture.prior._id));
  axios.put.mockResolvedValueOnce({ data: fixture.updated });
  await state.dispatch(events.attendEvent(fixture.prior._id));
  expect(ids(state.getState().auth.user.attending)).toContain(fixture.prior._id);
  old.resolve({ data: fixture.prior });
  await reading;
  const selected = state.getState().events.event;
  if (selected) expect(selected.attending).toBe(fixture.updated.attending);
  expect(ids(state.getState().auth.user.attending)).toContain(fixture.prior._id);
});
