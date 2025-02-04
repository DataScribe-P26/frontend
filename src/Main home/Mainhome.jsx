import React, { useEffect } from "react";  // Add this import
import { HiAnnotation, HiPhotograph, HiDocumentText } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MainhomeNavbar from "./MainhomeNavbar.jsx";

const Mainhome = () => {
  const navigate = useNavigate();


  
  return (
    <div className="">
      <div className="w-full h-screen font-sans bg-[#011429] text-gray-100 relative  lg:overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
        >
          <source src="/videos/121470-724697516_medium.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay Content */}
        <div className="relative z-10 h-full">
          {/* Navbar */}
          <MainhomeNavbar />

          {/* Main Content */}
          <main className="container mx-auto px-4 py-12 h-full flex flex-col justify-start items-center pt-16">
            <h2 className="text-3xl font-bold text-center mb-8 ">
              Welcome to the Ultimate Annotation Platform
            </h2>
            <p className="text-xl text-center mb-12 max-w-3xl">
              Accelerate your data annotation process with cutting-edge tools
              designed for efficiency, accuracy, and ease.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link
                to="/image"
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-opacity-95 p-6 rounded-xl shadow hover:shadow-sm transition-shadow duration-200 ease-in-out bg-gray-800 text-gray-200">
                  <div className="flex items-center mb-4">
                    <HiPhotograph className="text-4xl mr-4 text-white" />
                    <h3 className="text-2xl font-semibold">
                      Image Annotations
                    </h3>
                  </div>
                  <p className="text-gray-400">
                    Effortlessly annotate your images with our intuitive tool.
                  </p>
                </div>
              </Link>
              <Link
                to="/text"
                className="transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div className=" p-6 rounded-xl shadow hover:shadow-sm transition-shadow duration-200 ease-in-out bg-gray-800 bg-opacity-95 text-gray-200">
                  <div className="flex items-center mb-4">
                    <HiDocumentText className="text-4xl mr-4 text-white" />
                    <h3 className="text-2xl font-semibold">Text Annotations</h3>
                  </div>
                  <p className="text-gray-400">
                    Streamline your text annotation process with our intuitive
                    tools.
                  </p>
                </div>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Mainhome;
