import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { User, Briefcase, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null); // 'user' or 'vendor'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const loadingToast = toast.loading('Signing you in...');
      // Now that we have the access token, we can fetch the user's profile info.
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        // At this point, you have the user's email, name, and profile picture.

        // Register/Login user in backend
        await axios.post('http://localhost:5000/api/signup', {
          name: userInfo.data.name || userInfo.data.given_name,
          email: userInfo.data.email,
          role: selectedRole,
          googleId: userInfo.data.sub
        });

        const user = {
          name: userInfo.data.name || userInfo.data.given_name,
          email: userInfo.data.email,
          role: selectedRole
        };
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('authStateChange'));
        toast.dismiss(loadingToast);
        toast.success(`Welcome, ${user.name}!`);
        navigate(selectedRole === 'vendor' ? '/vendor/dashboard' : '/');
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('Failed to get user information.');
        console.error('Failed to fetch user info from Google:', error);
      }
    },
    onError: () => {
      toast.error('Google login failed. Please try again.');
    },
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error("Please select User or Vendor first");
      return;
    }

    const { name, email, password } = formData;

    const loadingToast = toast.loading('Creating account...');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/signup',
        { name, email, password, role: selectedRole }
      );

      if (response.data.success) {
        const user = { name, email, role: selectedRole };
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('authStateChange'));

        toast.success(`Welcome, ${name}!`);
        navigate(selectedRole === 'vendor'
          ? '/vendor/dashboard'
          : '/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-14 font-sans pt-24 pb-12">
      <div className="flex flex-col md:flex-row w-full max-w-[1100px] min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-violet-600 text-white items-center justify-center p-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-4">Your Home, Perfected.</h1>
            <p className="text-lg opacity-80 max-w-[350px] mx-auto">Join Caymantainane today and experience hassle-free home services.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12">
          {!selectedRole ? (
            <div className="w-full max-w-[380px] text-center animate-in fade-in duration-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Join as a User or Vendor</h2>
              <p className="text-gray-500 mb-10">Choose your account type to get started.</p>
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedRole('user')}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-gray-200 rounded-xl text-gray-800 font-bold text-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300"
                >
                  <User className="w-6 h-6 text-indigo-500" />
                  <span>I'm a User</span>
                </button>
                <button
                  onClick={() => setSelectedRole('vendor')}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-gray-200 rounded-xl text-gray-800 font-bold text-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
                >
                  <Briefcase className="w-6 h-6 text-purple-500" />
                  <span>I'm a Vendor</span>
                </button>
              </div>
              <p className="text-center mt-8 text-gray-500 text-sm">
                Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">Log in</Link>
              </p>
            </div>
          ) : (
            <div className="w-full max-w-[380px] animate-in fade-in duration-500">
              <button onClick={() => setSelectedRole(null)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-6">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create a <span className="capitalize">{selectedRole}</span> Account</h2>
              <p className="text-gray-500 mb-10">Let's get you started!</p>

              <form onSubmit={handleSignup}>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Your Full Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-600 transition duration-200"
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-600 transition duration-200"
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-600 transition duration-200"
                  />
                </div>

                <button type="submit" className="w-full py-3.5 border-none rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-base font-semibold cursor-pointer mt-4 shadow-lg shadow-indigo-500/40 hover:-translate-y-1 transition-transform duration-300">Create Account</button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <span className="flex-1 h-px bg-gray-300"></span>
                <span className="text-gray-400 text-sm">OR</span>
                <span className="flex-1 h-px bg-gray-300"></span>
              </div>

              <button onClick={() => login()} className="w-full py-3.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-base font-semibold cursor-pointer flex items-center justify-center gap-3 shadow-sm hover:-translate-y-1 transition-transform duration-300 no-underline">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path><path d="M1 1h22v22H1z" fill="none"></path></svg>
                Sign up with Google
              </button>
              <p className="text-center mt-8 text-gray-500 text-sm">
                Already have an account? <Link to="/login" state={{ role: selectedRole }} className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">Log in</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Signup