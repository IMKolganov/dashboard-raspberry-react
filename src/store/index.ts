import { configureStore } from '@reduxjs/toolkit';
import temperatureReducer from '../slices/temperatureSlice';
import soilMoistureReducer from '../slices/soilMoistureSlice';

const store = configureStore({
  reducer: {
    temperature: temperatureReducer,
    soilMoisture: soilMoistureReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;