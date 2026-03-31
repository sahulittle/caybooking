# Frontend Integration Guide - Role-Based Authentication

## Overview
The backend now requires role selection during login. The frontend needs to be updated to support this workflow.

## Key Changes Needed

### 1. Update API Client with Token Handling

**File**: `frontend/src/api/apiClient.js`

```javascript
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const sendMaintenanceRequest = async (payload) => {
  const response = await apiClient.post('/api/maintenance-request', payload)
  return response.data
}

export default apiClient
```

---

### 2. Update Signup Component

**File**: `frontend/src/components/Signup.jsx`

Key changes:
- Already has role selection ✓
- Update to store token properly
- Update localStorage structure

```javascript
const handleSignup = async (e) => {
  e.preventDefault();
  const name = e.target[0].value;
  const email = e.target[1].value;
  const password = e.target[2].value;

  const loadingToast = toast.loading('Creating account...');

  try {
    const response = await axios.post('http://localhost:5000/api/signup', { 
      name, 
      email, 
      password, 
      role: selectedRole 
    });

    if (response.data.success) {
      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        roles: response.data.user.roles,
        activeRole: response.data.user.activeRole
      }));
      
      window.dispatchEvent(new Event('authStateChange'));
      toast.dismiss(loadingToast);
      toast.success(`Welcome, ${name}! Account created.`);
      navigate(selectedRole === 'vendor' ? '/vendor/dashboard' : '/');
    }
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    toast.dismiss(loadingToast);
    toast.error(
      error.response?.data?.message ||
      "Server error. Please try again."
    );
  }
};
```

---

### 3. Update Login Component (IMPORTANT)

**File**: `frontend/src/components/Login.jsx`

The login form needs to:
1. Request API login instead of local storage
2. Accept role parameter
3. Store token from response
4. Handle multiple roles

```javascript
import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVendor, setIsVendor] = useState(location.state?.role === 'vendor');
  const [selectedRole, setSelectedRole] = useState('user');
  const [userRoles, setUserRoles] = useState(null); // For users with multiple roles
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const loadingToast = toast.loading('Signing you in...');
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        // Try to login with the selected role
        const response = await axios.post('http://localhost:5000/api/login', {
          email: userInfo.data.email,
          password: userInfo.data.sub, // Use Google ID as password
          role: isVendor ? 'vendor' : 'user'
        });

        if (response.data.success) {
          // Store token from response
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          window.dispatchEvent(new Event('authStateChange'));
          toast.dismiss(loadingToast);
          toast.success(`Welcome back, ${response.data.user.name}!`);
          navigate(isVendor ? '/vendor/dashboard' : '/');
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        
        // Check if user has multiple roles
        if (error.response?.status === 403 && error.response?.data?.message?.includes('role')) {
          // User might have multiple roles, show selector
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to login. Please try again.');
        }
        console.error('Login Error:', error.response?.data || error.message);
      }
    },
    onError: () => {
      toast.error('Google login failed. Please try again.');
    },
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    const loadingToast = toast.loading('Logging in...');

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        role: selectedRole
      });

      if (response.data.success) {
        // Store token and user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        window.dispatchEvent(new Event('authStateChange'));
        toast.dismiss(loadingToast);
        toast.success('Login successful!');
        
        // Navigate based on active role
        const activeRole = response.data.user.activeRole;
        if (activeRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (activeRole === 'vendor') {
          navigate('/vendor/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      
      if (error.response?.status === 403) {
        // User doesn't have this role
        toast.error(error.response.data.message);
      } else {
        toast.error(
          error.response?.data?.message ||
          'Invalid email or password'
        );
      }
      
      console.error("Login Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-[1100px] min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-violet-600 text-white items-center justify-center p-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-4">Your Home, Perfected.</h1>
            <p className="text-lg opacity-80 max-w-[350px] mx-auto">Welcome back! Access your account to manage your home services.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-[380px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-500 mb-10">Please enter your details to log in.</p>
            
            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Email</label>
                <input 
                  type="email" 
                  placeholder="Enter Your Email"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Password</label>
                <input 
                  type="password" 
                  placeholder="Enter Your Password"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Role Selector */}
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Login as</label>
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                >
                  <option value="user">User</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                Login
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <button 
              onClick={() => login()}
              className="w-full py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Sign in with Google
            </button>

            <p className="text-center mt-6 text-gray-600">
              Don't have an account? 
              <Link to="/signup" className="text-indigo-600 font-semibold ml-1 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

---

### 4. Update Auth Context/Store (If Using Context)

Create or update `frontend/src/contexts/AuthContext.jsx`:

```javascript
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on app mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    
    setLoading(false);

    // Listen for auth state changes
    const handleAuthChange = () => {
      const newUser = localStorage.getItem('user');
      const newToken = localStorage.getItem('token');
      
      if (newUser && newToken) {
        setUser(JSON.parse(newUser));
        setToken(newToken);
      } else {
        setUser(null);
        setToken(null);
      }
    };

    window.addEventListener('authStateChange', handleAuthChange);
    return () => window.removeEventListener('authStateChange', handleAuthChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    window.dispatchEvent(new Event('authStateChange'));
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  const switchRole = async (newRole) => {
    if (!hasRole(newRole)) {
      throw new Error(`User does not have ${newRole} role`);
    }
    
    // Log in again with new role to get new token
    // This should call your login API with the new activeRole
    // Then dispatch authStateChange event
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, logout, hasRole, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### 5. Update Protected Routes

**File**: `frontend/src/routes/ProtectedRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !user.roles?.includes(requiredRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
```

---

### 6. Update Role-Specific Navigation

**File**: `frontend/src/utils/roleHelpers.js`

```javascript
export const getRoleLabel = (role) => {
  const labels = {
    'user': 'User',
    'vendor': 'Vendor',
    'admin': 'Administrator'
  };
  return labels[role] || role;
};

export const getNavigationByRole = (role) => {
  const navigation = {
    'user': [
      { path: '/', label: 'Home' },
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/services', label: 'Services' }
    ],
    'vendor': [
      { path: '/vendor/dashboard', label: 'Dashboard' },
      { path: '/vendor/services', label: 'My Services' },
      { path: '/vendor/earnings', label: 'Earnings' }
    ],
    'admin': [
      { path: '/admin/dashboard', label: 'Dashboard' },
      { path: '/admin/users', label: 'Users' },
      { path: '/admin/vendors', label: 'Vendors' }
    ]
  };
  return navigation[role] || [];
};

export const canAccessEndpoint = (userRoles, requiredRoles) => {
  return requiredRoles.some(role => userRoles?.includes(role));
};
```

---

## Testing Scenarios

### 1. Fresh Registration
```
1. Go to /signup
2. Select role "User"
3. Fill form and submit
4. Should receive token and be redirected to home
5. Check localStorage: token and user should be stored
```

### 2. Multi-Role Login
```
1. Admin assigns 'vendor' role to a user
2. Go to /login
3. Enter credentials and select role
4. If role selector available, should show "User" and "Vendor" options
5. Select "Vendor" and login
6. activeRole should be "vendor" in stored user object
```

### 3. Role-Specific Access
```
1. Log in as User
2. Try to access /vendor/dashboard (should redirect)
3. Log out
4. Log in as Vendor
5. Should be able to access /vendor/dashboard
```

---

## LocalStorage Structure

### Before (Old)
```javascript
{
  "user": {
    "id": "...",
    "name": "John",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### After (New)
```javascript
{
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John",
    "email": "john@example.com",
    "roles": ["user", "vendor"],
    "activeRole": "vendor"
  }
}
```

---

## API Endpoints to Update Frontend Calls

### Auth Endpoints
```
POST   /api/signup           # Register new user
POST   /api/login            # Login with role selection
```

### Admin Role Management
```
GET    /api/admin/users/:id/roles         # Get user's roles
PUT    /api/admin/users/:id/assign-role   # Assign new role
PUT    /api/admin/users/:id/remove-role   # Remove role
```

---

## Common Frontend Issues & Solutions

### Issue: "Invalid role in token"
- **Cause**: Token has activeRole user doesn't have
- **Solution**: Clear localStorage and re-login

### Issue: User can't select role in login
- **Cause**: Role selector not implemented
- **Solution**: Add role dropdown to login form

### Issue: After login, redirected to wrong page
- **Cause**: Using user.role instead of user.activeRole
- **Solution**: Check getNavigationByRole and update to use activeRole

---

## Migration Script for Existing Frontend

If you have existing localStorage with old structure:

```javascript
// Run once on app startup
function migrateLocalStorage() {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    if (!userData.roles) {
      // Old format, migrate to new
      userData.roles = [userData.role];
      userData.activeRole = userData.role;
      delete userData.role;
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }
}

// Call in your App.jsx or index.jsx
migrateLocalStorage();
```
