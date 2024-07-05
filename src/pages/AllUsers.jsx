import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';

function AllUsers() {
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
      const fetchAllUsers = async () => {
        try {
          const token = Cookies.get('token');
          console.log("token::::",token)
          if (!token) {
            throw new Error('No authentication token found.');
          }
  
          const response = await fetch('http://192.168.1.9:9999/api/auth/all-users', {
            headers: {
              'x-auth-token': `${token}`
            }
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
          setAllUsers(data);
          toast.success('Users fetched successfully!', {
            position: 'top-right',
            autoClose: 2000,
          });
        } catch (error) {
          console.error('Error fetching admins:', error);
          toast.error('Error fetching Users. Please try again later.', {
            position: 'top-right',
            autoClose: 2000,
          });
        }
      };
  
      fetchAllUsers();
    }, []);
  return (
    <div className="w-full h-screen rounded-md mt-12 p-4 bg-[#e4572e24]">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-xl font-semibold">All Users</h2>
        <p className="text-gray-600">A list of all the Users in your account including their name, title, email and role.</p>
      </div>
      <Link to='/addadmin' className="bg-[#17BEBB] hover:bg-[#E4572E] text-white py-2 px-4 rounded">Add Admin</Link>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-md border border-[#17BEBB]">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Password</th>
            <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Email</th>
            <th className="px-6 py-3 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((alluser, index) => (
            <tr key={index}>
              <td className="px-6 py-4 border-b text-sm text-gray-900">{alluser.name}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-900">{alluser.password}</td>
              <td className="px-6 py-4 border-b text-sm text-gray-900">{alluser.email}</td>
              <td className="px-6 py-4 border-b text-right text-sm">
                <button className="text-[#17BEBB] hover:text-[#E4572E]">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default AllUsers