import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Store,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreVertical,
} from "lucide-react";
import { adminAPI } from "../../api/apiClient";

// CSS-only Simple Bar Chart
const SimpleBarChart = () => {
  const data = [
    { value: 45, label: "Mon" },
    { value: 60, label: "Tue" },
    { value: 75, label: "Wed" },
    { value: 50, label: "Thu" },
    { value: 80, label: "Fri" },
    { value: 95, label: "Sat" },
    { value: 85, label: "Sun" },
  ];

  return (
    <div className="flex items-end justify-between h-44 sm:h-48 gap-2 pt-4">
      {data.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer"
        >
          <div className="w-full max-w-[26px] sm:max-w-[30px] bg-blue-50 rounded-t-lg relative flex flex-col justify-end overflow-hidden group-hover:bg-blue-100 transition-colors h-full">
            <div
              style={{ height: `${item.value}%` }}
              className="w-full bg-blue-600 rounded-t-lg transition-all duration-300 group-hover:bg-blue-700 relative"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] sm:text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                {item.value} Bookings
              </div>
            </div>
          </div>
          <span className="text-[10px] sm:text-xs text-gray-400 mt-2 font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// SVG Simple Line Chart
const SimpleAreaChart = () => {
  return (
    <div className="h-44 sm:h-48 pt-4 w-full overflow-hidden relative">
      <svg
        viewBox="0 0 400 150"
        className="w-full h-full text-emerald-500 overflow-visible"
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,100 C50,80 100,120 150,60 C200,0 250,80 300,40 C350,0 400,60 400,60 V150 H0 Z"
          fill="url(#gradient)"
        />
        <path
          d="M0,100 C50,80 100,120 150,60 C200,0 250,80 300,40 C350,0 400,60 400,60"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [vendorsCount, setVendorsCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getAllUsers();

        const raw = res?.data?.data || res?.data?.user || res?.data || [];
        const allUsers = Array.isArray(raw)
          ? raw
          : raw.data && Array.isArray(raw.data)
            ? raw.data
            : [];

        const uCount = allUsers.filter(
          (u) => u.role === "user" || (u.roles && u.roles.includes("user"))
        ).length;

        const vCount = allUsers.filter(
          (u) => u.role === "vendor" || (u.roles && u.roles.includes("vendor"))
        ).length;

        const recent = [...allUsers]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4)
          .map((u) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role:
              u.role === "vendor" || (u.roles && u.roles.includes("vendor"))
                ? "Vendor"
                : "User",
            date: new Date(u.createdAt).toLocaleDateString(),
            initials:
              u.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2) || "U",
          }));

        setUsersCount(uCount);
        setVendorsCount(vCount);
        setRecentUsers(recent);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: loading ? "..." : usersCount.toLocaleString(),
      change: "+12.5%",
      isPositive: true,
      icon: <Users className="text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Total Vendors",
      value: loading ? "..." : vendorsCount.toLocaleString(),
      change: "+5.2%",
      isPositive: true,
      icon: <Store className="text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      title: "Total Bookings",
      value: "2,890",
      change: "+18.1%",
      isPositive: true,
      icon: <Calendar className="text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      title: "Total Revenue",
      value: "$124,500",
      change: "-2.4%",
      isPositive: false,
      icon: <DollarSign className="text-amber-600" />,
      bg: "bg-amber-50",
    },
  ];

  const recentBookings = [
    {
      id: "#BK-001",
      user: "Alex Johnson",
      service: "AC Repair",
      provider: "Cool Air Pros",
      amount: "$120.00",
      status: "Completed",
      date: "Oct 25, 2023",
    },
    {
      id: "#BK-002",
      user: "Sarah Williams",
      service: "Home Cleaning",
      provider: "Sparkle Clean",
      amount: "$85.00",
      status: "Pending",
      date: "Oct 25, 2023",
    },
    {
      id: "#BK-003",
      user: "Mike Brown",
      service: "Plumbing",
      provider: "Quick Fix",
      amount: "$200.00",
      status: "Processing",
      date: "Oct 24, 2023",
    },
    {
      id: "#BK-004",
      user: "Emily Davis",
      service: "Electrical",
      provider: "Bright Lights",
      amount: "$150.00",
      status: "Cancelled",
      date: "Oct 24, 2023",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-5 sm:space-y-6 lg:space-y-8 animate-in fade-in-5 duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor platform performance and recent activity
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <select className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>

          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start gap-3 mb-4">
              <div className={`p-3 rounded-xl shrink-0 ${stat.bg}`}>
                {stat.icon}
              </div>

              <span
                className={`flex items-center text-[11px] sm:text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${stat.isPositive
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                  }`}
              >
                {stat.isPositive ? (
                  <TrendingUp size={14} className="mr-1" />
                ) : (
                  <TrendingDown size={14} className="mr-1" />
                )}
                {stat.change}
              </span>
            </div>

            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 break-words">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
            Revenue Analytics
          </h3>
          <p className="text-sm text-gray-500 mb-4 sm:mb-6">
            Income trends over the last week
          </p>
          <SimpleAreaChart />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
            Booking Trends
          </h3>
          <p className="text-sm text-gray-500 mb-4 sm:mb-6">
            Daily booking volume
          </p>
          <SimpleBarChart />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between gap-3">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Recent Bookings
            </h3>
            <Link
              to="/admin/bookings"
              className="text-blue-600 text-sm font-semibold hover:underline whitespace-nowrap"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase">
                    Booking ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase">
                    Service
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-blue-600 whitespace-nowrap">
                      {booking.id}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">{booking.service}</div>
                      <div className="text-xs text-gray-500">
                        {booking.provider}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                      {booking.amount}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Users */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100 flex items-center justify-between gap-3">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              New Users
            </h3>
            <Link
              to="/admin/users"
              className="text-blue-600 text-sm font-semibold hover:underline whitespace-nowrap"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 text-sm">
                Loading users...
              </div>
            ) : recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 flex items-center gap-3 sm:gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                    {user.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {user.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${user.role === "Vendor"
                          ? "bg-purple-50 text-purple-600"
                          : "bg-blue-50 text-blue-600"
                        }`}
                    >
                      {user.role}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {user.date}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 sm:p-8 text-center text-gray-500 text-sm">
                No users found.
              </div>
            )}
          </div>

          <div className="p-4 text-center">
            <Link
              to="/admin/users"
              className="block w-full py-2.5 text-sm text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors border border-dashed border-gray-300 no-underline"
            >
              Manage Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;