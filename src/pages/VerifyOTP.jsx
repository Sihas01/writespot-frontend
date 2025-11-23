// src/pages/VerifyOTP.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/logo.png";
import pattern from "../assets/images/pattern.png";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // SUPER SAFE WAY TO GET EMAIL — WORKS EVERY TIME
  const email =
    location.state?.email ||
    location.state?.state?.email ||
    location?.state?.state?.state?.email ||
    "your email";

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return alert("Please enter 6-digit OTP");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/auth/verify-otp", {
        email: email,
        otp: otp,
      });

      localStorage.setItem("token", res.data.token);
      alert("Email verified successfully! Welcome to WriteSpot");
      navigate("/author/dashboard"); // change to your dashboard path
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT - GREEN SIDE */}
      <div
        className="w-1/2 bg-green-800 relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${pattern})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-green-800/70"></div>
        <h1 className="absolute top-10 left-10 text-6xl font-light text-white tracking-wider">
          WriteSpot
        </h1>
        <img src={logo} alt="books" className="w-96 z-10 drop-shadow-2xl" />
      </div>

      {/* RIGHT - OTP FORM */}
      <div className="w-1/2 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full px-10">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Verify Email</h2>
          <p className="text-center text-gray-600 mb-10">
            Enter the 6-digit code sent to
            <br />
            <strong className="text-green-700 text-lg">{email}</strong>
          </p>

          <form onSubmit={handleVerify}>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full text-center text-4xl tracking-widest py-6 px-4 border-2 border-yellow-500 rounded-xl focus:outline-none focus:border-yellow-600 transition text-gray-800"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-xl py-5 rounded-full mt-10 transition disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Didn't receive code?{" "}
            <span className="text-green-700 font-bold cursor-pointer">
              Resend OTP
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}