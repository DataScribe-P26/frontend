import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../text_pages/Text/ThemeContext";
import { useAuth } from "../../login/AuthContext";
import useStore from "../../Zustand/Alldata";
import toast from "react-hot-toast";
import axios from "axios";
import FuzzySearch from "fuzzy-search"; // Fixed missing import for FuzzySearch

import { 
  Building2,
  Users,
  Search,
  UserPlus,
  X,
  ChevronRight,
  Save,
  ArrowLeft
} from "lucide-react";

const OrganizationCreationPage = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isMembersSectionSkipped, setIsMembersSectionSkipped] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/users");
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    const searcher = new FuzzySearch(users, ["email", "name"], { caseSensitive: false });
    const results = searcher.search(query);
    setFilteredUsers(results);
  };

  const handleAddMember = (user, role) => {
    if (!selectedMembers.some((member) => member.userId === user._id)) {
      setSelectedMembers(prev => [...prev, { ...user, role }]);
      toast.success(`Added ${user.name} as ${role}`);
    }
  };

  const handleRemoveMember = (userId) => {
    setSelectedMembers(prev => prev.filter((member) => member.userId !== userId));
  };

  const handleSubmit = async () => {
    if (!organizationName.trim()) {
      toast.error("Please enter an organization name");
      return;
    }

    const organizationData = {
      name: organizationName,
      admin_id: user.email,
      members: selectedMembers.map((member) => ({
        userId: member._id,
        role: member.role,
      })),
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
      return data;
  } catch (error) {
      console.error("Failed to create organization:", error);
  }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} text-gray-900 dark:text-gray-100`}
      style={{
        backgroundImage: 'url("images/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-8 space-x-3">
            <Building2 className="w-8 h-8 text-indigo-500" />
            <h2 className="text-3xl font-bold">Create New Organization</h2>
          </div>

          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl">
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
                    className="w-full p-3 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 
                             bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 
                             transition-all duration-200"
                    placeholder="Enter organization name"
                  />
                  <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </motion.div>

              {/* Skip Members Toggle */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-3"
              >
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMembersSectionSkipped}
                    onChange={() => setIsMembersSectionSkipped(!isMembersSectionSkipped)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                              peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full 
                              peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                              peer-checked:after:border-white after:content-[''] after:absolute 
                              after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                              after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                              dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-medium">Skip adding members</span>
                </label>
              </motion.div>

              {/* Members Section */}
              {!isMembersSectionSkipped && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Search Input */}
                  <div className="relative">
                    <Search className={`absolute left-3 top-3.5 w-5 h-5 transition-colors duration-200
                                   ${isSearchFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full p-3 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 
                               bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 
                               transition-all duration-200"
                      placeholder="Search users..."
                    />
                  </div>

                  {/* User List */}
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 rounded-lg
                                 bg-white dark:bg-gray-800 border border-gray-200 
                                 dark:border-gray-700 hover:border-indigo-500 
                                 dark:hover:border-indigo-500 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <UserPlus className="w-5 h-5 text-gray-400" />
                          <span>{user.name}</span>
                        </div>
                        <select
                          onChange={(e) => handleAddMember(user, e.target.value)}
                          className="p-2 rounded-md border border-gray-200 dark:border-gray-700
                                   bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select Role</option>
                          <option value="admin">Admin</option>
                          <option value="labeller">Labeller</option>
                          <option value="reviewer">Reviewer</option>
                        </select>
                      </motion.div>
                    ))}
                  </div>

                  {/* Selected Members List */}
                  {selectedMembers.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>Selected Members</span>
                      </h3>
                      {selectedMembers.map((member) => (
                        <motion.div
                          key={member._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-center justify-between p-3 rounded-lg
                                   bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100
                                   dark:border-indigo-800"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{member.name}</span>
                            <span className="px-2 py-1 text-xs rounded-full bg-indigo-100
                                         dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200">
                              {member.role}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveMember(member._id)}
                            className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20
                                     text-red-500 transition-colors duration-200"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-end space-x-3"
              >
                <button
                  onClick={() => navigate("/home")}
                  className="px-5 py-2 text-sm font-medium text-gray-800 bg-gray-100
                           rounded-lg hover:bg-gray-200 dark:text-gray-100 dark:bg-gray-800
                           dark:hover:bg-gray-700"
                >
                  <ArrowLeft className="w-5 h-5 inline-block" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600
                           rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  <Save className="w-5 h-5 inline-block" /> Save
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
