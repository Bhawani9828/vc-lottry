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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addadmin" element={<AddAdmin />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
