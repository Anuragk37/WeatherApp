import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = '3919b2f01d9c5a2712acaa4ef6df1eba';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (location) => {
    let response;

    // Check if location is an object with latitude and longitude
    if (typeof location === 'object') {     
      // response = await axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`);
      console.log("response with coordinates", response.data);
      
    } else {
      // Default to city name query
      console.log("lattttt lofgggggggg",typeof location, location);
      
      response = await axios.get(`${BASE_URL}/forecast?q=${location}&appid=${API_KEY}&units=metric`);
      console.log("response with city", response.data);
      
    }

    return response.data;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
