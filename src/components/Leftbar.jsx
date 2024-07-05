import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUserPlus,  FaCalendarAlt, FaFileAlt, FaChartBar, FaCog } from 'react-icons/fa';

// eslint-disable-next-line react/prop-types
function Leftbar({ isMenuOpen, toggleMenu }) {
  return (
    <>
      <button
        className="md:hidden bg-[#E4572E] text-white p-2"
        onClick={toggleMenu}
      >
        Menu
      </button>
      <div className={`leftbar mt-4 h-screen bg-[#E4572E] duration-300 text-white flex flex-col ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <nav className="flex-1 px-2 space-y-1">
          <Link to="/dashboard" className=" px-4 py-2 rounded-lg hover:bg-[#17BEBB] flex items-center">
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </Link>
          <Link to="/alluser" className=" px-4 py-2 rounded-lg hover:bg-[#17BEBB] flex items-center">
            <FaFileAlt className="mr-2" />
            All User
          </Link>
          <Link to="/addadmin" className=" px-4 py-2 rounded-lg hover:bg-[#17BEBB] flex items-center">
            <FaUserPlus className="mr-2" />
            Add Admin
          </Link>
          <Link to="/adduser" className=" px-4 py-2 rounded-lg hover:bg-[#17BEBB] flex items-center">
            <FaUserPlus className="mr-2" />
            Add User
          </Link>
          <Link to="/userlist" className=" px-4 py-2 rounded-lg hover:bg-[#17BEBB] flex items-center">
            <FaCalendarAlt className="mr-2" />
            User List
          </Link>
          
          <Link to="#" className=" px-4 py-2 rounded-lg hover:bg-[#17BEBB] flex items-center">
            <FaChartBar className="mr-2" />
            Reports
          </Link>
        </nav>
        <div className="p-4 border-t border-white">
          <Link to="#" className=" text-sm font-medium hover:underline flex items-center">
            <FaCog className="mr-2" />
            Settings
          </Link>
        </div>
      </div>
    </>
  );
}

export default Leftbar;
