import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../admin/Navbar'
import Sidebar from '../admin/sidebar/Sidebar'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex pt-20 h-screen overflow-hidden">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
