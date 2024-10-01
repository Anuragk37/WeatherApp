import React from 'react';
import { FaSun, FaCloud } from 'react-icons/fa';
import  GoogleLoginButton  from '../Components/GoogleLoginButton';
import { useSelector } from 'react-redux';
const LandingPage = () => {

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
 
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-2xl text-center">
        <div className="flex justify-center items-center mb-8">
          <FaSun className="text-yellow-300 text-5xl mr-2" />
          <FaCloud className="text-white text-6xl" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Welcome to WeatherNow</h1>
        <p className="text-xl mb-8">
          Your personal weather companion. Get accurate forecasts and real-time updates, all in one place.
        </p>
        {!isAuthenticated ? (
          <GoogleLoginButton />
        ) : (
          <p className="text-xl">You are already logged in.</p>
        )}
      </div>
    </div>
  );
};

export default LandingPage;