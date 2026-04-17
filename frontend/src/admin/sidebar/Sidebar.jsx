import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Star,
  MessageCircle,
  AlertCircle,
  DollarSign,
  X,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      name: "Subscriptions",
      icon: <DollarSign size={20} />,
      path: "/admin/subscriptions",
    },
    { name: "User", icon: <Users size={20} />, path: "/admin/users" },
    { name: "Vendor", icon: <Store size={20} />, path: "/admin/vendor" },
    { name: "Booking", icon: <Calendar size={20} />, path: "/admin/booking" },
    {
      name: "Service",
      icon: <DollarSign size={20} />,
      path: "/admin/services",
    },
    { name: "Payment", icon: <FileText size={20} />, path: "/admin/payments" },
    { name: "Problem", icon: <AlertCircle size={20} />, path: "/admin/problem" },
    { name: "Review", icon: <Star size={20} />, path: "/admin/review" },
    {
      name: "Notification",
      icon: <MessageCircle size={20} />,
      path: "/admin/notification",
    },
    {
      name: "Admin Role",
      icon: <Users size={20} />,
      path: "/admin/adminrole",
    },
    { name: "Setting", icon: <Settings size={20} />, path: "/admin/setting" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authStateChange"));
    setIsSidebarOpen(false);
    navigate("/");
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 flex flex-col pt-24 pb-6 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-6 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <X size={20} />
        </button>

        <nav className="px-3 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-[#088395] text-white shadow-md shadow-[#7AB2B2]/60"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#088395]"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 mt-auto border-t border-gray-100 pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;