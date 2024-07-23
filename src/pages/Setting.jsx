import { useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

function Setting() {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    upiId: '',
    qrCodeImage: null,
    lotteryName: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "qrCodeImage") {
      setFormData({
        ...formData,
        [name]: files[0] // Set the file object directly
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const data = new FormData();
      data.append('mobileNumber', formData.mobileNumber);
      data.append('upiId', formData.upiId);
      data.append('lotteryName', formData.lotteryName);
      if (formData.qrCodeImage) {
        data.append('qrCodeImage', formData.qrCodeImage);
      }

      const response = await fetch('https://vclottery.in/vc/api/auth/admin/update-info', {
        method: "PUT",
        headers: {
          "x-auth-token": token,
          "Accept": "application/json"
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update payment");
      }
      toast.success(`Payment updated successfully! Modified `, {
        position: "top-right",
        autoClose: 2000,
      });
   
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error(`Error updating payment: ${error.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="w-full rounded-md mt-12 p-4 bg-[#e4572e24]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Set Payment Method</h2>
          <p className="text-gray-600">
            Select your preferred payment method and provide the required details below.
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 border-2 border-[#17BEBB] mb-4"
      >
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="mobileNumber"
              >
                Mobile Number
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter mobile number"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="upiId"
              >
                UPI
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="upiId"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="Enter UPI"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="qrCodeImage"
              >
                QR Code
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="qrCodeImage"
                name="qrCodeImage"
                type="file"
                onChange={handleChange}
                placeholder="Choose image"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lotteryName"
          >
            lotteryName
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="lotteryName"
            name="lotteryName"
            type="text"
            value={formData.lotteryName}
            onChange={handleChange}
            placeholder="Enter lottery Name"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-[#17BEBB] hover:bg-[#E4572E] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default Setting;
