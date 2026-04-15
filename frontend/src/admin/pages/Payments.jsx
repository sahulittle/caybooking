import React, { useState, useEffect } from 'react'
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
import { adminAPI } from '../../api/apiClient'

const Payments = () => {
  const [activeTab, setActiveTab] = useState('transactions')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [commissionRate, setCommissionRate] = useState(10)

  // Computed stats (derived from API data)
  const [stats, setStats] = useState([
    { title: 'Total Revenue', value: '...', sub: '', icon: <DollarSign className="w-6 h-6 text-white" />, bg: 'bg-emerald-500' },
    { title: 'Vendor Payouts', value: '...', sub: '', icon: <ArrowUpRight className="w-6 h-6 text-white" />, bg: 'bg-blue-500' },
    { title: 'Pending Withdrawals', value: '...', sub: '', icon: <Clock className="w-6 h-6 text-white" />, bg: 'bg-amber-500' },
    { title: 'Net Profit', value: '...', sub: '', icon: <ArrowDownLeft className="w-6 h-6 text-white" />, bg: 'bg-purple-500' },
  ])

  // Data from API
  const [transactions, setTransactions] = useState([])
  const [txLoading, setTxLoading] = useState(false)

  const [withdrawals, setWithdrawals] = useState([])
  const [wdLoading, setWdLoading] = useState(false)

  const handleWithdrawalAction = async (id, action) => {
    try {
      const newStatus = action === 'approve' ? 'Approved' : 'Rejected'
      await adminAPI.updateWithdrawalStatus(id, { status: newStatus })
      toast.success(`Request ${action}d successfully`)
      loadWithdrawals()
    } catch (err) {
      console.error(err)
      toast.error('Action failed')
    }
  }

  const loadTransactions = async () => {
    try {
      setTxLoading(true)
      const res = await adminAPI.getAllTransactions({ page: 1, limit: 50 })
      setTransactions(res.data.transactions || [])
    } catch (err) {
      console.error('Failed to load transactions', err)
      toast.error('Failed to load transactions')
    } finally {
      setTxLoading(false)
    }
  }

  const loadWithdrawals = async () => {
    try {
      setWdLoading(true)
      const res = await adminAPI.getAllWithdrawals({ page: 1, limit: 50 })
      setWithdrawals(res.data.withdrawals || [])
    } catch (err) {
      console.error('Failed to load withdrawals', err)
      toast.error('Failed to load withdrawals')
    } finally {
      setWdLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
    loadWithdrawals()
  }, [])

  // Recompute dashboard stats when data changes
  useEffect(() => {
    const totalRevenue = transactions.reduce((s, t) => s + (Number(t.amount) || 0), 0)
    const adminFeeRate = 0.1 // 10%
    const vendorPayouts = totalRevenue * (1 - adminFeeRate)
    const pendingWithdrawals = withdrawals
      .filter((w) => (w.status || '').toString().toLowerCase() === 'pending')
      .reduce((s, w) => s + (Number(w.amount) || 0), 0)
    const netProfit = totalRevenue * adminFeeRate - pendingWithdrawals

    setStats([
      { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, sub: '', icon: <DollarSign className="w-6 h-6 text-white" />, bg: 'bg-emerald-500' },
      { title: 'Vendor Payouts', value: `$${vendorPayouts.toFixed(2)}`, sub: 'Total distributed', icon: <ArrowUpRight className="w-6 h-6 text-white" />, bg: 'bg-blue-500' },
      { title: 'Pending Withdrawals', value: `$${pendingWithdrawals.toFixed(2)}`, sub: `${withdrawals.filter((w) => (w.status || '').toString().toLowerCase() === 'pending').length} requests pending`, icon: <Clock className="w-6 h-6 text-white" />, bg: 'bg-amber-500' },
      { title: 'Net Profit', value: `$${netProfit.toFixed(2)}`, sub: 'Platform earnings', icon: <ArrowDownLeft className="w-6 h-6 text-white" />, bg: 'bg-purple-500' },
    ])
  }, [transactions, withdrawals])

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
  const filteredTransactions = transactions.filter(t => (t.transactionId || t.id || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) || (t.vendor || '').toLowerCase().includes(searchTerm.toLowerCase()))
  const filteredWithdrawals = withdrawals.filter(w => (w.vendor || '').toLowerCase().includes(searchTerm.toLowerCase()))

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
                    <td className="px-6 py-4 font-medium text-blue-600">{trx.transactionId || trx.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{trx.vendor}</p>
                      <p className="text-xs text-gray-500">{trx.user}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">${(trx.amount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600">${((trx.amount || 0) * 0.1).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(trx.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor('Completed')}`}>
                        Completed
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
                    <td className="px-6 py-4 text-gray-500">{wdr.date ? new Date(wdr.date).toLocaleDateString() : ''}</td>
                    <td className="px-6 py-4">
                      {(() => {
                        const raw = (wdr.status || '').toString().toLowerCase();
                        const label = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : '';
                        return (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(label)}`}>
                            {label}
                          </span>
                        )
                      })()}
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