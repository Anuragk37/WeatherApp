import { useState } from 'react'

import './App.css'
import { Provider } from 'react-redux';
import store from './app/store';
import LandingPage from './Pages/LandingPage'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './Pages/Dashboard';
import AdminLogin from './Pages/AdminLogin';
import UserManagement from './Pages/UserManagement';
import UserProtecredRoute from './utils/userProtectRoute';

function App() {
  

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />
    },
    {
      path: "/dashboard",
      element: <UserProtecredRoute ><Dashboard /> </UserProtecredRoute>
    },
    {
      path: "/admin-login",
      element: <AdminLogin />
    },
    {
      path: "/user-management",
      element: <UserManagement />
    }
  ]);



  return (
    <>
    <Provider store={store}>
      <GoogleOAuthProvider
        clientId="1065712212133-ti3o2vcejivl56g32gntu9g20tvbdr14.apps.googleusercontent.com"
      >
          
            <RouterProvider router={router} />
          
      </GoogleOAuthProvider>
      </Provider>
    </>
  )
}

export default App
