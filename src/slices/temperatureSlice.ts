import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { hostAPI, countTryAttempts, timeoutMs } from '../const/api';
import { ErrorResponse } from '../models/ErrorResponse';

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

axiosRetry(axios, {
  retries: countTryAttempts,
  retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
    return retryCount * timeoutMs;
  },
  retryCondition: (error) => {
    return error.response?.status !== 200;
  },
});

export const fetchTemperature = createAsyncThunk('temperature/fetchTemperature', async () => {
  try {
    const response = await axios.get(`${hostAPI}/api/GetTemperatureAndHumidify?sensorId=1&useRandomValuesFotTest=true`);
    const data = response.data;

    // Проверяем поле `success`
    if (!data.success) {
      console.error('Request failed:', data.errorMessage);
      throw new Error(data.errorMessage || 'Request failed without errorMessage');
    }

    // Проверяем наличие данных
    if (data) {
      const { temperature, humidity } = data.data;
      return { temperature, humidity };
    } else {
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;

    if (axiosError.response && axiosError.response.data) {
      const errorData = axiosError.response.data;
      console.error('Error fetching data:', errorData);

      // Обрабатываем поля Message и Description
      throw new Error(
        `${errorData.Message || 'Unknown error'}${errorData.Description ? ' Description: ' + errorData.Description : ''}`
      );
    } else {
      console.error('Network or unknown error:', error);
      throw new Error(axiosError.message || 'Unknown error occurred');
    }
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
        state.error = null;
      })
      .addCase(fetchTemperature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch temperature and humidity after multiple attempts';
      });
  },
});

export default temperatureSlice.reducer;

export {};