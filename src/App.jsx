import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import Leftbar from './components/Leftbar';
import Topbar from './components/Topbar';
import AddAdmin from './pages/AddAdmin';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import AddUser from './pages/AddUser';
import UserList from './pages/UserList';
import AllUsers from './pages/AllUsers';
import PrivateRoute from './PrivateRoute';

function App() {
  const location = useLocation();
  const isSignupPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
    <ToastContainer />
      {!isLoginPage && !isRegisterPage && !isSignupPage && <Topbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />}
      {!isLoginPage && !isRegisterPage && !isSignupPage && <Leftbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />}
      
      <div className={!isLoginPage && !isRegisterPage && !isSignupPage ? "main-content" : ""}>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/dashboard"   element={<PrivateRoute> <Dashboard /> </PrivateRoute>}  />
          <Route path="/addadmin" element={<AddAdmin />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="/alluser" element={<AllUsers />} />
          <Route path="/unauthorized" element={<div className='text-black text-5xl flex justify-center items-center h-screen font-rubik-mono'>Unauthorized Access</div>} /> 
          
        </Routes>
      </div>
    </>
  );
}

export default App;
