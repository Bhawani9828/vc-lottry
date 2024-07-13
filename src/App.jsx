import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
// import Signup from './pages/Signup';
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
import  { AdminRoute, SuperAdminRoute } from './PrivateRoute';
import UsersByAdmin from './pages/UsersByAdmin';
import EditUser from './pages/EditUser';
import AllWinners from './pages/AllWinners';
import WinnersUser from './pages/WinnersUser';
import EditAdmin from './pages/EditAdmin';

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
    
      {!isLoginPage && !isRegisterPage && !isSignupPage && <Topbar  isMenuOpen={isMenuOpen} toggleMenu={toggleMenu}  />}
      {!isLoginPage && !isRegisterPage && !isSignupPage && <Leftbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu}  />}
      
      <div className={!isLoginPage && !isRegisterPage && !isSignupPage ? "main-content" : ""}>
        <Routes>
          {/* <Route path="/" element={<Signup />} /> */}

          <Route path="/" element={<Signin />} />
          <Route path="/dashboard"   element={<SuperAdminRoute> <Dashboard /> </SuperAdminRoute>}  />
          <Route path="/addadmin" element={<SuperAdminRoute><AddAdmin /></SuperAdminRoute> } />
          <Route path="/allwinners" element={<SuperAdminRoute><AllWinners /></SuperAdminRoute> } />
          <Route path="/adduser" element={ <AdminRoute><AddUser /></AdminRoute> } />
          <Route path="/userlist" element={ <AdminRoute><UserList /></AdminRoute> } />
          <Route path="/win" element={ <AdminRoute><WinnersUser /></AdminRoute> } />
          <Route path="/alluser" element={ <SuperAdminRoute><AllUsers /></SuperAdminRoute> } />
          <Route path="/usersbyadmin" element={<SuperAdminRoute><UsersByAdmin /></SuperAdminRoute>} />
          <Route path="/edituser/:id" element={<EditUser />} />
          <Route path="/editadmin/:id" element={<EditAdmin />} />
       
          
        </Routes>
      </div>
    </>
  );
}

export default App;
