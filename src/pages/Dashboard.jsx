import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { ThreeCircles } from "react-loader-spinner";

function Dashboard() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("token");
        console.log("token::::", token);
        if (!token) {
          throw new Error("No authentication token found.");
        }

        const response = await fetch(
          "http://192.168.1.13:9999/api/auth/admins",
          {
            headers: {
              "x-auth-token": `${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAdmins(data);
        toast.success("Admins fetched successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Error fetching admins. Please try again later.", {
          position: "top-right",
          autoClose: 2000,
        });
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    try {
      console.log("Deleting admin with _id:", id); // Debugging statement

      if (!id) {
        throw new Error("No _id provided for deletion");
      }

      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch(
        `http://192.168.1.13:9999/api/auth/delete-user/${id}`,
        {
          method: "DELETE",
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted admin from the state
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== id));

      toast.success("Admin deleted successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Error deleting admin. Please try again later.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      handleDelete(id); // Pass _id correctly
    }
  };

  return (
    <div className="w-full rounded-md md:mt-20 p-4 bg-[#e4572e24]">
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
          <div className="flex md:justify-between  items-center mb-4">
            <div className="">
              <h2 className="text-xl font-semibold">All Admins</h2>
              <p className="text-gray-600">
                A list of all the admins in your account including their name,
                title, email and role.
              </p>
            </div>
            <Link
              to="/addadmin"
              className="relative inline-flex items-center justify-center py-2 px-4 overflow-hidden  md:text-lg tracking-tighter text-white bg-[#17BEBB] rounded-lg group"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#E4572E] rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
              <span className="relative">Add Admin</span>
            </Link>
            {/* <Link to='/addadmin' className="bg-[#17BEBB] hover:bg-[#E4572E] text-white py-2 px-4 rounded">

        Add Admin</Link> */}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md border-2 border-[#17BEBB]">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">
                    Password
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">
                    Mobile number
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
                  <th className="px-6 py-3 border-b text-center text-sm font-medium text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {admin.password}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {admin.town}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {admin.address}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {admin.role}
                    </td>
                    <td className="px-6 py-4 border-b flex justify-around  text-sm">
                      <Link
                        to={`/editadmin/${admin.id}`} state={{ user: admin }}
                        className="text-[#17BEBB]  hover:text-[#E4572E]"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => confirmDelete(admin.id)} // Pass _id correctly
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

export default Dashboard;
