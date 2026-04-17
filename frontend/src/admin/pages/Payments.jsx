import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  MoreVertical,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { adminAPI } from "../../api/apiClient";

const Payments = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    loadTransactions();
    loadWithdrawals();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await adminAPI.getAllTransactions();
      setTransactions(res.data.transactions || []);
    } catch {
      toast.error("Failed to load transactions");
    }
  };

  const loadWithdrawals = async () => {
    try {
      const res = await adminAPI.getAllWithdrawals();
      setWithdrawals(res.data.withdrawals || []);
    } catch {
      toast.error("Failed to load withdrawals");
    }
  };

  const handleWithdrawalAction = async (id, action) => {
    try {
      const status = action === "approve" ? "Approved" : "Rejected";
      await adminAPI.updateWithdrawalStatus(id, { status });
      toast.success(`Request ${action}d`);
      loadWithdrawals();
    } catch {
      toast.error("Action failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredTransactions = transactions.filter((t) =>
    (t.vendor || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredWithdrawals = withdrawals.filter((w) =>
    (w.vendor || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Payments</h1>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"
        >
          <Settings size={16} /> Settings
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 rounded-lg w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* TABS */}
      <div className="flex gap-4">
        <button onClick={() => setActiveTab("transactions")}>
          Transactions
        </button>
        <button onClick={() => setActiveTab("withdrawals")}>Withdrawals</button>
      </div>

      {/* TRANSACTIONS */}
      {activeTab === "transactions" && (
        <table className="w-full border">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((trx) => (
              <tr key={trx.id}>
                <td>{trx.id}</td>
                <td>{trx.vendor}</td>
                <td>${trx.amount}</td>

                {/* ✅ FIXED PART */}
                <td>
                  <span
                    className={`px-2 py-1 rounded ${getStatusColor(
                      trx.status,
                    )}`}
                  >
                    {trx.status}
                  </span>
                </td>

                <td>
                  <MoreVertical size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* WITHDRAWALS */}
      {activeTab === "withdrawals" && (
        <table className="w-full border">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredWithdrawals.map((w) => (
              <tr key={w.id}>
                <td>{w.id}</td>
                <td>{w.vendor}</td>
                <td>${w.amount}</td>
                <td>{w.status}</td>

                <td>
                  {w.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleWithdrawalAction(w.id, "approve")}
                        className="text-green-600"
                      >
                        <CheckCircle size={16} />
                      </button>

                      <button
                        onClick={() => handleWithdrawalAction(w.id, "reject")}
                        className="text-red-600"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl">
            <h2 className="text-lg font-bold mb-4">Settings</h2>
            <button onClick={() => setIsSettingsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
