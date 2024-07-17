import { configureStore } from '@reduxjs/toolkit';
import temperatureReducer from '../slices/temperatureSlice';

const store = configureStore({
  reducer: {
    temperature: temperatureReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
