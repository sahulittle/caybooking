import React, { useState, useEffect } from 'react'
import Sidebar from '../Sidebar'
import { Star, Reply } from 'lucide-react'
import { vendorAPI, bookingAPI } from '../../api/apiClient'
import toast from 'react-hot-toast'

const Review = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const [replyText, setReplyText] = useState('')
  const [activeReplyId, setActiveReplyId] = useState(null)

  const handleReplySubmit = async (id) => {
    if (!replyText.trim()) return
    try {
      await bookingAPI.updateReply(id, { vendorReply: replyText })
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, reply: replyText } : r)),
      )
      toast.success('Reply posted')
      setReplyText('')
      setActiveReplyId(null)
    } catch (err) {
      console.error('Reply error', err)
      toast.error('Failed to post reply')
    }
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await vendorAPI.getReviews()
        if (!mounted) return
        setReviews((res.data.reviews || []).map((r) => ({
          ...r,
          date: r.date ? new Date(r.date).toLocaleDateString() : '',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.customer || 'V')}`,
        })))
      } catch (err) {
        console.error('Failed to load reviews', err)
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
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="pt-10 pb-12 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900">Customer Reviews</h1>
            <p className="text-gray-500 text-sm mt-1">See what your customers are saying about your services</p>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img src={review.avatar} alt={review.customer} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h3 className="font-bold text-gray-900">{review.customer}</h3>
                      <p className="text-xs text-gray-500">{review.date} • {review.service}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">"{review.comment}"</p>

                {review.reply ? (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 ml-8 md:ml-16">
                    <p className="text-xs font-bold text-[#088395] mb-1">Your Reply</p>
                    <p className="text-gray-600 text-sm">{review.reply}</p>
                  </div>
                ) : (
                  <div>
                    {activeReplyId === review.id ? (
                      <div className="ml-8 md:ml-16 animate-in fade-in slide-in-from-top-2">
                        <textarea
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#088395] outline-none resize-none text-sm mb-2"
                          rows="3"
                          placeholder="Write your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        ></textarea>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleReplySubmit(review.id)}
                            className="px-4 py-2 bg-[#088395] text-white text-sm font-bold rounded-lg hover:bg-[#088395]/70"
                          >
                            Post Reply
                          </button>
                          <button 
                            onClick={() => setActiveReplyId(null)}
                            className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setActiveReplyId(review.id)}
                        className="flex items-center gap-2 text-[#088395] font-bold text-sm hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors ml-auto"
                      >
                        <Reply className="w-4 h-4" /> Reply
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Review