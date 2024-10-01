import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = '3919b2f01d9c5a2712acaa4ef6df1eba';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    fetchWeatherStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchWeatherSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchWeatherFailure(state, action) {
      state.loading = false;
      state.error = "location not found";
    },
  },
});

export const { fetchWeatherStart, fetchWeatherSuccess, fetchWeatherFailure } = weatherSlice.actions;

// Action creator for fetching weather data
export const fetchWeatherData = (location) => async (dispatch) => {
  dispatch(fetchWeatherStart());
  try {
    let response;
    if (typeof location === 'object' && location.latitude && location.longitude) {
      response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat: location.latitude,
          lon: location.longitude,
          appid: API_KEY,
          units: 'metric',
        },
      });
    } else {
      response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: location,
          appid: API_KEY,
          units: 'metric',
        },
      });
    }
    dispatch(fetchWeatherSuccess(response.data));
  } catch (error) {
    dispatch(fetchWeatherFailure(error.message));
  }
};

export default weatherSlice.reducer;