import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, DollarSign, Briefcase, User, Star, Settings, LogOut, X ,SquareStar} from 'lucide-react'

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || (path === '/vendor/dashboard' && location.pathname === '/vendor/dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/vendor/dashboard' },
    { name: 'Subscription', icon: <SquareStar size={20} />, path: '/vendor/subscription' },
    { name: 'Bookings', icon: <Calendar size={20} />, path: '/vendor/bookings' },
    { name: 'Earnings', icon: <DollarSign size={20} />, path: '/vendor/earnings' },
    { name: 'Services', icon: <Briefcase size={20} />, path: '/vendor/services' },
    { name: 'Profile', icon: <User size={20} />, path: '/vendor/profile' },
    { name: 'Reviews', icon: <Star size={20} />, path: '/vendor/reviews' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/vendor/setting' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 flex flex-col pt-24 pb-6 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <button 
          onClick={toggleSidebar}
          className="absolute top-6 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <X size={20} />
        </button>
      
      <nav className="px-3 space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
              isActive(item.path) 
                ? 'bg-[#088395] text-white shadow-md shadow-[#7AB2B2]/60' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#088395]'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="px-4 mt-auto border-t border-gray-100 pt-6">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
    </>
  )
}

export default Sidebar