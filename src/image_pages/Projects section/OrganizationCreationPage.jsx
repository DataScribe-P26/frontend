import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../text_pages/Text/ThemeContext";
import { useAuth } from "../../login/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import FuzzySearch from "fuzzy-search";
import MainhomeNavbar from "../../Main home/MainhomeNavbar.jsx";
import { Building2 } from "lucide-react";
import { USER_TYPE } from "../../Main home/user-type.js";


const OrganizationCreationPage = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    localStorage.setItem("userType", USER_TYPE.ORGANIZATION);
  }, []);

  const handleSubmit = async () => {
    if (!organizationName.trim()) {
      toast.error("Please enter an organization name");
      return;
    }
    const organizationData = {
      name: organizationName,
      admin_id: user.email,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/organizations/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Organization Created:", data);
      toast.success("Organization created successfully!");

    } catch (error) {
      toast.error("Failed to create organization");
    }
      // Store the organization name in localStorage
      localStorage.setItem("organizationName", organizationName);
  };

  return (

    <div
    className={`h-screen overflow-hidden flex flex-col  ${
      isDarkMode ? "text-white" : "text-black"
    } bg-cover bg-center bg-opacity-80`}
    style={{
      backgroundImage: `url('/images/image3.png')`,
    }}
  >
      <MainhomeNavbar />
      <div className="container mx-auto  px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-6 space-x-3">
            <Building2 className="w-8 h-10 text-indigo-500" />
            <h1
  className={`text-3xl font-extrabold text-center mb-6 mt-6 ${
    isDarkMode ? "text-gray-400" : "text-white"
  } transition-all`}
>
  Create New Organization
</h1>

          </div>

          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } backdrop-blur-lg rounded-lg shadow-xl bg-opacity-50`}
          >
            <div className="p-6 space-y-8">
              {/* Organization Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <label className="block text-lg font-medium">
                  Organization Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500 transition-all`}
                    placeholder="Enter organization name"
                  />
                  <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
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
                  onClick={() => navigate("/home")}
                  className={`px-6 py-3 rounded-md font-semibold transition-all ${
                    isDarkMode
                      ? "bg-red-700 hover:bg-red-800 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSubmit(); // Your existing logic
                    navigate("/add-members");
                  }}

                  className={`px-6 py-3 rounded-md font-semibold transition-all ${
                    isDarkMode
                      ? "bg-green-700 hover:bg-green-800 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  Create Organization
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrganizationCreationPage;
