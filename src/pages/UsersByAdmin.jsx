import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

function UsersByAdmin() {
  const [admins, setAdmins] = useState([]);
  const [usersByAdmin, setUsersByAdmin] = useState({});
  const [openAdminId, setOpenAdminId] = useState(null);
  const [selectedWinnerId, setSelectedWinnerId] = useState(null); // New state to store selected winner ID

  useEffect(() => {
    // Fetch admins on component mount
    const fetchAdmins = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No authentication token found.');
        }

        const response = await fetch('http://192.168.1.9:9999/api/auth/admins', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAdmins(data);
        toast.success('Admins fetched successfully!', {
          position: 'top-right',
          autoClose: 2000,
        });
      } catch (error) {
        console.error('Error fetching admins:', error);
        toast.error('Error fetching admins. Please try again later.', {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    };

    fetchAdmins();
  }, []);

  const fetchUsersByAdmin = async (email) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch('http://192.168.1.9:9999/api/auth/all-users', {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const filteredUsers = data.filter(user => user.createdBy?.email === email);

      setUsersByAdmin(prevState => ({
        ...prevState,
        [email]: filteredUsers
      }));
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

  const toggleAccordion = async (email) => {
    if (openAdminId === email) {
      setOpenAdminId(null);
    } else {
      setOpenAdminId(email);
      if (!usersByAdmin[email]) {
        await fetchUsersByAdmin(email);
      }
    }
  };

  const handleDelete = async (id, type) => {
    try {
      console.log(`Deleting ${type} with _id:`, id);

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

      if (type === 'admin') {
        setAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== id));
      } else if (type === 'user') {
        setUsersByAdmin(prevState => {
          const newState = { ...prevState };
          Object.keys(newState).forEach(email => {
            newState[email] = newState[email].filter(user => user._id !== id);
          });
          return newState;
        });
      }

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`, {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Error deleting ${type}. Please try again later.`, {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  const confirmDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      handleDelete(id, type);
    }
  };

  const selectLotteryWinner = async (userId) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch('http://192.168.1.9:9999/api/auth/select-lottery-winner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update selectedWinnerId state to reflect the selected winner
      setSelectedWinnerId(userId);

      toast.success('Lottery winner selected successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error selecting lottery winner:', error);
      toast.error('Error selecting lottery winner. Please try again later.', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="w-full h-screen rounded-md mt-12 p-4 bg-[#e4572e24]">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md border border-[#17BEBB]">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Toggle</th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Password</th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Role</th>
              <th className="px-6 py-3 border-b text-center text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <React.Fragment key={admin.email}>
                <tr className="cursor-pointer hover:bg-gray-100" onClick={() => toggleAccordion(admin.email)}>
                  <td className="px-6 py-4 border-b text-sm text-gray-900">
                    {openAdminId === admin.email ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                  </td>
                  <td className="px-6 py-4 border-b text-sm text-gray-900">{admin.name}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-900">{admin.password}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-900">{admin.email}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-900">{admin.role}</td>
                  <td className="px-6 py-4 border-b text-center text-sm">
                    <Link to={`/edituser/${admin._id}`} className="text-[#17BEBB] me-3 z-10 hover:text-[#E4572E]">Edit</Link>
                    <button
                      onClick={() => confirmDelete(admin._id, 'admin')}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {openAdminId === admin.email && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 border-b">
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold">Users for {admin.name}</h3>
                        <div className="overflow-x-auto mt-4">
                          <table className="min-w-full bg-white rounded-md border border-[#17BEBB]">
                            <thead>
                              <tr>
                                <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Created By Name</th>
                                <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Created By Email</th>
                                <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Role</th>
                                <th className="px-6 py-3 border-b text-center text-sm font-medium text-gray-500">Winner</th>
                                <th className="px-6 py-3 border-b text-center text-sm font-medium text-gray-500">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {usersByAdmin[admin.email]?.map((user) => (
                                <tr key={user.email} className={selectedWinnerId === user._id ? "bg-green-100" : ""}>
                                  <td className="px-6 py-4 border-b text-sm text-gray-900">{user.name || 'N/A'}</td>
                                  <td className="px-6 py-4 border-b text-sm text-gray-900">{user.email || 'N/A'}</td>
                                  <td className="px-6 py-4 border-b text-sm text-gray-900">{user.role || 'N/A'}</td>
                                  <td className="px-6 py-4 border-b text-center text-sm">
                                    <button
                                      onClick={() => selectLotteryWinner(user._id)}
                                      className={`py-1 px-2 rounded-sm hover:bg-${selectedWinnerId === user._id ? "[#17BEBB]" : "[#E4572E]"} text-white bg-${selectedWinnerId === user._id ? "[#17BEBB]" : "[#E4572E]"}`}
                                    >
                                      Winner
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 border-b text-center text-sm">
                                    <Link to={`/edituser/${user._id}`} className="text-[#17BEBB] me-3 z-10 hover:text-[#E4572E]">Edit</Link>
                                    <button
                                      onClick={() => confirmDelete(user._id, 'user')}
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
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersByAdmin;
