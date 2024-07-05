
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
const PrivateRoute = ({ children }) => {
  // Fetch the token from cookies
  const token = Cookies.get('token');
  
  // Assume the default role is 'admin' until proven otherwise
  let userRole = 'admin';
  
  if (token) {
    // Decode the token or fetch the user data to get the role
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      const user = JSON.parse(jsonPayload).user;
      userRole = user.role;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  
  return userRole === 'superadmin' ? children : <Navigate to="/unauthorized" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired 
};

export default PrivateRoute;
