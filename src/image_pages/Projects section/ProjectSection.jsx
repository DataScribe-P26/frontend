import React, { useEffect, useState } from "react";
import { HiUserGroup, HiOutlineUserCircle, HiPlus, HiFolder } from "react-icons/hi";
import MainhomeNavbar from "../../Main home/MainhomeNavbar.jsx";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useTheme } from "../../text_pages/Text/ThemeContext.jsx";
import { useAuth } from "../../login/AuthContext";
import useStore from "../../Zustand/Alldata";


const ProjectSection = () => {
    const {
        isProjectModalOpen,
        openProjectModal,
        setprojectname,
        setCreatedOn,
        set_allAnnotations,
        reset,
      } = useStore();
      
  const [activeTab, setActiveTab] = useState("personalProjects");
  const [projects, setProjects] = useState([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState([]);
  const { organizations, setOrganizations } = useStore();
   const [organizationName, setOrganizationName] = useState("");

  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  

  const tabs = [
    { key: "personalProjects", label: "Personal Projects", icon: HiOutlineUserCircle },
    { key: "organizations", label: "Your Organizations", icon: HiUserGroup },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('here123');
      const response = await axios.get(`http://127.0.0.1:8000/user-projects/?email=${user.email}`);
      setProjects(response.data);
      setType('single');
      console.log(response.data);
      setName(response.data.map((project) => project.name));
      setType(response.data.map((project)=>project.type));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/organizations/user/${user.email}`);
      setOrganizations(response.data); 
      console.log('ORGS---',response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to fetch organizations");
      setLoading(false);
    }
  };


  useEffect(() => {
    if (activeTab === "personalProjects") {
      fetchProjects();
    }
    else if (activeTab === "organizations") {
      fetchOrganizations();
    }
  }, [activeTab, user.email]);

  const handleNavigate= () => {

    localStorage.setItem("organizationName", organizationName);
    console.log(organizationName);
    navigate(`/dashboard`)

  }

  const renderTabContent = () => {
    if (activeTab === "personalProjects") {
      return (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Projects</h2>
            <button
              className={`px-4 py-2 rounded-md flex items-center transition-colors duration-300 ${
                isDarkMode ? "bg-green-500 hover:bg-green-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              onClick={() => navigate("/create-project")}
            >
              Create New Project
            </button>
          </div>


          {loading ? (
            <div className="text-center py-8">
              <div
                className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
                  isDarkMode ? "border-green-400" : "border-indigo-600"
                }`}
              ></div>
              <p
                className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Loading projects...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p
                className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                No projects available
              </p>
              <p
                className={`mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                Click 'Add Project' to create your first project.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            >
              {projects.map((project) => (
                <motion.div
                  key={project._id}
                  whileHover={{ scale: 1.05 }}
                  className={`rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer ${
                    isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
                  }`}
                  onClick={() => {
                    setprojectname(project.name);
                    setCreatedOn(project.created_on);
                    reset();
                    set_allAnnotations([]);
                    navigate(`/user-project/${project.type}/${project.name}`);
                  }}
                >
                  <div className="relative">
                    <div className={`p-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                      <div className="flex items-center">
                        <HiFolder
                          className={`text-3xl mr-4 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
                        />
                        <div>
                          <h3 className="text-2xl font-semibold">
                            {project.name}
                            <span
                              className={`ml-4 px-3 py-1 text-sm rounded-full ${
                                isDarkMode ? "bg-purple-600 text-white" : "bg-purple-300 text-purple-800"
                              }`}
                            >
                              {project.type}
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <p className={`text-base ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {project.description.length > 100
                          ? `${project.description.substring(0, 40)}....`
                          : project.description}
                      </p>
                      <p className="text-sm">
                        Created on:{" "}
                        <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                          {new Date(project.created_on).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      );
    } else {
      // Render for Organizations section
      return (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Organizations</h2>
            <button
              className={`px-4 py-2 rounded-md flex items-center transition-colors duration-300 ${
                isDarkMode ? "bg-green-500 hover:bg-green-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              onClick={() => navigate("/create-organization")}
            >
              Create New Organization
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Loading organizations...</p>
            </div>
          ) : organizations.length === 0 ? (
            <div className="text-center py-8">
              <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>No organizations found</p>
            </div>
          ) : Array.isArray(organizations) && organizations.length > 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {organizations.map((org) => (
                <motion.div
                  key={org._id}
                  whileHover={{ scale: 1.05 }}
                  className={`rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer ${
                    isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
                  }`}
                  onClick={() =>handleNavigate()  }
                >
                  <div className="relative">
                    <div className={`p-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
                      <div className="flex items-center">
                        <HiFolder className={`text-3xl mr-4 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                        <h3 className="text-2xl font-semibold">{org.name}</h3>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <p className={`text-base ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {org.description ? org.description : "No description available"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>No organizations found</p>
            </div>
          )}
        </>
      );
    }
  };


  return (
    <div className="w-full h-screen bg-[#011429] text-gray-100 relative">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      >
        <source src="/videos/121470-724697516_medium.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      

      <div className="relative z-10 h-full">
        <MainhomeNavbar />
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Welcome to the Ultimate Annotation Platform
          </h2>
          <div className="flex justify-center space-x-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`flex items-center px-4 py-2 text-lg font-semibold rounded-xl transition-all ${
                  activeTab === tab.key
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => handleTabChange(tab.key)}
              >
                <tab.icon className="text-2xl mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;
