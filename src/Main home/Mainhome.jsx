import React from "react";
import { HiAnnotation, HiPhotograph, HiDocumentText } from "react-icons/hi";
import { Link } from "react-router-dom";
import MainhomeNavbar from "./MainhomeNavbar.jsx";
import { useTheme } from "../text_pages/Text/ThemeContext.jsx"; // Import the theme context

const Mainhome = () => {
  const { isDarkMode } = useTheme(); // Access dark mode state


  // Handle video replay animation
  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.classList.remove("animate-fade-in");
      videoRef.current.classList.add("animate-fade-out");

      // Reapply fade-in effect after fade-out completes
      setTimeout(() => {
        videoRef.current.classList.remove("animate-fade-out");
        videoRef.current.classList.add("animate-fade-in");
      }, 2000); // Time should match the duration of the fade-out animation
    }
  };

  return (
    <div
      className={`h-screen overflow-hidden font-sans ${
        isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-white"
      }`}
    >
      {/* Navbar */}
      <MainhomeNavbar />

      {/* Background Video */}
      <div className="relative h-screen mt-0">
        {/* Video Container */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 animate-fade-in" // Added fade-in animation
          autoPlay
          loop
          muted
          onEnded={handleVideoEnd} // Trigger on video end
        >
          <source src="/videos/12716-241674181_tiny.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Main Content */}
        <main className="relative container mx-auto px-4 py-12 z-10 h-full flex flex-col justify-start items-center pt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Welcome to the Ultimate Annotation Platform
          </h2>
          <p
            className={`text-xl text-center mb-12 max-w-3xl ${
              isDarkMode ? "text-gray-300" : "text-white"
            }`}
          >
            Accelerate your data annotation process with cutting-edge tools
            designed for efficiency, accuracy, and ease.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              to="/image"
              className="transform hover:scale-105 transition-transform duration-300"
            >
              <div
                className={`p-6 rounded-xl shadow hover:shadow-sm transition-shadow duration-200 ease-in-out ${
                  isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                }`}
              >
                <div className="flex items-center mb-4">
                  <HiPhotograph
                    className={`text-4xl mr-4 ${
                      isDarkMode ? "text-purple-400" : "text-purple-700"
                    }`}
                  />
                  <h3 className="text-2xl  font-semibold">Image Annotations</h3>
                </div>
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Effortlessly annotate your images with our intuitive tool.
                </p>
              </div>
            </Link>
            <Link
              to="/text"
              className="transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div
                className={`p-6 rounded-xl shadow hover:shadow-sm transition-shadow duration-200 ease-in-out ${
                  isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                }`}
              >
                <div className="flex items-center mb-4">
                  <HiDocumentText
                    className={`text-4xl mr-4 ${
                      isDarkMode ? "text-purple-400" : "text-purple-700"
                    }`}
                  />
                  <h3 className="text-2xl  font-semibold">Text Annotations</h3>
                </div>
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Streamline your text annotation process with our intuitive tools.
                </p>
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Mainhome;
