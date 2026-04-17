import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../public/logo-cayman2.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          // Ensure the user has a role/activeRole
          if (parsedUser.role || parsedUser.activeRole) {
            setUser(parsedUser);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
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
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const navLinks = [
    { to: "/", name: "Home", end: true },
    { to: "/service", name: "Service" },
    { to: "/about", name: "About" },
    { to: "/contact", name: "Contact" },
  ];

  return (
    <>
      <style>
        {`
          .nav-link { transition: color 0.3s ease; }
          .nav-link:hover { color: #2563EB !important; }
          .signup-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
          .signup-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4) !important; }
          .dropdown-animation { animation: slideDown 0.2s ease-out; }
          .nav-link.active {
            color: #2563EB !important;
            position: relative;
          }
          .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #2563EB;
            border-radius: 2px;
            animation: underline-grow 0.3s ease-out;
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes underline-grow {
            from { width: 0; }
            to { width: 100%; }
          }
        `}
      </style>

      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md font-sans">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img
                src={logo}
                alt="Cayman Logo"
                className="h-10 sm:h-12 md:h-14 w-auto transition-transform duration-300 scale-150"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <ul className="flex list-none m-0 p-0 space-x-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `nav-link no-underline text-gray-600 text-base font-semibold py-2 ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center">
            {!user ? (
              <Link to="/signup">
                <button className="signup-btn bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none py-3 px-6 rounded-full text-base font-bold cursor-pointer shadow-lg shadow-blue-500/50">
                  Sign Up
                </button>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-extrabold text-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all border border-blue-200"
                >
                  {getInitials(user.name)}
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-animation absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 z-50">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-sm font-bold text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <Link
                      to={
                        user && (user.activeRole || user.role)
                          ? user.activeRole === "vendor" || user.role === "vendor"
                            ? "/vendor/profile"
                            : user.activeRole === "admin" || user.role === "admin"
                            ? "/admin/setting"
                            : "/user/dashboard"
                          : "/login"
                      }
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      Profile
                    </Link>

                    <Link
                      to={
                        user && (user.activeRole || user.role)
                          ? user.activeRole === "vendor" || user.role === "vendor"
                            ? "/vendor/dashboard"
                            : (user.activeRole || user.role) === "admin"
                            ? "/admin/dashboard"
                            : "/user/dashboard"
                          : "/login"
                      }
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      Dashboard
                    </Link>

                    <div className="h-px bg-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  end={link.end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-3 border-t border-gray-100">
                {!user ? (
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white py-3 px-6 rounded-full text-sm font-bold shadow-lg shadow-blue-500/30">
                      Sign Up
                    </button>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                      <p className="text-sm font-bold text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to={
                        user && (user.activeRole || user.role)
                          ? user.activeRole === "vendor" || user.role === "vendor"
                            ? "/vendor/profile"
                            : user.activeRole === "admin" || user.role === "admin"
                            ? "/admin/setting"
                            : "/user/dashboard"
                          : "/login"
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </Link>

                    <Link
                      to={
                        user && (user.activeRole || user.role)
                          ? user.activeRole === "vendor" || user.role === "vendor"
                            ? "/vendor/dashboard"
                            : (user.activeRole || user.role) === "admin"
                            ? "/admin/dashboard"
                            : "/user/dashboard"
                          : "/login"
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;