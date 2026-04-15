import React, { useState } from "react";
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

const Payments = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [commissionRate, setCommissionRate] = useState(10);

  const stats = [
    {
      title: "Total Revenue",
      value: "$124,500.00",
      sub: "+12.5% vs last month",
      icon: <DollarSign className="w-6 h-6 text-white" />,
      bg: "bg-emerald-500",
    },
    {
      title: "Vendor Payouts",
      value: "$85,200.00",
      sub: "Total distributed",
      icon: <ArrowUpRight className="w-6 h-6 text-white" />,
      bg: "bg-blue-500",
    },
    {
      title: "Pending Withdrawals",
      value: "$4,350.00",
      sub: "12 requests pending",
      icon: <Clock className="w-6 h-6 text-white" />,
      bg: "bg-amber-500",
    },
    {
      title: "Net Profit",
      value: "$34,950.00",
      sub: "Platform earnings",
      icon: <ArrowDownLeft className="w-6 h-6 text-white" />,
      bg: "bg-purple-500",
    },
  ];

  const transactions = [
    {
      id: "TRX-98765",
      bookingId: "BK-001",
      vendor: "Cool Air Pros",
      customer: "John Doe",
      amount: 120.0,
      adminFee: 12.0,
      status: "Completed",
      date: "2023-10-25",
    },
    {
      id: "TRX-98764",
      bookingId: "BK-002",
      vendor: "Sparkle Clean",
      customer: "Jane Smith",
      amount: 85.0,
      adminFee: 8.5,
      status: "Completed",
      date: "2023-10-24",
    },
    {
      id: "TRX-98763",
      bookingId: "BK-003",
      vendor: "Quick Fix Plumbing",
      customer: "Bob Jones",
      amount: 200.0,
      adminFee: 20.0,
      status: "Refunded",
      date: "2023-10-23",
    },
    {
      id: "TRX-98762",
      bookingId: "BK-004",
      vendor: "Bright Lights Elec.",
      customer: "Emily Davis",
      amount: 150.0,
      adminFee: 15.0,
      status: "Completed",
      date: "2023-10-22",
    },
    {
      id: "TRX-98761",
      bookingId: "BK-005",
      vendor: "Green Gardeners",
      customer: "Michael Wilson",
      amount: 95.0,
      adminFee: 9.5,
      status: "Pending",
      date: "2023-10-21",
    },
  ];

  const [withdrawals, setWithdrawals] = useState([
    {
      id: "WDR-001",
      vendor: "Cool Air Pros",
      amount: 1500.0,
      method: "Bank Transfer",
      account: "**** 1234",
      date: "2023-10-26",
      status: "Pending",
    },
    {
      id: "WDR-002",
      vendor: "Sparkle Clean",
      amount: 800.0,
      method: "PayPal",
      account: "sparkle@clean.com",
      date: "2023-10-25",
      status: "Approved",
    },
    {
      id: "WDR-003",
      vendor: "Quick Fix Plumbing",
      amount: 2100.0,
      method: "Bank Transfer",
      account: "**** 5678",
      date: "2023-10-24",
      status: "Rejected",
    },
    {
      id: "WDR-004",
      vendor: "Bright Lights Elec.",
      amount: 1200.0,
      method: "Bank Transfer",
      account: "**** 9012",
      date: "2023-10-23",
      status: "Pending",
    },
  ]);

  const handleWithdrawalAction = (id, action) => {
    setWithdrawals(
      withdrawals.map((w) =>
        w.id === id
          ? { ...w, status: action === "approve" ? "Approved" : "Rejected" }
          : w
      )
    );
    toast.success(`Request ${action}d successfully`);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSettingsOpen(false);
    toast.success("Commission settings updated");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Refunded":
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWithdrawals = withdrawals.filter((w) =>
    w.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-5 sm:space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Payments & Revenue
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage transactions, payouts, and financial settings
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            <Settings className="w-4 h-4" />
            Commission
          </button>

          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>{stat.icon}</div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 break-words">
              {stat.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 px-4 sm:px-6 pt-4">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-6">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`pb-3 sm:pb-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === "transactions"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Payment History
            </button>
            <button
              onClick={() => setActiveTab("withdrawals")}
              className={`pb-3 sm:pb-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === "withdrawals"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Withdrawal Requests
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-50 bg-gray-50/30">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Transactions desktop table */}
        {activeTab === "transactions" && (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[900px] text-left border-collapse">
                <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-4 lg:px-6 py-4">Transaction ID</th>
                    <th className="px-4 lg:px-6 py-4">Details</th>
                    <th className="px-4 lg:px-6 py-4">Amount</th>
                    <th className="px-4 lg:px-6 py-4">Admin Fee</th>
                    <th className="px-4 lg:px-6 py-4">Date</th>
                    <th className="px-4 lg:px-6 py-4">Status</th>
                    <th className="px-4 lg:px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredTransactions.map((trx) => (
                    <tr
                      key={trx.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4 font-medium text-blue-600 whitespace-nowrap">
                        {trx.id}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <p className="font-bold text-gray-900">{trx.vendor}</p>
                        <p className="text-xs text-gray-500">
                          {trx.customer} • {trx.bookingId}
                        </p>
                      </td>
                      <td className="px-4 lg:px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                        ${trx.amount.toFixed(2)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-gray-600 whitespace-nowrap">
                        ${trx.adminFee.toFixed(2)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-gray-500 whitespace-nowrap">
                        {trx.date}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(
                            trx.status
                          )}`}
                        >
                          {trx.status}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Transactions mobile cards */}
            <div className="md:hidden p-4 space-y-4">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((trx) => (
                  <div
                    key={trx.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-blue-600">
                          {trx.id}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {trx.vendor}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {trx.customer} • {trx.bookingId}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${getStatusColor(
                          trx.status
                        )}`}
                      >
                        {trx.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="font-bold text-gray-900">
                          ${trx.amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Admin Fee</p>
                        <p className="font-bold text-gray-900">
                          ${trx.adminFee.toFixed(2)}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-gray-700">{trx.date}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No transactions found.
                </div>
              )}
            </div>
          </>
        )}

        {/* Withdrawals desktop table */}
        {activeTab === "withdrawals" && (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[900px] text-left border-collapse">
                <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-4 lg:px-6 py-4">Request ID</th>
                    <th className="px-4 lg:px-6 py-4">Vendor</th>
                    <th className="px-4 lg:px-6 py-4">Amount</th>
                    <th className="px-4 lg:px-6 py-4">Method</th>
                    <th className="px-4 lg:px-6 py-4">Date</th>
                    <th className="px-4 lg:px-6 py-4">Status</th>
                    <th className="px-4 lg:px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredWithdrawals.map((wdr) => (
                    <tr
                      key={wdr.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {wdr.id}
                      </td>
                      <td className="px-4 lg:px-6 py-4 font-bold text-gray-900">
                        {wdr.vendor}
                      </td>
                      <td className="px-4 lg:px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                        ${wdr.amount.toFixed(2)}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <p className="text-gray-900">{wdr.method}</p>
                        <p className="text-xs text-gray-500">{wdr.account}</p>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-gray-500 whitespace-nowrap">
                        {wdr.date}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(
                            wdr.status
                          )}`}
                        >
                          {wdr.status}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right">
                        {wdr.status === "Pending" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                handleWithdrawalAction(wdr.id, "approve")
                              }
                              className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleWithdrawalAction(wdr.id, "reject")
                              }
                              className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            No actions
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredWithdrawals.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No withdrawal requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Withdrawals mobile cards */}
            <div className="md:hidden p-4 space-y-4">
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((wdr) => (
                  <div
                    key={wdr.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900">
                          {wdr.id}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {wdr.vendor}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {wdr.method} • {wdr.account}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${getStatusColor(
                          wdr.status
                        )}`}
                      >
                        {wdr.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="font-bold text-gray-900">
                          ${wdr.amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-gray-700">{wdr.date}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      {wdr.status === "Pending" ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() =>
                              handleWithdrawalAction(wdr.id, "approve")
                            }
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleWithdrawalAction(wdr.id, "reject")
                            }
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs italic text-gray-400">
                          No actions available
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No withdrawal requests found.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Commission Settings
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="p-4 sm:p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Commission (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-2">
                  This percentage will be deducted from each booking payment.
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;