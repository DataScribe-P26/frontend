import React, { useState } from "react";
import { HiAnnotation } from "react-icons/hi";
import { FaUserCircle, FaCog, FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const MainhomeNavbar = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  

  return (
    <nav className="text-white px-6 py-5 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Left side: Datascribe.ai */}
        <Link to="/home" className="flex items-center">
          <HiAnnotation className="mr-3 text-4xl text-purple-400 transform transition-transform duration-300 hover:scale-110" />
          <h1 className="text-3xl font-extrabold tracking-wide">Datascribe.ai</h1>
        </Link>

        {/* Right side: Icons including Help, User, and Settings */}
        <div className="flex items-center space-x-10 relative">
          {/* Help Icon with Tooltip */}
          <FaQuestionCircle
            className="text-2xl cursor-pointer hover:text-purple-400 transition-transform duration-300 hover:scale-110"
            
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute top-[120%] right-0 z-50 bg-gray-800 bg-opacity-90 text-gray-100 text-sm rounded-lg shadow-lg p-4 w-64">
              <h3 className="font-semibold text-lg mb-2 text-purple-400">Key Features:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Comprehensive image annotation with bounding boxes, polygons, and segmentation.</li>
                <li>Text annotation with advanced Named Entity Recognition (NER) tagging.</li>
                <li>AI-driven auto-annotation to enhance speed and accuracy.</li>
                <li>Dynamic label management for both text and image classes.</li>
              </ul>
            </div>
          )}
          {/* Other Icons */}
          <FaCog
            className="text-2xl cursor-pointer hover:text-purple-400 transition-transform duration-300 hover:scale-110"
          />
          <FaUserCircle
            className="text-2xl cursor-pointer hover:text-purple-400 transition-transform duration-300 hover:scale-110"
          />
        </div>
      </div>
    </nav>
  );
};

export default MainhomeNavbar;
