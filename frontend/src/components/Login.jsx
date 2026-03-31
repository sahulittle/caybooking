import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role;
  const [isVendor, setIsVendor] = useState(role === "vendor");

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const loadingToast = toast.loading("Signing you in...");
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        toast.dismiss(loadingToast);
        const user = {
          name: userInfo.data.name || userInfo.data.given_name,
          email: userInfo.data.email,
          role: isVendor ? "vendor" : "user",
        };
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("authStateChange"));
        toast.success(`Welcome back, ${user.name}!`);
        navigate(isVendor ? "/vendor/dashboard" : "/");
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

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    // Call backend login
    (async () => {
      const role = isVendor ? "vendor" : location.state?.role || "user";
      const loading = toast.loading("Logging in...");
      try {
        const res = await apiClient.post("/api/login", {
          email,
          password,
          role,
        });
        if (res.data && res.data.token) {
          // Token returned can be prefixed with 'Bearer ' - normalize
          let token = res.data.token;
          if (token.startsWith("Bearer "))
            token = token.replace(/^Bearer\s+/i, "");
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          window.dispatchEvent(new Event("authStateChange"));

          toast.dismiss(loading);
          toast.success(res.data.message || "Login successful");

          const dest =
            res.data.user?.activeRole === "admin"
              ? "/admin/dashboard"
              : res.data.user?.activeRole === "vendor"
                ? "/vendor/dashboard"
                : "/";
          navigate(dest);
        }
      } catch (error) {
        toast.dismiss(loading);
        toast.error(error.response?.data?.message || "Login failed");
      }
    })();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row w-full  max-w-[1100px] min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-violet-600 text-white items-center justify-center p-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-4">
              Your Home, Perfected.
            </h1>
            <p className="text-lg opacity-80 max-w-[350px] mx-auto">
              Welcome back! Access your account to manage your home services.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-[380px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-500 mb-10">
              Please enter your details to log in.
            </p>

            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-600 transition duration-200"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-600 transition duration-200"
                />
              </div>

              {role !== "user" && (
                <div className="flex items-center gap-2 mb-6">
                  <input
                    type="checkbox"
                    id="vendor-checkbox"
                    checked={isVendor}
                    onChange={(e) => setIsVendor(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 cursor-pointer"
                  />
                  {/* <label htmlFor="vendor-checkbox" className="text-gray-700 font-medium cursor-pointer select-none text-sm">Log in as Vendor</label> */}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 border-none rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-base font-semibold cursor-pointer mt-4 shadow-lg shadow-indigo-500/40 hover:-translate-y-1 transition-transform duration-300"
              >
                Log In
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <span className="flex-1 h-px bg-gray-300"></span>
              <span className="text-gray-400 text-sm">OR</span>
              <span className="flex-1 h-px bg-gray-300"></span>
            </div>

            <button
              onClick={() => login()}
              className="w-full py-3.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-base font-semibold cursor-pointer flex items-center justify-center gap-3 shadow-sm hover:-translate-y-1 transition-transform duration-300 no-underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
                <path d="M1 1h22v22H1z" fill="none"></path>
              </svg>
              Log in with Google
            </button>

            <p className="text-center mt-8 text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline"
              >
                Sign up
              </Link>
            </p>

            <div className="w-[80%] h-[40%] bg-gray-200 mt-20 flex items-center flex-col ">
              <p>admin mail:admin@gmail.com</p>
              <p>password:123456</p>

              <p>vendor mail:vendor@gmail.com</p>
              <p>password:123456</p>

              <p>user mail:user@gmail.com</p>
              <p>password:123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
