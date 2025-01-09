import React, { useState } from "react";
import useStore from "../../Zustand/Alldata";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProjectaddModal({ names }) {
  const {
    isProjectModalOpen,
    closeProjectModal,
    addProject,
    setprojectname,
    setCreatedOn,
  } = useStore();
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const navigate = useNavigate();

  function submit_project() {
    axios
      .post("http://127.0.0.1:8000/projects/", { name, description })
      .then((result) => {
        console.log(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (!isProjectModalOpen) return null;
  const currentDate = new Date();
  function formatDateToCustomString(date) {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" }); // Full month name
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const isoDate = formatDateToCustomString(currentDate);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
          onClick={closeProjectModal}
        ></div>
        <div className="relative w-[400px] h-[70%] bg-gray-800 rounded-2xl px-10 text-white py-10">
          <div className="text-3xl font-semibold mt-8 mb-8">Add Project</div>
          <input
            className="w-full h-[8vh] xs:h-[6.5vh] rounded-sm bg-[#333333] border-b-[3px] border-gray-300 focus:border-green-500 focus:outline-none p-2 mb-7"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          <textarea
            className="w-full h-[15vh] xs:h-[6.5vh] rounded-sm bg-[#333333] border-b-[3px] border-gray-300 focus:border-green-500 focus:outline-none p-2"
            placeholder="Project Description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
          />
          <button
            className="w-full h-[8vh] rounded-md bg-green-600 mt-5"
            onClick={() => {
              if (name && description) {
                const projectExists = names.find(
                  (nameObj) => nameObj.toLowerCase() === name.toLowerCase()
                );

                if (!projectExists) {
                  addProject(name, description);
                  submit_project();
                  toast.success("Project Added");
                  setprojectname(name);
                  setCreatedOn(isoDate);
                  setTimeout(() => {
                    navigate(`/project/${name}`);
                  }, 100);
                  setname("");
                  setdescription("");
                  closeProjectModal();
                } else {
                  toast.error("Project Name Already Taken");
                }
              } else {
                toast.error("Complete all fields");
              }
            }}
          >
            Add
          </button>
          <button
            className="absolute top-5 right-5  font-semibold text-xl p-2 text-red-700"
            onClick={() => {
              closeProjectModal();
              setname("");
              setdescription("");
            }}
          >
            X
          </button>
        </div>
      </div>
    </>
  );
}

export default ProjectaddModal;