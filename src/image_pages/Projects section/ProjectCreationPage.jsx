import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../text_pages/Text/ThemeContext";
import { useAuth } from "../../login/AuthContext";
import useStore from "../../Zustand/Alldata";
import toast from "react-hot-toast";
import axios from "axios";

const ProjectCreationPage = () => {
  const {
    addProject,
    setprojectname,
    setCreatedOn,
    set_allAnnotations,
    reset,
  } = useStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const formatDateToCustomString = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = () => {
    if (name && description && type) {
      const currentDate = new Date();
      const isoDate = formatDateToCustomString(currentDate);

      addProject(name, description, type);

      axios
        .post("http://127.0.0.1:8000/user-projects/", {
          email: user?.email,
          name,
          description,
          type,
        })
        .then(() => {
          toast.success("Project Added");
          setprojectname(name);
          setCreatedOn(isoDate);
          reset();
          set_allAnnotations([]);
          setTimeout(() => {
            navigate(`/user-project/${type}/${name}`);
          }, 10);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error adding project");
        });
    } else {
      toast.error("Please complete all fields");
    }
  };

  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
  };

  return (
    <div
      className={`h-screen overflow-hidden p-8 ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"}`}
    >
      <h1 className="text-2xl font-bold">Let's Create Your Project</h1>

      <div className="mt-8 space-y-6">
        <div>
          <label className="block text-lg font-medium">Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            className={`w-full p-3 rounded-md border ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200"}`}
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            className={`w-full p-3 h-32 resize-y rounded-md border ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200"}`}
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Project Type</label>
          <div className="flex flex-wrap gap-8 mt-2 ">
            {[
              { value: "image", label: "Object Detection", imgSrc: "/images/objectdetection.png" },
              { value: "segmentation", label: "Segmentation", imgSrc: "/images/segmentation.jpg" },
              { value: "ner_tagging", label: "NER Tagging", imgSrc: "/images/nertagging.jpg" },
            ].map((option) => (
              <div
                key={option.value}
                onClick={() => handleTypeSelect(option.value)}
                className={`cursor-pointer rounded-xl p-6 w-96 shadow-md ${
                  type === option.value
                    ? "bg-green-600 text-white border-2 border-green-700"
                    : isDarkMode
                    ? "bg-gray-700 text-white border border-gray-500"
                    : "bg-gray-200 border border-gray-300"
                }`}
              >
                <img
                  src={option.imgSrc}
                  alt={option.label}
                  className="w-full h-32 object-cover mb-4 rounded-lg"
                />
                <span className="text-lg font-semibold">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold transition-all"
          >
            Create Project
          </button>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreationPage;
