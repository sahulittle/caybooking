import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { vendorAPI } from "../../api/apiClient";
import {
  DollarSign,
  Download,
  MoreVertical,
  X,
  Eye,
  FileText,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// Simple CSS-only Bar Chart Component for monthly data
const MonthlyBarChart = ({ year }) => {
  const data2023 = [
    { label: "Jan", value: 2400 },
    { label: "Feb", value: 2210 },
    { label: "Mar", value: 2290 },
    { label: "Apr", value: 2000 },
    { label: "May", value: 2181 },
    { label: "Jun", value: 2500 },
    { label: "Jul", value: 2300 },
    { label: "Aug", value: 3490 },
    { label: "Sep", value: 3200 },
    { label: "Oct", value: 4800 },
    { label: "Nov", value: 4200 },
    { label: "Dec", value: 5100 },
  ];

  const data2022 = [
    { label: "Jan", value: 1800 },
    { label: "Feb", value: 1600 },
    { label: "Mar", value: 1750 },
    { label: "Apr", value: 1900 },
    { label: "May", value: 2100 },
    { label: "Jun", value: 2000 },
    { label: "Jul", value: 2200 },
    { label: "Aug", value: 2100 },
    { label: "Sep", value: 2400 },
    { label: "Oct", value: 2800 },
    { label: "Nov", value: 3000 },
    { label: "Dec", value: 3500 },
  ];

  const data = year === 2023 ? data2023 : data2022;
  const maxVal = 6000;

  return (
    <div className="flex items-end justify-between h-64 gap-2 sm:gap-3 w-full">
      {data.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer"
        >
          <div className="w-full max-w-[20px] sm:max-w-[30px] bg-[#7AB2B2]/30 rounded-t-lg relative flex flex-col justify-end overflow-hidden group-hover:bg-[#7AB2B2]/50 transition-colors h-full">
            <div
              style={{ height: `${(item.value / maxVal) * 100}%` }}
              className="w-full bg-[#088395] rounded-t-lg transition-all duration-500 group-hover:bg-[#088395]/60 relative"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                ${item.value}
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-500 mt-3 font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const Earning = () => {
  const [selectedYear, setSelectedYear] = useState(2023);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState("bank");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [bankCountry, setBankCountry] = useState("");
  const [bankAccounts, setBankAccounts] = useState([]);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newBankName, setNewBankName] = useState("");
  const [newRoutingNumber, setNewRoutingNumber] = useState("");
  const [newSwiftCode, setNewSwiftCode] = useState("");
  const [newBankCountry, setNewBankCountry] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [wdLoading, setWdLoading] = useState(false);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsTotal, setPaymentsTotal] = useState(0);
  const [paymentsLimit] = useState(20);

  const paymentHistory = [
    {
      id: "PAY-001",
      date: "2023-10-15",
      amount: 1500.0,
      status: "Paid",
      method: "Bank Transfer",
    },
    {
      id: "PAY-002",
      date: "2023-09-15",
      amount: 1250.5,
      status: "Paid",
      method: "PayPal",
    },
    {
      id: "PAY-003",
      date: "2023-08-15",
      amount: 1800.75,
      status: "Paid",
      method: "Bank Transfer",
    },
    {
      id: "PAY-004",
      date: "2023-07-15",
      amount: 1100.0,
      status: "Paid",
      method: "Bank Transfer",
    },
    {
      id: "PAY-005",
      date: "2023-06-15",
      amount: 2100.25,
      status: "Paid",
      method: "PayPal",
    },
  ];

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await vendorAPI.getEarnings();
        if (!mounted) return;
        setTotalEarnings(res.data.total || 0);
        // map recent from earnings response
        setRecentPayments(
          (res.data.recent || []).map((r) => ({
            id: r.payment?.transactionId || r._id,
            date:
              r.payment?.createdAt ||
              r.date ||
              (r.createdAt
                ? new Date(r.createdAt).toISOString().slice(0, 10)
                : ""),
            amount: r.payment?.amount || 0,
            status: "Paid",
            method: r.payment?.method || "Stripe",
          })),
        );

        // load paginated payments for full history table (page 1)
        try {
          const payRes = await vendorAPI.getPayments({
            page: 1,
            limit: paymentsLimit,
          });
          if (payRes?.data?.payments) {
            setRecentPayments(payRes.data.payments);
            setPaymentsTotal(payRes.data.total || 0);
            setPaymentsPage(payRes.data.page || 1);
          }
        } catch (err) {
          console.warn("Failed to load payments page", err);
        }
        // load vendor withdrawals
        try {
          setWdLoading(true);
          const wres = await vendorAPI.getWithdrawals({ page: 1, limit: 50 });
          setWithdrawals(wres.data.withdrawals || []);
        } catch (err) {
          console.warn('Failed to load withdrawals', err);
        } finally {
          setWdLoading(false);
        }
      } catch (err) {
        console.error("Failed to load earnings", err);
      } finally {
        setLoading(false);
      }
    };
    load();
    // load saved bank accounts / prefill bank details from localStorage.user
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const accounts =
        user?.bankAccounts || (user?.bankDetails ? [user.bankDetails] : []);
      if (accounts && accounts.length) {
        setBankAccounts(accounts);
        // prefill withdraw modal fields with default or first
        const defaultAcc = accounts.find((a) => a.isDefault) || accounts[0];
        if (defaultAcc) {
          setBankAccountNumber(defaultAcc.accountNumber || "");
          setBankAccountName(defaultAcc.accountName || "");
          setBankName(defaultAcc.bankName || "");
          setRoutingNumber(defaultAcc.routingNumber || "");
          setSwiftCode(defaultAcc.swiftCode || "");
          setBankCountry(defaultAcc.country || "");
        }
      }
    } catch (err) {
      // ignore parse errors
    }
    return () => {
      mounted = false;
    };
  }, []);

  const saveBankAccountsToLocalStorage = (accounts) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.bankAccounts = accounts;
      const defaultAcc = accounts.find((a) => a.isDefault) || accounts[0];
      if (defaultAcc) user.bankDetails = { ...defaultAcc };
      localStorage.setItem("user", JSON.stringify(user));
      setBankAccounts(accounts);
    } catch (err) {
      console.warn("Failed to save bank accounts to localStorage", err);
    }
  };

  const handleAddBankAccount = () => {
    if (!newAccountName || !newAccountNumber || !newBankName) {
      toast.error("Please fill account holder name, number and bank name");
      return;
    }
    const account = {
      id: `BA-${Date.now()}`,
      accountName: newAccountName,
      accountNumber: newAccountNumber,
      bankName: newBankName,
      routingNumber: newRoutingNumber,
      swiftCode: newSwiftCode,
      country: newBankCountry,
      isDefault: bankAccounts.length === 0,
    };
    const updated = [...bankAccounts, account];
    saveBankAccountsToLocalStorage(updated);
    setNewAccountName("");
    setNewAccountNumber("");
    setNewBankName("");
    setNewRoutingNumber("");
    setNewSwiftCode("");
    setNewBankCountry("");
    toast.success("Bank account added");
  };

  const handleRemoveBankAccount = (id) => {
    const updated = bankAccounts.filter((a) => a.id !== id);
    saveBankAccountsToLocalStorage(updated);
    toast.success("Bank account removed");
  };

  const handleSetDefaultAccount = (id) => {
    const updated = bankAccounts.map((a) => ({ ...a, isDefault: a.id === id }));
    saveBankAccountsToLocalStorage(updated);
    const def = updated.find((a) => a.isDefault);
    if (def) {
      setBankAccountNumber(def.accountNumber || "");
      setBankAccountName(def.accountName || "");
      setBankName(def.bankName || "");
      setRoutingNumber(def.routingNumber || "");
      setSwiftCode(def.swiftCode || "");
      setBankCountry(def.country || "");
    }
    toast.success("Default account updated");
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (selectedWithdrawMethod === "bank") {
      if (!bankAccountNumber || !bankAccountName || !bankName) {
        toast.error(
          "Please provide bank account number, account holder name and bank name",
        );
        return;
      }
    }
    // call backend
    (async () => {
      try {
        const payload = {
          amount: Number(withdrawAmount),
          method: selectedWithdrawMethod || "bank",
        };

        if (payload.method === "bank") {
          payload.bankDetails = {
            accountNumber: bankAccountNumber,
            accountName: bankAccountName,
            bankName,
            routingNumber,
            swiftCode,
            country: bankCountry,
          };
        }

        const res = await vendorAPI.createWithdrawal(payload);
        toast.success("Withdrawal request submitted");
        // refresh earnings and payments table
        const earningsRes = await vendorAPI.getEarnings();
        setTotalEarnings(earningsRes.data.total || 0);
        try {
          const payRes = await vendorAPI.getPayments({
            page: paymentsPage,
            limit: paymentsLimit,
          });
          if (payRes?.data?.payments) {
            setRecentPayments(payRes.data.payments);
            setPaymentsTotal(payRes.data.total || 0);
            setPaymentsPage(payRes.data.page || paymentsPage);
          }
        } catch (err) {
          console.warn("Failed to refresh payments after withdrawal", err);
        }
      } catch (err) {
        console.error("Withdraw error", err);
        toast.error("Failed to submit withdrawal");
      } finally {
        setIsWithdrawModalOpen(false);
        setWithdrawAmount("");
      }
    })();
  };
  const loadPaymentsPage = async (page) => {
    try {
      const res = await vendorAPI.getPayments({ page, limit: paymentsLimit });
      if (res?.data?.payments) {
        // append when loading next pages
        if (page > 1) {
          setRecentPayments((prev) => [...prev, ...res.data.payments]);
        } else {
          setRecentPayments(res.data.payments);
        }
        setPaymentsTotal(res.data.total || 0);
        setPaymentsPage(res.data.page || page);
      }
    } catch (err) {
      console.error("Failed to load payments page", err);
    }
  };

  const handleExport = () => {
    // Mock CSV download
    const headers = ["Transaction ID", "Date", "Amount", "Status", "Method"];
    const rows = paymentHistory.map((p) => [
      p.id,
      p.date,
      p.amount,
      p.status,
      p.method,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "earnings_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report downloaded successfully");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="pt-10 pb-12 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Earnings
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Track your income and manage payouts
              </p>
            </div>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="bg-[#088395] hover:bg-[#088395]/70 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Withdraw Funds
            </button>
          </div>

          {/* Stat Cards & Chart */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#088395] p-3 rounded-xl shadow-lg shadow-gray-200">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-semibold">
                Total Earnings
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                $
                {totalEarnings.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-400 mt-2">All time earnings</p>
            </div>
            <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Monthly Earnings
                  </h2>
                  <p className="text-sm text-gray-500">
                    Your income summary for the year
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-1 flex">
                  <button
                    onClick={() => setSelectedYear(2023)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${selectedYear === 2023 ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    2023
                  </button>
                  <button
                    onClick={() => setSelectedYear(2022)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${selectedYear === 2022 ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    2022
                  </button>
                </div>
              </div>
              <MonthlyBarChart year={selectedYear} />
            </div>
          </div>

          {/* Payout Accounts: manage bank accounts for withdrawals */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Payout Accounts
                </h2>
                <p className="text-sm text-gray-500">
                  Manage bank accounts used for payouts
                </p>
              </div>
            </div>

            {bankAccounts.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">
                No saved payout accounts.
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                {bankAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-bold text-gray-900">
                        {acc.accountName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {acc.bankName} • ****{" "}
                        {String(acc.accountNumber).slice(-4)}
                      </div>
                      {acc.swiftCode && (
                        <div className="text-xs text-gray-400">
                          SWIFT: {acc.swiftCode}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {acc.isDefault && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                          Default
                        </span>
                      )}
                      {!acc.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAccount(acc.id)}
                          className="px-3 py-1 bg-white border rounded-lg text-sm"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveBankAccount(acc.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 border rounded-lg text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Add a new bank account
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    value={newAccountNumber}
                    onChange={(e) => setNewAccountNumber(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200"
                    placeholder="123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200"
                    placeholder="Bank of Example"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Routing / Sort Code
                  </label>
                  <input
                    value={newRoutingNumber}
                    onChange={(e) => setNewRoutingNumber(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200"
                    placeholder="012345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    SWIFT / BIC
                  </label>
                  <input
                    value={newSwiftCode}
                    onChange={(e) => setNewSwiftCode(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200"
                    placeholder="ABCDEF12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    value={newBankCountry}
                    onChange={(e) => setNewBankCountry(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200"
                    placeholder="United States"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleAddBankAccount}
                  className="px-4 py-2 bg-[#088395] text-white rounded-xl font-bold"
                >
                  Add Account
                </button>
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Payment History
                </h2>
                <p className="text-sm text-gray-500">Your recent payouts</p>
              </div>
              <button
                onClick={handleExport}
                className="text-[#088395] font-bold text-sm hover:bg-[#7AB2B2]/40 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download size={14} />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8">
                        Loading...
                      </td>
                    </tr>
                  ) : recentPayments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No payments found.
                      </td>
                    </tr>
                  ) : (
                    recentPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-[#088395]">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {payment.date
                            ? new Date(payment.date).toLocaleString()
                            : ""}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          ${Number(payment.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusStyle(payment.status || "Paid")}`}
                          >
                            {payment.status || "Paid"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenActionId(
                                  openActionId === payment.id
                                    ? null
                                    : payment.id,
                                )
                              }
                              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {openActionId === payment.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <button
                                  onClick={() => {
                                    setSelectedTransaction(payment);
                                    setOpenActionId(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" /> View Details
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                  <FileText className="w-4 h-4" /> Download
                                  Invoice
                                </button>
                              </div>
                            )}
                            {/* Overlay to close dropdown when clicking outside */}
                            {openActionId === payment.id && (
                              <div
                                className="fixed inset-0 z-0"
                                onClick={() => setOpenActionId(null)}
                              ></div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Load more */}
            {paymentsTotal > paymentsPage * paymentsLimit && (
              <div className="p-4 border-t border-gray-100 flex justify-center">
                <button
                  onClick={() => loadPaymentsPage(paymentsPage + 1)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
          {/* Withdrawals List */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Withdrawal Requests</h2>
                <p className="text-sm text-gray-500">Your withdrawal history and statuses</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Request ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {wdLoading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8">Loading...</td>
                    </tr>
                  ) : withdrawals.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No withdrawal requests found.</td>
                    </tr>
                  ) : (
                    withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-[#088395]">{w.id}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">${Number(w.amount || 0).toFixed(2)}</td>
                        <td className="px-6 py-4 text-gray-700">{w.method}</td>
                        <td className="px-6 py-4 text-gray-500">{w.createdAt ? new Date(w.createdAt).toLocaleDateString() : ''}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${w.status === 'approved' || w.status === 'Approved' ? 'bg-green-100 text-green-700' : w.status === 'rejected' || w.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {w.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Funds Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Withdraw Funds
              </h2>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-6">
                <p className="text-sm text-emerald-700 font-medium">
                  Available Balance
                </p>
                <p className="text-2xl font-bold text-emerald-800">
                  $
                  {totalEarnings.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Amount to Withdraw
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-bold">$</span>
                  </div>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Withdraw To
                </label>
                {(() => {
                  const user = JSON.parse(localStorage.getItem("user") || "{}");
                  const defaultAcc =
                    bankAccounts.find((a) => a.isDefault) || bankAccounts[0];
                  const bankLabel =
                    defaultAcc && defaultAcc.accountNumber
                      ? `Bank Account (**** ${String(defaultAcc.accountNumber).slice(-4)})`
                      : user?.bankDetails?.accountNumber
                        ? `Bank Account (**** ${String(user.bankDetails.accountNumber).slice(-4)})`
                        : "Bank Account (**** 1234)";
                  const paypalLabel = user?.email
                    ? `PayPal (${user.email})`
                    : "PayPal (user@example.com)";
                  return (
                    <select
                      value={selectedWithdrawMethod}
                      onChange={(e) =>
                        setSelectedWithdrawMethod(e.target.value)
                      }
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    >
                      <option value="bank">{bankLabel}</option>
                      <option value="paypal">{paypalLabel}</option>
                    </select>
                  );
                })()}
              </div>

              {selectedWithdrawMethod === "bank" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Account Holder Name
                    </label>
                    <input
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Account Number
                    </label>
                    <input
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      placeholder="123456789"
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Bank Name
                    </label>
                    <input
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Bank of Example"
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Routing / Sort Code
                    </label>
                    <input
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      placeholder="012345678"
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      SWIFT / BIC
                    </label>
                    <input
                      value={swiftCode}
                      onChange={(e) => setSwiftCode(e.target.value)}
                      placeholder="ABCDEF12"
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      value={bankCountry}
                      onChange={(e) => setBankCountry(e.target.value)}
                      placeholder="United States"
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 mt-2"
              >
                Confirm Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-0 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">
                Transaction Details
              </h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  ${selectedTransaction.amount.toFixed(2)}
                </p>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold inline-block mt-2">
                  {selectedTransaction.status}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-semibold text-gray-900">
                    {selectedTransaction.id}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Date</span>
                  <span className="font-semibold text-gray-900">
                    {selectedTransaction.date}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-semibold text-gray-900">
                    {selectedTransaction.method}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earning;
