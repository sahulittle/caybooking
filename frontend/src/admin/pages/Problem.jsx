import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  MapPin,
  Briefcase,
  X,
  AlertCircle,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { adminAPI } from "../../api/apiClient";

const Problem = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [vendors] = useState([
    "Cool Air Pros",
    "Quick Fix Plumbing",
    "Bright Lights Elec.",
    "Sparkle Clean",
  ]);

  const filteredRequests = requests.filter((req) => {
    const name = (req?.name || "").toString();
    const id = (req?._id || "").toString();
    const service = (req?.service || "").toString();

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || req?.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminAPI.updateRequest(id, { status: newStatus });
      fetchRequests();
      toast.success(`Status updated`);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleAssignVendor = async (vendorName) => {
    try {
      await adminAPI.updateRequest(selectedRequest._id, {
        vendor: vendorName,
        status: "Confirmed",
      });
      fetchRequests();
      setSelectedRequest(null);
      toast.success("Vendor assigned!");
    } catch (err) {
      toast.error("Failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteRequest(id);
      fetchRequests();
      toast.success("Request deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete request");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await adminAPI.getAllRequests();
      const raw = res?.data?.data || res?.data || [];
      const arr = Array.isArray(raw)
        ? raw
        : raw.data && Array.isArray(raw.data)
        ? raw.data
        : [];
      setRequests(arr);
    } catch (err) {
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-5 sm:space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Maintenance Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and manage reported problems from users
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, ID or service..."
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 lg:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  User & Request ID
                </th>
                <th className="px-4 lg:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 lg:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-4 lg:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-4 lg:px-6 py-4">
                      <div className="font-bold text-gray-900">{req.name}</div>
                      <div className="text-xs text-blue-600 font-medium break-all">
                        #{req._id}
                      </div>
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="font-medium">{req.service}</span>
                      </div>
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm text-gray-600">{req.date}</div>
                      <div className="text-xs text-gray-400">{req.time}</div>
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="px-4 lg:px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Manage Request"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
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
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">{req.name}</p>
                  <p className="text-xs text-blue-600 font-medium break-all mt-1">
                    #{req._id}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 border ${getStatusStyle(
                    req.status
                  )}`}
                >
                  {req.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>{req.service}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-900">Date:</span>{" "}
                  {req.date}
                </div>

                <div>
                  <span className="font-medium text-gray-900">Time:</span>{" "}
                  {req.time}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-blue-600 hover:bg-blue-50 border border-gray-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>

                <button
                  onClick={() => handleDelete(req._id)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
            No requests found.
          </div>
        )}
      </div>

      {/* Manage Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh]">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="min-w-0">
                <h3 className="font-bold text-lg sm:text-xl text-gray-900">
                  Request Management
                </h3>
                <p className="text-sm text-blue-600 font-semibold break-all">
                  {selectedRequest?._id || ""}
                </p>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(92vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Info Left */}
                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Customer Info
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        {(selectedRequest?.name || "").charAt(0)}
                      </div>
                      <span className="font-bold text-gray-900 break-words">
                        {selectedRequest?.name || ""}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Location
                    </label>
                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed break-words">
                        {selectedRequest?.address || ""}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      The Problem
                    </label>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 italic text-sm text-gray-600 break-words">
                      "{selectedRequest?.notes || ""}"
                    </div>
                  </div>
                </div>

                {/* Actions Right */}
                <div className="space-y-5 sm:space-y-6">
                  <div className="p-4 sm:p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <label className="text-[11px] font-bold text-blue-600 uppercase tracking-widest block mb-3">
                      Workflow Actions
                    </label>

                    <div className="space-y-3">
                      {selectedRequest?.status === "Pending" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(selectedRequest?._id, "Confirmed")
                          }
                          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Confirm Request
                        </button>
                      )}

                      <div>
                        <label className="text-xs font-bold text-gray-500 block mb-2 ml-1">
                          Assign Service Vendor
                        </label>

                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium text-sm"
                            defaultValue={
                              selectedRequest?.vendor === "Unassigned"
                                ? ""
                                : selectedRequest?.vendor
                            }
                            onChange={(e) => handleAssignVendor(e.target.value)}
                          >
                            <option value="" disabled>
                              Select a professional...
                            </option>
                            {vendors.map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Service
                      </p>
                      <p className="font-bold text-gray-900 break-words">
                        {selectedRequest.service}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        Status
                      </p>
                      <span
                        className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusStyle(
                          selectedRequest?.status
                        )}`}
                      >
                        {(selectedRequest?.status || "").toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 text-amber-600 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Confirming will notify the user.</span>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Problem;