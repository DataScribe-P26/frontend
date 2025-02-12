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

  const handleSubmit = async () => {
    if (selectedMembers.length === 0) {
      toast.error("No members selected");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/organizations/add-members", {
        org_name: organizationName,
        user_emails: selectedMembers,
      });

      if (response.status === 200) {
        toast.success("Members added successfully");
        setSelectedMembers([]);
        const membersResponse = await axios.get("http://127.0.0.1:8000/organization-members", {
          params: { org_name: organizationName }
        });
        setOrganizationMembers(membersResponse.data.members || []);
      }
    } catch (error) {
      toast.error("Failed to add members");
    }
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
            <div className="p-6 min-h-screen">
              <h2 className="text-3xl font-semibold mb-8">Projects</h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project.name}
                    className="p-6 bg-gray-200 dark:bg-gray-800 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/user-project/${project.type}/${project.name}`)}
                  >
                    <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                    <p className="text-sm mb-1">{project.description}</p>
                    <span className="text-xs italic">{project.type}</span>
                  </div>
                ))}
              </div>
              <button
                className="mt-8 px-8 py-3 bg-purple-600 dark:bg-purple-700 text-white rounded-lg shadow hover:bg-purple-700 dark:hover:bg-purple-800 focus:ring focus:ring-purple-300"
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
                  <h3 className="text-xl font-semibold mb-4">Current Members</h3>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {organizationMembers.map((member) => (
                      <div key={member} className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}>
                        {member}
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
                    <ul className={`border rounded-lg mt-1 max-h-48 overflow-y-auto ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"}`}>
                      {searchResults.map((result) => (
                        <li key={result.email} className="p-3 cursor-pointer hover:bg-purple-500 hover:text-white transition" onClick={() => handleSelectMember(result.email)}>
                          {result.email}
                        </li>
                      ))}
                    </ul>
                  )}
          
                  {/* Selected Members */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedMembers.map((member) => (
                      <div key={member} className={`px-3 py-1 rounded-full flex items-center gap-2 ${isDarkMode ? "bg-purple-900 text-white" : "bg-purple-100 text-gray-900"}`}>
                        <span>{member}</span>
                        <button onClick={() => handleRemoveMember(member)} className="text-red-600 hover:text-red-800">✕</button>
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
