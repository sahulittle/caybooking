import React, { useState } from 'react'
import { 
  Save, 
  Percent, 
  CreditCard, 
  Mail, 
  Smartphone,
  Globe 
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminSetting = () => {
  const [settings, setSettings] = useState({
    platformName: 'Cayman Maintenance',
    supportEmail: 'support@cayman.com',
    commissionRate: 10,
    currency: 'USD',
    paymentGateway: 'Stripe',
    enableEmailNotifs: true,
    enableSmsNotifs: false,
    smtpServer: 'smtp.example.com',
    smsApiKey: 'sk_test_12345'
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSave = (e) => {
    e.preventDefault()
    toast.success('Settings saved successfully')
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure global application preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">General Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Platform Name</label>
              <input type="text" name="platformName" value={settings.platformName} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Support Email</label>
              <input type="email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        {/* Financial settings removed per request */}

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <Mail className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Notification Config</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">Email Notifications</p>
                <p className="text-xs text-gray-500">Send system emails via SMTP</p>
              </div>
              <input type="checkbox" name="enableEmailNotifs" checked={settings.enableEmailNotifs} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
            </div>
            {settings.enableEmailNotifs && (
               <input type="text" name="smtpServer" placeholder="SMTP Server Address" value={settings.smtpServer} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            )}

            <div className="h-px bg-gray-50"></div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">SMS Notifications</p>
                <p className="text-xs text-gray-500">Send alerts via Twilio/Vonage</p>
              </div>
              <input type="checkbox" name="enableSmsNotifs" checked={settings.enableSmsNotifs} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
            </div>
            {settings.enableSmsNotifs && (
               <input type="text" name="smsApiKey" placeholder="SMS Provider API Key" value={settings.smsApiKey} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            <Save className="w-5 h-5" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminSetting