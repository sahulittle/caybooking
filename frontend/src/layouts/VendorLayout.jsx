import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../vendor/Sidebar'
import Navbar from '../vendor/Navbar'

const VendorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="lg:ml-64 pt-20 pb-8">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="app-container">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default VendorLayout
