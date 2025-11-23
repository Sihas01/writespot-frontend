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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!role) return alert("Please select your role");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
        role: role, // ← SEND "Reader" or "Author" EXACTLY (no toLowerCase!)
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful! Welcome back to WriteSpot");
      
      // Redirect based on role
      if (role === "Author") {
        navigate("/dashboard"); 
      } else {
        navigate("/reader/dashboard"); // or your reader page
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE - GREEN */}
      <div
        className="relative w-1/2 bg-green-800 flex flex-col justify-center items-center overflow-hidden"
        style={{ backgroundImage: `url(${pattern})`, backgroundSize: "cover" }}
      >
        <div className="absolute inset-0 bg-green-800/70"></div>
        <h1 className="absolute top-10 left-10 text-6xl font-light text-white tracking-wide z-20">
          WriteSpot
        </h1>
        <img src={logo} alt="Logo" className="w-96 z-10 drop-shadow-2xl" />
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-1/2 bg-white flex items-center justify-center px-20">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">LOG IN</h2>

          <form onSubmit={handleLogin}>
            {/* ROLE SELECT - NOW SHOWS "Reader" / "Author" */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border-2 border-yellow-500 rounded-lg px-5 py-4 mb-6 text-lg font-medium focus:outline-none focus:border-yellow-600 transition"
              required
            >
              <option value="" disabled>Select Role</option>
              <option value="Reader">Reader</option>
              <option value="Author">Author</option>
            </select>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-5 py-4 mb-5 text-base"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-5 py-4 mb-10 text-base"
              required
            />

            {/* SOCIAL BUTTONS */}
            <div className="flex justify-center gap-10 mb-12">
              <button type="button" className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition">
                <FcGoogle className="text-3xl" />
              </button>
              <button type="button" className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition">
                <FaFacebookF className="text-3xl text-blue-600" />
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-xl py-5 rounded-full transition disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Don't have an account?{" "}
            <Link to="/registration" className="text-green-700 font-bold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}