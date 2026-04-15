import React, { useState, useEffect } from 'react'
import Sidebar from '../Sidebar'
import { User, Mail, Phone, MapPin, Upload, Camera, FileText, CheckCircle } from 'lucide-react'
import { vendorAPI } from '../../api/apiClient'
import toast from 'react-hot-toast'

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Rd, George Town',
    bio: 'Experienced home service professional with 5+ years in AC repair and maintenance.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  })

  const [vendorId, setVendorId] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        // attempt to fetch vendor profile for current user
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const res = await vendorAPI.getProfile('me')
        // res may return list of vendors (when "me" route used)
        const vendors = res.data.vendors || res.data || []
        const found = vendors.find((v) => {
          const uid = v.user?._id || v.user?.id || v.user
          return uid === user.id || uid === user._id
        })
        if (!mounted) return
        if (found) {
          setVendorId(found._id || found.id)
          setProfile((p) => ({
            ...p,
            name: found.businessName || p.name,
            email: user.email || p.email,
            phone: found.phone || p.phone,
            address: found.location || p.address,
            bio: found.description || p.bio,
            image: found.image || p.image,
          }))
        } else {
          // fallback: use saved user info
          setProfile((p) => ({ ...p, name: user.name || p.name, email: user.email || p.email }))
        }
      } catch (err) {
        console.error('Failed to load vendor profile', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setProfile({ ...profile, image: imageUrl })
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="pt-10 pb-12 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900">Vendor Profile</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your personal information and verification details</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 group">
                  <img src={profile.image} alt={profile.name} className="w-full h-full rounded-full object-cover border-4 border-gray-50 shadow-md" />
                  <label className="absolute bottom-0 right-0 bg-[#088395] text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-[#088395]/70 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-500 text-sm mb-4">AC Repair Specialist</p>
                
                <div className="flex justify-center gap-2 mb-6">
                  <span className="bg-[#7AB2B2]/30 text-[#689898] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified Vendor
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4 text-left space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" /> {profile.email}
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" /> {profile.phone}
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" /> {profile.address}
                  </div>
                </div>
              </div>

              {/* KYC Status Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
                <h3 className="font-bold text-gray-900 mb-4">KYC Verification</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-dashed border-gray-300 rounded-xl text-center bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-[#088395]" />
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-[#088395]">Upload ID Proof</p>
                    <p className="text-xs text-gray-500">Passport, Driving License</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-bold text-[#7AB2B2]">Approved</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Edit Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Edit Profile Details</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <input type="text" defaultValue={profile.name} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#088395] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input type="tel" defaultValue={profile.phone} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#088395] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input type="email" defaultValue={profile.email} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#088395] outline-none bg-gray-50 text-gray-500 cursor-not-allowed" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                    <input type="text" defaultValue={profile.address} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#088395] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bio / Description</label>
                    <textarea rows="4" defaultValue={profile.bio} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#088395] outline-none resize-none"></textarea>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const payload = {
                            businessName: profile.name,
                            phone: profile.phone,
                            location: profile.address,
                            description: profile.bio,
                          }
                          if (!vendorId) {
                            toast.error('Vendor profile not found')
                            return
                          }
                          await vendorAPI.updateProfile(vendorId, payload)
                          toast.success('Profile updated')
                        } catch (err) {
                          console.error('Update profile failed', err)
                          toast.error('Failed to update profile')
                        }
                      }}
                      className="px-8 py-3 bg-[#088395] text-white font-bold rounded-xl hover:bg-[#088395]/70 transition-colors shadow-lg shadow-blue-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile