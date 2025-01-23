import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { HiAnnotation } from "react-icons/hi";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState(""); // New state for username
  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    try {
      const result = await axios.post("http://127.0.0.1:8000/auth/register", {
        email: email.trim(),
        password: password.trim(),
        full_name: fullName.trim(),
        username: username.trim(), // Pass the username to the backend
      });

      toast.success(result.data.message, {
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
    <div className="relative h-screen overflow-hidden flex flex-col bg-gradient-to-br from-indigo-800 to-purple-900">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/17085-278405143_small.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-900 opacity-40 backdrop-blur-sm"></div>

      {/* Navigation Bar */}
      <nav className="relative z-10 py-6 px-8 text-white">
        <h1 className="text-4xl font-extrabold flex items-center gap-3">
          <HiAnnotation className="text-5xl text-purple-500 transform transition-transform duration-300 hover:scale-110" />
          Datascribe.ai
        </h1>
      </nav>

      {/* Register Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-transparent bg-opacity-40 backdrop-blur-md shadow-xl rounded-[10%] overflow-hidden border border-white border-opacity-20 h-[550px] mx-auto">
            <div className="bg-gradient-to-r mb-2 from-purple-800 to-indigo-900 px-6 py-5 text-center">
              <h1 className="text-3xl font-extrabold text-white tracking-wide">
                Sign Up
              </h1>
            </div>

            <div className="p-8">
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full mb-1 px-4 py-3 bg-transparent border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full mb-1 px-4 py-3 bg-transparent border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full mb-1 px-4 py-3 bg-transparent border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Create a Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full mb-3 px-4 py-3 bg-transparent border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl font-semibold tracking-wide shadow-lg hover:opacity-90 transition"
                >
                  Register
                </button>

                <div className="text-center text-white mt-4">
                  <Link
                    to="/login"
                    className="underline text-purple-300 hover:text-purple-500 transition"
                  >
                    Already Have an Account? Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
