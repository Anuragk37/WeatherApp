import React from 'react'
import { FaGoogle } from 'react-icons/fa'
import { useGoogleLogin } from '@react-oauth/google';
import axiosInstance from '../utils/axiosInstance';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleSuccess = async(codeResponse) => {
      try{
         const response = await axiosInstance.post('/account/login-with-google/', {"code": codeResponse.code})
         dispatch(loginSuccess(response.data));
         navigate('/dashboard')
         console.log(response)
      }catch(error){
         console.log(error)
      }
    }

   const handleGoogleLogin = useGoogleLogin({
      onSuccess: handleSuccess,
      flow: 'auth-code',
   })

   

  return (
    <div>
      <button 
          onClick={handleGoogleLogin}
          className="bg-white text-blue-600 hover:bg-blue-100 transition-colors duration-300 flex items-center justify-center px-4 py-2 rounded-lg font-semibold shadow-md"
        >
          <FaGoogle className="mr-2" /> Sign in with Google
        </button>
    </div>
  )
}

export default GoogleLoginButton
