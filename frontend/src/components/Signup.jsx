import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { User, Briefcase, ArrowLeft, Home } from "lucide-react";
import logo from "../../public/logo1.png"; // Import the logo

const Signup = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("user"); // Default to 'user' (Customer)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const loadingToast = toast.loading("Signing you in...");
      // Now that we have the access token, we can fetch the user's profile info.
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        // At this point, you have the user's email, name, and profile picture.

        // Register/Login user in backend
        await apiClient.post("/api/signup", {
          name: userInfo.data.name || userInfo.data.given_name,
          email: userInfo.data.email,
          role: selectedRole,
          googleId: userInfo.data.sub,
        });

        const user = {
          name: userInfo.data.name || userInfo.data.given_name,
          email: userInfo.data.email,
          role: selectedRole,
        };
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("authStateChange"));
        toast.dismiss(loadingToast);
        toast.success(`Welcome, ${user.name}!`);
        navigate(selectedRole === "vendor" ? "/vendor/dashboard" : "/");
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Failed to get user information.");
        console.error("Failed to fetch user info from Google:", error);
      }
    },
    onError: () => {
      toast.error("Google login failed. Please try again.");
    },
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error("Please select User or Vendor first");
      return;
    }

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const loadingToast = toast.loading("Creating account...");

    try {
      const response = await apiClient.post("/api/signup", {
        name: name,
        email,
        password,
        role: selectedRole,
      });

      if (response.data && response.data.token) {
        let token = response.data.token;
        if (token.startsWith("Bearer "))
          token = token.replace(/^Bearer\s+/i, "");
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.dispatchEvent(new Event("authStateChange"));

        toast.success(response.data.message || `Welcome, ${name}!`);
        navigate(selectedRole === "vendor" ? "/vendor/dashboard" : "/");
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
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-8 font-sans pt-24 pb-12">
      <div className="flex flex-col md:flex-row w-full max-w-[1200px] min-h-[850px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex-col justify-center p-12 items-center relative">
          {/* Decorative Blur Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl"></div>

          <div className="relative z-10 text-center max-w-md">
            {/* Cayman Logo */}
            <img src={logo} alt="Caymantainane Logo" className="h-20 mx-auto mb-8 drop-shadow-xl" />

            {/* Trusted Platform Badge (Glassmorphism) */}
            <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold mb-8 border border-white/30">
              Trusted Platform
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              Every service, <br />
              <span className="text-indigo-200">booked smarter.</span>
            </h1>

            {/* Description Paragraph */}
            <p className="text-lg text-indigo-100/90 max-w-[360px] mx-auto mb-10 leading-relaxed">
              Connect with verified electricians, carpenters, salons, doctors, and 20+ more service categories — all in one place.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 mb-12 py-6 border-y border-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold">12K+</p>
                <p className="text-[10px] uppercase tracking-tighter opacity-70 font-semibold">Providers</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-2xl font-bold">200K+</p>
                <p className="text-[10px] uppercase tracking-tighter opacity-70 font-semibold">Bookings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">20+</p>
                <p className="text-[10px] uppercase tracking-tighter opacity-70 font-semibold">Categories</p>
              </div>
            </div>

            {/* Testimonial Card (Glassmorphism) */}
            <div className="bg-white/10 backdrop-blur-lg p-7 rounded-2xl border border-white/20 text-left shadow-2xl">
              <p className="italic text-sm text-indigo-50 mb-6 leading-relaxed">
                "Found a certified electrician in under 3 minutes. The date booking showed his exact availability — no back-and-forth."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/40 flex items-center justify-center text-white font-bold border border-white/30 text-lg">
                  RK
                </div>
                <div>
                  <p className="font-bold text-base leading-none">Rachel Kim</p>
                  <p className="text-xs text-indigo-200 mt-1.5">Homeowner, Brooklyn NY</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto">
          {/* Top Toggle Nav */}
          <div className="flex justify-end mb-10">
            <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
              <Link to="/login" className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-all">Login</Link>
              <button className="px-6 py-2 text-sm font-bold bg-white text-indigo-600 rounded-lg shadow-sm">Signup</button>
            </div>
          </div>

          <div className="w-full max-w-[420px] mx-auto">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-500 mb-8 font-medium">Join 200,000+ users on CayBookMe today.</p>

            {/* Role Selection */}
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-4">I AM A</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole("user")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border-2 ${selectedRole === "user"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50"
                    : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    }`}
                >
                  <User className="w-4 h-4" /> Customer
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("vendor")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border-2 ${selectedRole === "vendor"
                    ? "border-purple-600 bg-purple-50 text-purple-600 ring-4 ring-purple-50"
                    : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    }`}
                >
                  <Briefcase className="w-4 h-4" /> Service Provider
                </button>
              </div>
            </div>

            {/* Google Login */}
            <button
              onClick={() => login()}
              className="w-full py-3.5 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm font-bold flex items-center justify-center gap-3 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300 mb-8"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Continue with Google
            </button>

            <div className="relative mb-8 text-center">
              <span className="bg-white px-4 text-gray-400 text-xs font-bold uppercase relative z-10">or sign up with email</span>
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -z-0"></div>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block mb-1.5 font-bold text-gray-700 text-xs uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block mb-1.5 font-bold text-gray-700 text-xs uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all bg-gray-50/50"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 font-bold text-gray-700 text-xs uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-bold text-gray-700 text-xs uppercase tracking-wider">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-normal">
                  I agree to CayBookMe's <span className="text-indigo-600 font-bold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-indigo-600 font-bold hover:underline cursor-pointer">Privacy Policy</span>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 mt-2"
              >
                Create {selectedRole === "vendor" ? "provider" : "customer"} account
              </button>
            </form>

            <p className="text-center mt-8 text-gray-500 text-sm font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-black hover:underline ml-1">Log in</Link>
            </p>

            <button
              onClick={() => navigate("/")}
              className="w-full mt-10 py-3 rounded-xl text-gray-400 hover:text-gray-800 hover:bg-gray-50 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-3.5 h-3.5" /> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
