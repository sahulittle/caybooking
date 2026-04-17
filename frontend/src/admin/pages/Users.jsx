import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Ban,
  CheckCircle,
  X,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { adminAPI } from "../../api/apiClient";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllUsers();
      const raw = res?.data?.data || res?.data?.user || res?.data || [];
      const usersArray = Array.isArray(raw)
        ? raw
        : raw.data && Array.isArray(raw.data)
        ? raw.data
        : [];
      setUsers(usersArray);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
      await adminAPI.updateUser(id, { status: newStatus });
      toast.success(
        `User ${newStatus === "Active" ? "unblocked" : "blocked"} successfully`
      );
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteUser(id);
      fetchUsers();
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
    setShowDeleteConfirm(null);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
    setIsEditMode(false);
    setSelectedUser(null);
    toast.success("User updated successfully");
  };

  const openModal = (user, edit = false) => {
    setSelectedUser({ ...user });
    setIsEditMode(edit);
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "U";

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-5 sm:space-y-6 animate-in fade-in duration-500">
      {/* Header and filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and view all registered users
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:w-full lg:w-44">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white w-full"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 lg:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 lg:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 lg:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 lg:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {!loading && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: #{user._id.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">{user.phone || "-"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 lg:px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(user, false)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal(user, true)}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleStatusToggle(user._id, user.status)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === "Active"
                              ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                              : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                          }`}
                          title={
                            user.status === "Active"
                              ? "Block User"
                              : "Unblock User"
                          }
                        >
                          {user.status === "Active" ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
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
                    {loading
                      ? "Loading users..."
                      : "No users found matching your criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {!loading && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {getInitials(user.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ID: #{user._id.substring(0, 8)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{user.phone || "-"}</span>
                    </div>

                    <div className="text-xs text-gray-500 pt-1">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2">
                    <button
                      onClick={() => openModal(user, false)}
                      className="flex items-center justify-center py-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-gray-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openModal(user, true)}
                      className="flex items-center justify-center py-2 rounded-xl text-gray-500 hover:text-amber-600 hover:bg-amber-50 border border-gray-100 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleStatusToggle(user._id, user.status)}
                      className={`flex items-center justify-center py-2 rounded-xl border border-gray-100 transition-colors ${
                        user.status === "Active"
                          ? "text-gray-500 hover:text-red-600 hover:bg-red-50"
                          : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {user.status === "Active" ? (
                        <Ban className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirm(user._id)}
                      className="flex items-center justify-center py-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
            {loading
              ? "Loading users..."
              : "No users found matching your criteria."}
          </div>
        )}
      </div>

      {/* Modal for View/Edit */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                {isEditMode ? "Edit User" : "User Details"}
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-72px)]">
              <form onSubmit={handleUpdateUser}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl sm:text-2xl font-bold shrink-0">
                    {getInitials(selectedUser.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                      {selectedUser.name}
                    </h4>
                    <p className="text-sm text-gray-500 break-words">
                      {selectedUser.activeRole} • Joined{" "}
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                          !isEditMode && "bg-gray-50 text-gray-500"
                        }`}
                        value={selectedUser.name || ""}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            name: e.target.value,
                          })
                        }
                        disabled={!isEditMode}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                          !isEditMode && "bg-gray-50 text-gray-500"
                        }`}
                        value={selectedUser.email || ""}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditMode}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                          !isEditMode && "bg-gray-50 text-gray-500"
                        }`}
                        value={selectedUser.phone || ""}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            phone: e.target.value,
                          })
                        }
                        disabled={!isEditMode}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                          !isEditMode && "bg-gray-50 text-gray-500"
                        }`}
                        value={selectedUser.address || ""}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            address: e.target.value,
                          })
                        }
                        disabled={!isEditMode}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
                  {isEditMode ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedUser(null)}
                        className="w-full sm:w-auto px-4 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedUser(null)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      Close
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-sm p-5 sm:p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete User?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex flex-col-reverse sm:flex-row justify-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="w-full sm:w-auto px-4 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;