import React from 'react'
import { FaGoogle } from 'react-icons/fa'
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = () => {

   const handleSuccess = async(codeResponse) => {
      try{
        console.log(codeResponse);
        
         const response = await axios.post('http://127.0.0.1:8000/api/account/login-with-google/', {"code": codeResponse.code})
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
