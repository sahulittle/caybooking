import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { Eye, Check, X, Search } from "lucide-react";
import { useEffect } from "react";
import { bookingAPI, vendorAPI } from "../../api/apiClient";
import { connectSocket, joinRoom } from "../../api/socket";
import toast from "react-hot-toast";

const Booking = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await bookingAPI.updateBookingStatus(id, newStatus);
      toast.success(`Booking ${newStatus}`);
      fetchBookings(); // refresh data
    } catch (error) {
      toast.error("Failed to update status");
    }
  };
  const filteredBookings = bookings.filter((booking) => {
    const matchesTab = activeTab === "All" || booking.status === activeTab;
    const customerName = booking.name || booking.customer || "";
    const serviceTitle = booking.service || "";
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await bookingAPI.getAllBookings();
      // backend returns { success, count, bookings }
      setBookings(res.data.bookings || []);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // initialize socket and listen for real-time updates
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      const socket = connectSocket(token);
      if (user?.id) joinRoom(`vendor_${user.id}`);

      const onNewBooking = (payload) => {
        toast.success("New booking received");
        fetchBookings();
      };
      const onBookingUpdated = (payload) => {
        toast.success(`Booking ${payload.status}`);
        fetchBookings();
      };

      socket.on("newBooking", onNewBooking);
      socket.on("bookingUpdated", onBookingUpdated);

      return () => {
        socket.off("newBooking", onNewBooking);
        socket.off("bookingUpdated", onBookingUpdated);
      };
    } catch (err) {
      console.warn("Socket not available", err);
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className=" pt-10 pb-12 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Booking Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage and track all your service requests
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#088395] bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl p-1.5 inline-flex shadow-sm border border-gray-100 mb-6 w-full sm:w-auto overflow-x-auto">
            {["All", "Pending", "Completed", "Cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#088395] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-10">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">
                            {booking.name || booking.customer}
                          </div>
                          <div className="text-xs text-gray-400">
                            {booking.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {booking.service}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div>{booking.date}</div>
                          <div className="text-xs text-gray-400">
                            {booking.time}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {booking.status === "Pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusChange(booking._id, "Confirmed")
                                  }
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Accept/Complete"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(booking._id, "Cancelled")
                                  }
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject/Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No bookings found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
