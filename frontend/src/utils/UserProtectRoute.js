import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
const UserProtectedRoute = ({children}) => {
   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
   const navigate = useNavigate()

   useEffect(() => {
      if(!isAuthenticated){
         navigate('/')
      }
   },[isAuthenticated])
   
  return children
}

export default UserProtectedRoute
