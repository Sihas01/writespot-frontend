import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/images/logo.png";
import pattern from "../assets/images/pattern.png";   // ← Already correct
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }
    if (!formData.role) return alert("Please select a role");
    if (!formData.name.trim() || !formData.email.trim()) return alert("Name and Email are required");

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
      });

      alert("Check your email for OTP!");
      navigate("/verify-otp", { state: { email: formData.email.trim() } });
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center px-10 lg:px-24 xl:px-32">
        <h2 className="text-3xl font-semibold text-center mb-10">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 transition"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 appearance-none bg-white"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%236b7280' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 16px center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "12px",
            }}
            required
          >
            <option value="">Select Role</option>
            <option value="Reader">Reader</option>
            <option value="Author">Author</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 transition"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 transition"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:border-green-600 transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg py-4 rounded-xl transition duration-200 disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Continue"}
          </button>
        </form>

        <div className="text-center my-6 text-gray-500 relative">
          <span className="bg-white px-4 z-10 relative">or</span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -z-10"></div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            className="w-14 h-14 rounded-full border-2 border-gray-300 hover:border-green-600 flex items-center justify-center transition shadow-sm hover:shadow-md"
          >
            <FcGoogle className="text-3xl" />
          </button>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 font-bold cursor-pointer hover:underline"
          >
            LOG IN
          </span>
        </p>
      </div>

      {/* RIGHT SIDE - FIXED PATTERN */}
      <div
        className="hidden lg:flex w-2/5 bg-green-800 bg-cover bg-center relative flex-col items-center justify-center rounded-l-3xl overflow-hidden"
        style={{ backgroundImage: `url(${pattern})` }}   // ← THIS IS THE ONLY CHANGE
      >
        <h1 className="text-5xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg z-10">
          WriteSpot
        </h1>
        <img
          src={logo}
          alt="Books"
          className="w-4/5 max-w-md drop-shadow-2xl z-10"
        />
      </div>
    </div>
  );
}

export default Registration;