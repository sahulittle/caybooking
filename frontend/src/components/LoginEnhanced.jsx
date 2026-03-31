// frontend/src/components/LoginEnhanced.jsx
/**
 * Enhanced Login Component with Strict Role-Based Access Control
 * Requires role selection during login
 * Prevents accessing other roles without re-login
 */
import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const LoginEnhanced = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState(location.state?.role || 'user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for role mismatch error from URL
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'role_mismatch') {
      setError('You were accessing a panel with a different role. Please log in with the correct role.');
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!selectedRole) {
        throw new Error('Please select a role to continue');
      }

      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        role: selectedRole  // 🔒 MUST specify role
      });

      if (response.data.success) {
        // ✅ Store token and user info with activeRole
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        const { user } = response.data;
        toast.dismiss();
        toast.success(`Welcome back, ${user.name}!`);
        window.dispatchEvent(new Event('authStateChange'));

        // 🎯 Navigate to correct dashboard based on activeRole
        const dashboardRoutes = {
          'admin': '/admin/dashboard',
          'vendor': '/vendor/dashboard',
          'user': '/dashboard'
        };

        navigate(dashboardRoutes[user.activeRole] || '/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      
      // Handle specific role-related errors
      if (errorMessage.includes('role is not assigned')) {
        setError('This role is not assigned to your account. Please select a different role.');
      } else if (errorMessage.includes('email or password')) {
        setError('Invalid email or password.');
      } else {
        setError(errorMessage);
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const loadingToast = toast.loading('Signing you in...');
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        // Login with selected role
        const response = await axios.post('http://localhost:5000/api/login', {
          email: userInfo.data.email,
          password: userInfo.data.sub,
          role: selectedRole
        });

        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));

          const { user } = response.data;
          toast.dismiss(loadingToast);
          toast.success(`Welcome back, ${user.name}!`);
          window.dispatchEvent(new Event('authStateChange'));

          const dashboardRoutes = {
            'admin': '/admin/dashboard',
            'vendor': '/vendor/dashboard',
            'user': '/dashboard'
          };

          navigate(dashboardRoutes[user.activeRole] || '/');
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        const errorMsg = error.response?.data?.message || 'Google login failed';
        toast.error(errorMsg);
        setError(errorMsg);
      }
    },
    onError: () => {
      setError('Google login failed. Please try again.');
      toast.error('Google login failed. Please try again.');
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-[1100px] min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-violet-600 text-white items-center justify-center p-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-4">Your Home, Perfected.</h1>
            <p className="text-lg opacity-80 max-w-[350px] mx-auto">
              Welcome back! Access your account with the correct role.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-[380px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-500 mb-6">Select your role and sign in.</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Role Selector - MUST select before login */}
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Select Your Role *
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 font-medium"
                >
                  <option value="user">👤 User</option>
                  <option value="vendor">🏢 Vendor</option>
                  <option value="admin">👑 Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ You can only access the panel for the role you select. Use the role switcher later to access other roles.
                </p>
              </div>

              {/* Email Input */}
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Email</label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Password</label>
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={() => login()}
              disabled={loading}
              className="w-full py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition font-semibold"
            >
              Sign in with Google
            </button>

            {/* Sign Up Link */}
            <p className="text-center mt-6 text-gray-600">
              Don't have an account?
              <Link to="/signup" className="text-indigo-600 font-semibold ml-1 hover:underline">
                Sign Up
              </Link>
            </p>

            {/* Warning Box */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
              <strong>🔒 Security Note:</strong> Each role has separate access. User role cannot access vendor/admin panels. Vendor role cannot access user/admin panels.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginEnhanced;
