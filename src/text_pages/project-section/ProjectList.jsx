import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectModal from "./ProjectModal";
import { HiPlus, HiFolder } from "react-icons/hi";
import textStore from "../zustand/Textdata";
import axios from "axios";
import toast from "react-hot-toast";

const ProjectList = () => {
  const {
    projects,
    setProjects,
    showModal,
    setShowModal,
    projectname,
    setprojectname,
    project_type,
    setproject_type,
  } = textStore();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
    }
  }, []);

  // Toggle dark mode and update localStorage
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

  const addProject = (newProject) => {
    const isDuplicate = projects.some(
      (project) => project.name === newProject.name
    );
    if (isDuplicate) {
      alert("Project name already exists!");
      return;
    }

    setProjects([...projects, newProject]);
    setShowModal(false);
  };

  const handleProjectClick = (projectName) => {
    navigate(`/text/${projectName}`);
  };

  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/textprojects");
        setProjects(response.data);
        setprojectname(response.data.map((project) => project.name));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects");
        setLoading(false);
      }
    };

    fetchProjects();
  }, [showModal]);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"} font-sans`}>
      <nav className={`bg-gradient-to-r ${darkMode ? "from-gray-800 to-gray-900" : "from-indigo-600 to-indigo-800"} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wide flex items-center">Datascribe.</h1>
          <div className="flex space-x-4 items-center">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center w-10 h-8 rounded-full transition-colors duration-300 ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}
            >
              <span className={`block w-5 h-6 rounded-full transition-transform duration-300 ${darkMode ? "transform translate-x-4 bg-gray-800" : "bg-white"}`}></span>
            </button>
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center">
              <HiPlus className="mr-2" />
              Add Project
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-12 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Project List</h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">No projects available</p>
            <p className="mt-2 text-gray-500">Click 'Add Project' to create your first project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              project.name && (
                <div
                  key={index}
                  onClick={() => {
                    handleProjectClick(project.name);
                    setprojectname(project.name);
                    setproject_type(project.type);
                  }}
                  className={`bg-white ${darkMode ? "text-black" : "text-gray-800"} rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer p-5`}
                >
                  <div className="flex items-center mb-3">
                    <HiFolder className="text-2xl text-indigo-600 mr-3" />
                    <h3 className="text-xl font-semibold">{project.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {project.description && project.description.length > 100
                      ? `${project.description.substring(0, 40)}....`
                      : project.description}
                  </p>
                  <span
                    className="text-sm font-medium px-2 py-1 rounded-full bg-opacity-50"
                    style={{
                      backgroundColor:
                        project.type === "ner"
                          ? "rgba(59, 130, 246, 0.5)"
                          : "rgba(16, 185, 129, 0.5)",
                      color:
                        project.type === "ner"
                          ? "#1e40af"
                          : "#065f46",
                    }}
                  >
                    {project.type}
                  </span>
                </div>
              )
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <ProjectModal
          onAddProject={addProject}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectList;
