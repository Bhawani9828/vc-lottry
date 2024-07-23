import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    role: "" // Added role to the formData
  });

  useEffect(() => {
    if (location.state && location.state.user) {
      const { name, email, role,town,address } = location.state.user; // Ensure role is included
      setFormData({
        name,
        email,
        password: "",
        town,
        address,
        role
      });
    } else {
      fetchUserData();
    }
  }, [location.state, id]);

  const fetchUserData = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await fetch(
        `https://vclottery.in/vc/api/auth/users/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setFormData({
        name: userData.name,
        email: userData.email,
        password: "",
        town:userData.town,
        address:userData.address,
        role: userData.role // Store user role in formData
      });
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      toast.error(`Error fetching user data: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const filteredData = {};
      for (const key in formData) {
        if (formData[key]) {
          filteredData[key] = formData[key];
        }
      }

      const response = await fetch(
        `https://vclottery.in/vc/api/auth/edit-user/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
          },
          body: JSON.stringify(filteredData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      toast.success("User updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        onClose: () => {
          // Navigate based on user role
         
            navigate("/userlist");
         
        }
      });
    } catch (error) {
      console.error("Error updating user:", error.message);
      toast.error(`Error updating user: ${error.message}`);
    }
  };

  return (
    <div className="w-full rounded-md mt-12 p-4 bg-[#e4572e24]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Edit User</h2>
          <p className="text-gray-600">
            Edit a user by filling in the information below.
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Mobile number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            placeholder="Enter mobile"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Enter new password (leave blank to keep current)"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Town
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="town"
            type="text"
            placeholder="Enter town"
            value={formData.town}
            onChange={handleChange}
          />
         
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            placeholder="Enter address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-[#17BEBB] hover:bg-[#E4572E] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update User
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
