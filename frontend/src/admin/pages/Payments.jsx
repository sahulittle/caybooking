import React, { useState } from 'react'
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
  MoreVertical
} from 'lucide-react'
import toast from 'react-hot-toast'

const Payments = () => {
  const [activeTab, setActiveTab] = useState('transactions')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [commissionRate, setCommissionRate] = useState(10)

  // Mock Stats
  const stats = [
    { title: 'Total Revenue', value: '$124,500.00', sub: '+12.5% vs last month', icon: <DollarSign className="w-6 h-6 text-white" />, bg: 'bg-emerald-500' },
    { title: 'Vendor Payouts', value: '$85,200.00', sub: 'Total distributed', icon: <ArrowUpRight className="w-6 h-6 text-white" />, bg: 'bg-blue-500' },
    { title: 'Pending Withdrawals', value: '$4,350.00', sub: '12 requests pending', icon: <Clock className="w-6 h-6 text-white" />, bg: 'bg-amber-500' },
    { title: 'Net Profit', value: '$34,950.00', sub: 'Platform earnings', icon: <ArrowDownLeft className="w-6 h-6 text-white" />, bg: 'bg-purple-500' },
  ]

  // Mock Data
  const transactions = [
    { id: 'TRX-98765', bookingId: 'BK-001', vendor: 'Cool Air Pros', customer: 'John Doe', amount: 120.00, adminFee: 12.00, status: 'Completed', date: '2023-10-25' },
    { id: 'TRX-98764', bookingId: 'BK-002', vendor: 'Sparkle Clean', customer: 'Jane Smith', amount: 85.00, adminFee: 8.50, status: 'Completed', date: '2023-10-24' },
    { id: 'TRX-98763', bookingId: 'BK-003', vendor: 'Quick Fix Plumbing', customer: 'Bob Jones', amount: 200.00, adminFee: 20.00, status: 'Refunded', date: '2023-10-23' },
    { id: 'TRX-98762', bookingId: 'BK-004', vendor: 'Bright Lights Elec.', customer: 'Emily Davis', amount: 150.00, adminFee: 15.00, status: 'Completed', date: '2023-10-22' },
    { id: 'TRX-98761', bookingId: 'BK-005', vendor: 'Green Gardeners', customer: 'Michael Wilson', amount: 95.00, adminFee: 9.50, status: 'Pending', date: '2023-10-21' },
  ]

  const [withdrawals, setWithdrawals] = useState([
    { id: 'WDR-001', vendor: 'Cool Air Pros', amount: 1500.00, method: 'Bank Transfer', account: '**** 1234', date: '2023-10-26', status: 'Pending' },
    { id: 'WDR-002', vendor: 'Sparkle Clean', amount: 800.00, method: 'PayPal', account: 'sparkle@clean.com', date: '2023-10-25', status: 'Approved' },
    { id: 'WDR-003', vendor: 'Quick Fix Plumbing', amount: 2100.00, method: 'Bank Transfer', account: '**** 5678', date: '2023-10-24', status: 'Rejected' },
    { id: 'WDR-004', vendor: 'Bright Lights Elec.', amount: 1200.00, method: 'Bank Transfer', account: '**** 9012', date: '2023-10-23', status: 'Pending' },
  ])

  const handleWithdrawalAction = (id, action) => {
    setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status: action === 'approve' ? 'Approved' : 'Rejected' } : w))
    toast.success(`Request ${action}d successfully`)
  }

  const handleSaveSettings = (e) => {
    e.preventDefault()
    setIsSettingsOpen(false)
    toast.success('Commission settings updated')
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': case 'Approved': return 'bg-green-100 text-green-700'
      case 'Pending': return 'bg-amber-100 text-amber-700'
      case 'Refunded': case 'Rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Filter Logic (Basic)
  const filteredTransactions = transactions.filter(t => t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.vendor.toLowerCase().includes(searchTerm.toLowerCase()))
  const filteredWithdrawals = withdrawals.filter(w => w.vendor.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Revenue</h1>
          <p className="text-sm text-gray-500 mt-1">Manage transactions, payouts, and financial settings</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            <Settings className="w-4 h-4" /> Commission
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} shadow-lg shadow-opacity-20`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 px-6 pt-4 flex gap-6">
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'transactions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Payment History
          </button>
          <button 
            onClick={() => setActiveTab('withdrawals')}
            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'withdrawals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Withdrawal Requests
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-6 flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-50 bg-gray-50/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Admin Fee</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-600">{trx.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{trx.vendor}</p>
                      <p className="text-xs text-gray-500">{trx.customer} • {trx.bookingId}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">${trx.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600">${trx.adminFee.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-500">{trx.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(trx.status)}`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Withdrawals Table */}
        {activeTab === 'withdrawals' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredWithdrawals.map((wdr) => (
                  <tr key={wdr.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{wdr.id}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{wdr.vendor}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${wdr.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{wdr.method}</p>
                      <p className="text-xs text-gray-500">{wdr.account}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{wdr.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(wdr.status)}`}>
                        {wdr.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {wdr.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleWithdrawalAction(wdr.id, 'approve')}
                            className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleWithdrawalAction(wdr.id, 'reject')}
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Commission Settings</h3>
            <form onSubmit={handleSaveSettings}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Commission (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-2">This percentage will be deducted from each booking payment.</p>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payments