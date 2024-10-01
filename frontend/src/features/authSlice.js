// src/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken:  null,
  refreshToken: null,
  isAuthenticated: false,
  role: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.role = action.payload.role;
      state.isAuthenticated = true;

      localStorage.setItem('accessToken', action.payload.access);
      localStorage.setItem('refreshToken', action.payload.refresh);
      localStorage.setItem('role', action.payload.role);
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
    }
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
