import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventReducer from '../features/events/eventSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
  },
});
