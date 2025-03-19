import React, { useState, useEffect } from "react";
import {
  Settings,
  ExternalLink,
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  Search,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../utils/authUtils";
import { useTheme } from "../../utils/themeUtils";
import useStore from "../../state/store/imageStore/combinedImageSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../state/api-client/api";

const OrganizationCard = ({ name, role, createdOn }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-700 dark:border-gray-100 dark:text-gray-100"
      onClick={() => {
        localStorage.setItem("organizationName", name);
        navigate("/Dashboard");
      }}
    >
      <div className="flex items-center justify-between dark:bg-gray-700 dark:text-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-lg font-semibold text-purple-600 ">
              {name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold p-1 text-gray-900 dark:text-gray-100">
              {name}
            </h3>
            <span className="px-2 py-1 p-1 text-sm rounded-full bg-purple-300 text-purple-800">
              {role}
            </span>
            <p className="text-sm mt-2 text-gray-600  dark:text-gray-100">
              Created on:{" "}
              {createdOn ? new Date(createdOn).toLocaleDateString() : "Unknown"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-purple-600 ">
            <Settings size={18} />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-purple-600 ">
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const OrganizationIllustration = () => (
  <svg
    viewBox="0 0 240 240"
    className="w-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Gradient definitions */}
    <defs>
      <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C084FC" />
        <stop offset="100%" stopColor="#7E22CE" />
      </linearGradient>
      <linearGradient id="lightPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F3E8FF" />
        <stop offset="100%" stopColor="#E9D5FF" />
      </linearGradient>
    </defs>

    {/* Background elements */}
    <circle
      cx="120"
      cy="120"
      r="90"
      fill="url(#lightPurpleGrad)"
      className="animate-pulse"
    />
    <circle
      cx="120"
      cy="120"
      r="75"
      fill="none"
      stroke="#E9D5FF"
      strokeWidth="2"
      strokeDasharray="4 4"
    />

    {/* Central organization symbol */}
    <g transform="translate(95, 85)">
      <rect
        x="0"
        y="20"
        width="50"
        height="60"
        fill="url(#purpleGrad)"
        rx="4"
      />
      <path d="M-5 20 L25 0 L55 20" fill="#9333EA" />
      <rect x="10" y="30" width="12" height="12" fill="#F3E8FF" rx="2" />
      <rect x="28" y="30" width="12" height="12" fill="#F3E8FF" rx="2" />
      <rect x="10" y="48" width="12" height="12" fill="#F3E8FF" rx="2" />
      <rect x="28" y="48" width="12" height="12" fill="#F3E8FF" rx="2" />
      <rect x="15" y="68" width="20" height="4" fill="#F3E8FF" rx="1" />
    </g>

    {/* Floating elements */}
    <g className="animate-bounce" style={{ animationDuration: "3s" }}>
      <rect
        x="40"
        y="70"
        width="24"
        height="24"
        fill="#9333EA"
        rx="4"
        transform="rotate(-15, 52, 82)"
      />
      <circle cx="52" cy="82" r="8" fill="#F3E8FF" />
      <path d="M48 82 L56 82 M52 78 L52 86" stroke="#9333EA" strokeWidth="2" />
    </g>

    <g className="animate-bounce" style={{ animationDuration: "2.5s" }}>
      <rect
        x="176"
        y="70"
        width="24"
        height="24"
        fill="#9333EA"
        rx="4"
        transform="rotate(15, 188, 82)"
      />
      <circle cx="188" cy="82" r="8" fill="#F3E8FF" />
      <path d="M184 82 L192 82" stroke="#9333EA" strokeWidth="2" />
    </g>

    {/* Team members */}
    {/* Left group */}
    <g transform="translate(40, 140)">
      <circle
        cx="0"
        cy="0"
        r="15"
        fill="#9333EA"
        className="animate-ping opacity-20"
      />
      <circle cx="0" cy="-8" r="8" fill="#7E22CE" />
      <path d="M-8 2 C-8 2 0 12 8 2 L8 16 L-8 16 L-8 2" fill="#7E22CE" />
      <line
        x1="15"
        y1="0"
        x2="40"
        y2="0"
        stroke="#9333EA"
        strokeWidth="2"
        strokeDasharray="3 3"
      />
    </g>

    {/* Right group */}
    <g transform="translate(200, 140)">
      <circle
        cx="0"
        cy="0"
        r="15"
        fill="#9333EA"
        className="animate-ping opacity-20"
      />
      <circle cx="0" cy="-8" r="8" fill="#7E22CE" />
      <path d="M-8 2 C-8 2 0 12 8 2 L8 16 L-8 16 L-8 2" fill="#7E22CE" />
      <line
        x1="-15"
        y1="0"
        x2="-40"
        y2="0"
        stroke="#9333EA"
        strokeWidth="2"
        strokeDasharray="3 3"
      />
    </g>

    {/* Top group */}
    <g transform="translate(120, 40)">
      <circle
        cx="0"
        cy="0"
        r="15"
        fill="#9333EA"
        className="animate-ping opacity-20"
      />
      <circle cx="0" cy="-8" r="8" fill="#7E22CE" />
      <path d="M-8 2 C-8 2 0 12 8 2 L8 16 L-8 16 L-8 2" fill="#7E22CE" />
      <line
        x1="0"
        y1="20"
        x2="0"
        y2="35"
        stroke="#9333EA"
        strokeWidth="2"
        strokeDasharray="3 3"
      />
    </g>

    {/* Connection circles */}
    <circle cx="85" cy="140" r="4" fill="#9333EA" className="animate-pulse" />
    <circle cx="155" cy="140" r="4" fill="#9333EA" className="animate-pulse" />
    <circle cx="120" cy="80" r="4" fill="#9333EA" className="animate-pulse" />

    {/* Decorative floating elements */}
    <g className="animate-bounce" style={{ animationDuration: "4s" }}>
      <circle cx="50" cy="60" r="3" fill="#9333EA" />
      <circle cx="190" cy="60" r="3" fill="#9333EA" />
      <circle cx="120" cy="190" r="3" fill="#9333EA" />
    </g>
  </svg>
);

const CreateOrganizationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [orgData, setOrgData] = useState({
    name: "",
    description: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [mockUser, setMock] = useState([]);

  // Extended mock data for demonstration
  const slideUpAnimation = "animate-[slideUp_0.3s_ease-out]";
  const fadeInAnimation = "animate-[fadeIn_0.3s_ease-out]";

  // Add keyframes to the component
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const mockUsers = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com" },
    { id: 2, name: "Michael Chen", email: "michael.c@example.com" },
    { id: 3, name: "Emma Davis", email: "emma.d@example.com" },
    { id: 4, name: "James Wilson", email: "james.w@example.com" },
    { id: 5, name: "Sofia Rodriguez", email: "sofia.r@example.com" },
    { id: 6, name: "Alexander Kim", email: "alex.k@example.com" },
    { id: 7, name: "Isabella Martinez", email: "isabella.m@example.com" },
    { id: 8, name: "William Taylor", email: "william.t@example.com" },
    { id: 9, name: "Olivia Brown", email: "olivia.b@example.com" },
    { id: 10, name: "Daniel Lee", email: "daniel.l@example.com" },
    { id: 11, name: "Ava Thompson", email: "ava.t@example.com" },
    { id: 12, name: "Lucas Garcia", email: "lucas.g@example.com" },
    { id: 13, name: "Mia Patel", email: "mia.p@example.com" },
    { id: 14, name: "Ethan Anderson", email: "ethan.a@example.com" },
    { id: 15, name: "Sophie Wright", email: "sophie.w@example.com" },
  ];

  const filteredUsers = mockUser.filter(
    (user) =>
      !selectedMembers.find((member) => member.id === user.id) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInputChange = (e) => {
    setOrgData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isFirstStepValid =
    orgData.name.trim() !== "" && orgData.description.trim() !== "";

  const handleAddMember = (user) => {
    setSelectedMembers((prev) => [...prev, user]);
    setSearchQuery("");
  };
  const handleRoleChange = (email, role) => {
    setSelectedMembers((prev) =>
      prev.map((member) =>
        member.email === email ? { ...member, role } : member
      )
    );
  };

  const handleRemoveMember = (userId) => {
    setSelectedMembers((prev) => prev.filter((member) => member.id !== userId));
  };

  const handleClose = () => {
    setStep(1);
    setOrgData({ name: "", description: "" });
    setSelectedMembers([]);
    setSearchQuery("");
    onClose();
  };
  const { user } = useAuth();

  async function handleSubmit() {
    const organizationData = {
      name: orgData.name,
      details: orgData.description,
      admin_id: user.email,
    };
    try {
      const response = await post(
        "/organizations/create/",
        organizationData,
        {}
      );
      const data = response
      console.log("Organization Created:", data);
      toast.success("Organization created successfully!");
    } catch (error) {
      toast.error("Failed to create organization");
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await get(`/users/search?query=${query}`);
      setSearchResults(response.data.matches);
      const formattedUsers = response.data.matches.map((user, index) => {
        // Extract name from email (part before @)
        const name = user.email
          .split("@")[0]
          // Replace dots and underscores with spaces
          .replace(/[._]/g, " ")
          // Capitalize first letter of each word
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return {
          id: index + 1, // Generate sequential IDs
          name: name,
          email: user.email,
          role: "member",
        };
      });
      setMock(formattedUsers);
      console.log(formattedUsers);
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };

  const handleSubmitmember = async () => {
    if (selectedMembers.length === 0) {
      console.error("No members selected");
      return;
    }
    console.log(orgData.name, selectedMembers);
    let data = {
      org_name: orgData.name,
      members: selectedMembers,
    };
    console.log(data);

    try {
      const response = await post("/organizations/add-members", data);
      console.log(response.data);
      if (response.status === 200) {
        console.log("Members added successfully:", response.data);
      }
      handleClose();
    } catch (error) {
      console.error("Error adding members:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50  dark:text-gray-100">
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-6 ${fadeInAnimation}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b dark:bg-gray-800 dark:text-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-gray-100">
            {step === 1 ? "Create Organization" : "Add Team Members"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors dark:bg-gray-800 dark:text-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          className="p-5 dark:bg-gray-800 dark:text-gray-100"
          style={{ minHeight: "400px" }}
        >
          {step === 1 ? (
            <div className={`flex gap-8 ${slideUpAnimation}`}>
              {/* Left side - Illustration */}
              <div className="w-1/2 flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg dark:bg-gray-800 dark:text-gray-100">
                <OrganizationIllustration />
                <div className="text-center mt-6 dark:bg-gray-800 dark:text-gray-100">
                  <h3 className="text-lg font-semibold text-purple-800 dark:bg-gray-800 dark:text-gray-100">
                    Build Your Organization
                  </h3>
                  <p className="text-sm text-purple-600 mt-2 dark:bg-gray-800 dark:text-gray-100">
                    Create a space for your team to collaborate and annotate
                    together
                  </p>
                </div>
              </div>

              {/* Right side - Form */}
              <div className="w-1/2 space-y-5 dark:bg-gray-800 dark:text-gray-100">
                <div className="space-y-5">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:bg-gray-800 dark:text-gray-100">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={orgData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300 group-hover:border-purple-400 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:bg-gray-800 dark:text-gray-100">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={orgData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300 group-hover:border-purple-400 resize-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="What's your organization about?"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="relative">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400 dark:bg-gray-800 dark:text-gray-100"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-800 dark:text-gray-100"
                  placeholder="Search users..."
                />
              </div>

              <div className="flex gap-5" style={{ height: "300px" }}>
                {/* Search Results */}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 dark:bg-gray-800 dark:text-gray-100">
                    Available Users
                  </h3>
                  <div
                    className="border rounded-lg overflow-y-auto"
                    style={{ maxHeight: "260px" }}
                  >
                    {searchQuery &&
                      filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleAddMember(user)}
                          className="w-full text-left px-4 py-2 hover:bg-purple-50 border-b last:border-b-0 transition-colors dark:bg-gray-800 dark:text-gray-100"
                        >
                          <p className="font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-100">
                            {user.email}
                          </p>
                        </button>
                      ))}
                    {searchQuery && filteredUsers.length === 0 && (
                      <p className="px-4 py-2 text-gray-500 dark:bg-gray-800 dark:text-gray-100">
                        No users found
                      </p>
                    )}
                    {!searchQuery && (
                      <p className="px-4 py-2 text-gray-500 dark:bg-gray-800 dark:text-gray-100">
                        Type to search users
                      </p>
                    )}
                  </div>
                </div>

                {/* Selected Members */}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 dark:bg-gray-800 dark:text-gray-100">
                    Selected Members
                  </h3>
                  <div
                    className="border rounded-lg overflow-y-auto dark:bg-gray-800 dark:text-gray-100"
                    style={{ maxHeight: "260px" }}
                  >
                    {selectedMembers.length > 0 ? (
                      <div className="space-y-2 p-2">
                        {selectedMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between bg-purple-50 p-2 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                                {member.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-100">
                                {member.email}
                              </p>
                            </div>

                            {/* Role Selector */}
                            <select
                              value={member.role || "Member"} // Ensure a default role
                              onChange={(e) => handleRoleChange(member.email, e.target.value)}
                              className="p-1 border rounded-md text-sm dark:bg-gray-700 dark:text-white"
                            >
                              <option value="Member">Member</option>
                              <option value="Admin">Admin</option>
                              <option value="Viewer">Viewer</option>
                            </select>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-gray-400 hover:text-red-500 p-1 dark:bg-red-800 dark:text-gray-100 rounded-lg"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="px-4 py-2 text-gray-500 dark:bg-gray-800 dark:text-red-500">
                        No members selected
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Same functionality but adjusted padding */}
        <div className="flex justify-between p-5 border-t bg-gray-50 rounded-b-lg dark:bg-gray-800 dark:text-gray-100">
          {step === 1 ? (
            <>
              <button
                onClick={handleClose}
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors dark:bg-red-800 dark:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleSubmit();
                  setStep(2);
                }}
                disabled={!isFirstStepValid}
                className={`flex items-center px-5 py-2 rounded-lg text-white dark:bg-gray-800 dark:text-gray-100 ${
                  isFirstStepValid
                    ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 "
                    : "bg-gray-300 cursor-not-allowed"
                } transition-colors`}
              >
                Next
                <ArrowRight size={18} className="ml-2" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors dark:bg-red-800 dark:text-gray-100"
              >
                <ArrowLeft size={18} className="mr-2" />
                Previous
              </button>
              <div className="space-x-3">
                {selectedMembers.length === 0 && (
                  <button
                    onClick={handleClose}
                    className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Skip
                  </button>
                )}
                {selectedMembers.length > 0 && (
                  <button
                    onClick={handleSubmitmember}
                    className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Done
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const USER_TYPE = {
  INDIVIDUAL: "single",
  ORGANIZATION: "org",
};

const OrganizationsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const organizationss = [
    { id: 1, name: "Acme Corp", role: "Admin" },
    { id: 2, name: "TechStart", role: "Member" },
    { id: 3, name: "Design Co", role: "Owner" },
  ];
  const {
    isProjectModalOpen,
    openProjectModal,
    setprojectname,
    setCreatedOn,
    set_allAnnotations,
    reset,
    organizations,
    setOrganizations,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const userType = USER_TYPE.ORGANIZATION;
      localStorage.setItem("userType", USER_TYPE.ORGANIZATION);
      console.log("current user is", userType);
      const response = await get(`/organizations/user/${user.email}`);
      console.log("ORGS---", response.data);
      setOrganizations(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [showModal]);

  return (
    <div className="px-8 py-8 h-screen dark:bg-gray-900 dark:text-gray-100 mb-4">
      <div className="flex items-center justify-between mb-8 dark:bg-gray-900 dark:text-gray-100">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Organizations
          </h1>
          <p className="text-gray-500 mt-1 dark:text-gray-100">
            Manage your organization memberships and settings
          </p>
        </div>
        <button
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors dark:text-gray-100"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} className="mr-2" />
          New Organization
        </button>
      </div>
      <>
        {loading ? (
          <div className="text-center py-8">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
                isDarkMode ? "border-green-400" : "border-indigo-600"
              }`}
            ></div>
            <p
              className={`mt-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Loading Org...
            </p>
          </div>
        ) : (
          <>
            {organizations.length == 0 ? (
              <div className="w-full text-center py-12 text-gray-600 dark:bg-gray-900 dark:text-gray-100 flex flex-col items-center justify-center">
                <p className="text-xl">No Organizations available</p>
                <p className="mt-2">
                  Click 'New Organization' to create your first Organization.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {organizations.length > 0 ? (
                  organizations.map((org) => {
                    let role = "Member"; // Default role
                    if (org.admin_id === user.email) {
                      role = "Admin";
                    } else {
                      const memberInfo = org.members.find(
                        (member) => member.email === user.email
                      );
                      if (memberInfo) {
                        role = memberInfo.role;
                      }
                    }

                    return (
                      <OrganizationCard
                        key={org.id}
                        name={org.name}
                        role={role}
                        createdOn={org.created_on}
                      />
                    );
                  })
                ) : (
                  <></>
                )}
              </div>
            )}
          </>
        )}
      </>

      <CreateOrganizationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default OrganizationsPage;
