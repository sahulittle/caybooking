import React, { useState, useEffect } from 'react'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { Menu, HouseHeart } from 'lucide-react'
import logo from "../../public/logo1.png"

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        setUser(null)
      }
    }
    loadUser()
    window.addEventListener('authStateChange', loadUser)
    return () => window.removeEventListener('authStateChange', loadUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('authStateChange'))
    setUser(null)
    setIsDropdownOpen(false)
    navigate('/')
  }

  const getInitials = (name) => {
    if (!name) return 'V'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }

  return (
    <>
      <style>
        {`
          .nav-link { transition: color 0.3s ease; }
          .nav-link:hover { color: #2563EB !important; }
          .dropdown-animation { animation: slideDown 0.2s ease-out; }
          .nav-link.active {
            color: #2563EB !important;
            position: relative;
          }
          .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #2563EB;
            border-radius: 2px;
            animation: underline-grow 0.3s ease-out;
          }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes underline-grow { from { width: 0; } to { width: 100%; } }
        `}
      </style>
      <nav className="fixed top-0 left-0 w-full z-50 box-border flex justify-between items-center py-2 px-4 sm:px-8 bg-white shadow-md font-sans">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>

          <Link to="/vendor/dashboard">
            <img src={logo} alt="Cayman Logo" className="h-12 sm:h-16 w-auto transition-transform duration-300 sm:pl-7 sm:scale-150" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
            <Link to="/" className="p-2 text-white hover:bg-gray-300 bg-gray-500  rounded-full transition-colors" title="Go to Home">
              <HouseHeart size={20} />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-extrabold text-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all border border-blue-200"
              >
                {user ? getInitials(user.name) : 'V'}
              </button>

              {isDropdownOpen && (
                <div className="dropdown-animation absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-sm font-bold text-gray-800">{user?.name || 'Vendor'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'vendor@example.com'}</p>
                  </div>
                  <Link 
                    to="/vendor/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/vendor/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >Dashboard
                  </Link>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">Logout</button>
                </div>
              )}
            </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar