import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiAnnotation } from "react-icons/hi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth, login } from "../../utils/authUtils";
import api from "../../state/api-client/api";
import NeonCursor from "../../components/home/Neon";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [token, navigate]);

  async function handleLogin(event) {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const result = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      if (result.data.status === "success") {
        const tempToken = btoa(result.data.user.email);

        toast.success("Login successful! Welcome to Datascribe.ai", {
          position: "top-center",
          autoClose: 2000,
        });

        // Call login which will handle navigation
        login(tempToken, result.data.user, navigate);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.detail ||
          "Login failed. Please check your credentials.",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    }
  }

  const clientId =
    "849832574401-u80ur1j46qvdt7lr9lnatak8h6koj3l4.apps.googleusercontent.com"; // Replace with your actual Client ID

  const onSuccess = async (response) => {
    try {
      const result = await api.post("/auth/callback", {
        token: response.credential, // Send the Google token to the backend
      });

      if (result.data.status === "success") {
        const tempToken = btoa(result.data.user.email);
        toast.success("Login successful! Welcome to Datascribe.ai", {
          position: "top-center",
          autoClose: 2000,
        });

        login(tempToken, result.data.user);
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.detail || "Google login failed.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const onFailure = (error) => {
    console.log(error);
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-purple-800 to-indigo-900 relative">
        <NeonCursor />

        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src="/videos/17085-278405143_medium.mp4" type="video/mp4" />
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
                Empowering your data with advanced, AI-driven auto annotations
                for images, text, and more providing unified, data-agnostic
                solutions.
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

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Login to Your Account
            </h2>
            <p className="mt-2 text-gray-600">
              Access the Power of Automated Data Annotation with AI
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-700 to-purple-800 text-white rounded-xl font-semibold hover:opacity-90 transition duration-200"
            >
              Login
            </button>

            <div className="text-center text-gray-600">
              <Link
                to="/register"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Don't have an account? Register
              </Link>
            </div>
          </form>

          {/* Google SignIn Button */}
          <div className="flex justify-center mt-6">
            <GoogleLogin onSuccess={onSuccess} onError={onFailure} useOneTap />
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} theme="light" />
    </div>
  );
}
