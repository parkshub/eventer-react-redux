jest.mock('axios', () => ({
  get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn()
}));

const axios = require('axios');
const { configureStore } = require('@reduxjs/toolkit');
const eventService = require('../../frontend/src/features/events/eventService').default;
const events = require('../../frontend/src/features/events/eventSlice');

let storage;
const event = { _id: 'event-1', title: 'Park walk', attending: 2, maxAttendee: 5 };
const token = 'fixture-token';

function store() {
  return configureStore({
    reducer: {
      events: events.default,
      auth: (state = { user: { id: 'guest-1', token } }) => state
    }
  });
}

beforeEach(() => {
  jest.resetAllMocks();
  storage = new Map();
  global.localStorage = {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key),
    clear: () => storage.clear()
  };
});

afterEach(() => { delete global.localStorage; });

test('loading event detail updates state and its browser cache', async () => {
  axios.get.mockResolvedValue({ data: event });
  const state = store();
  const result = await state.dispatch(events.getEvent(event._id));
  expect(events.getEvent.fulfilled.match(result)).toBe(true);
  expect(state.getState().events.event).toEqual(event);
  expect(JSON.parse(localStorage.getItem('event'))).toEqual(event);
  expect(axios.get).toHaveBeenCalledWith('/api/event/getEvent/event-1');
});

test('successful join sends authentication and caches the server result', async () => {
  axios.put.mockResolvedValue({ data: event });
  const state = store();
  const result = await state.dispatch(events.attendEvent(event._id));
  expect(events.attendEvent.fulfilled.match(result)).toBe(true);
  expect(result.payload).toEqual(event);
  expect(JSON.parse(localStorage.getItem('event'))).toEqual(event);
  expect(axios.put).toHaveBeenCalledWith('/api/event/attendEvent/event-1', null, {
    headers: { authorization: `Bearer ${token}` }
  });
});

test('successful leave updates event state and caches the server result', async () => {
  const updated = { ...event, attending: 1 };
  axios.put.mockResolvedValue({ data: updated });
  const state = store();
  const result = await state.dispatch(events.unattendEvent(event));
  expect(events.unattendEvent.fulfilled.match(result)).toBe(true);
  expect(state.getState().events.event).toEqual(updated);
  expect(JSON.parse(localStorage.getItem('event'))).toEqual(updated);
  expect(axios.put).toHaveBeenCalledWith('/api/event/unattendEvent/event-1', event, {
    headers: { authorization: `Bearer ${token}` }
  });
});

test('a rejected join reaches the error state without changing the service cache', async () => {
  localStorage.setItem('event', JSON.stringify(event));
  axios.put.mockRejectedValue({ response: { data: 'Request rejected' } });
  const state = store();
  const result = await state.dispatch(events.attendEvent(event._id));
  expect(events.attendEvent.rejected.match(result)).toBe(true);
  expect(state.getState().events.isRejected).toBe(true);
  expect(state.getState().events.message).toBe('Request rejected');
  expect(state.getState().events.isPending).toBe(false);
  expect(JSON.parse(localStorage.getItem('event'))).toEqual(event);
});

test('a rejected leave reaches the error state without changing the service cache', async () => {
  localStorage.setItem('event', JSON.stringify(event));
  axios.put.mockRejectedValue({ response: { data: 'Request rejected' } });
  const state = store();
  const result = await state.dispatch(events.unattendEvent(event));
  expect(events.unattendEvent.rejected.match(result)).toBe(true);
  expect(state.getState().events.message).toBe('Request rejected');
  expect(JSON.parse(localStorage.getItem('event'))).toEqual(event);
});

test('deleting an event clears the selected event in state', async () => {
  axios.get.mockResolvedValue({ data: event });
  axios.delete.mockResolvedValue({ data: [] });
  const state = store();
  await state.dispatch(events.getEvent(event._id));
  const result = await state.dispatch(events.deleteEvent(event._id));
  expect(events.deleteEvent.fulfilled.match(result)).toBe(true);
  expect(state.getState().events.event).toBeFalsy();
  expect(axios.delete).toHaveBeenCalledWith('/api/event/deleteEvent/event-1', {
    headers: { authorization: `Bearer ${token}` }
  });
});

test('profile loading preserves hosted and attended result groups', async () => {
  const profile = { userEvents: [event], attendingEvents: [{ ...event, _id: 'event-2' }] };
  axios.get.mockResolvedValue({ data: profile });
  const state = store();
  await state.dispatch(events.getProfileEvents('guest-1'));
  expect(state.getState().events.profileEvents).toEqual(profile);
  expect(axios.get).toHaveBeenCalledWith('/api/event/getProfileEvents/guest-1', {
    headers: { authorization: `Bearer ${token}` }
  });
});

test('browse loading preserves results in state and browser storage', async () => {
  axios.get.mockResolvedValue({ data: [event] });
  const state = store();
  await state.dispatch(events.getAllEvents());
  expect(state.getState().events.events).toEqual([event]);
  expect(JSON.parse(localStorage.getItem('events'))).toEqual([event]);
});

test('home loading preserves the server event order', async () => {
  const ranked = [event, { ...event, _id: 'event-2', attending: 1 }];
  axios.get.mockResolvedValue({ data: ranked });
  const state = store();
  await state.dispatch(events.getHomeEvents());
  expect(state.getState().events.homeEvents).toEqual(ranked);
});

test('create service sends the form and image with authentication', async () => {
  axios.post.mockResolvedValue({ data: event });
  const payload = { formData: { title: 'Park walk' }, selectedFile: 'fixture-image' };
  expect(await eventService.createEvent(token, payload)).toEqual(event);
  expect(axios.post).toHaveBeenCalledWith('/api/event/', payload, {
    headers: { authorization: `Bearer ${token}` }
  });
});

test('update service targets the selected event and returns the saved details', async () => {
  axios.put.mockResolvedValue({ data: event });
  const payload = { formData: event, selectedFile: 'fixture-image' };
  expect(await eventService.updateEvent(token, payload)).toEqual(event);
  expect(axios.put).toHaveBeenCalledWith('/api/event/updateEvent/event-1', payload, {
    headers: { authorization: `Bearer ${token}` }
  });
});
