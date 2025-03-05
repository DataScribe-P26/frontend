// Sidebar
import React from "react";
import { Home, User, Building2, LogOut, Settings, Menu } from "lucide-react";
import { HiAnnotation } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { user, logout } = useAuth();
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`fixed z-50 left-0 top-0 h-screen opacity-70 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo and Toggle Button */}
      <div
        className={`flex items-center mb-6 ${
          isCollapsed ? "flex-col" : "justify-between"
        }`}
      >
        <Link to="/home" className="flex items-center gap-3">
          <div className="flex items-center">
            <HiAnnotation
              className={`text-4xl text-purple-400 transform transition-transform duration-300 hover:scale-110 ${
                isCollapsed ? "mb-2" : "mr-2"
              }`}
            />
            {!isCollapsed && (
              <h1 className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                Datascribe.ai
              </h1>
            )}
          </div>
        </Link>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
            isCollapsed ? "mt-2" : ""
          }`}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Sidebar Items */}
      <div className="space-y-6">
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">
              MAIN
            </h3>
          )}
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === "home"
                ? "bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <Home size={18} className="shrink-0" />
            {!isCollapsed && <span>Home</span>}
          </button>
        </div>

        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500  mb-2">
              PROFILE
            </h3>
          )}
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === "profile"
                ? "bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <User size={18} className="shrink-0" />
            {!isCollapsed && <span>Public Profile</span>}
          </button>
        </div>

        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">
              MORE
            </h3>
          )}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("organizations")}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === "organizations"
                  ? "bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Building2 size={18} className="shrink-0" />
              {!isCollapsed && <span>Organizations</span>}
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === "projects"
                  ? "bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Settings size={18} className="shrink-0" />
              {!isCollapsed && <span>Projects</span>}
            </button>

            <button
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={handleLogout}
            >
              <LogOut size={18} className="shrink-0" />
              {!isCollapsed && <span>Log out</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
