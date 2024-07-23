import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { ThreeCircles } from "react-loader-spinner";

function AllWinners() {
  const [admins, setAdmins] = useState([]);
  const [allWinners, setAllWinners] = useState({});
  const [openAdminId, setOpenAdminId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch("https://vclottery.in/vc/api/auth/admins", {
        headers: { "x-auth-token": token },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAdmins(data);
      toast.success("Admins fetched successfully!", { autoClose: 2000 });
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Error fetching admins. Please try again later.", {
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllWinners = async (email) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }
  
      const response = await fetch("https://vclottery.in/vc/api/auth/all-users", {
        headers: { "x-auth-token": token },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Raw response:", response); // Log the raw response
      console.log("Fetched data:", data); // Log the parsed data
  
      const users = data.users; // Adjust this line based on actual structure
  
      if (!Array.isArray(users)) {
        throw new Error("Unexpected response format: users is not an array.");
      }
  
      const filteredUsers = users.filter(
        (user) => user.createdBy?.email === email && user.hasWonLottery
      );
  
      setAllWinners((prevState) => ({ ...prevState, [email]: filteredUsers }));
      toast.success("Users fetched successfully!", { autoClose: 2000 });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users. Please try again later.", {
        autoClose: 2000,
      });
    }
  };

  const toggleAccordion = async (email) => {
    if (openAdminId === email) {
      setOpenAdminId(null);
    } else {
      setOpenAdminId(email);
      if (!allWinners[email]) {
        await fetchAllWinners(email);
      }
    }
  };

  // const handleDelete = async (id, type) => {
  //   try {
  //     const token = Cookies.get("token");
  //     if (!token) {
  //       throw new Error("No authentication token found.");
  //     }

  //     const response = await fetch(`https://vclottery.in/vc/api/auth/delete-user/${id}`, {
  //       method: "DELETE",
  //       headers: { "x-auth-token": token },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     if (type === "admin") {
  //       setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id));
  //     } else if (type === "user") {
  //       setAllWinners((prevState) => {
  //         const newState = { ...prevState };
  //         Object.keys(newState).forEach((email) => {
  //           newState[email] = newState[email].filter((user) => user._id !== id);
  //         });
  //         return newState;
  //       });
  //     }

  //     toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`, {
  //       autoClose: 2000,
  //     });
  //   } catch (error) {
  //     console.error(`Error deleting ${type}:`, error);
  //     toast.error(`Error deleting ${type}. Please try again later.`, { autoClose: 2000 });
  //   }
  // };

  // const confirmDelete = (id, type) => {
  //   if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
  //     handleDelete(id, type);
  //   }
  // };

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
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">All Winners</h2>
              <p className="text-gray-600">
                A list of all the Users in your account including their name,
                title, email and role.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md border-2 border-[#17BEBB]">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">
                    Toggle
                  </th>
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
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <React.Fragment key={admin.email}>
                    <tr
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleAccordion(admin.email)}
                    >
                      <td className="px-6 py-4 border-b text-sm text-gray-900">
                        {openAdminId === admin.email ? (
                          <RiArrowUpSLine className="animate-bounce w-5 h-5 text-[#E4572E]" />
                        ) : (
                          <RiArrowDownSLine className="animate-bounce w-5 h-5 text-[#E4572E]" />
                        )}
                      </td>
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
                    </tr>
                    {openAdminId === admin.email && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 border-b">
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold">
                              Winning Users for {admin.name}
                            </h3>
                            <div className="overflow-x-auto mt-4">
                              <table className="min-w-full bg-white rounded-md border-2 border-[#E4572E]">
                                <thead>
                                  <tr>
                                    <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500"></th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">
                                      Name
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
                                      Winner
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allWinners[admin.email]?.map((user) => (
                                    <tr
                                      key={user.email}
                                      className="bg-green-100"
                                    >
                                      <td className="px-6 py-4 border-b text-sm text-gray-900">
                                        ✅
                                      </td>
                                      <td className="px-6 py-4 border-b text-sm text-gray-900">
                                        {user.name || "N/A"}
                                      </td>
                                      <td className="px-6 py-4 border-b text-sm text-gray-900">
                                        {user.email || "N/A"}
                                      </td>
                                      <td className="px-6 py-4 border-b text-sm text-gray-900">
                                        {user.town || "N/A"}
                                      </td>
                                      <td className="px-6 py-4 border-b text-sm text-gray-900">
                                        {user.address || "N/A"}
                                      </td>
                                      <td className="px-6 py-4 border-b text-sm text-gray-900">
                                        {user.role || "N/A"}
                                      </td>
                                      <td className="px-6 py-4 border-b text-center text-sm">
                                        {user.hasWonLottery ? "Winner" : ""}
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
        </>
      )}
    </div>
  );
}

export default AllWinners;
