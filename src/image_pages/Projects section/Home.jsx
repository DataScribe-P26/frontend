import React, { useEffect, useState } from "react";
import useStore from "../../Zustand/Alldata";
import ProjectaddModal from "./ProjectaddModal";
import { useNavigate, Outlet, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { HiPlus, HiFolder, HiAnnotation } from "react-icons/hi";

function Home() {
  const { isProjectModalOpen, openProjectModal, setprojectname, setCreatedOn } =
    useStore();
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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <ProjectaddModal names={names} />
      <nav className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-5 shadow-lg">
        <div className=" flex items-center justify-between">
          <Link className="flex items-center">
            <HiAnnotation className="mr-3 text-4xl transform transition-transform duration-300 hover:scale-110" />
            <h1 className="text-3xl font-extrabold tracking-wide">
              Datascribe.ai{" "}
            </h1>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-12 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Project List</h2>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center"
            onClick={openProjectModal}
          >
            <HiPlus className="mr-2" />
            Add Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">No projects available</p>
            <p className="mt-2 text-gray-500">
              Click 'Add Project' to create your first project.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
                onClick={() => {
                  setprojectname(project.name);
                  setCreatedOn(project.created_on);
                  navigate(`/image/${project.name}`);
                }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <HiFolder className="text-2xl text-indigo-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {project.description.length > 100
                      ? `${project.description.substring(0, 40)}....`
                      : project.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created on:{" "}
                    {new Date(project.created_on).toLocaleDateString()}
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
