import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PublicLayout from './layouts/PublicLayout'
import ProtectedRoute from './routes/ProtectedRoute'


import Home from './users/pages/Home'
import Service from './users/pages/Service'
import About from './users/pages/About'
import Contact from './users/pages/Contact'
import Signup from './components/Signup'
import Login from './components/Login'
import ServicesDetails from './users/pages/ServicesDetails'
import BookingPage from './users/pages/BookingPage'
import WeeklyBookingPage from './users/pages/WeeklyBookingPage'

import NotFound from './users/pages/NotFound'
import VendorRoutes from './routes/VendorRoutes'
import AdminRoutes from './routes/AdminRoutes'
import UserRoutes from './routes/UserRoutes'

const App = () => {
  return (
    <Router>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="service" element={<Service />} />
          <Route path="service/:serviceId" element={<ServicesDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="bookingpage" element={<BookingPage />} />
          <Route path="weekly-booking" element={<WeeklyBookingPage />} />
        </Route>

        {/* Vendor Routes - Protected */}
        <Route path="/vendor/*" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorRoutes />
          </ProtectedRoute>
        } />

        {/* Admin Routes - Protected */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminRoutes />
          </ProtectedRoute>
        } />

        {/* User Routes - Protected */}
        <Route path="/user/*" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserRoutes />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App