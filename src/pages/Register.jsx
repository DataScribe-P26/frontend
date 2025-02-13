import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { HiAnnotation } from "react-icons/hi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import NeonCursor from "../css/neon";
import { GoogleLogin } from '@react-oauth/google';
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validate password format
  const validatePassword = (password) => {
    // Minimum 6 characters, at least one number, and one special character
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return regex.test(password);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrors((prev) => {
        const { email, ...rest } = prev; // Remove the email error if valid
        return rest;
      });
    }
  };


  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!validatePassword(value)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters long and contain a number and a special character.",
      }));
    } else {
      setErrors((prev) => {
        const { password, ...rest } = prev; // Remove the password error if valid
        return rest;
      });
    }
  };

  async function handleRegister(event) {
    event.preventDefault();

    // Clear previous errors
    setErrors({});

    let formIsValid = true;

    // Validate email
    if (!validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
      formIsValid = false;
    }

    // Validate password
    if (!validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters long and contain a number and a special character.",
      }));
      formIsValid = false;
    }

    if (!formIsValid) return;

    try {
      const result = await axios.post("http://127.0.0.1:8000/auth/register", {
        email: email.trim(),
        password: password.trim(),
        full_name: fullName.trim(),
        username: username.trim(), // Pass the username to the backend
      });

       // Display success toast here
    toast.success("Registration successful! Welcome to DataScribe.", {
      position: "top-center",
      autoClose: 3000,
      theme: "light",
    });

    setTimeout(() => {
      navigate("/login");
    }, 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Registration failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
      });
      console.error("Registration error:", errorMessage);
    } finally {
      setEmail("");
      setPassword("");
      setFullName("");
      setUsername("");
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-purple-800 to-indigo-900 relative">
      <NeonCursor/>
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src="/videos/17085-278405143_small.mp4" type="video/mp4" />
        </video>

        {/* Enhanced Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 flex justify-center">
            <div className="w-1/2 h-full bg-gradient-to-b from-purple-500/10 to-transparent blur-xl"></div>
          </div>

          {/* Logo and Title Section */}
          <div className="relative flex flex-col items-center mb-22">
            <div className="flex items-center gap-6 mb-4">
              <div className="relative">
                <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur-md"></div>
                <HiAnnotation className="text-8xl text-white animate-pulse relative" />
              </div>
              <h1 className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-400">
                Datascribe.ai
              </h1>
            </div>

            {/* Tagline with gradient underline */}
            <div className="relative">
              <p className="text-xl text-purple-100 text-center max-w-2xl leading-relaxed">
                Empowering your data with advanced, AI-driven auto annotations for images, text, and more providing unified, data-agnostic solutions.
              </p>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
          </div>

          {/* Enhanced Features Section */}
          <div className="relative mt-10 space-y-2 text-l w-full max-w-2xl items-center justify-center flex flex-col">
            {/* Feature Items */}
            <div className="feature-item group hover:bg-purple-900/20 p-4 rounded-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-purple-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <div className="absolute inset-0 bg-purple-400/50 rounded-full animate-ping"></div>
                </div>
                <p className="text-purple-100 group-hover:text-white transition-colors duration-300">
                  Unified and Intuitive Interface for Diverse Annotation Tasks
                </p>
              </div>
            </div>

            <div className="feature-item group hover:bg-purple-900/20 p-4 rounded-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-purple-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <div className="absolute inset-0 bg-purple-400/50 rounded-full animate-ping"></div>
                </div>
                <p className="text-purple-100 group-hover:text-white transition-colors duration-300">
                  AI-Powered Auto Annotations for Faster Data Labeling
                </p>
              </div>
            </div>

            <div className="feature-item group hover:bg-purple-900/20 p-4 rounded-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-purple-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <div className="absolute inset-0 bg-purple-400/50 rounded-full animate-ping"></div>
                </div>
                <p className="text-purple-100 group-hover:text-white transition-colors duration-300">
                  Integrated Augmentations to Enhance Diversity
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Bottom Element */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">Unlock the Power of Automated Data Annotation with AI</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.fullName && <p className="mt-1 text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.username && <p className="mt-1 text-red-500 text-sm">{errors.username}</p>}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={handleEmailChange} // Update onChange handler
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange} // Update onChange handler
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-700 to-purple-800 text-white rounded-xl font-semibold hover:opacity-90 transition duration-200"
            >
              Register
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} theme="light" />
    </div>
  );
}
