import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    try {
      const result = await axios.post("http://localhost:8000/auth/register", {
        email: email.trim(),
        password: password.trim(),
        full_name: fullName.trim(),
      });

      // Display the success message from the response
      toast.success(result.data.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
      });

      // Optional: Redirect to the login page after successful registration
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      // Handle error and display a message
      const errorMessage = error.response?.data?.detail || "Registration failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
      });
      console.error("Registration error:", errorMessage);
    } finally {
      // Clear input fields
      setEmail("");
      setPassword("");
      setFullName("");
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <nav className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-extrabold tracking-wide flex items-center">
              Datascribe.ai
            </h1>
          </div>
        </nav>

        <div className="w-full h-[100vh] mob:h-[90vh] flex items-center xs:px-0 xs:items-end xs:pb-[180px] relative">
          <div className="w-[380px] z-10 bg-purple-700 mx-auto lg:w-[430px] rounded-md px-8 pt-16 pb-20 xs:pt-9 shadow-[B6C4B6] shadow-sm border-stone-900 text-white">
            <h1 className="text-white font-bold text-3xl text-center">Sign Up</h1>
            <form className="mt-[40px]" onSubmit={handleRegister}>
              <input
                className="w-full h-[8vh] xs:h-[6.5vh] rounded-sm border-b-[3px] border-gray-300 focus:border-green-500 focus:outline-none p-2 text-black"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
              <input
                className="w-full h-[8vh] xs:h-[6.5vh] rounded-sm border-b-[3px] border-gray-300 focus:border-green-500 focus:outline-none p-2 mt-[25px] text-black"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <input
                type="password"
                className="w-full h-[8vh] xs:h-[6.5vh] rounded-sm mt-[25px] border-b-[3px] border-gray-300 focus:border-green-500 p-2 text-black"
                placeholder="Create a Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="w-full h-[7vh] bg-purple-900 rounded-sm mb-4 text-xl font-medium mt-[25px]"
                type="submit"
              >
                Register
              </button>
            </form>
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
            theme="light"
          />
        </div>
      </div>
    </>
  );
}
