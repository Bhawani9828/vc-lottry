import { useState } from 'react';
import axios from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function AddAdmin() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    email: '',
    role: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.1.2:9999/api/auth/register', formData);
      console.log('Admin added successfully:', response.data);
      toast.success('Admin added successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
    
      setFormData({
        name: '',
        password: '',
        email: '',
        role: ''
      });
    } catch (error) {
      console.log("data::::::",error)
      if (error.response) {
       
        console.error('Server responded with error status:', error.response.status);
        console.error('Error details:', error.response.data);
        toast.error('Error adding admin. Please try again later.');
      } else if (error.request) {
   
        console.error('No response received from server:', error.request);
        toast.error('No response received from server. Please check your internet connection.');
      } else {
       
        console.error('Error setting up the request:', error.message);
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="w-full h-screen rounded-md mt-12 p-4 bg-[#e4572e24]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Add Admin</h2>
          <p className="text-gray-600">Add a new admin to your account by filling in the information below.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
            Role
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-[#17BEBB] hover:bg-[#E4572E] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Admin
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAdmin;