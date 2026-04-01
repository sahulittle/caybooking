import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-5xl font-extrabold text-slate-900">404</h1>
    <p className="mt-2 text-lg text-slate-600">Page not found</p>
    <Link
      to="/"
      className="mt-4 inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
    >
      Go home
    </Link>
  </div>
)

export default NotFound
