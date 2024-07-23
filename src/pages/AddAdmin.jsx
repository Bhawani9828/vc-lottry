import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
function AddAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    town:'',
    address:'',
    role:"admin"
    
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
       "http://192.168.1.13:9999/api/auth/register",
        formData
      );
      console.log("Admin added successfully:", response.data);
      toast.success("Admin added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setFormData({
        name: "",
        password: "",
        email: "",
        town:'',
        address:'',
        
      });
      navigate('/dashboard')

    } catch (error) {
      console.log("data::::::", error);
      if (error.response) {
        console.error( 
          "Server responded with error status:",
          error.response.status
        );
        console.error("Error details:", error.response.data);
        toast.error("Error adding admin. Mobile number already exist.");
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        toast.error(
          "No response received from server. Please check your internet connection."
        );
      } else {
        console.error("Error setting up the request:", error.message);
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="w-full  rounded-md mt-12 p-4 bg-[#e4572e24]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Add Admin</h2>
          <p className="text-gray-600">
            Add a new admin to your account by filling in the information below.
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 border-2 border-[#17BEBB] mb-4"
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
            Mobile Number
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
            placeholder="Enter password"
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

        {/* <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="role"
          >
            Role
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
          />
        </div> */}

        <div className="flex items-center justify-between">
          <button
            className="bg-[#17BEBB] hover:bg-[#E4572E] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Admin
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAdmin;
