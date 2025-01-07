import React, { useEffect, useState } from "react";
import useStore from "../../Zustand/Alldata";
import ProjectaddModal from "./ProjectaddModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Navbar from "../Text/Navbar.jsx";


function Home() {
  const { isProjectModalOpen, openProjectModal, setprojectname } = useStore();
  const [projects, setProjects] = useState([]);
  const [loading, setloading] = useState(false);
  const [names, setNames] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setloading(true);
        const response = await axios.get("http://127.0.0.1:8000/projects");
        setProjects(response.data);
        setNames(response.data.map((project) => project.name)); // Store project names
        setloading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects");
      }
    };

    fetchProjects();
  }, [isProjectModalOpen]);

  return (
    <div className="w-full h-screen bg-gray-900 overflow-hidden">
      <ProjectaddModal names={names} />
      <div className="w-full h-[10%] bg-gray-700 flex items-center text-3xl text-white font-bold px-7 rounded-b-xl">
        DataScribe.
      </div>
      <div className="w-full h-[90%] px-5">
        <div className="w-full h-[15%] flex items-center justify-between pr-5">
          <div className="mt-6 mb-4 text-2xl font-bold text-white px-6">
            Project List
          </div>
          <button
            className="px-3 py-2 text-white bg-green-500 rounded-md"
            onClick={openProjectModal}
          >
            Add Project+
          </button>
        </div>

        {!loading && (
          <>
            {projects.length === 0 && (
              <div className="text-red-500 text-center font-semibold text-xl">
                No Project's
              </div>
            )}
            <div className="w-full h-[90%] overflow-auto pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                {projects.map((project) => {
                  return (
                    <div
                      key={project._id}
                      className="w-[80%] bg-slate-800 px-5 py-3 rounded-xl font-bold cursor-pointer mb-3 hover:bg-gray-700  duration-300 "
                      onClick={() => {
                        setprojectname(project.name);
                        navigate(`/project/${project.name}`);
                      }}
                    >
                      <div className="text-xl text-white">{project.name}</div>
                      <div className="text-gray-400">{project.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
