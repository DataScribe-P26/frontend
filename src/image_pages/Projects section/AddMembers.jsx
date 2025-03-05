import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../text_pages/Text/ThemeContext";
import FuzzySearch from "fuzzy-search";
import MainhomeNavbar from "../../Main home/MainhomeNavbar";
import { UserPlus } from "lucide-react";
import axios from "axios";

const AddMembers = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [organizationName, setOrganizationName] = useState("");
  var storedOrgName='';

  // Initialize fuzzy search
  const searcher = new FuzzySearch();
  useEffect(() => {
    storedOrgName = localStorage.getItem("organizationName");
    if (storedOrgName) {
      setOrganizationName(storedOrgName);
    }
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {

      const response = await axios.get(
        `http://127.0.0.1:8000/users/search?query=${query}`
      );
      setSearchResults(response.data.matches);
      console.log(selectedMembers);
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };
  const handleSelectMember = (email) => {
    if (!selectedMembers.some((member) => member.email === email)) {
      setSelectedMembers([
        ...selectedMembers,
        { email, role: "Member" }, // Default role
      ]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRoleChange = (email, role) => {
    setSelectedMembers((prev) =>
      prev.map((member) =>
        member.email === email ? { ...member, role } : member
      )
    );
  };

  const handleRemoveMember = (email) => {
    setSelectedMembers(selectedMembers.filter((member) => member.email !== email));
  };
  // IMPLEMENT HERE
  const handleSubmit = async() => {
    if (selectedMembers.length === 0) {
      console.error("No members selected");
      return;
    }
    console.log(organizationName,
      selectedMembers);
      let data={
        org_name: organizationName,
        members: selectedMembers,
      }
      console.log(data);


    try {
      const response = await axios.post("http://127.0.0.1:8000/organizations/add-members", data
      );

      if (response.status === 200) {
        console.log("Members added successfully:", response.data);
        navigate("/CreateOrgProject"); // Navigate after successful API call
      }
    } catch (error) {
      console.error("Error adding members:", error);
    }
    navigate("/CreateOrgProject");
  };
  const dropdownStyles = {
    list: {
      position: "absolute",
      zIndex: 10,
      backgroundColor: isDarkMode ? "#374151" : "#ffffff",
      border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
      borderRadius: "0.375rem",
      top: "80%",
      width: "90%",
      maxHeight: "150px",
      overflowY: "auto",
      margin: 0,
      padding: "0.5rem 0",
      boxShadow: isDarkMode
        ? "0 4px 6px rgba(0, 0, 0, 0.3)"
        : "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    listItem: {
      padding: "0.75rem",
      cursor: "pointer",
      color: isDarkMode ? "#ffffff" : "#000000",
      transition: "all 0.2s",
      ":hover": {
        backgroundColor: isDarkMode ? "#4b5563" : "#F3E5F5",
      },
    },
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
            <div className="p-16 space-y-8">
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
                  {searchResults.length > 0 && (
                    <ul style={dropdownStyles.list}>
                      {searchResults.map((result) => (
                        <li
                          key={result.email}className="p-3 cursor-pointer hover:bg-purple-500 hover:text-white transition"
                          onClick={() => handleSelectMember(result.email)}
                          style={dropdownStyles.listItem}
                        >
                          {result.email}
                        </li>
                      ))}
                    </ul>
                  )}

                </div>
                <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              columnGap: "4px", // Tight gap between emails horizontally
              rowGap: "4px",    // Minimal vertical spacing if wrapping occurs
            }}
          >
            {selectedMembers.map((member) => (
              <div
                key={member}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  backgroundColor: isDarkMode ? "#374151" : "#e3f2fd", // Light and Dark theme background
                  padding: "4px 8px",
                  borderRadius: "12px",
                  boxShadow: isDarkMode
                    ? "0px 1px 2px rgba(0, 0, 0, 0.3)"  // Dark mode shadow
                    : "0px 1px 2px rgba(0, 0, 0, 0.15)", // Light mode shadow
                }}
              >
                <span
                  style={{
                    color: isDarkMode ? "#ffffff" : "#1a237e", // Light and Dark theme text color
                    fontWeight: "500",
                    marginRight: "6px",
                  }}
                >
                  {member.email}
                </span>
                <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.email, e.target.value)}
                          className={`p-2 rounded border text-sm
                            ${isDarkMode
                              ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-400"
                              : "bg-white text-gray-900 border-gray-300 focus:ring-purple-500"}
                            focus:ring-2`}
                        >
                          <option value="Member">Member</option>
                          <option value="Admin">Admin</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                <button
                  onClick={() => handleRemoveMember(member)}
                  style={{
                    background: "none",
                    border: "none",
                    color: isDarkMode ? "#f44336" : "#d32f2f", // Dark and light theme for button color
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
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
                  onClick={() => handleSubmit()}
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
