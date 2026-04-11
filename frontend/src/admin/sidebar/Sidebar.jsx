import React from "react";
import { NavLink } from "react-router-dom";
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
} from "lucide-react";

const Sidebar = ({ isSidebarOpen }) => {
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
    { name: "Problem", icon: <FileText size={20} />, path: "/admin/problem" },
    { name: "Review", icon: <Star size={20} />, path: "/admin/review" },
    {
      name: "Notification",
      icon: <MessageCircle size={20} />,
      path: "/admin/notification",
    },
    {
      name: "Admin Role",
      icon: <AlertCircle size={20} />,
      path: "/admin/adminrole",
    },
    { name: "Setting", icon: <Settings size={20} />, path: "/admin/setting" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 no-underline ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
