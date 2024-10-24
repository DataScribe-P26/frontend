import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [show, setshow] = useState(false);
  const navigate = useNavigate();

  function handle_login(event) {
    event.preventDefault();
    axios
      .post("https://wt-project-backend-9uhv.onrender.com/login", {
        email,
        password,
      })
      .then((result) => {
        console.log(result.data);
        if (result.data === "success") {
          const user = localStorage.setItem("user", email);
          console.log("user is correctly authenticated");
          toast.success("Welcome!!!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
        setemail("");
        setpassword("");
      });
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wide flex items-center">
            Datascribe.
          </h1>
        </div>
      </nav>

      <div className=" w-full h-[100vh] mob:h-[90vh] flex items-center xs:px-0 xs:items-end xs:pb-[180px] relative ">
        <div className="w-[380px]   z-10 bg-indigo-700 mx-auto lg:w-[430px] rounded-md px-8 pt-16 pb-20 xs:pt-9 shadow-[B6C4B6] shadow-sm border-stone-900 text-white">


          <h1 className="text-white font-bold text-3xl text-center">Sign In</h1>
          <form className=" mt-[40px]" onSubmit={handle_login} action="POST">
            <input
              className="w-full h-[8vh] xs:h-[6.5vh] rounded-sm  border-b-[3px] border-gray-300 focus:border-green-500 focus:outline-none p-2"
              placeholder=" Enter Your Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              autoComplete="email"
              required
            />
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                className="w-full h-[8vh] xs:h-[6.5vh] rounded-sm mt-[25px] border-b-[3px] border-t-0 border-l-0 border-r-0 outline-none focus:ring-0 border-gray-300  focus:border-green-500 ppp p-2 "
                placeholder="  Enter Your Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                autoComplete="email"
                required
              />
              <label
                onClick={() => setshow(!show)}
                className="text-gray-400 absolute top-[44.5px] right-[17px] cursor-pointer select-none"
              >
                {show ? "Hide" : "Show"}
              </label>
            </div>
            <button
              className=" w-full h-[7vh] bg-indigo-900 rounded-sm mb-4  text-xl font-medium mt-[25px]"
              onClick={handle_login}
            >
              Login
            </button>
            <div className="flex justify-between mt-2">
              <div className="flex gap-2 mt-2">
                <Link to="/register" className="flex gap-2 items-center">
                  <p className=" font-light">{"Don't Have Account?"}</p>

                  <p className=" font-medium text-gray-300 cursor-pointer duration-150 text-lg hover:text-white">
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
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition:Bounce
        />
      </div>
      </div>
    </>
  );
}
