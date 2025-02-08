import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../text_pages/Text/ThemeContext";
import FuzzySearch from "fuzzy-search";
import MainhomeNavbar from "../../Main home/MainhomeNavbar";
import { UserPlus } from "lucide-react";

const AddMembers = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  

  // Initialize fuzzy search
  const searcher = new FuzzySearch();

  const handleSearch = (query) => {
    setSearchQuery(query);
    const result = searcher.search(query);
    setFilteredMembers(result);
  };

  return (
    <div
      className={`h-screen overflow-hidden flex flex-col ${
        isDarkMode ? "text-white" : "text-black"
      } bg-cover bg-center bg-opacity-80`}
      style={{ backgroundImage: `url('/images/image3.png')` }}
    >
      <MainhomeNavbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-6 space-x-3">
            <UserPlus className="w-8 h-10 text-indigo-500" />
            <h1
              className={`text-3xl font-extrabold text-center mb-6 mt-6 ${
                isDarkMode ? "text-gray-400" : "text-white"
              } transition-all`}
            >
              Add Members to Organization
            </h1>
          </div>

          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } backdrop-blur-lg rounded-lg shadow-xl bg-opacity-50`}
          >
            <div className="p-6 space-y-8">
              {/* Search Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <label className="block text-lg font-medium">
                  Search for Members
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 transition-all`}
                    placeholder="Search members..."
                  />
                  <UserPlus className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </motion.div>

             

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-end space-x-3"
              >
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`px-6 py-3 rounded-md font-semibold transition-all ${
                    isDarkMode
                      ? "bg-red-700 hover:bg-red-800 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  Skip
                </button>
                <button
                  onClick={() => navigate("/CreateOrgProject")}
                  className={`px-6 py-3 rounded-md font-semibold transition-all ${
                    isDarkMode
                      ? "bg-green-700 hover:bg-green-800 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  Add Member
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddMembers;
