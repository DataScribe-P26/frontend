import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../login/AuthContext";
import { useTheme } from "../../text_pages/Text/ThemeContext";
import MainhomeNavbar from "../../Main home/MainhomeNavbar";
import { UserPlus, Layout, Users, Settings, FolderPlus, Home } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [organizationName, setOrganizationName] = useState("");
  const [projects, setProjects] = useState([]);
  const [organizationMembers, setOrganizationMembers] = useState([]);
  var storedOrgName='';

  useEffect(() => {
    storedOrgName = localStorage.getItem("organizationName");
    if (storedOrgName) {
      setOrganizationName(storedOrgName);
    }
  }, []);

  useEffect(() => {
    if (user) {
      axios
      .get(`http://127.0.0.1:8000/ORG-all-projects`, {
        params: { org_name: storedOrgName }
    })
        .then((response) => setProjects(response.data || []))

      axios
        .get("http://127.0.0.1:8000/organization-members", {
          params: { org_name: storedOrgName }
        })
        .then((response) => setOrganizationMembers(response.data.members || []))
    }
  }, [user, organizationName]);
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
      const data = {
      org_name: organizationName,
      members: selectedMembers,
    };
      console.log(data);


    try {
      const response = await axios.post("http://127.0.0.1:8000/organizations/add-members", data
      );
  
      if (response.status === 200) {
        console.log("Members added successfully:", response.data);
      }
    } catch (error) {
      console.error("Error adding members:", error);
    }
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

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="p-6">
            <h2 className="text-3xl font-semibold mb-8">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-purple-600 dark:bg-purple-700 bg-opacity-80 rounded-lg text-white">
                <h3 className="text-xl font-semibold mb-2">Total Projects</h3>
                <p className="text-3xl font-bold">{projects.length}</p>
              </div>
              <div className="p-6 bg-blue-600 dark:bg-blue-700 bg-opacity-80 rounded-lg text-white">
                <h3 className="text-xl font-semibold mb-2">Team Members</h3>
                <p className="text-3xl font-bold">{organizationMembers.length}</p>
              </div>
            </div>
          </div>
        );

        case "projects":
          return (
            <div className={`p-6 min-h-screen `}>
              <h2 className="text-3xl font-semibold mb-8">Projects</h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project.name}
                    className={`p-6 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-200 cursor-pointer 
                      ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"}`}
                    onClick={() => navigate(`/user-project/${project.type}/${project.name}`)}
                  >
                    <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                    <p className="text-sm mb-1">{project.description}</p>
                    <span className="text-xs italic">{project.type}</span>
                  </div>
                ))}
              </div>
              <button
                className={`mt-8 px-8 py-3 rounded-lg shadow transition focus:ring 
                  ${isDarkMode 
                    ? "bg-purple-700 hover:bg-purple-800 focus:ring-purple-400 text-white" 
                    : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-300 text-white"}`}
                onClick={() => navigate("/CreateOrgProject")}
              >
                Create New Project
              </button>
            </div>
          );

          case "members":
            return (
              <div className={`p-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                <h2 className="text-3xl font-semibold mb-8">Team Members</h2>
          
                {/* Current Members */}
                <div className={`rounded-lg p-6 mb-8 ${isDarkMode ? "bg-gray-800" : "bg-white"} bg-opacity-90 shadow`}>
                  <h3 className="text-xl font-semibold mb-4">{storedOrgName} Current Members</h3>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {organizationMembers.map((member, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} shadow-sm`}
                      >
                        <p className="font-medium">{member.email}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    ))}
                  </div>
                </div>

          
                {/* Add New Members */}
                <div className={`rounded-lg p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"} bg-opacity-90 shadow`}>
                  <h3 className="text-xl font-semibold mb-4">Add New Members</h3>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={`w-full p-3 pl-10 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-purple-400" : "border-gray-300 text-gray-900 focus:ring-purple-500"} focus:ring-2`}
                    placeholder="Search members..."
                  />
          
                  {searchResults.length > 0 && (
                    <ul style={dropdownStyles.list} className={`border rounded-lg mt-1 max-h-48 overflow-y-auto ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`}>
                      {searchResults.map((result) => (
                        <li key={result.email} className="p-3 cursor-pointer hover:bg-purple-500 hover:text-white transition" onClick={() => handleSelectMember(result.email)}>
                          {result.email}
                        </li>
                      ))}
                    </ul>
                  )}
          
                  {/* Selected Members with Roles */}
                  <div className="flex flex-col gap-4 mt-4">
                    {selectedMembers.map((member) => (
                      <div
                        key={member.email}
                        className="flex items-center gap-4 p-2 rounded-lg bg-purple-100 dark:bg-purple-800"
                      >
                        <span>{member.email}</span>
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
                          onClick={() => handleRemoveMember(member.email)}
                          className="text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
          
                  <button
                    className={`mt-4 px-6 py-2 rounded-lg transition ${isDarkMode ? "bg-purple-700 hover:bg-purple-800 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
                    onClick={handleSubmit}
                  >
                    Add Members
                  </button>
                </div>
              </div>
            );
          
    

          
        

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      {/* Navbar */}
      <MainhomeNavbar />

      {/* Layout with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <div className={`w-64 fixed h-screen ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} bg-opacity-90 shadow-lg`}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-8">Organization</h2>
            <nav className="space-y-4">
              <button
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                  activeSection === "dashboard"
                    ? "bg-purple-600 text-white"
                    : "hover:bg-purple-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveSection("dashboard")}
              >
                <Home size={20} />
                <span>Dashboard</span>
              </button>

              <button
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                  activeSection === "projects"
                    ? "bg-purple-600 text-white"
                    : "hover:bg-purple-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveSection("projects")}
              >
                <Layout size={20} />
                <span>Projects</span>
              </button>

              <button
                className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                  activeSection === "members"
                    ? "bg-purple-600 text-white"
                    : "hover:bg-purple-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveSection("members")}
              >
                <Users size={20} />
                <span>Members</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1">
          <main className="p-6">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
