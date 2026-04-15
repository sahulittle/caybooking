import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../admin/Navbar'
import Sidebar from '../admin/sidebar/Sidebar'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="lg:ml-64 pt-20 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
