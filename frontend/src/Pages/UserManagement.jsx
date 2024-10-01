import React, { useEffect, useState } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import axiosInstance from '../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get('/account/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleBlockUser = async (id, isActive) => {
    try {
      await axiosInstance.patch(`/account/block-user/${id}/`);
      getUsers();
      toast.success(`User ${isActive ? 'blocked' : 'unblocked'} successfully!`);
    } catch (error) {
      toast.error('Error blocking/unblocking user.');
    }
  };

  const confirmBlockUser = (id, isActive) => {
    toast.info(
      <>
        <div className="font-bold mb-2">
          Are you sure you want to {isActive ? 'block' : 'unblock'} this user?
        </div>
        <div className="flex justify-around mt-2">
          <button
            onClick={() => handleBlockUser(id, isActive)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full"
          >
            No
          </button>
        </div>
      </>,
      { autoClose: true, closeOnClick: true, position:'top-center' }
    );
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-purple-100 to-blue-100 min-h-screen p-8">
      <ToastContainer />
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">User Management</h1>
          
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <div className="overflow-x-auto bg-gray-100 rounded-lg">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Username</th>
                  <th className="py-3 px-4 text-left">First Name</th>
                  <th className="py-3 px-4 text-left">Last Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition duration-300">
                    <td className="py-3 px-4 border-b">{user.id}</td>
                    <td className="py-3 px-4 border-b flex items-center">
                      <FaUserCircle className="mr-2 text-gray-500" size={20} />
                      {user.username}
                    </td>
                    <td className="py-3 px-4 border-b">{user.first_name}</td>
                    <td className="py-3 px-4 border-b">{user.last_name}</td>
                    <td className="py-3 px-4 border-b">{user.email}</td>
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() => confirmBlockUser(user.id, user.is_active)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                          user.is_active
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {user.is_active ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
