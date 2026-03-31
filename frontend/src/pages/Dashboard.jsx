import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Clock, Heart, User, LogOut, Droplet, Bug, Star, X } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upcoming')
  const [user, setUser] = useState({ name: 'Guest', email: 'guest@example.com' })
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    window.scrollTo(0, 0)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('authStateChange'))
    navigate('/')
  }

  // Mock Data
  const upcomingBookings = [
    { id: 101, service: 'AC Repair & Service', date: 'Oct 25, 2023', time: '10:00 AM', status: 'Pending', price: 64, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { id: 102, service: 'Deep Home Cleaning', date: 'Oct 28, 2023', time: '02:00 PM', status: 'Confirmed', price: 89, image: 'https://img500.exportersindia.com/product_images/bc-500/2023/1/3571043/deep-home-cleaning-services-1672811734-4054697.jpeg' }
  ]

  const pastBookings = [
    { id: 98, service: 'Professional Plumbing', date: 'Sep 15, 2023', time: '11:00 AM', status: 'Completed', price: 59, image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { id: 95, service: 'Electrical Repair', date: 'Aug 20, 2023', time: '09:00 AM', status: 'Cancelled', price: 55, image: 'https://images.unsplash.com/photo-1621905252507-b35a83013b28?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }
  ]

  const savedServices = [
    { id: 3, name: 'Professional Plumbing', rating: 4.7, price: 59, icon: <Droplet className="w-6 h-6 text-blue-600" />, category: 'Plumbing' },
    { id: 5, name: 'Pest Control', rating: 4.5, price: 79, icon: <Bug className="w-6 h-6 text-blue-600" />, category: 'Pest Control' }
  ]

  const navItems = [
    { id: 'upcoming', label: 'Upcoming Bookings', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'past', label: 'Past Bookings', icon: <Clock className="w-5 h-5" /> },
    { id: 'saved', label: 'Saved Services', icon: <Heart className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile Settings', icon: <User className="w-5 h-5" /> },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700'
      case 'Completed': return 'bg-blue-100 text-blue-700'
      case 'Pending': return 'bg-yellow-100 text-yellow-700'
      case 'Cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 truncate max-w-[140px]">{user.name}</h3>
                  <p className="text-xs text-gray-500 truncate max-w-[140px]">{user.email}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      activeTab === item.id 
                        ? 'bg-blue-50 text-blue-700 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{activeTab.replace('-', ' ')} Bookings</h1>
            
            {/* UPCOMING BOOKINGS */}
            {activeTab === 'upcoming' && (
              <div className="space-y-4">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <div key={booking.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-5 items-start sm:items-center transition-transform hover:-translate-y-1">
                      <img src={booking.image} alt={booking.service} className="w-full sm:w-24 h-24 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-gray-900">{booking.service}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-gray-400" /> {booking.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" /> {booking.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 justify-between">
                        <span className="font-bold text-xl text-blue-600">${booking.price}</span>
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No upcoming bookings found.</p>
                  </div>
                )}
              </div>
            )}

            {/* PAST BOOKINGS */}
            {activeTab === 'past' && (
              <div className="space-y-4">
                 {pastBookings.map((booking) => (
                    <div key={booking.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-5 items-start sm:items-center opacity-80 hover:opacity-100 transition-opacity">
                      <img src={booking.image} alt={booking.service} className="w-full sm:w-20 h-20 rounded-xl object-cover grayscale" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900">{booking.service}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{booking.date} • {booking.time}</p>
                      </div>
                      <div className="text-right">
                         <span className="font-bold text-lg text-gray-900">${booking.price}</span>
                         <button className="block mt-2 text-sm text-blue-600 hover:underline">Rebook</button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* SAVED SERVICES */}
            {activeTab === 'saved' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {savedServices.map((service) => (
                  <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group ">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-red-500 hover:bg-red-50 p-2 rounded-full"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-2xl flex items-center justify-center">
                      {service.icon}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{service.category}</span>
                      <h3 className="font-bold text-lg text-gray-900 mt-1">{service.name}</h3>
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-amber-400 fill-current" /> {service.rating}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <span className="font-bold text-lg">${service.price}</span>
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PROFILE INFO */}
            {activeTab === 'profile' && (
              <div id='profile' className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <button className="text-sm font-semibold text-blue-600 hover:underline">Change Avatar</button>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                      <input type="text" defaultValue={user.name} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                      <input type="tel" placeholder="+1 (555) 000-0000" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Default Address</label>
                    <textarea rows="3" placeholder="123 Main St, Apt 4B..." className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative h-48">
              <img src={selectedBooking.image} alt={selectedBooking.service} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold text-white mb-1">{selectedBooking.service}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border-0 ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <CalendarDays className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">Date</span>
                  </div>
                  <p className="font-bold text-gray-900">{selectedBooking.date}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">Time</span>
                  </div>
                  <p className="font-bold text-gray-900">{selectedBooking.time}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-gray-500 font-medium">Total Amount</span>
                <span className="text-3xl font-bold text-blue-600">${selectedBooking.price}</span>
              </div>

              <button onClick={() => setSelectedBooking(null)} className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-transform active:scale-95">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard