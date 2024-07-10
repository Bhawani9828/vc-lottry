import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUserPlus, FaFileAlt, FaChartBar, FaCog } from 'react-icons/fa';
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { GrUserAdmin } from "react-icons/gr";

// eslint-disable-next-line react/prop-types
function Leftbar({ isMenuOpen, toggleMenu }) {
  const location = useLocation();
  
  const getLinkClass = (path) => {
    return location.pathname === path 
      ? "bg-[#17BEBB] text-white px-4 py-2 rounded-lg flex items-center"
      : "hover:bg-[#17BEBB] px-4 py-2 rounded-lg flex items-center";
  };

  return (
    <>
      <button
        className="md:hidden bg-[#E4572E] text-white p-2"
        onClick={toggleMenu}
      >
        Menu
      </button>
      <div className={`leftbar md:mt-20 h-screen md:pt-10 pt-28 bg-[#E4572E] duration-300 text-white flex flex-col ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <nav className="flex-1 md:mb-32 px-2 space-y-3">
          <Link to="/dashboard" className={getLinkClass("/dashboard")}>
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </Link>
          <Link to="/alluser" className={getLinkClass("/alluser")}>
            <FaFileAlt className="mr-2" />
            All User
          </Link>
          <Link to="/addadmin" className={getLinkClass("/addadmin")}>
            <GrUserAdmin className="mr-2" />
            Add Admin
          </Link>
          <Link to="/usersbyadmin" className={getLinkClass("/usersbyadmin")}>
            <FaChartBar className="mr-2" />
            Users By Admin
          </Link>
          <Link to="/adduser" className={getLinkClass("/adduser")}>
            <FaUserPlus className="mr-2" />
            Add User
          </Link>
          <Link to="/userlist" className={getLinkClass("/userlist")}>
            <HiOutlineClipboardDocumentList className="mr-2" />
            User List
          </Link>
        </nav>
        <div className="p-4 border-t border-white">
          <Link to="#" className="text-sm font-medium hover:underline flex items-center">
            <FaCog className="mr-2" />
            Settings
          </Link>
        </div>
      </div>
    </>
  );
}

export default Leftbar;
