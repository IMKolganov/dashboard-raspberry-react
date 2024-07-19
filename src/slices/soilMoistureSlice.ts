import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { hostAPI } from '../const/api';

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

export const fetchSoilMoisture = createAsyncThunk('soilMoisture/fetchSoilMoisture', async () => {
  const response = await axios.get(`${hostAPI}/api/soil-moisture`);
  return response.data.soilMoisture;
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
        state.soilMoisture = action.payload;
      })
      .addCase(fetchSoilMoisture.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch soil moisture';
      });
  },
});

export default soilMoistureSlice.reducer;

// Add this line to ensure the file is recognized as a module
export {};
