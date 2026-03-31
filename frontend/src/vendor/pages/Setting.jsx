import React, { useState } from 'react'
import Sidebar from '../Sidebar'
import { Bell, Lock, Power, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const Setting = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    app: true,
    promotional: false
  })
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    toast.success('Preference updated')
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (password.new !== password.confirm) {
      toast.error("New passwords don't match")
      return
    }
    toast.success('Password updated successfully')
    setPassword({ current: '', new: '', confirm: '' })
  }

  const toggleAvailability = () => {
    setIsOnline(!isOnline)
    toast.success(isOnline ? 'You are now Offline' : 'You are now Online')
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="pt-10 pb-12 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your account preferences and security</p>
          </div>

          <div className="space-y-6">
            
            {/* 1. Availability Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isOnline ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Power className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Service Availability</h3>
                    <p className="text-sm text-gray-500">
                      {isOnline ? 'You are currently online and accepting new bookings.' : 'You are offline. Customers cannot book you right now.'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={toggleAvailability}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#088395] focus:ring-offset-2 ${
                    isOnline ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isOnline ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* 2. Notification Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-[#088395]" />
                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email Notifications', desc: 'Receive booking updates via email' },
                  { id: 'sms', label: 'SMS Notifications', desc: 'Get text messages for urgent alerts' },
                  { id: 'app', label: 'In-App Notifications', desc: 'Show alerts within the dashboard' },
                  { id: 'promotional', label: 'Marketing Emails', desc: 'Receive tips and promotional offers' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleNotificationChange(item.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        notifications[item.id] ? 'bg-[#088395]' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[item.id] ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Security (Password) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-5 h-5 text-[#088395]" />
                <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
              </div>
              
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
                  <input 
                    type="password" 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#088395] outline-none"
                    value={password.current}
                    onChange={(e) => setPassword({...password, current: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                  <input 
                    type="password" 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#088395] outline-none"
                    value={password.new}
                    onChange={(e) => setPassword({...password, new: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#088395] outline-none"
                    value={password.confirm}
                    onChange={(e) => setPassword({...password, confirm: e.target.value})}
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" className="px-6 py-2.5 bg-[#088395] text-white font-bold rounded-xl hover:bg-[#088395] transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> Update Password
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Setting