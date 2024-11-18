import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { hostAPI, countTryAttempts, timeoutMs } from '../const/api';
import { ErrorResponse } from '../models/ErrorResponse';

interface SoilMoistureState {
  soilMoisture: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: SoilMoistureState = {
  soilMoisture: null,
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

export const fetchSoilMoisture = createAsyncThunk('soilMoisture/fetchSoilMoisture`', async () => {
  try {
    const response = await axios.get(`${hostAPI}/api/GetSoilMoisture?sensorId=1&useRandomValuesFotTest=true`);
    const data = response.data;

    // Проверяем поле `success`
    if (!data.success) {
      console.error('Request failed:', data.errorMessage);
      throw new Error(data.errorMessage || 'Request failed without errorMessage');
    }

    // Проверяем, есть ли ожидаемые данные
    if (data.data && typeof data.data.soilMoistureLevelPercent === 'number') {
      const { soilMoistureLevelPercent } = data.data;
      return { soilMoisture: soilMoistureLevelPercent };
    } else {
      console.error('Invalid response structure or missing data:', data);
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;

    if (axiosError.response && axiosError.response.data) {
      const errorData = axiosError.response.data;
      console.error('Error fetching data:', errorData);

      // Используем Message и Description, если они доступны
      throw new Error(
        `${errorData.Message || 'Unknown error'}${errorData.Description ? ' Description: ' + errorData.Description : ''}`
      );
    } else {
      console.error('Network or unknown error:', error);
      throw new Error(axiosError.message || 'Unknown error occurred');
    }
  }
});


const soilMoistureSlice = createSlice({
  name: 'soilMoisture',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSoilMoisture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSoilMoisture.fulfilled, (state, action) => {
        state.loading = false;
        state.soilMoisture = action.payload.soilMoisture;
      })
      .addCase(fetchSoilMoisture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch soil moisture after multiple attempts';
      });
  },
});

export default soilMoistureSlice.reducer;

export {};