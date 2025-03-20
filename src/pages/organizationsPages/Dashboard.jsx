import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { del, get, post, put } from "../../state/api-client/api";
import toast from "react-hot-toast";
import { useAuth } from "../../utils/authUtils";
import { useTheme } from "../../utils/themeUtils";
// import MainhomeNavbar from "../../Main home/MainhomeNavbar";
import Navbar from "../../components/textProject/modals/navbar";
import { Layout, Users, Settings, FolderPlus, Home, Menu } from "lucide-react";
import { MdWorkOutline } from "react-icons/md"; // Project icon
import { FiSettings, FiTrash2 } from "react-icons/fi"; // Settings icon
import CreateOrgProjectModal from "../../components/organizations/createOrgProject";
import { HiAnnotation } from "react-icons/hi";
import ProjectSettingsModal from "../../components/organizations/projectSettingsModal";
import useStore from "../../state/store/imageStore/combinedImageSlice";
import { Trash2 } from "lucide-react";
import { useRole } from "../../utils/authUtils";
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const {userRole,setRole,clearRole}=useRole();
  const {
    setprojectname,
    setCreatedOn,
    reset,
    set_allAnnotations,
    setprojectType,
  } = useStore();
  const userType = localStorage.getItem("userType");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [organizationName, setOrganizationName] = useState("");
  const [projects, setProjects] = useState([]);
  const [organizationMembers, setOrganizationMembers] = useState([]);
  var storedOrgName = "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectSettingsModalOpen, setIsProjectSettingsModalOpen] =
    useState(false);

  // Add new state for organization details
  const [orgDetails, setOrgDetails] = useState({
    name: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalOrgDetails, setOriginalOrgDetails] = useState({});

  const [editingMember, setEditingMember] = useState(null);
  const [tempRole, setTempRole] = useState("");
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Add useEffect to fetch organization details
  useEffect(() => {
    if (user) {
      storedOrgName = localStorage.getItem("organizationName");
      console.log(storedOrgName);
      get(`/organization-details`, { org_name: storedOrgName })
        .then((response) => {
          setOrgDetails(response.data);
          setOriginalOrgDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching organization details:", error);
        });
    }
  }, [user]);

  // Add handler for updating organization details
  const handleUpdateOrg = async () => {
    try {
      const data = {
        org_name: organizationName,
        new_name: orgDetails.name,
        details: orgDetails.details || "",
      };

      const response = await put(`/organization-update`, data);

      if (response.status === 200) {
        toast.success("Organization details updated successfully");
        setIsEditing(false);
        setOriginalOrgDetails(orgDetails);
        localStorage.setItem("organizationName", orgDetails.name);
      }
    } catch (error) {
      toast.error("Failed to update organization details");
      console.error("Error updating organization:", error);
    }
  };

  const handleDeleteProject = async (name) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await del(
          `/delete-org-project/${user.email}/${name}/${organizationName}`
        );
        alert("Project deleted successfully!");
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.name !== name)
        );
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete the project. Please try again.");
      }
    }
  };

  useEffect(() => {
    storedOrgName = localStorage.getItem("organizationName");
    if (storedOrgName) {
      setOrganizationName(storedOrgName);
    }
  }, []);

  useEffect(() => {
    if (user) {
      get(`/ORG-user-projects`, {
        org_name: storedOrgName,
        user_email: user.email,
      }).then((response) => setProjects(response.data || []));

      get("/organization-members", {
        org_name: storedOrgName,
      }).then((response) =>
        setOrganizationMembers(response.data.members || [])
      );
    }
  }, [user, organizationName]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await get(`/users/search/${organizationName}?query=${query}`);
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
  const handleEditClick = (member) => {
    setEditingMember(member.email);
    setTempRole(member.role);
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setTempRole("");
  };

  const handleRoleChange = (email, role) => {
    setOrganizationMembers((prev) =>
      prev.map((member) =>
        member.email === email ? { ...member, role } : member
      )
    );
    setSelectedMembers((prev) =>
      prev.map((member) =>
        member.email === email ? { ...member, role } : member
      )
    );
  };

  const handleRemoveMember = (email) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.filter((member) => member.email !== email)
    );
  };
  const handleRoleUpdate = async (userEmail, tempRole) => {
    try {
      console.log(user.email);
      console.log(organizationName);
      const response = await put(
        `/organizations/change-role?admin_email=${user.email}`,
        {
          org_name: organizationName,
          user_email: userEmail,
          new_role: tempRole,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error changing user role", error);
      throw error;
    }
  };
  const handleDeleteMember = async (userEmail) => {
    try {
      const response = await del(
        `/organizations/remove-member/${organizationName}/${userEmail}?admin_email=${user.email}`
      );
      return response.data;
    } catch (error) {
      console.error("Error removing member from organization", error);
      throw error;
    }
  };
  const handleSubmit = async () => {
    if (selectedMembers.length === 0) {
      console.error("No members selected");
      return;
    }
    console.log(organizationName, selectedMembers);
    const data = {
      org_name: organizationName,
      members: selectedMembers,
    };
    console.log(data);

    try {
      const response = await post("/organizations/add-members", data);

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
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-600 text-white text-xl font-bold">
                {organizationName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold">
                {organizationName} Organization
              </h2>
            </div>

            <h2 className="text-2xl font-semibold mb-8">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                className="p-6 bg-purple-600 dark:bg-purple-700 bg-opacity-80 rounded-lg text-white"
                onClick={() => setActiveSection("projects")}
              >
                <h3 className="text-xl font-semibold mb-2">Total Projects</h3>
                <p className="text-3xl font-bold">{projects.length}</p>
              </div>
              <div
                className="p-6 bg-blue-600 dark:bg-blue-700 bg-opacity-80 rounded-lg text-white"
                onClick={() => setActiveSection("members")}
              >
                <h3 className="text-xl font-semibold mb-2">Team Members</h3>
                <p className="text-3xl font-bold">
                  {organizationMembers.length}
                </p>
              </div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Manage and access all your organization's projects
                </p>
              </div>
              {(userType !== "org" || (userType === "org" && userRole !== "viewer")) && (
              <button
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700
                          text-white font-medium rounded-lg shadow-sm transition-colors duration-200
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={() => setIsModalOpen(true)}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Project
              </button>
            )}
              <CreateOrgProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md
                              hover:shadow-xl transition-all duration-300 overflow-hidden"
                  onClick={() => {
                    setprojectname(project.name);
                    setCreatedOn(project.created_on);
                    reset();
                    set_allAnnotations([]);
                    setprojectType(project.type);
                    localStorage.setItem("projectType", project.type);
                    if (
                      project.type === "image" ||
                      project.type === "instance-segmentation"
                    ) {
                      navigate(`/user-project/image/${project.name}`);
                    } else {
                      navigate(`/user-project/ner_tagging/${project.name}`);
                    }
                  }}
                >
                  {/* Card Content Container */}
                  <div className="p-6 cursor-pointer">
                    {/* Project Icon and Settings */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 flex items-center bg-purple-100 dark:bg-purple-900/30 rounded-lg space-x-2">
                        {/* Project Icon */}
                        <MdWorkOutline className="text-xl text-purple-600 dark:text-purple-400" />
                        {/* Project Name */}
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {project.name}
                        </h3>
                      </div>
                      {/* Action Icons */}
                      {(userType !== "org" || (userType === "org" && userRole !== "viewer")) && (
                        <div className="flex space-x-2">
                          <button
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full
                                        transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                              setIsProjectSettingsModalOpen(true);
                            }}
                          >
                            <FiSettings
                              className="text-lg text-gray-500 hover:text-gray-700
                                          dark:text-gray-400 dark:hover:text-gray-300"
                            />
                          </button>
                          <button
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full
                                        transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.name);
                            }}
                          >
                            <FiTrash2
                              className="text-lg text-gray-500 hover:text-red-600
                                        dark:text-gray-400 dark:hover:text-red-400"
                            />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Project Type Badge */}
                    <div className="mt-4">
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm
                                       font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50
                                       dark:text-purple-300"
                      >
                        {project.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal */}
            <ProjectSettingsModal
              isOpen={isProjectSettingsModalOpen}
              onClose={() => setIsProjectSettingsModalOpen(false)}
              project={selectedProject}
              organizationName={organizationName}
              onUpdateProject={(old_name, updatedProject) => {
                console.log(old_name, updatedProject);
                setProjects((prevProjects) =>
                  prevProjects.map((proj) =>
                    proj.name === old_name ? updatedProject : proj
                  )
                );
                toast.success("Project updated successfully");
              }}
              onDeleteProject={(deletedProjectId) => {
                setProjects((prevProjects) =>
                  prevProjects.filter((proj) => proj.name !== deletedProjectId)
                );
                toast.success("Project deleted successfully");
              }}
            />
          </div>
        );

      case "members":
        return (
          <div className={`p-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Team Members</h2>
              {(userType !== "org" || (userType === "org" && userRole !== "viewer")) && (
              <button
                onClick={() => setIsModalOpen(true)}
                className={`px-4 py-2 rounded-lg transition ${
                  isDarkMode
                    ? "bg-purple-700 hover:bg-purple-800 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                + Add Members
              </button>
              )}
            </div>

            {/* Members List */}
            <div
              className={`rounded-lg p-6 mb-8 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } bg-opacity-90 shadow `}
            >
              <h3 className="text-xl font-semibold mb-4">Current Members</h3>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                {organizationMembers.map((member) => (
                  <div
                    key={member.email}
                    className={`p-4 rounded-lg flex justify-between items-center ${
                      isDarkMode
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-900"
                    } shadow-sm`}
                  >
                    <div>
                      <p className="font-medium">{member.email}</p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Role Display / Edit Mode */}
                        {editingMember === member.email ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={tempRole}
                              onChange={(e) => setTempRole(e.target.value)}
                              className={`p-2 rounded border text-sm ${
                                isDarkMode
                                  ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-400"
                                  : "bg-purple-200 text-gray-900 border-gray-300 focus:ring-purple-500"
                              } focus:ring-2`}
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                              <option value="viewer">Viewer</option>
                            </select>
                            <button
                              onClick={() => {
                                handleRoleUpdate(member.email, tempRole);

                                setEditingMember(null);
                              }}
                              className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                              Update
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-300 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm">{member.role}</p>
                        )}
                      </div>
                    </div>

                    {/* Edit & Delete Buttons Aligned */}
                   {/* Edit & Delete Buttons Aligned */}
                   {(userType !== "org" || (userType === "org" && userRole !== "viewer")) && (
                    <div className="flex items-center gap-3">
                      {editingMember !== member.email && (
                        <button
                          onClick={() => handleEditClick(member)}
                          className="px-3 py-1 text-sm font-medium text-gray-700 bg-purple-400 rounded hover:bg-purple-500"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMember(member.email)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove Member"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add Members Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div
                  className={`p-6 w-1/2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                  } shadow-lg`}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Add New Members
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className={`w-full p-3 pl-10 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-purple-400"
                          : "border-gray-300 text-gray-900 focus:ring-purple-500"
                      } focus:ring-2`}
                      placeholder="Search members..."
                    />

                    {searchResults.length > 0 && (
                      <ul
                        className={`absolute z-10 w-full border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg ${
                          isDarkMode
                            ? "border-gray-600 bg-gray-700 text-white"
                            : "border-gray-300 bg-white text-gray-900"
                        }`}
                      >
                        {searchResults.map((result) => (
                          <li
                            key={result.email}
                            className="p-3 cursor-pointer hover:bg-purple-500 hover:text-white transition"
                            onClick={() => handleSelectMember(result.email)}
                          >
                            {result.email}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Selected Members with Roles */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedMembers.map((member) => (
                      <div
                        key={member}
                        className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                          isDarkMode
                            ? "bg-purple-900 text-white"
                            : "bg-purple-100 text-gray-900"
                        }`}
                      >
                        <span>{member.email}</span>
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(member.email, e.target.value)
                          }
                          className={`p-2 rounded border text-sm
                            ${
                              isDarkMode
                                ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-400"
                                : "bg-purple-200 text-gray-900 border-gray-300 focus:ring-purple-500"
                            }
                            focus:ring-2`}
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        {selectedMembers.map((member) => (
                          <div
                            key={member.email}
                            className="flex items-center space-x-2 bg-gray-200 px-3 py-1 rounded-lg"
                          >
                            <button
                              onClick={() => handleRemoveMember(member.email)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      className={`px-4 py-2 rounded-lg transition ${
                        isDarkMode
                          ? "bg-gray-600 hover:bg-gray-700"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg transition ${
                        isDarkMode
                          ? "bg-purple-700 hover:bg-purple-800 text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}
                      onClick={() => {
                        handleSubmit();
                        setIsModalOpen(false);
                        setSelectedMembers([]);
                      }}
                    >
                      Add Members
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "Org settings":
        return (
          // <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-900 ">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:bg-gray-900 dark:text-gray-100">
                Organization Settings
              </h2>
              {(userType !== "org" || (userType === "org" && userRole !== "viewer")) && (
                !isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Edit Details
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setOrgDetails(originalOrgDetails);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateOrg}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )
              )}

            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={orgDetails.name}
                    onChange={(e) =>
                      setOrgDetails({ ...orgDetails, name: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                ) : (
                  <p className="text-lg">{orgDetails.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    value={orgDetails.details}
                    onChange={(e) =>
                      setOrgDetails({ ...orgDetails, details: e.target.value })
                    }
                    rows="4"
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {orgDetails.details}
                  </p>
                )}
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">
                  Organization Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Members
                    </p>
                    <p className="text-2xl font-bold">
                      {organizationMembers.length}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Projects
                    </p>
                    <p className="text-2xl font-bold">{projects.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          // </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`h-screen flex flex-col ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out border-r border-gray-100 shadow-lg ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          } ${isSidebarCollapsed ? "w-20" : "w-64"}`}
        >
          <div
            className={`p-4 ${
              isSidebarCollapsed ? "items-center" : "p-6"
            } mb-2`}
          >
            <div
              className={`flex items-center mb-6 ${
                isSidebarCollapsed ? "flex-col" : "justify-between"
              }`}
            >
              <Link to="/home" className="flex items-center gap-3">
                <div className="flex items-center">
                  <HiAnnotation
                    className={`text-4xl text-purple-400 transform transition-transform duration-300 hover:scale-110 ${
                      isSidebarCollapsed ? "mb-2" : "mr-2"
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <h1 className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                      Datascribe.ai
                    </h1>
                  )}
                </div>
              </Link>

              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                aria-label={
                  isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
              >
                <Menu size={20} />
              </button>
            </div>

            <nav className="space-y-4">
              {[
                { name: "Dashboard", icon: Home, section: "dashboard" },
                { name: "Projects", icon: Layout, section: "projects" },
                { name: "Members", icon: Users, section: "members" },
                {
                  name: "Org Settings",
                  icon: Settings,
                  section: "Org settings",
                },
              ].map(({ name, icon: Icon, section }) => (
                <button
                  key={section}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                    activeSection === section
                      ? "bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  } ${isSidebarCollapsed ? "justify-center" : "space-x-3"}`}
                  onClick={() => setActiveSection(section)}
                  title={name}
                >
                  <Icon size={20} />
                  {!isSidebarCollapsed && <span>{name}</span>}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <Navbar />
          <main
            className={`p-6 transition-all duration-300 ${
              isSidebarCollapsed ? "ml-0" : "ml-0"
            }`}
          >
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;