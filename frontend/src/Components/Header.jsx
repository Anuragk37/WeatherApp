import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { FaCloud, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="flex items-center space-x-2 text-2xl font-bold">
            <FaCloud className="text-yellow-300" />
            <span>WeatherPro</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {role === 'admin' && (
              <Link to="/user-management" className="text-white hover:text-yellow-300 transition duration-300">
                User Management
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300 flex items-center"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;