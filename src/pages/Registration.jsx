import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/images/logo.png";
import pattern from "../assets/images/pattern.png";
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
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(""); // success or error from server
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const validatePassword = (pwd) =>
    pwd.length >= 8 && /[0-9]/.test(pwd) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // === FRONTEND VALIDATION ===
    if (!formData.name.trim()) newErrors.name = "Full Name is required";

    if (!formData.role) newErrors.role = "Please select your role";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be 8+ characters, contain a number and a special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Stop if any validation fails
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("");
      return;
    }

    // === ALL GOOD → SEND TO BACKEND ===
    setLoading(true);
    setErrors({});
    setMessage("");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
      });

      setMessage("Registration successful! Check your email for OTP verification.");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: formData.email.trim() } });
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Registration failed. Please try again.";
      setMessage(errorMsg);

      // Highlight email if already exists
      if (errorMsg.toLowerCase().includes("exists") || errorMsg.toLowerCase().includes("already")) {
        setErrors({ email: "This email is already registered" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT - FORM */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-24 xl:px-32 py-10 lg:py-0 bg-white">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-8 text-gray-800 mt-8">
            Create an Account
          </h2>

          {/* SUCCESS / ERROR MESSAGE */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center font-medium border ${
                message.includes("successful")
                  ? "bg-green-50 text-green-800 border-green-300"
                  : "bg-red-50 text-red-800 border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-5 py-4 text-base border rounded-xl focus:outline-none focus:border-green-600 transition ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Role */}
            <div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-5 py-4 text-base border rounded-xl focus:outline-none appearance-none bg-white ${
                  errors.role ? "border-red-500" : "border-gray-300"
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%236b7280' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 16px center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "12px",
                }}
              >
                <option value="">Select Role</option>
                <option value="reader">Reader</option>
                <option value="author">Author</option>
              </select>
              {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-5 py-4 text-base border rounded-xl focus:outline-none focus:border-green-600 transition ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-5 py-4 text-base border rounded-xl focus:outline-none focus:border-green-600 transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-5 py-4 text-base border rounded-xl focus:outline-none focus:border-green-600 transition ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg py-4 rounded-xl transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Continue"}
            </button>
          </form>

          <div className="text-center my-6 text-gray-500 relative">
            <span className="bg-white px-4 z-10 relative">or</span>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
          </div>

          <div className="flex justify-center gap-6">
            <button
              type="button"
              className="w-14 h-14 rounded-full border-2 border-gray-300 hover:border-green-600 flex items-center justify-center transition shadow-sm hover:shadow-md"
            >
              <FcGoogle className="text-3xl" />
            </button>
          </div>

          <p className="text-center mt-8 text-gray-600 text-sm sm:text-base">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-green-600 font-bold cursor-pointer hover:underline"
            >
              LOG IN
            </span>
          </p>
        </div>
      </div>

      {/* Desktop Green Side */}
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

      {/* Mobile Background */}
      <div
        className="lg:hidden fixed inset-0 -z-10 bg-green-800 bg-cover bg-center opacity-90"
        style={{ backgroundImage: `url(${pattern})` }}
      >
        <div className="absolute inset-0 bg-green-800/70"></div>
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

export default Registration;