import React, { useEffect, useState } from "react";
import useStore from "../../Zustand/Alldata";
import ProjectaddModal from "./ProjectaddModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { HiPlus, HiFolder } from "react-icons/hi";
import ImageNavbar from "../../text_pages/Text/ImageNavbar.jsx";
import { useTheme } from "../../text_pages/Text/ThemeContext.jsx"; // Import dark mode context

function Home() {
  const { isProjectModalOpen, openProjectModal, setprojectname, setCreatedOn } =
    useStore();
  const { isDarkMode } = useTheme(); // Access dark mode state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/projects");
        setProjects(response.data);
        setNames(response.data.map((project) => project.name));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects");
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isProjectModalOpen]);

  return (
    <div
      className={`min-h-screen font-sans ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <ProjectaddModal names={names} />
      <ImageNavbar />

      <main className="container mx-auto px-12 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Projects</h2>
          <button
            className={`px-4 py-2 rounded-md flex items-center transition-colors duration-300 ${
              isDarkMode
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            onClick={openProjectModal}
          >
            <HiPlus className="mr-2" />
            Add Project
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
              className={`mt-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Loading projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <p
              className={`text-xl ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No projects available
            </p>
            <p
              className={`mt-2 ${
                isDarkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Click 'Add Project' to create your first project.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className={`rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-800"
                }`}
                onClick={() => {
                  setprojectname(project.name);
                  setCreatedOn(project.created_on);
                  navigate(`/image/${project.name}`);
                }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <HiFolder
                      className={`text-2xl mr-3 ${
                        isDarkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                    <h3 className="text-xl font-semibold">{project.name}</h3>
                  </div>
                  <p
                    className={`mb-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {project.description.length > 100
                      ? `${project.description.substring(0, 40)}....`
                      : project.description}
                  </p>
                  <p className="text-sm">
                    Created on:{" "}
                    <span
                      className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                    >
                      {new Date(project.created_on).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
