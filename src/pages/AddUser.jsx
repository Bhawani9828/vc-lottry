import { useState } from 'react';
import axios from 'axios';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
function AddUser() {
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        email: "",
        town:'',
        address:'',
        role:"user"
        
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
            const token = Cookies.get('token');
            console.log("token::::",token)
            if (!token) {
              throw new Error('No authentication token found.');
            }
          const response = await axios.post('https://vclottery.in/vc/api/auth/create-user', formData, {
            headers: {
                'x-auth-token': `${token}`
              }
          });
          console.log('User added successfully:', response.data);
          toast.success('User added successfully!', {
            position: 'top-right',
            autoClose: 2000,
          });
        
          setFormData({
            name: '',
            password: '',
            email: '',
            town:'',
            address:'',
           
          });
          navigate('/userlist')
        } catch (error) {
          console.log("data::::::",error)
          if (error.response) {
           
            console.error('Server responded with error status:', error.response.status);
            console.error('Error details:', error.response.data);
            toast.error(error.response.status);
          } else if (error.request) {
       
            console.error('No response received from server:', error.request);
            toast.error('No response received from server. Please check your internet connection.');
          } else {
           
            console.error('Error setting up the request:', error.message);
            toast.error(error.message);
          }
        }
      };
  return (
    <div className="w-full  rounded-md mt-12 p-4 bg-[#e4572e24]">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-xl font-semibold">Add User</h2>
        <p className="text-gray-600">Add a new User to your account by filling in the information below.</p>
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
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Mobile number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="text"
          placeholder="Enter mobile"
          value={formData.email}
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
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Town
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="town"
          type="text"
          placeholder="Enter town"
          value={formData.town}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Address
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="address"
          type="text"
          placeholder="Enter address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
    
     
      <div className="flex items-center justify-between">
        <button
          className="bg-[#17BEBB] hover:bg-[#E4572E] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Add User
        </button>
      </div>
    </form>
  </div>
  )
}

export default AddUser