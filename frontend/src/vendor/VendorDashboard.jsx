import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Star,
  MoreVertical,
  Briefcase,
  ChevronRight,
  Eye,
  ArrowUpRight
} from 'lucide-react'
import Sidebar from './Sidebar'
import { useEffect } from 'react'
import { adminAPI } from '../api/apiClient'

// Simple CSS-only Bar Chart Component to avoid extra dependencies
const SimpleBarChart = ({ timeframe }) => {
  // Data for different timeframes
  const weeklyData = [
    { label: 'Mon', value: 450 },
    { label: 'Tue', value: 320 },
    { label: 'Wed', value: 550 },
    { label: 'Thu', value: 400 },
    { label: 'Fri', value: 600 },
    { label: 'Sat', value: 750 },
    { label: 'Sun', value: 200 },
  ];

  const monthlyData = [
    { label: 'Week 1', value: 2400 }, { label: 'Week 2', value: 3100 },
    { label: 'Week 3', value: 1800 }, { label: 'Week 4', value: 4200 },
  ];

  const data = timeframe === 'weekly' ? weeklyData : monthlyData;
  const maxVal = Math.max(...data.map(d => d.value)) * 1.1;

  return (
    <div className="flex items-end justify-between h-64 gap-2 sm:gap-4 w-full">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer">
          <div className="w-full max-w-[30px] sm:max-w-[50px] bg-blue-50 rounded-t-lg relative flex flex-col justify-end overflow-hidden group-hover:bg-blue-100 transition-colors h-full">
            <div
              style={{ height: `${(item.value / maxVal) * 100}%` }}
              className="w-full bg-[#088395] rounded-t-lg transition-all duration-500 group-hover:bg-[#088395] relative"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                {item.label}: ${item.value}
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-500 mt-3 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [chartTimeframe, setChartTimeframe] = useState('weekly');

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await adminAPI.getAllBookings()

      // map backend data to UI format
      const mapped = res.data.bookings.map(b => ({
        id: b._id,
        customer: b.name || 'Customer',   // adjust based on your schema
        service: b.service,
        date: b.date,
        time: b.time,
        status: b.status || 'Pending',
        price: b.price || 0
      }))

      setBookings(mapped)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Mock Data
  // const stats = [
  //   { title: 'Total Bookings', value: '1,240', change: '+12.5%', isPositive: true, icon: <Calendar className="w-6 h-6 text-white" />, color: 'bg-blue-500' },
  //   { title: 'Total Earnings', value: '$48,250', change: '+8.2%', isPositive: true, icon: <DollarSign className="w-6 h-6 text-white" />, color: 'bg-emerald-500' },
  //   { title: 'Pending Jobs', value: '14', change: '-2.4%', isPositive: false, icon: <Clock className="w-6 h-6 text-white" />, color: 'bg-amber-500' },
  //   { title: 'Rating', value: '4.8', change: '+0.4%', isPositive: true, icon: <Star className="w-6 h-6 text-white" />, color: 'bg-purple-500' },
  // ]

  const recentBookings = [
    { id: '#ORD-001', customer: 'Alex Johnson', service: 'AC Repair', amount: '$120.00', status: 'Completed', date: 'Oct 24, 2023' },
    { id: '#ORD-002', customer: 'Sarah Williams', service: 'Home Cleaning', amount: '$85.00', status: 'Pending', date: 'Oct 24, 2023' },
    { id: '#ORD-003', customer: 'Mike Brown', service: 'Plumbing', amount: '$200.00', status: 'Processing', date: 'Oct 23, 2023' },
    { id: '#ORD-004', customer: 'Emily Davis', service: 'Electrical', amount: '$150.00', status: 'Cancelled', date: 'Oct 22, 2023' },
    { id: '#ORD-005', customer: 'David Wilson', service: 'Garden Maint.', amount: '$95.00', status: 'Completed', date: 'Oct 21, 2023' },
  ]

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Vendor Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your services.</p>
            </div>
            <button
              onClick={() => navigate('/vendor/services')}
              className="group bg-white border border-gray-200 text-gray-900 hover:border-[#088395] hover:text-[#088395] px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-gray-500 group-hover:text-[#088395] transition-colors" />
              Manage Services
            </button>
          </div>

          {/* 1. Stat Cards */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> */}
            {/* {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl shadow-lg shadow-blue-900/5 ring-4 ring-opacity-20 ring-gray-100">
                    {stat.icon}
                  </div>
                  <div className="flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-semibold">{stat.title}</h3>
                <p className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">{stat.value}</p>
              </div>
            ))} */}
          {/* </div> */}

          {/* 2. Graph Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Earnings Overview</h2>
                  <p className="text-sm text-gray-500">Track your income trends over time</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setChartTimeframe('weekly')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${chartTimeframe === 'weekly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setChartTimeframe('monthly')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${chartTimeframe === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <SimpleBarChart timeframe={chartTimeframe} />
            </div>

            {/* Pending Jobs / Mini List */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Pending Actions</h2>
                <span className="bg-[#7AB2B2]/60 text-[#09637E] border border-[#7AB2B2] text-xs font-bold px-3 py-1 rounded-full">3 Urgent</span>
              </div>
              <div className="space-y-3 flex-1">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} onClick={() => navigate('/vendor/bookings')} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer border border-gray-100 hover:border-blue-100 group">
                    <div className="w-12 h-12 rounded-full bg-[#7AB2B2]/60 flex items-center justify-center text-[#09637E] flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-[#088395] transition-colors">New Service Request</h4>
                      <p className="text-xs text-gray-500 truncate mt-0.5">Plumbing • 10 mins ago</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:bg-[#088395] group-hover:border-[#088395] transition-colors">
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/vendor/bookings')} className="w-full mt-6 py-3 border border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:text-[#088395] hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                View All Actions
              </button>
            </div>
          </div>

          {/* 3. Recent Bookings Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                <p className="text-sm text-gray-500">Latest service orders</p>
              </div>
              <button onClick={() => navigate('/vendor/bookings')} className="text-[#088395] font-bold text-sm hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">See All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors group cursor-default">
                      <td className="px-6 py-4 text-sm font-bold text-[#088395]">{booking.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{booking.service}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{booking.date}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{booking.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => navigate('/vendor/bookings')} className="text-gray-400 hover:text-[#088395] p-2 rounded-lg hover:bg-blue-50 transition-all" title="View Details">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDashboard