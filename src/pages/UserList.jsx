import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { ThreeCircles } from "react-loader-spinner";
import { Link } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true); // Start loading
      try {
        const token = Cookies.get("token");
        console.log("token::::", token);
        if (!token) {
          throw new Error("No authentication token found.");
        }

        const response = await fetch("https://vclottery.in/vc/api/auth/users", {
          headers: {
            "x-auth-token": `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.users);
        toast.success("Users fetched successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users. Please try again later.", {
          position: "top-right",
          autoClose: 2000,
        });
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchUsers();
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

      const response = await fetch(`https://vclottery.in/vc/api/auth/delete-user/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted user from the state
      setUsers((prevUsers) => prevUsers.filter(user => user._id !== id));

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
      console.log("id::::",id);
      handleDelete(id);  // Pass _id correctly
    }
  };

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
              <p className="text-gray-600">
                A list of all the users in your account including their name,
                Mobile number, password,town,address and role.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md border-2 border-[#17BEBB]">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">
                    Name
                  </th>
               
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">
                  Mobile number
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">
                    Password
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">
                    Town
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">
                    Address
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">
                    Role
                  </th>
                  <th className="px-6 py-3 border-b text-start text-sm font-medium text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {user.name}
                    </td>
                  
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {user.password}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {user.town || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {user.address || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 border-b text-sm flex justify-start">
                  <Link to={`/edituser/${user._id}`} state={{ user: user }} className="text-[#17BEBB] me-3 z-10 hover:text-[#E4572E]">Edit</Link>
                  <button
                    onClick={() => confirmDelete(user._id)}  // Pass _id correctly
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
        </>
      )}
    </div>
  );
}

export default UserList;
