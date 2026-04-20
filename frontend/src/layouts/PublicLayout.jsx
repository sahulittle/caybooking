import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../users/Navbar'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16 lg:pt-20">
        <Outlet />
      </div>
    </div>
  )
}

export default PublicLayout
