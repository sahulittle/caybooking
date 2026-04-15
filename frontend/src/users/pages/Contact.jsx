import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react'
import { sendMaintenanceRequest } from '../../api/apiClient'
import { toast } from 'react-hot-toast'

const Contact = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'AC Repair',
    address: '', // Added address field
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const services = ['AC Repair', 'Plumbing', 'Electrical', 'Cleaning', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await sendMaintenanceRequest(formData)
      toast.success('Your message has been sent successfully!')
      setFormData({ name: '', email: '', phone: '', service: 'AC Repair', address: '', message: '' }) // Reset address
      navigate('/bookingpage')
    } catch (error) {
      console.error(error)
      toast.error('Unable to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="font-sans bg-gray-50">
      {/* 1. Header */}
      <header className="text-center py-10 px-4 sm:py-16 sm:px-8 bg-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-lg sm:text-xl text-gray-600">Have questions or need help? We're here for you.</p>
      </header>

      <div className="flex flex-wrap max-w-7xl mx-auto my-8 gap-8 px-4 sm:px-8">
        {/* 2. Contact Form (Left) */}
        <div className="flex-[2] min-w-[300px] bg-white p-6 sm:p-10 rounded-2xl shadow-lg shadow-gray-200/50">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full p-3.5 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all" />
            </div>
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full p-3.5 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all" />
            </div>
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full p-3.5 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all" />
            </div>
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Service Needed</label>
              <select name="service" value={formData.service} onChange={handleInputChange} className="w-full p-3.5 rounded-lg border border-gray-300 text-base bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all">
                {services.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Your Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full p-3.5 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all" />
            </div>
            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Message</label>
              <textarea name="message" rows="5" value={formData.message} onChange={handleInputChange} className="w-full p-3.5 rounded-lg border border-gray-300 text-base resize-y focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full p-4 bg-blue-600 text-white rounded-lg text-base font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-200 cursor-pointer">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* 3. Contact Info (Right) */}
          <div className="flex-1 min-w-[300px]">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg shadow-gray-200/50 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-full"><Phone className="w-6 h-6" /></div>
              <div>
                <p className="font-semibold text-gray-500 text-sm">Phone</p>
                <p className="font-bold text-gray-800 text-base">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-full"><Mail className="w-6 h-6" /></div>
              <div>
                <p className="font-semibold text-gray-500 text-sm">Email</p>
                <p className="font-bold text-gray-800 text-base">support@caymantainane.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-full"><MapPin className="w-6 h-6" /></div>
              <div>
                <p className="font-semibold text-gray-500 text-sm">Address</p>
                <p className="font-bold text-gray-800 text-base">Caymantainane, India</p>
              </div>
            </div>
          </div>

          {/* 4. Map Section */}
          <div className="h-48 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 font-semibold mb-8">
            <p>Google Map Placeholder</p>
          </div>

          {/* 5. Support Info */}
          <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl font-semibold border border-emerald-100">
            <p className="mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Customer support available 24/7</p>
            <p className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Quick response within 24 hours</p>
          </div>
        </div>
      </div>

      {/* 6. CTA Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 py-12 sm:py-24 px-4 sm:px-8 text-center text-white mt-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8">Need urgent service?</h2>
        <button onClick={() => navigate('/bookingpage')} className="bg-white text-indigo-600 py-3 sm:py-4 px-4 sm:px-12 rounded-full text-base sm:text-lg font-bold border-none cursor-pointer shadow-lg transition-transform hover:scale-105">Book Now</button>
      </section>
    </div>
  )
}

export default Contact