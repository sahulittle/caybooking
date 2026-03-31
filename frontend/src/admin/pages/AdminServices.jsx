import React, { useState } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  Folder,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminServices = () => {
  const [activeTab, setActiveTab] = useState('services') // 'services' or 'categories'
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  
  // Data
  const [categories, setCategories] = useState([
    { id: 1, name: 'Cooling', count: 5 },
    { id: 2, name: 'Plumbing', count: 3 },
    { id: 3, name: 'Cleaning', count: 8 },
    { id: 4, name: 'Electrical', count: 4 },
  ])

  const [services, setServices] = useState([
    { id: 1, name: 'AC Repair', category: 'Cooling', price: '120.00', status: 'Active' },
    { id: 2, name: 'Pipe Fitting', category: 'Plumbing', price: '85.00', status: 'Active' },
    { id: 3, name: 'Home Cleaning', category: 'Cleaning', price: '150.00', status: 'Active' },
    { id: 4, name: 'Wiring Check', category: 'Electrical', price: '60.00', status: 'Inactive' },
  ])

  const [currentService, setCurrentService] = useState({ id: null, name: '', category: '', price: '', status: 'Active' })
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' })

  // Service Handlers
  const handleSaveService = (e) => {
    e.preventDefault()
    if (currentService.id) {
      setServices(services.map(s => s.id === currentService.id ? currentService : s))
      toast.success('Service updated')
    } else {
      setServices([...services, { ...currentService, id: Date.now() }])
      toast.success('Service created')
    }
    setIsServiceModalOpen(false)
  }

  const handleDeleteService = (id) => {
    setServices(services.filter(s => s.id !== id))
    toast.success('Service deleted')
  }

  const openServiceModal = (service = null) => {
    if (service) {
      setCurrentService(service)
    } else {
      setCurrentService({ id: null, name: '', category: categories[0]?.name || '', price: '', status: 'Active' })
    }
    setIsServiceModalOpen(true)
  }

  // Category Handlers
  const handleSaveCategory = (e) => {
    e.preventDefault()
    if (currentCategory.id) {
      setCategories(categories.map(c => c.id === currentCategory.id ? currentCategory : c))
      toast.success('Category updated')
    } else {
      setCategories([...categories, { ...currentCategory, id: Date.now(), count: 0 }])
      toast.success('Category created')
    }
    setIsCategoryModalOpen(false)
  }

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id))
    toast.success('Category deleted')
  }

  const openCategoryModal = (category = null) => {
    if (category) {
      setCurrentCategory(category)
    } else {
      setCurrentCategory({ id: null, name: '' })
    }
    setIsCategoryModalOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage services and categories offered</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'services' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            Services
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'categories' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            Categories
          </button>
        </div>
      </div>

      {activeTab === 'services' ? (
        // Services View
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-lg font-bold text-gray-900">All Services</h2>
            <button 
              onClick={() => openServiceModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
            >
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Service Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map(service => (
                  <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{service.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">${service.price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openServiceModal(service)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteService(service.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
      ) : (
        // Categories View
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-lg font-bold text-gray-900">Categories</h2>
            <button 
              onClick={() => openCategoryModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {categories.map(category => (
              <div key={category.id} className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white rounded-lg border border-gray-200 text-blue-600">
                    <Folder className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openCategoryModal(category)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-md">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCategory(category.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} active services</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">{currentService.id ? 'Edit Service' : 'New Service'}</h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveService} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Service Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentService.name}
                  onChange={(e) => setCurrentService({...currentService, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={currentService.category}
                  onChange={(e) => setCurrentService({...currentService, category: e.target.value})}
                >
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentService.price}
                    onChange={(e) => setCurrentService({...currentService, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                  <select 
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={currentService.status}
                    onChange={(e) => setCurrentService({...currentService, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">{currentCategory.id ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminServices