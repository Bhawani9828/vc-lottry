import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { ThreeCircles } from "react-loader-spinner";

function AdminAprovel() {
  const [adminAprovel, setAdminAprovel] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAdminAprovel = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("token");
        console.log("token::::", token);
        if (!token) {
          throw new Error("No authentication token found.");
        }

        const response = await fetch(
          "https://vclottery.in/vc/api/auth/pending-users",
          {
            headers: {
              "x-auth-token": `${token}`,
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched users data:", data);  // Debugging statement
        setAdminAprovel(data);
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
        setIsLoading(false);
      }
    };

    fetchAdminAprovel();
  }, []);

  const handleApproval = async (id) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch(`https://vclottery.in/vc/api/auth/verify-user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedUser = await response.json();
console.log("updatedUser::::",updatedUser)
      // Update the state to reflect the approval
      setAdminAprovel((prevUsers) => prevUsers.filter((user) => user.id !== id));

      toast.success("User approved successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Error approving user. Please try again later.", {
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
              <h2 className="text-xl font-semibold">Admin Approval</h2>
              <p className="text-gray-600">
                A list of pending users in your account.
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
                  <th className="px-6 py-3 border-b text-start text-sm font-medium text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminAprovel.map((alluser, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {alluser.name}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {alluser.password}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {alluser.email}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {alluser.town || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                      {alluser.address || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b text-sm flex justify-start">
                      <button
                        className="text-green-600"
                        onClick={() => handleApproval(alluser.id)}
                      >
                        Approve
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

export default AdminAprovel;
