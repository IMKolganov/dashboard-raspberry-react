import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { hostAPI } from '../const/api';

// Определение состояния
interface SoilMoistureState {
  soilMoisture: number | null;
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: SoilMoistureState = {
  soilMoisture: null,
  loading: false,
  error: null,
};

// Настройка axios для повторных попыток
axiosRetry(axios, {
  retries: 5, // Количество повторных попыток
  retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
    return retryCount * 1000; // задержка в ms
  },
  retryCondition: (error) => {
    return error.response?.status !== 200; // повторять только если статус не 200
  },
});


export const fetchSoilMoisture = createAsyncThunk('soilMoisture/fetchSoilMoisture', async () => {
  try {
    const response = await axios.get(`${hostAPI}/api/GetSoilMoisture`);
    const data = JSON.parse(response.data);

    if (data && data.webservice_data && typeof data.webservice_data.soil_moisture === 'number') {
      const { soil_moisture } = data.webservice_data;
      return { soilMoisture: soil_moisture };
    } else {
      console.error('Invalid response structure or missing data:', data);
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
});


// Создание среза для управления состоянием влажности почвы
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
      .addCase(fetchSoilMoisture.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch soil moisture after multiple attempts';
      });
  },
});

export default soilMoistureSlice.reducer;

// Добавление этой строки для обеспечения распознавания файла как модуля
export {};