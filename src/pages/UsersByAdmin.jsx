import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { ThreeCircles } from "react-loader-spinner";

function UsersByAdmin() {
  const [admins, setAdmins] = useState([]);
  const [usersByAdmin, setUsersByAdmin] = useState({});
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

      const response = await fetch(
        "https://vclottery.in/vc/api/auth/admins",
        {
          headers: {
            "x-auth-token": token,
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
      setIsLoading(false);
    }
  };

  const fetchUsersByAdmin = async (email) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch(
        "https://vclottery.in/vc/api/auth/all-users",
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("data::::::",(data,null ))

      const filteredUsers = data.users.filter(
        (user) => user.createdBy?.email === email
      );

      setUsersByAdmin((prevState) => ({
        ...prevState,
        [email]: filteredUsers,
      }));
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
        throw new Error("No _id provided for deletion");
      }

      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch(
        `https://vclottery.in/vc/api/auth/delete-user/${id}`,
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

      if (type === "admin") {
        setAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => admin.id !== id)
        );
      } else if (type === "user") {
        setUsersByAdmin((prevState) => {
          const newState = { ...prevState };
          Object.keys(newState).forEach((email) => {
            newState[email] = newState[email].filter((user) => user.id !== id);
          });
          return newState;
        });
      }

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Error deleting ${type}. Please try again later.`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const confirmDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      handleDelete(id, type);
    }
  };

  const selectLotteryWinner = async (userId, adminEmail) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch(
        "https://vclottery.in/vc/api/auth/select-lottery-winner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Refresh the user data for this admin
      await fetchUsersByAdmin(adminEmail);

      toast.success("Lottery winner selected successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error selecting lottery winner:", error);
      toast.error("Error selecting lottery winner. Please try again later.", {
        position: "top-right",
        autoClose: 2000,
      });
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
              <h2 className="text-xl font-semibold">UsersByAdmin</h2>
              <p className="text-gray-600">
                A list of all the Users in your account including their name, title,
                email and role.
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
                    Role
                  </th>
                  <th className="px-6 py-3 border-b text-center text-sm font-medium text-gray-500">
                    Action
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
                        {admin.role}
                      </td>
                      <td className="px-6 py-4 border-b text-center text-sm">
                        <Link
                          to={`/editadmin/${admin.id}`} state={{ user: admin }}
                          className="text-[#17BEBB] me-3 z-10 hover:text-[#E4572E]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => confirmDelete(admin.id, "admin")}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {openAdminId === admin.email && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 border-b">
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold">
                              Users for {admin.name}
                            </h3>
                            <div className="overflow-x-auto mt-4">
                              <table className="min-w-full bg-white rounded-md border-2 border-[#E4572E]">
                                <thead>
                                  <tr>
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
                                      Role
                                    </th>
                                    <th className="px-6 py-3 border-b text-center text-sm font-medium text-gray-500">
                                      Winner
                                    </th>
                                  
                                  </tr>
                                </thead>
                                <tbody>
                                  {usersByAdmin[admin.email]?.map((user) => (
                                    <tr
                                      key={user.email}
                                      className={user.hasWonLottery ? "bg-green-100" : ""}
                                    >
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
                                        {user.role || "N/A"}
                                      </td>
                                      <td className="px-6 py-4 border-b text-center text-sm">
                                        <button
                                          onClick={() => selectLotteryWinner(user.id, admin.email)}
                                          className={`py-1 px-2 rounded-sm ${
                                            user.hasWonLottery
                                              ? "bg-[#17BEBB] hover:bg-[#17BEBB]"
                                              : "bg-[#E4572E] hover:bg-[#E4572E]"
                                          } text-white`}
                                          disabled={user.hasWonLottery}
                                        >
                                          {user.hasWonLottery ? "Winner" : "Select as Winner"}
                                        </button>
                                      </td>
                                      {/* <td className="px-6 py-4 border-b text-center text-sm">
                                        <Link
                                          to={`/edituser/${user._id}`} state={{ user: user }}
                                          className="text-[#17BEBB] me-3 z-10 hover:text-[#E4572E]"
                                        >
                                          Edit
                                        </Link>
                                        <button
                                          onClick={() => confirmDelete(user.id, "user")}
                                          className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                          Delete
                                        </button>
                                      </td> */}
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

export default UsersByAdmin;