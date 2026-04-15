import React, { useState, useEffect } from 'react'
import { 
  Star, 
  Search, 
  Filter, 
  Trash2, 
  User, 
  MessageSquare, 
  AlertTriangle, 
  ThumbsUp 
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adminAPI } from '../../api/apiClient'

const AdminReview = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('All')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  // Filtering
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      review.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = filterRating === 'All' || review.rating === parseInt(filterRating)
    return matchesSearch && matchesRating
  })

  // Stats
  const totalReviews = reviews.length
  const avgRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
  const flaggedReviews = reviews.filter(r => r.status === 'Flagged').length

  // Handlers
  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteReview(id)
      setReviews((prev) => prev.filter((r) => r.id !== id))
      setShowDeleteConfirm(null)
      toast.success('Review deleted successfully')
    } catch (err) {
      console.error('Failed to delete review', err)
      toast.error('Failed to delete review')
    }
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await adminAPI.getAllReviews({ page: 1, limit: 100 })
        if (!mounted) return
        const items = res.data.reviews || []
        setReviews(
          items.map((r) => ({
            ...r,
            date: r.date ? new Date(r.date).toLocaleDateString() : "",
          })),
        )
      } catch (err) {
        console.error('Failed to load reviews', err)
        toast.error('Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor feedback and manage platform reputation</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3 shadow-sm">
            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Star className="w-5 h-5 fill-current" /></div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Avg Rating</p>
              <p className="text-lg font-bold text-gray-900">{avgRating}</p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3 shadow-sm">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><MessageSquare className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Total Reviews</p>
              <p className="text-lg font-bold text-gray-900">{totalReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 flex flex-col sm:flex-row justify-between gap-4 bg-gray-50/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select 
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white w-full sm:w-48"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Reviewer</th>
                <th className="px-6 py-4">Vendor & Service</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 w-1/3">Comment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                        {review.user.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-900">{review.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{review.vendor}</p>
                    <p className="text-xs text-gray-500">{review.service}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 italic">"{review.comment}"</td>
                  <td className="px-6 py-4 text-gray-500">{review.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setShowDeleteConfirm(review.id)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredReviews.length === 0 && (
            <div className="p-8 text-center text-gray-500">No reviews found matching your criteria.</div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Review?</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this review? This action cannot be undone.</p>
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

export default AdminReview