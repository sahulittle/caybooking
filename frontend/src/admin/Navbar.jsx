import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  Settings,
  LayoutDashboard,
  HouseHeart,
} from "lucide-react";
import logo from "../../public/logo-cayman2.png";

const Navbar = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("authStateChange", loadUser);
    return () => window.removeEventListener("authStateChange", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authStateChange"));
    setUser(null);
    setIsDropdownOpen(false);
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <style>
        {`
          .dropdown-animation {
            animation: slideDown 0.2s ease-out;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-100">
        <div className="h-16 sm:h-18 lg:h-20 flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>

            <Link to="/admin/dashboard">
              <img
                src={logo}
                alt="Cayman Logo"
                className="h-10 sm:h-12 lg:h-14 w-auto transition-transform duration-300 scale-150"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link navigate
              to="/"
              className="p-2 text-white hover:bg-gray-400 bg-gray-500 rounded-full transition-colors"
              title="Go to Home"
            >
              <HouseHeart size={20} />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#CDE8E5] to-[#EEF7FF] text-[#088395] font-extrabold text-sm sm:text-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all border border-[#7AB2B2]"
              >
                {user ? getInitials(user.name) : "A"}
              </button>

              {isDropdownOpen && (
                <div className="dropdown-animation absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-sm font-bold text-gray-800">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || "admin@example.com"}
                    </p>
                  </div>

                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#088395] transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>

                  <Link
                    to="/admin/setting"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#088395] transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>

                  <div className="h-px bg-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;