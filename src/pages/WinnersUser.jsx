import  { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { ThreeCircles } from "react-loader-spinner";
import { Link } from "react-router-dom";

function WinnersUser() {
  const [winnersUsers, setWinnersUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWinnersUser();
  }, []);

  const fetchWinnersUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch("http://192.168.1.9:9999/api/auth/admin-winners", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Check if data.winners exists and is an array
      if (data.winners && Array.isArray(data.winners)) {
        setWinnersUsers(data.winners);
      } else {
        throw new Error("Invalid data structure received from API");
      }
      toast.success("Winners fetched successfully!");
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
      toast.error(`Error fetching users: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
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

      setWinnersUsers((prevUsers) => prevUsers.filter(user => user._id !== id));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(`Error deleting user: ${error.message}`);
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      handleDelete(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeCircles visible={true} height="100" width="100" color="#E4572E" ariaLabel="three-circles-loading" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (winnersUsers.length === 0) {
    return <div>No winning users found.</div>;
  }

  return (
    <div className="w-full rounded-md mt-12 p-4 bg-[#e4572e24]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Winning Users</h2>
          <p className="text-gray-600">A list of all the users who have won the lottery.</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md border-2 border-[#17BEBB]">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500"></th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Role</th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 border-b text-start text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {winnersUsers.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 border-b text-sm text-gray-900">   ✅</td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">{user.role}</td>
                <td className="px-6 py-4 border-b text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 border-b text-sm flex justify-start">
                  <Link to={`/edituser/${user._id}`} state={{ user: user }} className="text-[#17BEBB] me-3 z-10 hover:text-[#E4572E]">Edit</Link>
                  <button onClick={() => confirmDelete(user._id)} className="text-red-500 hover:text-red-700 ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WinnersUser;