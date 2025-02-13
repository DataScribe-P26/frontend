import React, { useState, useEffect } from "react";
import { Search, Bell, HelpCircle, Sun, Moon, LogOut } from "lucide-react";
import { useAuth } from '../login/AuthContext';
import { useNavigate } from "react-router-dom";

export const TopBar = ({ title }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Get display name from user data
  const getDisplayName = () => {
    if (!user) return '';
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  const displayName = getDisplayName();

  // Handle theme toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfile(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfile && !event.target.closest('.profile-container')) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfile]);

  return (
    <div className="h-16 flex items-center justify-between px-6 border-b bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Title Section */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          {title || `Welcome ${displayName}`}
        </h1>
      </div>

      {/* Right-Side Icons & User Profile */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="text-yellow-400" size={20} />
            ) : (
              <Moon className="text-gray-400" size={20} />
            )}
          </button>
        </div>

        {/* Help Icon with Tooltip */}
        <div className="relative">
          <HelpCircle
            className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 cursor-pointer transition-colors duration-200"
            size={20}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute top-[120%] right-0 z-50 bg-gray-800 text-gray-100 text-sm rounded-lg shadow-lg p-4 w-64">
              <h3 className="font-semibold text-lg mb-2 text-purple-400">
                Key Features:
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Image annotation with bounding boxes, polygons, and segmentation.</li>
                <li>Text annotation with NER tagging.</li>
                <li>AI-driven auto-annotation.</li>
                <li>Dynamic label management.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Other Icons */}
        <Search className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 cursor-pointer" size={20} />
        <Bell className="text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 cursor-pointer" size={20} />

        {/* User Profile Section */}
        <div className="relative profile-container">
          <div className="flex items-center space-x-3">
            {/* Username display */}
            <span className="text-sm font-medium hidden md:block text-gray-700 dark:text-gray-300">
              {displayName}
            </span>

            {/* Profile Avatar */}
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-800 to-indigo-800 text-white flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity duration-300"
              onClick={() => setShowProfile(!showProfile)}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>

            {/* Dropdown Menu */}
            {showProfile && (
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 w-48 z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-red-400 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
