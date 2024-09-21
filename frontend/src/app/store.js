// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import weatherReducer from '../features/weatherSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
  },
});

export default store;
