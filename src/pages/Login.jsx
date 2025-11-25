import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa6";
import logo from "../assets/images/logo.png";
import pattern from "../assets/images/pattern.png";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(true);
  const [verifyMode, setVerifyMode] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!role) return alert("Please select your role");

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
        role,
        rememberMe,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful! Welcome back to WriteSpot");

      if (res.data.token && res.data.user?.role) {
        if (res.data.user.role.toLowerCase() === "author") {
          navigate("/dashboard");
        } else {
          navigate("/reader/dashboard");
        }
      }

    } catch (err) {
      const msg = err.response?.data?.msg || "Login failed.";

      if (msg.toLowerCase().includes("verify your email")) {
        setVerifyEmail(email.trim().toLowerCase());
        setVerifyMode(true);
        setShowForm(false);
      } else {
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const goToVerifyOTP = () => {
    navigate("/verify-otp", {
      state: { email: verifyEmail, autoResend: true }
    });
  };

  const goBackToLogin = () => {
    setVerifyMode(false);
    setShowForm(true);
    setVerifyEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* LEFT GREEN PANEL - Desktop */}
      <div className="hidden lg:block lg:w-2/5 bg-green-800 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${pattern})` }}
        />
        <div className="absolute inset-0 bg-green-800/70" />
        <h1 className="absolute top-12 left-12 text-6xl font-extrabold text-white tracking-tight drop-shadow-2xl">
          WriteSpot
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={logo} alt="WriteSpot" className="w-4/5 max-w-lg drop-shadow-2xl" />
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 bg-white flex items-center justify-center px-6 py-12 lg:px-20 lg:py-0">
        <div className="w-full max-w-md">

          {/* === NORMAL LOGIN FORM === */}
          {showForm && (
            <>
              <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">LOG IN</h2>

              <form onSubmit={handleLogin} className="space-y-6">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-yellow-500 rounded-xl focus:outline-none focus:border-yellow-600 transition"
                  required
                >
                  <option value="" disabled>Select Role</option>
                  <option value="reader">Reader</option>
                  <option value="author">Author</option>
                </select>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:outline-none transition"
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:outline-none transition"
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <span className="text-gray-700">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-green-700 font-medium hover:underline text-sm">
                    Forgot Password?
                  </Link>
                </div>

                {/* Social Buttons */}
                <div className="flex justify-center gap-8 py-6">
                  <button type="button" className="w-14 h-14 rounded-full border-2 border-gray-300 hover:border-green-600 flex items-center justify-center transition">
                    <FcGoogle className="text-3xl" />
                  </button>
                  <button type="button" className="w-14 h-14 rounded-full border-2 border-gray-300 hover:border-green-600 flex items-center justify-center transition">
                    <FaFacebookF className="text-3xl text-blue-600" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xl py-5 rounded-full transition disabled:opacity-70 shadow-lg"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              </form>

              <p className="text-center mt-10 text-gray-600 text-lg">
                Don't have an account?{" "}
                <Link to="/registration" className="text-green-700 font-bold hover:underline">
                  Create an Account
                </Link>
              </p>
            </>
          )}

          {/* === VERIFY EMAIL MODE === */}
          {verifyMode && (
            <div className="text-center py-16">
              <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-10 shadow-2xl">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>

                <h3 className="text-3xl font-bold text-red-800 mb-4">Email Not Verified</h3>
                <p className="text-gray-700 text-lg mb-8">
                  We sent a 6-digit code to:<br />
                  <strong className="text-green-700 text-xl">{verifyEmail}</strong>
                </p>

                <button
                  onClick={goToVerifyOTP}
                  className="px-16 py-5 bg-green-600 hover:bg-green-700 text-white font-bold text-2xl rounded-full transition shadow-2xl transform hover:scale-105"
                >
                  Verify Email Now
                </button>

                <button
                  onClick={goBackToLogin}
                  className="block mx-auto mt-8 text-green-700 font-medium hover:underline"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BACKGROUND */}
      <div className="lg:hidden fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-green-800 bg-cover bg-center"
          style={{ backgroundImage: `url(${pattern})` }}
        />
        <div className="absolute inset-0 bg-green-800/80" />
        <h1 className="absolute top-8 left-1/2 -translate-x-1/2 text-5xl font-extrabold text-white tracking-tight">
          WriteSpot
        </h1>
        <img
          src={logo}
          alt="WriteSpot"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 opacity-90"
        />
      </div>
    </div>
  );
}