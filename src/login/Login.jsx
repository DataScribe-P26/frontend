import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Login() {
  // Initialize email and password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  // Handle the login form submission
  async function handleLogin(event) {
    event.preventDefault();

    // Check if email and password are correctly set
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      // Send a POST request to the FastAPI backend
      const result = await axios.post("http://localhost:8000/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      // Check if login is successful
      console.log(result.data);
      if (result.data.status === "success") {
        localStorage.setItem("user", email);
        toast.success("Welcome!!!", {
          position: "top-center",
          autoClose: 3000,
        });

        // Redirect to home after a delay
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
    } catch (error) {
      // Log the error to inspect what went wrong
      console.error("Login error:", error);

      // Provide user-friendly feedback
      toast.error("Login failed. Please check your credentials.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      // Reset form inputs after submission
      setEmail("");
      setPassword("");
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <nav className="bg-purple-700 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-extrabold tracking-wide flex items-center">
              Datascribe.ai
            </h1>
          </div>
        </nav>

        <div className="w-full h-[100vh] mob:h-[90vh] flex items-center xs:px-0 xs:items-end xs:pb-[180px] relative ">
          <div className="w-[380px] z-10 bg-purple-700 mx-auto lg:w-[430px] rounded-md px-8 pt-16 pb-20 xs:pt-9 shadow-[B6C4B6] shadow-sm border-stone-900 text-white">
            <h1 className="text-white font-bold text-3xl text-center">Sign In</h1>
            <form className="mt-[40px]" onSubmit={handleLogin}>
              <input
                className="w-full h-[8vh] xs:h-[6.5vh] rounded-sm border-b-[3px] border-gray-300 focus:border-green-500 focus:outline-none p-2 text-black"
                placeholder="Enter Your Email"
                value={email}  // State is linked to input value
                onChange={(e) => setEmail(e.target.value)}  // onChange updates state
                autoComplete="email"
                required
              />
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  className="w-full h-[8vh] xs:h-[6.5vh] text-black rounded-sm mt-[25px] border-b-[3px] border-t-0 border-l-0 border-r-0 outline-none focus:ring-0 border-gray-300 focus:border-green-500 p-2"
                  placeholder="Enter Your Password"
                  value={password}  // State is linked to input value
                  onChange={(e) => setPassword(e.target.value)}  // onChange updates state
                  required
                />
                <label
                  onClick={() => setShow(!show)}
                  className="text-gray-400 absolute top-[44.5px] right-[17px] cursor-pointer select-none"
                >
                  {show ? "Hide" : "Show"}
                </label>
              </div>
              <button
                className="w-full h-[7vh] bg-purple-900 rounded-sm mb-4 text-xl font-medium mt-[25px]"
                type="submit"
              >
                Login
              </button>
              <div className="flex justify-between mt-2">
                <div className="flex gap-2 mt-2">
                  <Link to="/register" className="flex gap-2 items-center">
                    <p className="font-light">{"Don't Have an Account?"}</p>
                    <p className="font-medium text-gray-300 cursor-pointer duration-150 text-lg hover:text-white">
                      Register
                    </p>
                  </Link>
                </div>
              </div>
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
