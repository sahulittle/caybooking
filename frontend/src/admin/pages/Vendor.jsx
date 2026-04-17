import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  ShieldOff,
  X,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { adminAPI } from "../../api/apiClient";

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllUsers({ role: "vendor" });
      setVendors(res.data.user || []);
    } catch {
      toast.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await adminAPI.updateUser(id, { status });
      toast.success("Status updated");
      fetchVendors();
    } catch {
      toast.error("Failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteUser(id);
      toast.success("Deleted");
      fetchVendors();
    } catch {
      toast.error("Failed");
    }
  };

  const filteredVendors = vendors.filter((v) => {
    return (
      (v.name || "").toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "All" || v.status === filterStatus)
    );
  });

  const getStatusStyle = (status) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "Suspended") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Vendor Management</h1>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>Suspended</option>
          <option>Pending Approval</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Rating</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4">Loading...</td>
            </tr>
          ) : filteredVendors.length > 0 ? (
            filteredVendors.map((v) => (
              <tr key={v._id}>
                <td>{v.name || v.businessName}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded ${getStatusStyle(v.status)}`}
                  >
                    {v.status}
                  </span>
                </td>

                <td>
                  <div className="flex items-center gap-1">
                    <Star size={14} />
                    {v.rating || "N/A"}
                  </div>
                </td>

                <td className="flex gap-2">
                  <button>
                    <Eye size={16} />
                  </button>

                  <button onClick={() => handleStatusChange(v._id, "Active")}>
                    <CheckCircle size={16} />
                  </button>

                  <button
                    onClick={() => handleStatusChange(v._id, "Suspended")}
                  >
                    <ShieldOff size={16} />
                  </button>

                  <button onClick={() => handleDelete(v._id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No vendors found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Vendor;
