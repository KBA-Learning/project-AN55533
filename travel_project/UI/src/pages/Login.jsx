import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loginimage from "../assets/login.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginSubmit = async (e) => {
    e.preventDefault();

    const loginDetails = { username, password };

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginDetails),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Logged in successfully as ${data.userType}`);
        // Navigate based on user type
        if (data.userType === "admin") {
          navigate("/adminhome");
        } else {
          navigate("/userhome");
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-400">
      {/* Left Section: Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src={loginimage}
          alt="Login Illustration"
          className="h-[550px] mt-[150px] bg-[400px]"
        />
      </div>

      {/* Right Section: Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-cover bg-center">
        <form
          onSubmit={loginSubmit}
          className="w-[90%] max-w-md p-6 bg-white rounded-lg shadow-md"
        >
          <h1 className="text-2xl font-bold text-center text-blue-600">
            Login
          </h1>

          {/* Username Input */}
          <div className="mt-6">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/sign" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
