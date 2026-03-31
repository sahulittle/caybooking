import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import VendorLayout from '../layouts/VendorLayout'
import VendorDashboard from '../vendor/VendorDashboard'
import Booking from '../vendor/pages/Booking'
import Earning from '../vendor/pages/Earning'
import Services from '../vendor/pages/Services'
import Profile from '../vendor/pages/Profile'
import Review from '../vendor/pages/Review'
import Setting from '../vendor/pages/Setting'
import Subscription from '../vendor/pages/Subscription'


const VendorRoutes = () => {
  return (
    <Routes>
      <Route element={<VendorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="bookings" element={<Booking />} />
        <Route path="earnings" element={<Earning />} />
        <Route path="services" element={<Services />} />
        <Route path="profile" element={<Profile />} />
        <Route path="reviews" element={<Review />} />
        <Route path="setting" element={<Setting />} />

        {/* Default redirect: any unknown vendor URL goes to dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default VendorRoutes