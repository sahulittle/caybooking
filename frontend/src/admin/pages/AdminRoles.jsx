import React, { useState } from 'react'
import { 
  Shield, 
  UserPlus, 
  Edit2, 
  Trash2, 
  X 
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminRoles = () => {
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Main Admin', email: 'admin@gmail.com', role: 'Super Admin', status: 'Active', permissions: ['All Access'] },
    { id: 2, name: 'Sarah Manager', email: 'sarah@example.com', role: 'Sub Admin', status: 'Active', permissions: ['Users', 'Vendors'] },
    { id: 3, name: 'Mike Support', email: 'mike@example.com', role: 'Sub Admin', status: 'Inactive', permissions: ['Bookings', 'Reviews'] },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState({ id: null, name: '', email: '', role: 'Sub Admin', status: 'Active', permissions: [] })
  
  const allPermissions = ['Users', 'Vendors', 'Bookings', 'Payments', 'Reviews', 'Content']

  const handlePermissionChange = (perm) => {
    if (currentAdmin.permissions.includes(perm)) {
      setCurrentAdmin({ ...currentAdmin, permissions: currentAdmin.permissions.filter(p => p !== perm) })
    } else {
      setCurrentAdmin({ ...currentAdmin, permissions: [...currentAdmin.permissions, perm] })
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!currentAdmin.name || !currentAdmin.email) {
      toast.error('Please fill in required fields')
      return
    }

    let adminToSave = { ...currentAdmin }
    if (adminToSave.role === 'Super Admin') {
        adminToSave.permissions = ['All Access']
    }

    if (currentAdmin.id) {
      setAdmins(admins.map(a => a.id === currentAdmin.id ? adminToSave : a))
      toast.success('Admin updated successfully')
    } else {
      setAdmins([...admins, { ...adminToSave, id: Date.now() }])
      toast.success('New admin added successfully')
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id) => {
    if (admins.length <= 1) {
        toast.error("Cannot delete the last admin")
        return
    }
    setAdmins(admins.filter(a => a.id !== id))
    toast.success('Admin removed')
  }

  const openModal = (admin = null) => {
    if (admin) {
      setCurrentAdmin(admin)
    } else {
      setCurrentAdmin({ id: null, name: '', email: '', role: 'Sub Admin', status: 'Active', permissions: [] })
    }
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Roles & Permissions</h1>
                <p className="text-sm text-gray-500 mt-1">Manage admin access levels and roles</p>
            </div>
            <button 
                onClick={() => openModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-sm"
            >
                <UserPlus className="w-4 h-4" /> Add New Admin
            </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Admin Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Permissions</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {admins.map(admin => (
                            <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                            {admin.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{admin.name}</p>
                                            <p className="text-xs text-gray-500">{admin.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                        admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        <Shield className="w-3 h-3" /> {admin.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${admin.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span className="text-sm font-medium text-gray-700">{admin.status}</span>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <div className="flex flex-wrap gap-1">
                                        {admin.permissions.map(p => (
                                            <span key={p} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-semibold border border-blue-100">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openModal(admin)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(admin.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-lg text-gray-900">{currentAdmin.id ? 'Edit Admin' : 'Add New Admin'}</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSave} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={currentAdmin.name}
                                onChange={(e) => setCurrentAdmin({...currentAdmin, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={currentAdmin.email}
                                onChange={(e) => setCurrentAdmin({...currentAdmin, email: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                                <select 
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={currentAdmin.role}
                                    onChange={(e) => setCurrentAdmin({...currentAdmin, role: e.target.value})}
                                >
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Sub Admin">Sub Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                <select 
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={currentAdmin.status}
                                    onChange={(e) => setCurrentAdmin({...currentAdmin, status: e.target.value})}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {currentAdmin.role === 'Sub Admin' && (
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Access Permissions</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {allPermissions.map(perm => (
                                        <label key={perm} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={currentAdmin.permissions.includes(perm)}
                                                onChange={() => handlePermissionChange(perm)}
                                            />
                                            {perm}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-2">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  )
}

export default AdminRoles