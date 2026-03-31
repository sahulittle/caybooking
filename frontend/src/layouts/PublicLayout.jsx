import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../pages/Navbar'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24">
        <Outlet />
      </div>
    </div>
  )
}

export default PublicLayout
