import { useState } from 'react'

import './App.css'
import LandingPage from './Pages/LandingPage'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
  ]);



  return (
    <>
      <GoogleOAuthProvider
        clientId="1065712212133-ti3o2vcejivl56g32gntu9g20tvbdr14.apps.googleusercontent.com"
      >
      <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </>
  )
}

export default App
