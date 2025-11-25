import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/logo.png";
import pattern from "../assets/images/pattern.png";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "your email";
  const autoResend = location.state?.autoResend;

  // Auto-resend OTP when coming from login modal
  useEffect(() => {
    if (autoResend && email && email !== "your email") {
      handleResend();
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage("Please enter 6-digit OTP");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        email,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      setMessage("Email verified successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setMessage("Sending new code...");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/resend-otp`, { email });
      setMessage("New OTP sent! Check your email");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
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

          {message && (
            <p className={`text-center mb-6 text-sm font-medium ${message.includes("sent") || message.includes("success") ? "text-green-700" : "text-red-600"}`}>
              {message}
            </p>
          )}

          <form onSubmit={handleVerify}>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full text-center text-4xl tracking-widest py-6 px-4 border-2 border-yellow-500 rounded-xl focus:outline-none focus:border-yellow-600 transition text-gray-800"
              required
              autoFocus
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
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-green-700 font-bold hover:underline"
            >
              {resendLoading ? "Sending..." : "Send Again"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}