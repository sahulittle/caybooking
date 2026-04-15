import React, { useState, useEffect } from 'react'
import { Bell, Send, Clock, CheckCircle, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminAPI } from '../../api/apiClient'

const Notification = () => {
  const [notifications, setNotifications] = useState([
    // will be loaded from API
  ])

  const [loading, setLoading] = useState(false)
  
  const loadNotifications = async () => {
    try {
      setLoading(true)
      const res = await adminAPI.getAllNotifications({ page: 1, limit: 50 })
      setNotifications(res.data.notifications || [])
    } catch (err) {
      console.error('Failed to load notifications', err)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteNotification(id)
      toast.success('Notification deleted')
      loadNotifications()
    } catch (err) {
      console.error('Failed to delete notification', err)
      toast.error('Failed to delete notification')
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const [formData, setFormData] = useState({
    recipientType: 'all', // all, users, vendors, specific
    specificId: '',
    title: '',
    message: ''
  })

  const handleSend = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    (async () => {
      try {
        const payload = {
          recipientType: formData.recipientType,
          specificId: formData.specificId,
          title: formData.title,
          message: formData.message,
        }
        await adminAPI.createNotification(payload)
        setFormData({ recipientType: 'all', specificId: '', title: '', message: '' })
        toast.success('Notification sent successfully!')
        loadNotifications()
      } catch (err) {
        console.error('Failed to send notification', err)
        toast.error('Failed to send notification')
      }
    })()
  }

  const getRecipientLabel = (type, id) => {
    switch(type) {
      case 'all': return 'Everyone'
      case 'users': return 'All Users'
      case 'vendors': return 'All Vendors'
      case 'specific': return `User/Vendor ID: ${id}`
      default: return 'Unknown'
    }
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Notifications Center</h1>
        <p className="text-sm text-gray-500 mt-1">Broadcast messages or send targeted notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Compose */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Send className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Compose New</h2>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Recipient</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {['all', 'users', 'vendors', 'specific'].map((type) => (
                    <button 
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, recipientType: type})}
                      className={`p-2 rounded-lg text-sm font-medium border transition-all capitalize ${formData.recipientType === type ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                    >
                      {type === 'all' ? 'Broadcast' : type}
                    </button>
                  ))}
                </div>
                
                {formData.recipientType === 'specific' && (
                  <input 
                    type="text" 
                    placeholder="Enter User or Vendor ID" 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm mb-2"
                    value={formData.specificId}
                    onChange={(e) => setFormData({...formData, specificId: e.target.value})}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  placeholder="Notification Subject"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                <textarea 
                  rows="4"
                  placeholder="Type your message here..."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Notification
              </button>
            </form>
          </div>
        </div>

        {/* Right: History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" /> History
              </h2>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{notifications.length} Sent</span>
            </div>
            
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification._id || notification.id} className="p-6 hover:bg-gray-50 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                            (notification.type === 'Broadcast' || notification.recipientType === 'all')
                              ? 'bg-purple-50 text-purple-700 border-purple-100'
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {notification.type || (notification.recipientType === 'all' ? 'Broadcast' : 'Targeted')}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            To: <span className="font-medium text-gray-600">{notification.recipientLabel || getRecipientLabel(notification.recipientType, notification.specificId)}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</span>
                          <button onClick={() => handleDelete(notification._id || notification.id)} className="text-gray-400 hover:text-red-600 p-1 ml-2">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 mb-1">{notification.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No notifications sent yet.</p>
                  </div>
                )}
              
              {notifications.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications sent yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notification