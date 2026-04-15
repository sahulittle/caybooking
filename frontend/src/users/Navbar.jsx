import React, { useState, useEffect } from 'react'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import logo from "../../public/logo1.png"
const Navbar = () => {
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
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
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }

  return (
    <>
      <style>
        {`
          .nav-link { transition: color 0.3s ease; }
          .nav-link:hover { color: #2563EB !important; } /* Tailwind blue-600 */
          .signup-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
          .signup-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4) !important; }
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
      <nav className="fixed top-0 left-0 w-full z-50 box-border flex justify-between items-center py-3 px-4 sm:px-8 bg-white shadow-md font-sans">
        <div className="flex items-center">
          {/* <a
            href="/"
            className="text-2xl font-extrabold no-underline tracking-tight"
            style={{
              background: 'linear-gradient(to right, #111827, #4B5563)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Logo<span className="text-blue-600">.</span>
          </a> */}
          <Link to="/">
            <img src={logo} alt="Cayman Logo" className="h-12 sm:h-16 pl-2 sm:pl-7 w-auto transition-transform duration-300" />
          </Link>
        </div>
        <div className="flex items-center">
          <button
            className="md:hidden mr-3 p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <ul className="hidden md:flex list-none m-0 p-0 space-x-8">
            {[
              { to: '/', name: 'Home', end: true },
              { to: '/service', name: 'Service' },
              { to: '/about', name: 'About' },
              { to: '/contact', name: 'Contact' },
            ].map(link => (
              <li key={link.name}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-link no-underline text-gray-600 text-base font-semibold py-2 ${isActive ? 'active' : ''}`
                  }
                  end={link.end}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center">
          {/* Desktop sign up / profile */}
          <div className="hidden md:flex items-center">
            {!user ? (
              <Link to="/signup">
                <button
                  className="signup-btn bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none py-3 px-6 rounded-full text-base font-bold cursor-pointer shadow-lg shadow-blue-500/50"
                >
                  Sign Up
                </button>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-extrabold text-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all border border-blue-200"
                >
                  {getInitials(user.name)}
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-animation absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 z-50">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-sm font-bold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link 
                      to={user.role === 'vendor' ? '/vendor/profile' : `/${user.role}/dashboard`} 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link 
                      to={user.role === 'vendor' ? '/vendor/dashboard' : `/${user.role}/dashboard`} 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">Dashboard
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu content */}
          {isMobileOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-40 border-t">
              <div className="px-4 py-4 space-y-2">
                {[
                  { to: '/', name: 'Home', end: true },
                  { to: '/service', name: 'Service' },
                  { to: '/about', name: 'About' },
                  { to: '/contact', name: 'Contact' },
                ].map(link => (
                  <NavLink
                    key={link.name}
                    to={link.to}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) => `block nav-link text-gray-700 font-semibold py-2 ${isActive ? 'text-blue-600' : ''}`}
                    end={link.end}
                  >
                    {link.name}
                  </NavLink>
                ))}

                {!user ? (
                  <Link to="/signup" onClick={() => setIsMobileOpen(false)}>
                    <button className="w-full text-left bg-gradient-to-br from-blue-600 to-blue-800 text-white py-2 px-4 rounded-full font-bold">Sign Up</button>
                  </Link>
                ) : (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                    <Link to={user.role === 'vendor' ? '/vendor/profile' : `/${user.role}/dashboard`} onClick={() => setIsMobileOpen(false)} className="block py-2 text-gray-700">Profile</Link>
                    <Link to={user.role === 'vendor' ? '/vendor/dashboard' : `/${user.role}/dashboard`} onClick={() => setIsMobileOpen(false)} className="block py-2 text-gray-700">Dashboard</Link>
                    <button onClick={() => { handleLogout(); setIsMobileOpen(false); }} className="mt-2 text-red-500">Logout</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}



export default Navbar