import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { HiAnnotation } from "react-icons/hi";
import { Link } from "react-router-dom";

const Navbar = ({ toggleDarkMode, darkMode }) => {
  return (
    <nav className={`px-6 py-5 shadow-lg ${darkMode ? 'bg-indigo-700' : 'bg-gradient-to-r from-indigo-600 to-indigo-800'} text-white`}>
      <div className="container mx-auto flex items-center justify-between">
        <Link className="flex items-center">
          <HiAnnotation className="mr-3 text-4xl transform transition-transform duration-300 hover:scale-110" />
          <h1 className="text-3xl font-extrabold tracking-wide">Datascribe.</h1>
        </Link>
        <button
          onClick={toggleDarkMode}
          className={`w-10 h-10 rounded-full transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
        >
          <span className={`block w-6 h-6 rounded-full transition-transform duration-300 ${darkMode ? 'transform translate-x-2 bg-gray-800' : 'bg-white'}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
