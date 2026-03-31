import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  ShieldOff,
  X,
  FileText,
  Star,
  Mail,
  Phone,
  Briefcase,
  User,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adminAPI } from '../../api/apiClient'

const Vendor = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  // Filtering
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = (vendor.name || vendor.businessName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || vendor.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const res = await adminAPI.getAllUsers({ role: 'vendor' })
      setVendors(res.data.user || res.user || [])
    } catch (err) {
      toast.error('Failed to fetch vendors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  // Handlers
  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminAPI.updateUser(id, { status: newStatus })
      toast.success(`Vendor status updated to ${newStatus}`)
      fetchVendors()
      if (selectedVendor && selectedVendor._id === id) {
        setSelectedVendor(prev => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleKycChange = async (id, newKycStatus) => {
    try {
      await adminAPI.updateUser(id, { isVerified: newKycStatus === 'Verified' })
      toast.success(`Vendor KYC has been ${newKycStatus}`)
      fetchVendors()
    } catch (err) {
      toast.error('Failed to update verification status')
    }
  }

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteUser(id)
      fetchVendors()
      toast.success('Vendor deleted successfully')
    } catch (err) {
      toast.error('Failed to delete vendor')
    }
    setShowDeleteConfirm(null)
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800'
      case 'Suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getKycStatusStyle = (status) => {
    switch (status) {
      case 'Verified': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-gray-100 text-gray-800'
      case 'Rejected': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }


  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header and filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-sm text-gray-500 mt-1">Approve, manage, and view all registered vendors</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search vendors..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white w-full sm:w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!loading && filteredVendors.length > 0 ? (
                filteredVendors.map(vendor => (
                  <tr key={vendor._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {(vendor.name || vendor.businessName)?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{vendor.name || vendor.businessName}</p>
                          <p className="text-xs text-gray-500">{vendor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {vendor.serviceType}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(vendor.status)}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="font-bold text-gray-800">{vendor.rating > 0 ? vendor.rating.toFixed(1) : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {vendor.status === 'Pending Approval' && (
                          <>
                            <button onClick={() => handleStatusChange(vendor._id, 'Active')} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve Vendor"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => handleStatusChange(vendor._id, 'Suspended')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject Vendor"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                        {vendor.status === 'Active' && (
                          <button onClick={() => handleStatusChange(vendor._id, 'Suspended')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Suspend Vendor"><ShieldOff className="w-4 h-4" /></button>
                        )}
                        {vendor.status === 'Suspended' && (
                          <button onClick={() => handleStatusChange(vendor._id, 'Active')} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Activate Vendor"><Shield className="w-4 h-4" /></button>
                        )}
                        <button
                          onClick={() => setShowDeleteConfirm(vendor._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Vendor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {loading ? 'Loading vendors...' : 'No vendors found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Vendor Details & KYC */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">Vendor Details</h3>
              <button onClick={() => setSelectedVendor(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left side */}
                <div className="md:col-span-1 text-center md:text-left">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold mx-auto md:mx-0 mb-4 border-4 border-white shadow-md">
                    {selectedVendor.name?.charAt(0)}
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">{selectedVendor.name || selectedVendor.businessName}</h4>
                  <p className="text-sm text-gray-500 mb-4">Joined: {new Date(selectedVendor.createdAt).toLocaleDateString()}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-4 ${getStatusStyle(selectedVendor.status)}`}>
                    {selectedVendor.status || 'Active'}
                  </span>
                  <div className="text-left space-y-3 text-sm">
                    <div className="flex items-start gap-2"><User className="w-4 h-4 mt-0.5 text-gray-400" /><span className="text-gray-600">{selectedVendor.name}</span></div>
                    <div className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-gray-400" /><span className="text-gray-600">{selectedVendor.email}</span></div>
                    <div className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-gray-400" /><span className="text-gray-600">{selectedVendor.phone}</span></div>
                  </div>
                </div>

                {/* Right side */}
                <div className="md:col-span-2 space-y-6">
                  {/* Services */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Services Provided</h5>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{selectedVendor.serviceType}</span>
                    </div>
                  </div>

                  {/* KYC Verification */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> KYC Verification</h5>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Status: 
                          <span className={`ml-2 font-bold px-2 py-0.5 rounded-full text-xs ${getKycStatusStyle(selectedVendor.isVerified ? 'Verified' : 'Pending')}`}>
                            {selectedVendor.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </p>
                        <a href="#" className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1 mt-1">
                          <FileText className="w-3 h-3" /> View Document
                        </a>
                      </div>
                      {!selectedVendor.isVerified && (
                        <div className="flex gap-2">
                          <button onClick={() => handleKycChange(selectedVendor._id, 'Verified')} className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700">Verify</button>
                          <button onClick={() => handleKycChange(selectedVendor._id, 'Rejected')} className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                <button onClick={() => setSelectedVendor(null)} className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Vendor?</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this vendor? This action is permanent.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vendor