import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/logo.png";
import pattern from "../assets/images/pattern.png";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      setMessage(res.data.msg);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Invalid or expired link");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row justify-center">
      {/* LEFT SIDE */}
      <div
        className="hidden lg:block w-2/5 bg-green-800 bg-cover bg-center relative "
        style={{ backgroundImage: `url(${pattern})` }}
      >
        <div className="absolute inset-0 bg-green-800/70"></div>
        <h1 className="text-center mt-8 top-12 left-12 text-5xl font-extrabold text-white font-inknut tracking-tight drop-shadow-2xl z-10">
          WriteSpot
        </h1>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img src={logo} alt="WriteSpot Books" className="w-4/5 max-w-lg drop-shadow-2xl" />
        </div>
      </div>

      {/* RIGHT SIDE (hidden on mobile) */}
      <div className="flex lg:w-1/2 bg-white items-center justify-center px-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Set New Password</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-5 py-4 mb-5 text-base"
              required
              minLength="6"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-5 py-4 mb-8 text-base"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-xl py-5 rounded-full transition disabled:opacity-70"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          {message && (
            <p className={`mt-6 text-center font-medium ${message.includes("successful") ? "text-green-700" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}