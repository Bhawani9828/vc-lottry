import { Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.1.9:9999/api/auth/login', formData);
      console.log('Admin signin successfully:', response.data);
      
      // Save token in cookies
      Cookies.set('token', response.data.token);

      // Fetch user role
      const token = response.data.token;
      const userResponse = await axios.get('http://192.168.1.9:9999/api/auth/protected', {
        headers: {
          'x-auth-token': `${token}`
        }
      });
      const role = userResponse.data.user.role;
      console.log('User role:', role);

      if (role === 'superadmin') {
        toast.success('Superadmin signed in successfully!', {
          position: 'top-right',
          autoClose: 2000,
          onClose: () => {
            navigate("/dashboard");
          },
        });
      } else {
        toast.success('Admin signed in successfully!', {
          position: 'top-right',
          autoClose: 2000,
          onClose: () => {
            navigate("/addadmin");
          },
        });
      }
    
      setFormData({
        email: '',
        password: ''
      });
    } catch (error) {
      console.log("data::::::", error);
      if (error.response) {
        console.error('Server responded with error status:', error.response.status);
        console.error('Error details:', error.response.data);
        toast.error('Error adding admin signin. Please try again later.');
      } else if (error.request) {
        console.error('No response received from server:', error.request);
        toast.error('No response received from server. Please check your internet connection.');
      } else {
        console.error('Error setting up the request:', error.message);
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Signin to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="/verifyemail"
                    className="font-semibold text-orange-600 hover:text-orange-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#17BEBB] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Sign in
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <Link
              to="/signup"
              className="font-semibold leading-6 text-orange-600 hover:text-orange-500"
            >
              Visit Signup page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
