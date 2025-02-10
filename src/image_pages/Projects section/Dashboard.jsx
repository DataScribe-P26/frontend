import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../login/AuthContext";
import { useTheme } from "../../text_pages/Text/ThemeContext";
import MainhomeNavbar from "../../Main home/MainhomeNavbar";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [organizationName, setOrganizationName] = useState("");
  const [projects, setProjects] = useState([]);
  const [organizationMembers, setOrganizationMembers] = useState([]);
  var storedOrgName='';
  const [newMemberEmail, setNewMemberEmail] = useState("");
  
  useEffect(() => {
    storedOrgName = localStorage.getItem("organizationName");
    console.log('hellouu',storedOrgName);
    if (storedOrgName) {
      setOrganizationName(storedOrgName);
      console.log('hellouu123',organizationName);
    }
    console.log('hellouu123',organizationName);
  }, [organizationName]);
  
  useEffect(() => {
console.log(organizationName);
  },[organizationName])

  useEffect(() => {
    if (user) {
      axios
        .get(`http://127.0.0.1:8000/user-projects/${user?.email} `)
        .then((response) => setProjects(response.data || []))
        .catch(() => toast.error("Failed to load projects"));
      console.log(organizationName);
      axios
        .get(`http://127.0.0.1:8000/organization-members`, {
          params: { org_name: storedOrgName }
        })
        .then((response) => setOrganizationMembers(response.data.members || []))
        .catch(() => toast.error("Failed to load organization members"));
        
    }
  }, [user]);

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
    if (!selectedMembers.includes(email)) {
      setSelectedMembers([...selectedMembers, email]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveMember = (email) => {
    setSelectedMembers(selectedMembers.filter((member) => member !== email));
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
        user_emails: selectedMembers,
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
      className={`min-h-screen bg-cover bg-center p-8 ${isDarkMode ? "text-white bg-purple-900" : "text-gray-200 bg-gray-100"} `}
      style={{ backgroundImage: `url('/images/image5.jpg')` }}
    >
      <MainhomeNavbar />
      <div className="p-8 bg-opacity-70 min-h-screen rounded-lg">
        <h1 className="text-4xl font-bold mb-12 text-center">Welcome to Your Dashboard</h1>

        {/* Projects Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">My Projects</h2>
          {projects.length ? (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:scale-105 transform transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/user-project/${project.type}/${project.name}`)}
                >
                  <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                  <p className="text-sm mb-1">{project.description}</p>
                  <span className="text-xs italic">{project.type}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No projects available. Create one to get started.</p>
          )}
          <button
            className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:ring focus:ring-blue-300"
            onClick={() => navigate("/CreateOrgProject")}
          >
            Create Project
          </button>
        </div>

        {/* Organization Members Section */}
        <div className="mb-12">
  <h2 className="text-3xl font-semibold mb-8">Organization Members</h2>
  <div
    className={`max-h-40 overflow-y-auto p-4 rounded-md shadow-md ${
      isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
    }`}
  >
    {organizationMembers.length ? (
      organizationMembers.map((member) => (
        <div
          key={member}
          className={`p-2 rounded-md mb-2 ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {member}
        </div>
      ))
    ) : (
      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        No members found.
      </p>
    )}
  </div>



          {/* Add Member Section */}
          <div className="mt-8">
            <h3 className="text-xl font-medium mb-4">Add New Member</h3>
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
                          key={result.email}
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
                      {member}
                    </span>
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
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;