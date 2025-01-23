import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { HiAnnotation, HiEye, HiEyeOff } from "react-icons/hi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const result = await axios.post("http://localhost:8000/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      if (result.data.status === "success") {
        localStorage.setItem("user", email);
        toast.success("Welcome!!!", {
          position: "top-center",
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setEmail("");
      setPassword("");
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-indigo-800 to-purple-900">
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

      {/* Login Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
        <div className="bg-transparent bg-opacity-40 backdrop-blur-md shadow-xl rounded-[10%] overflow-hidden border border-white border-opacity-20 h-[500px]  mx-auto">

            <div className="bg-gradient-to-r mb-4 from-purple-800 to-indigo-900 px-6 py-5 text-center">
              <h1 className="text-3xl font-extrabold text-white tracking-wide">
                Welcome Back
              </h1>
            </div>

            <div className="p-8">
              <form onSubmit={handleLogin} className="space-y-6 ">
                <div>
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="w-full mb-3 px-4 py-3 bg-transparent border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>

                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 mb-3 bg-transparent border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition"
                  >
                    {show ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl font-semibold tracking-wide shadow-lg hover:opacity-90 transition"
                >
                  Login
                </button>

                <div className="text-center text-white mt-4">
                  <Link
                    to="/register"
                    className="underline  text-purple-300 hover:text-purple-500 transition"
                  >
                    Don't Have an Account? Register
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
