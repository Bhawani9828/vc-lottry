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
        console.log("token::::", token);
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
        console.error('Error fetching users:', error);
        toast.error('Error fetching users. Please try again later.', {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    };

    fetchAllUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      console.log("Deleting user with _id:", id);  // Debugging statement

      if (!id) {
        throw new Error('No _id provided for deletion');
      }

      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch(`http://192.168.1.9:9999/api/auth/delete-user/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted user from the state
      setAllUsers((prevUsers) => prevUsers.filter(user => user._id !== id));

      toast.success('User deleted successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user. Please try again later.', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      handleDelete(id);  // Pass _id correctly
    }
  };

  return (
    <div className="w-full h-screen rounded-md mt-12 p-4 bg-[#e4572e24]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">All Users</h2>
          <p className="text-gray-600">A list of all the Users in your account including their name, title, email, and role.</p>
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
                <td className="px-6 py-4 border-b text-sm">
                  <Link to={`/edituser/${alluser._id}`} className="text-[#17BEBB] me-3 z-10 hover:text-[#E4572E]">Edit</Link>
                  <button
                    onClick={() => confirmDelete(alluser._id)}  // Pass _id correctly
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllUsers;
