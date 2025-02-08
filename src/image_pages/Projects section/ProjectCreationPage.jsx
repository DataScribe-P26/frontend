import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../text_pages/Text/ThemeContext";
import { useAuth } from "../../login/AuthContext";
import useStore from "../../Zustand/Alldata";
import toast from "react-hot-toast";
import axios from "axios";
import MainhomeNavbar from "../../Main home/MainhomeNavbar.jsx";

const ProjectCreationPage = () => {
  const { addProject, setprojectname, setCreatedOn, set_allAnnotations, reset } = useStore();
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
    className={`h-screen overflow-hidden flex flex-col  ${
      isDarkMode ? "text-white" : "text-black"
    } bg-cover bg-center bg-opacity-80`}
    style={{
      backgroundImage: `url('/images/image3.png')`,
    }}
  >
      <MainhomeNavbar />

      <div className="flex flex-col justify-center items-center flex-1 px-4  backdrop-blur-sm">
      <h1
          className={`text-3xl font-extrabold text-center mb-6 ${
            isDarkMode ? "text-gray-100" : "text-gray-100"
          } transition-all`}
        >
          Let's Create Your Project
        </h1>

        <div
          className={`w-full max-w-2xl space-y-6 rounded-xl p-6 transition-all bg-opacity-50 ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
          }`}
        >
          <div>
          <label
            className={`block text-lg font-medium mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Project Name
          </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className={`w-full p-3 rounded-md border focus:ring-2 focus:ring-green-500 outline-none ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200"
              }`}
            />
          </div>

          <div>
            <label className={`block text-lg font-medium mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              className={`w-full p-3 h-24 rounded-md border focus:ring-2 focus:ring-green-500 outline-none ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200"
              }`}
            />
          </div>

          <div>
            <label className={`block text-lg font-medium mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>Project Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "image", label: "Object Detection", imgSrc: "/images/objectdetection.png" },
                { value: "segmentation", label: "Segmentation", imgSrc: "/images/segmentation.jpg" },
                { value: "ner_tagging", label: "NER Tagging", imgSrc: "/images/nertagging.jpg" },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleTypeSelect(option.value)}
                  className={`cursor-pointer p-4 rounded-md shadow-md transition-all ${
                    type === option.value
                      ? "bg-green-600 text-white"
                      : isDarkMode
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <img src={option.imgSrc} alt={option.label} className="w-full h-20 object-cover rounded-md" />
                  <span className="block text-center mt-2 font-semibold">{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold transition-all"
            >
              Create Project
            </button>
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreationPage;
