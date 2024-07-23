import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserPlus,
  FaFileAlt,
  FaChartBar,
} from "react-icons/fa";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoSettingsSharp,IoCheckmarkDoneSharp } from "react-icons/io5";
import { FaTrophy } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
function Leftbar({ isMenuOpen, toggleMenu }) {
  const location = useLocation();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = Cookies.get("userRole");
    setUserRole(role);
  }, []);

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
      <div
        className={`leftbar md:mt-20 h-screen md:pt-10 pt-28 bg-[#E4572E] duration-300 text-white flex flex-col ${
          isMenuOpen ? "block" : "hidden"
        } md:block`}
      >
        <nav className="flex-1 md:mb-32 px-2 space-y-3">
          {userRole === "superadmin" && (
            <>
              <Link to="/dashboard" className={getLinkClass("/dashboard")}>
                <FaTachometerAlt className="mr-2" />
                Dashboard
              </Link>
              <Link to="/allwinners" className={getLinkClass("/allwinners")}>
                <FaTrophy className="mr-2" />
                All Winners
              </Link>
              <Link to="/alluser" className={getLinkClass("/alluser")}>
                <FaFileAlt className="mr-2" />
                All User
              </Link>
              <Link to="/addadmin" className={getLinkClass("/addadmin")}>
                <GrUserAdmin className="mr-2" />
                Add Admin
              </Link>
              <Link
                to="/usersbyadmin"
                className={getLinkClass("/usersbyadmin")}
              >
                <FaChartBar className="mr-2" />
                Users By Admin
              </Link>
              <Link
                to="/adminaprovel"
                className={getLinkClass("/adminaprovel")}
              >
                <IoCheckmarkDoneSharp className="mr-2" />
                Admin Aprovel
              </Link>
            </>
          )}
          {userRole === "admin" && (
            <>
              <Link to="/userlist" className={getLinkClass("/userlist")}>
                <HiOutlineClipboardDocumentList className="mr-2" />
                User List
              </Link>
              <Link to="/adduser" className={getLinkClass("/adduser")}>
                <FaUserPlus className="mr-2" />
                Add User
              </Link>

              <Link to="/win" className={getLinkClass("/win")}>
                <FaTrophy className="mr-2" />
                Winners Users
              </Link>

              <Link to="/setting" className={getLinkClass("/setting")}>
                <IoSettingsSharp className="mr-2" />
                Setting
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

export default Leftbar;
