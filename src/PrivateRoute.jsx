
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

const decodeToken = (token) => {
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
    return JSON.parse(jsonPayload).user;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const AdminRoute = ({ children }) => {
  const token = Cookies.get('token');
  let userRole = 'user';
  
  if (token) {
    const user = decodeToken(token);
    if (user) userRole = user.role;
  }
  
  if (userRole === 'admin') {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

const SuperAdminRoute = ({ children }) => {
  const token = Cookies.get('token');
  let userRole = 'user';
  
  if (token) {
    const user = decodeToken(token);
    if (user) userRole = user.role;
  }
  
  if (userRole === 'superadmin') {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired 
};

SuperAdminRoute.propTypes = {
  children: PropTypes.node.isRequired 
};

export { AdminRoute, SuperAdminRoute };