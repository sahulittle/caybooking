import React, { useState } from 'react'
import Sidebar from '../Sidebar'
import { DollarSign, Download, MoreVertical, X, Eye, FileText, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

// Simple CSS-only Bar Chart Component for monthly data
const MonthlyBarChart = ({ year }) => {
  const data2023 = [
    { label: 'Jan', value: 2400 }, { label: 'Feb', value: 2210 },
    { label: 'Mar', value: 2290 }, { label: 'Apr', value: 2000 },
    { label: 'May', value: 2181 }, { label: 'Jun', value: 2500 },
    { label: 'Jul', value: 2300 }, { label: 'Aug', value: 3490 },
    { label: 'Sep', value: 3200 }, { label: 'Oct', value: 4800 },
    { label: 'Nov', value: 4200 }, { label: 'Dec', value: 5100 },
  ]

  const data2022 = [
    { label: 'Jan', value: 1800 }, { label: 'Feb', value: 1600 },
    { label: 'Mar', value: 1750 }, { label: 'Apr', value: 1900 },
    { label: 'May', value: 2100 }, { label: 'Jun', value: 2000 },
    { label: 'Jul', value: 2200 }, { label: 'Aug', value: 2100 },
    { label: 'Sep', value: 2400 }, { label: 'Oct', value: 2800 },
    { label: 'Nov', value: 3000 }, { label: 'Dec', value: 3500 },
  ]

  const data = year === 2023 ? data2023 : data2022
  const maxVal = 6000;

  return (
    <div className="flex items-end justify-between h-64 gap-2 sm:gap-3 w-full">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer">
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
           <span className="text-xs text-gray-500 mt-3 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

const Earning = () => {
  const [selectedYear, setSelectedYear] = useState(2023)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [openActionId, setOpenActionId] = useState(null)

  const paymentHistory = [
    { id: 'PAY-001', date: '2023-10-15', amount: 1500.00, status: 'Paid', method: 'Bank Transfer' },
    { id: 'PAY-002', date: '2023-09-15', amount: 1250.50, status: 'Paid', method: 'PayPal' },
    { id: 'PAY-003', date: '2023-08-15', amount: 1800.75, status: 'Paid', method: 'Bank Transfer' },
    { id: 'PAY-004', date: '2023-07-15', amount: 1100.00, status: 'Paid', method: 'Bank Transfer' },
    { id: 'PAY-005', date: '2023-06-15', amount: 2100.25, status: 'Paid', method: 'PayPal' },
  ];

  const handleWithdrawSubmit = (e) => {
    e.preventDefault()
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    setIsWithdrawModalOpen(false)
    setWithdrawAmount('')
    toast.success(`Withdrawal request for $${withdrawAmount} submitted!`)
  }

  const handleExport = () => {
    // Mock CSV download
    const headers = ['Transaction ID', 'Date', 'Amount', 'Status', 'Method']
    const rows = paymentHistory.map(p => [p.id, p.date, p.amount, p.status, p.method])
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "earnings_report.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Report downloaded successfully')
  }

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="pt-10 pb-12 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Earnings</h1>
              <p className="text-gray-500 text-sm mt-1">Track your income and manage payouts</p>
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
              <h3 className="text-gray-500 text-sm font-semibold">Total Earnings</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">$48,250.00</p>
              <p className="text-xs text-gray-400 mt-2">All time earnings</p>
            </div>
            <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Monthly Earnings</h2>
                  <p className="text-sm text-gray-500">Your income summary for the year</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-1 flex">
                   <button 
                    onClick={() => setSelectedYear(2023)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${selectedYear === 2023 ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                   >
                    2023
                   </button>
                   <button 
                    onClick={() => setSelectedYear(2022)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${selectedYear === 2022 ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                   >
                    2022
                   </button>
                </div>
              </div>
              <MonthlyBarChart year={selectedYear} />
            </div>
          </div>

          {/* Payment History Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                 <h2 className="text-lg font-bold text-gray-900">Payment History</h2>
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
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-[#088395]">{payment.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{payment.date}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">${payment.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusStyle(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="relative">
                           <button 
                            onClick={() => setOpenActionId(openActionId === payment.id ? null : payment.id)}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all"
                           >
                              <MoreVertical className="w-4 h-4" />
                           </button>
                           {openActionId === payment.id && (
                             <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                               <button 
                                onClick={() => { setSelectedTransaction(payment); setOpenActionId(null); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                               >
                                 <Eye className="w-4 h-4" /> View Details
                               </button>
                               <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                 <FileText className="w-4 h-4" /> Download Invoice
                               </button>
                             </div>
                           )}
                           {/* Overlay to close dropdown when clicking outside */}
                           {openActionId === payment.id && (
                             <div className="fixed inset-0 z-0" onClick={() => setOpenActionId(null)}></div>
                           )}
                         </div>
                      </td>
                    </tr>
                  ))}
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
              <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-6">
                <p className="text-sm text-emerald-700 font-medium">Available Balance</p>
                <p className="text-2xl font-bold text-emerald-800">$48,250.00</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Amount to Withdraw</label>
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
                <label className="block text-sm font-bold text-gray-700 mb-1">Withdraw To</label>
                <select className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                  <option>Bank Account (**** 1234)</option>
                  <option>PayPal (user@example.com)</option>
                </select>
              </div>

              <button type="submit" className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 mt-2">
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
              <h3 className="font-bold text-lg text-gray-900">Transaction Details</h3>
              <button onClick={() => setSelectedTransaction(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <p className="text-3xl font-bold text-gray-900">${selectedTransaction.amount.toFixed(2)}</p>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold inline-block mt-2">
                  {selectedTransaction.status}
                </span>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-semibold text-gray-900">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Date</span>
                  <span className="font-semibold text-gray-900">{selectedTransaction.date}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-semibold text-gray-900">{selectedTransaction.method}</span>
                </div>
              </div>

              <button onClick={() => setSelectedTransaction(null)} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors mt-4">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Earning