import React, { useState } from "react";
import { HiAnnotation } from "react-icons/hi";
import { FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../login/AuthContext';

const MainhomeNavbar = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Get display name from user data
  const getDisplayName = () => {
    if (!user) return '';
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  const displayName = getDisplayName();

  // Handle logout using AuthContext
  const handleLogout = () => {
    logout();
    setShowProfile(false);
  };

  // Close profile dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfile && !event.target.closest('.profile-container')) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfile]);

  return (
    <nav className="text-white px-6 py-5 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Left side: Datascribe.ai */}
        <Link to="/home" className="flex items-center">
          <HiAnnotation className="mr-3 text-4xl text-purple-400 transform transition-transform duration-300 hover:scale-110  "/>
          <h1 className="text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
  Datascribe.ai
</h1>

        </Link>

        {/* Right side: Icons including Help, User, and Settings */}
        <div className="flex items-center space-x-10 relative">
          {/* Help Icon with Tooltip */}
          <div className="relative">
            <FaQuestionCircle
              className="text-2xl cursor-pointer hover:text-purple-400 transition-transform duration-300 hover:scale-110"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div className="absolute top-[120%] right-0 z-50 bg-gray-800 bg-opacity-90 text-gray-100 text-sm rounded-lg shadow-lg p-4 w-64">
                <h3 className="font-semibold text-lg mb-2 text-purple-400">
                  Key Features:
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Comprehensive image annotation with bounding boxes, polygons,
                    and segmentation.
                  </li>
                  <li>Text annotation with advanced Named Entity Recognition (NER) tagging.</li>
                  <li>AI-driven auto-annotation to enhance speed and accuracy.</li>
                  <li>Dynamic label management for both text and image classes.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Settings Icon */}
          <FaCog className="text-2xl cursor-pointer hover:text-purple-400 transition-transform duration-300 hover:scale-110" />

          {/* User Profile Section */}
          <div className="relative profile-container">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Username display */}
                <span className="text-sm font-medium hidden md:block">
                  {displayName}
                </span>
                
                {/* Profile Avatar */}
                <div
                  className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center cursor-pointer hover:bg-purple-400 transition-colors duration-300"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>

                {/* Dropdown Menu */}
                {showProfile && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl py-2 w-48 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
                ?
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainhomeNavbar;