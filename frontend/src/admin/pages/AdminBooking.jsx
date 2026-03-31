import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  MapPin, 
  DollarSign,
  Briefcase,
  Clock,
  Save,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminBooking = () => {
  // Mock Data
  const [bookings, setBookings] = useState([
    { id: 'BK-001', customer: 'John Doe', vendor: 'Cool Air Pros', service: 'AC Repair', date: '2023-10-25', time: '10:00 AM', status: 'Completed', price: 120, address: '123 Main St', notes: 'Gate code 1234' },
    { id: 'BK-002', customer: 'Jane Smith', vendor: 'Unassigned', service: 'Home Cleaning', date: '2023-10-26', time: '02:00 PM', status: 'Pending', price: 85, address: '456 Oak Ave', notes: 'Bring eco-friendly products' },
    { id: 'BK-003', customer: 'Robert Johnson', vendor: 'Quick Fix Plumbing', service: 'Plumbing', date: '2023-10-27', time: '11:30 AM', status: 'Cancelled', price: 200, address: '789 Pine Ln', notes: '' },
    { id: 'BK-004', customer: 'Emily Davis', vendor: 'Bright Lights Elec.', service: 'Electrical', date: '2023-10-28', time: '09:00 AM', status: 'Processing', price: 150, address: '321 Elm St', notes: '' },
    { id: 'BK-005', customer: 'Michael Wilson', vendor: 'Unassigned', service: 'Pest Control', date: '2023-10-29', time: '04:00 PM', status: 'Pending', price: 95, address: '654 Cedar Blvd', notes: 'Dog in backyard' },
  ])

  const [vendors] = useState(['Cool Air Pros', 'Sparkle Clean', 'Quick Fix Plumbing', 'Bright Lights Elec.', 'Green Gardeners'])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Filtering
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'All' || booking.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Handlers
  const handleUpdateBooking = (e) => {
    e.preventDefault()
    setBookings(bookings.map(b => b.id === selectedBooking.id ? selectedBooking : b))
    setIsEditMode(false)
    setSelectedBooking(null)
    toast.success('Booking updated successfully')
  }

  const openModal = (booking, edit = false) => {
    setSelectedBooking({ ...booking })
    setIsEditMode(edit)
  }

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-700'
      case 'Pending': return 'bg-amber-100 text-amber-700'
      case 'Processing': return 'bg-blue-100 text-blue-700'
      case 'Cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all service bookings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select 
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white w-full sm:w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">{booking.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{booking.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{booking.service}</div>
                      <div className="text-xs text-gray-400">{booking.date}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${booking.vendor === 'Unassigned' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                        {booking.vendor}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">${booking.price}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openModal(booking, false)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openModal(booking, true)}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Booking"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details/Edit Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">
                {isEditMode ? 'Edit Booking' : 'Booking Details'}
              </h3>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateBooking} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-500 uppercase font-bold mb-1">Booking ID</p>
                   <p className="font-bold text-blue-600">{selectedBooking.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Amount</p>
                   <p className="font-bold text-gray-900">${selectedBooking.price}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Booking Status</label>
                  {isEditMode ? (
                    <select 
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedBooking.status}
                      onChange={(e) => setSelectedBooking({...selectedBooking, status: e.target.value})}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(selectedBooking.status)}`}>
                        {selectedBooking.status}
                     </span>
                  )}
                </div>

                {/* Vendor Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Vendor</label>
                  {isEditMode ? (
                    <select 
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedBooking.vendor}
                      onChange={(e) => setSelectedBooking({...selectedBooking, vendor: e.target.value})}
                    >
                      <option value="Unassigned">Unassigned</option>
                      {vendors.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                       <Briefcase className="w-4 h-4 text-gray-400" />
                       {selectedBooking.vendor}
                    </div>
                  )}
                </div>

                {/* Read-only info */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Customer</label>
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                         <User className="w-4 h-4 text-gray-400" /> {selectedBooking.customer}
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Service</label>
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                         <Briefcase className="w-4 h-4 text-gray-400" /> {selectedBooking.service}
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Date & Time</label>
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                         <Calendar className="w-4 h-4 text-gray-400" /> {selectedBooking.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                         <Clock className="w-4 h-4 text-gray-400" /> {selectedBooking.time}
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Location</label>
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                         <MapPin className="w-4 h-4 text-gray-400" /> {selectedBooking.address}
                      </div>
                   </div>
                </div>

                {selectedBooking.notes && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Notes</label>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                      "{selectedBooking.notes}"
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                {isEditMode ? (
                    <>
                        <button 
                            type="button"
                            onClick={() => setSelectedBooking(null)}
                            className="px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </>
                ) : (
                    <button 
                        type="button"
                        onClick={() => setSelectedBooking(null)}
                        className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Close
                    </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBooking