import React, { useState, useEffect } from "react";
import { HiAnnotation, HiPhotograph, HiDocumentText } from "react-icons/hi";
import { Link } from "react-router-dom";

const Mainhome = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
    }
  }, []);

  // Toggle dark mode and update localStorage
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"} font-sans`}>
      <nav className={`bg-gradient-to-r ${darkMode ? "from-gray-800 to-gray-900" : "from-indigo-600 to-indigo-800"} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wide flex items-center">
            Datascribe.
          </h1>
          <div className="flex space-x-4 items-center">
            <Link to="/login" className="flex gap-2 items-center">
              <button className={`bg-white hover:bg-gray-200 ${darkMode ? "text-indigo-800" : "text-gray-800"} font-bold py-2 px-4 rounded`}>
                Login
              </button>
            </Link>
            <Link to="/register" className="flex gap-2 items-center">
              <button className={`bg-white hover:bg-gray-200 ${darkMode ? "text-indigo-800" : "text-gray-800"} font-bold py-2 px-4 rounded`}>
                SignUp
              </button>
            </Link>
            <button
              onClick={toggleDarkMode}
              className={`flex items-center w-10 h-8 rounded-full transition-colors duration-300 ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
            >
              <span className={`block w-6 h-6 rounded-full transition-transform duration-300 ${darkMode ? "transform translate-x-4 bg-gray-800" : "bg-white"}`}></span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          A Professional Platform for Data Annotations
        </h2>
        <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
          Streamline your annotation process with our intuitive tools for both
          image and text data.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            to="/image"
            className="transform hover:scale-105 transition-transform duration-300"
          >
            <div className={`bg-white ${darkMode ? "text-black"  : "bg-white"} p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow`}>
              <div className="flex items-center mb-4">
                <HiPhotograph className="text-4xl text-indigo-600 mr-4" />
                <h3 className="text-2xl font-semibold">Image Annotations</h3>
              </div>
              <p className={`text-gray-600 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Effortlessly annotate your images with our intuitive tool.
              </p>
            </div>
          </Link>
          <Link
            to="/text"
            className="transform hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <div className={`bg-white ${darkMode ? "text-black" : "bg-white"} p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow`}>
              <div className="flex items-center mb-4">
                <HiDocumentText className="text-4xl text-indigo-600 mr-4" />
                <h3 className="text-2xl font-semibold">Text Annotations</h3>
              </div>
              <p className={`text-gray-600 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Streamline your text annotation process with our intuitive tools.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Mainhome;
