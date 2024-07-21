import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { countTryAttempts, hostAPI } from '../const/api';

interface TemperatureState {
  temperature: number | null;
  humidity: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: TemperatureState = {
  temperature: null,
  humidity: null,
  loading: false,
  error: null,
};

// Configure axios to retry the request up to 5 times with a 1 second delay between retries
axiosRetry(axios, {
  retries: countTryAttempts,
  retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
    return retryCount * 1000; // time in ms
  },
  retryCondition: (error) => {
    return error.response?.status !== 200; // retry only if status is not 200
  },
});

export const fetchTemperature = createAsyncThunk('temperature/fetchTemperature', async () => {
  try {
    const response = await axios.get(`${hostAPI}/api/GetTemperatureAndHumidify`);
    console.log('Response data:', response.data); // log
    const { temperature, humidity } = response.data.webservice_data;
    return { temperature, humidity };
  } catch (error) {
    console.error('Error fetching data:', error); // log error
    throw error;
  }
});


const temperatureSlice = createSlice({
  name: 'temperature',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemperature.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemperature.fulfilled, (state, action) => {
        state.loading = false;
        state.temperature = action.payload.temperature;
        state.humidity = action.payload.humidity;
      })
      .addCase(fetchTemperature.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch temperature and humidity after multiple attempts';
      });
  },
});

export default temperatureSlice.reducer;

// Add this line to ensure the file is recognized as a module
export {};
