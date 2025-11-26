import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/logo.png";
import pattern from "../assets/images/pattern.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email, role });
      setMessage(res.data.msg);
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row justify-center">
      {/* LEFT SIDE */}
      <div
        className="relative w-full lg:w-1/2 bg-green-800 hidden lg:flex flex-col justify-center items-center overflow-hidden h-64 lg:h-auto"
        style={{ backgroundImage: `url(${pattern})`, backgroundSize: "cover" }}
      >
        <div className="absolute inset-0 bg-green-800/70"></div>
        <h1 className="absolute top-10 left-10 text-4xl lg:text-6xl font-light font-inknut text-white tracking-wide z-20">
          WriteSpot
        </h1>
        <img src={logo} alt="Logo" className="w-64 lg:w-96 z-10 drop-shadow-2xl" />
      </div>

      {/* RIGHT SIDE (hidden on mobile) */}
      <div className="flex lg:w-1/2 bg-white items-center justify-center px-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Reset Password</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-5 py-4 mb-6 text-base"
              required
            />

            <select name="role" id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-gray-300 rounded-lg px-5 py-4 mb-6 text-base" required>
              <option value="">Select your role</option>
              <option value="author">Author</option>
              <option value="reader">Reader</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-xl py-5 rounded-full transition disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {message && (
            <p className="mt-6 text-center text-green-700 font-medium">{message}</p>
          )}

          <p className="text-center mt-8 text-gray-600">
            <Link to="/login" className="text-green-700 font-bold hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}