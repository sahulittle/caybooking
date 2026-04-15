import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { User, Briefcase, Home } from "lucide-react";
import logo from "../../public/logo-cayman2.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialRole = location.state?.role || "user";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selectedRole, setSelectedRole] = useState(initialRole);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const loadingToast = toast.loading("Signing you in...");
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const payload = {
          name: userInfo.data.name || userInfo.data.given_name,
          email: userInfo.data.email,
          role: selectedRole === "vendor" ? "vendor" : "user",
        };

        const res = await apiClient.post("/api/signup", payload);

        toast.dismiss(loadingToast);

        let token = res.data.token || "";
        if (token.startsWith("Bearer ")) {
          token = token.replace(/^Bearer\s+/i, "");
        }

        if (res.data && token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          window.dispatchEvent(new Event("authStateChange"));

          toast.success(
            `Welcome back, ${res.data.user.name || payload.name}!`
          );

          const resumeBooking = location.state?.resumeBooking;
          const from = location.state?.from;

          if (resumeBooking) {
            navigate("/bookingpage", { state: resumeBooking });
            return;
          }

          if (from && from.pathname) {
            navigate(from.pathname);
            return;
          }

          const dest =
            res.data.user?.activeRole === "admin"
              ? "/admin/dashboard"
              : res.data.user?.activeRole === "vendor"
              ? "/vendor/dashboard"
              : "/";

          navigate(dest);
        } else {
          toast.error("Login failed: no token returned");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Google login failed");
        console.error(error);
      }
    },
    onError: () => {
      toast.error("Google login failed. Please try again.");
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const role = selectedRole || "user";
    const loading = toast.loading("Logging in...");

    try {
      const res = await apiClient.post("/api/login", {
        email,
        password,
        role,
      });

      if (res.data && res.data.token) {
        let token = res.data.token;
        if (token.startsWith("Bearer ")) {
          token = token.replace(/^Bearer\s+/i, "");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("authStateChange"));

        toast.dismiss(loading);
        toast.success(res.data.message || "Login successful");

        const resumeBooking = location.state?.resumeBooking;
        const from = location.state?.from;

        if (resumeBooking) {
          navigate("/bookingpage", { state: resumeBooking });
          return;
        }

        if (from && from.pathname) {
          navigate(from.pathname);
          return;
        }

        const dest =
          res.data.user?.activeRole === "admin"
            ? "/admin/dashboard"
            : res.data.user?.activeRole === "vendor"
            ? "/vendor/dashboard"
            : "/";

        navigate(dest);
      } else {
        toast.dismiss(loading);
        toast.error("Login failed");
      }
    } catch (error) {
      toast.dismiss(loading);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-8 font-sans pt-24 pb-12">
      <div className="flex flex-col md:flex-row w-full max-w-[1200px] min-h-[750px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex-col justify-center p-12 items-center relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl"></div>

          <div className="relative z-10 text-center max-w-md">
            <img
              src={logo}
              alt="CayBookMe Logo"
              className="h-20 mx-auto mb-8 drop-shadow-xl"
            />

            <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold mb-8 border border-white/30">
              Trusted Platform
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              Every service, <br />
              <span className="text-indigo-200">booked smarter.</span>
            </h1>

            <p className="text-lg text-indigo-100/90 max-w-[360px] mx-auto mb-10 leading-relaxed">
              Connect with verified electricians, carpenters, salons, doctors,
              and 20+ more service categories — all in one place.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-12 py-6 border-y border-white/10">
              <div className="text-center">
                <p className="text-2xl font-bold">12K+</p>
                <p className="text-[10px] uppercase tracking-tighter opacity-70 font-semibold">
                  Providers
                </p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-2xl font-bold">200K+</p>
                <p className="text-[10px] uppercase tracking-tighter opacity-70 font-semibold">
                  Bookings
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">20+</p>
                <p className="text-[10px] uppercase tracking-tighter opacity-70 font-semibold">
                  Categories
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-7 rounded-2xl border border-white/20 text-left shadow-2xl">
              <p className="italic text-sm text-indigo-50 mb-6 leading-relaxed">
                "Found a certified electrician in under 3 minutes. The date
                booking showed his exact availability — no back-and-forth."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/40 flex items-center justify-center text-white font-bold border border-white/30 text-lg">
                  RK
                </div>
                <div>
                  <p className="font-bold text-base leading-none">Rachel Kim</p>
                  <p className="text-xs text-indigo-200 mt-1.5">
                    Homeowner, Brooklyn NY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto">
          <div className="flex justify-end mb-10">
            <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
              <Link
                to="/login"
                className="px-6 py-2 text-sm font-bold bg-white text-indigo-600 rounded-lg shadow-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-all"
              >
                Signup
              </Link>
            </div>
          </div>

          <div className="w-full max-w-[420px] mx-auto">
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              Please enter your details to log in.
            </p>

            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-4">
                I AM A
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole("user")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                    selectedRole === "user"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50"
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <User className="w-4 h-4" /> Customer
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("vendor")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                    selectedRole === "vendor"
                      ? "border-purple-600 bg-purple-50 text-purple-600 ring-4 ring-purple-50"
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <Briefcase className="w-4 h-4" /> Service Provider
                </button>
              </div>
            </div>

            <button
              onClick={() => login()}
              className="w-full py-3.5 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm font-bold flex items-center justify-center gap-3 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300 mb-8"
            >
              Log in with Google
            </button>

            <div className="relative mb-8 text-center">
              <span className="bg-white px-4 text-gray-400 text-xs font-bold uppercase relative z-10">
                or log in with email
              </span>
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -z-0"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block mb-1.5 font-bold text-gray-700 text-xs uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-gray-700 text-xs uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all bg-gray-50/50"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Role
                </label>
                <div className="flex gap-3">
                  <label
                    className={`px-3 py-2 rounded-lg cursor-pointer border ${
                      selectedRole === "user"
                        ? "bg-indigo-50 border-indigo-500"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={selectedRole === "user"}
                      onChange={() => setSelectedRole("user")}
                      className="mr-2"
                    />
                    User
                  </label>

                  <label
                    className={`px-3 py-2 rounded-lg cursor-pointer border ${
                      selectedRole === "vendor"
                        ? "bg-indigo-50 border-indigo-500"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="vendor"
                      checked={selectedRole === "vendor"}
                      onChange={() => setSelectedRole("vendor")}
                      className="mr-2"
                    />
                    Vendor
                  </label>

                  <label
                    className={`px-3 py-2 rounded-lg cursor-pointer border ${
                      selectedRole === "admin"
                        ? "bg-indigo-50 border-indigo-500"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={selectedRole === "admin"}
                      onChange={() => setSelectedRole("admin")}
                      className="mr-2"
                    />
                    Admin
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Select the role you want to sign in as.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 mt-2"
              >
                Log In
              </button>
            </form>

            <p className="text-center mt-8 text-gray-500 text-sm font-medium">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 font-black hover:underline ml-1"
              >
                Sign up
              </Link>
            </p>

            <button
              onClick={() => navigate("/")}
              className="w-full mt-10 py-3 rounded-xl text-gray-400 hover:text-gray-800 hover:bg-gray-50 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-gray-100 shadow-sm"
            >
              <Home className="w-3.5 h-3.5" /> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;