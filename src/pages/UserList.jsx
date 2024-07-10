import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import {  ThreeCircles } from 'react-loader-spinner';

function UserList() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const fetchUsers = async () => {
        setIsLoading(true); // Start loading
        try {
          const token = Cookies.get('token');
          console.log("token::::", token);
          if (!token) {
            throw new Error('No authentication token found.');
          }

          const response = await fetch('http://192.168.1.9:9999/api/auth/users', {
            headers: {
              'x-auth-token': `${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setUsers(data);
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
        } finally {
          setIsLoading(false); // Stop loading
        }
      };

      fetchUsers();
    }, []);

  return (
    <div className="w-full rounded-md mt-12 p-4 bg-[#e4572e24]">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
         <ThreeCircles
  visible={true}
  height="100"
  width="100"
  color="#E4572E"
  ariaLabel="three-circles-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">All Users</h2>
              <p className="text-gray-600">A list of all the users in your account including their name, title, email, and role.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md border border-[#17BEBB]">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Role</th>
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">{user.role}</td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 border-b text-right text-sm">
                      <button className="text-[#17BEBB] hover:text-[#E4572E]">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default UserList;
