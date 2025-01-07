import React from "react";
import { HiAnnotation } from "react-icons/hi";
import { FaUserCircle, FaCog, FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const MainhomeNavbar = () => {
  return (
    <nav className="  text-white  px-6 py-5 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Left side: Datascribe.ai */}
        <Link to="/home" className="flex items-center">
          <HiAnnotation className="mr-3 text-4xl text-purple-400 transform transition-transform duration-300 hover:scale-110" />
          <h1 className="text-3xl font-extrabold tracking-wide">Datascribe.ai</h1>
        </Link>

        {/* Right side: Icons including Help, User, and Settings */}
        <div className="flex items-center space-x-10">
          <FaQuestionCircle
            className="text-2xl cursor-pointer hover:text-purple-600 transition-transform duration-300 hover:scale-110"
          />
          <FaCog
            className="text-2xl cursor-pointer hover:text-purple-600 transition-transform duration-300 hover:scale-110"
          />
          <FaUserCircle
            className="text-2xl cursor-pointer hover:text-purple-600 transition-transform duration-300 hover:scale-110"
          />
        </div>
      </div>
    </nav>
  );
};

export default MainhomeNavbar;
