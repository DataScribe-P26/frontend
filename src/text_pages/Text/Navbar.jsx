import React, { useState } from "react";
import { HiAnnotation } from "react-icons/hi";
import { FaBell, FaUserCircle, FaCog, FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import HelpModal from "./HelpModal"; // Import Help Modal

const Navbar = () => {
  const [isHelpOpen, setHelpOpen] = useState(false); // Modal state

  const openHelpModal = () => setHelpOpen(true);
  const closeHelpModal = () => setHelpOpen(false);

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-5 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left side: Datascribe.ai */}
        <Link className="flex items-center">
          <HiAnnotation className="mr-3 text-4xl transform transition-transform duration-300 hover:scale-110" />
          <h1 className="text-3xl font-extrabold tracking-wide">Datascribe.ai</h1>
        </Link>

        {/* Right side: Icons including Help */}
        <div className="flex space-x-6 items-center">
          
          <FaQuestionCircle 
            className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110" 
            onClick={openHelpModal} // Open modal on click
          />
          <FaUserCircle className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110" />
          <FaCog className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110" />
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={closeHelpModal} />
    </nav>
  );
};

export default Navbar;
