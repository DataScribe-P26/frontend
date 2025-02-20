import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../text_pages/Text/ThemeContext";
import { useAuth } from "../../login/AuthContext";
import useStore from "../../Zustand/Alldata";
import toast from "react-hot-toast";
import axios from "axios";
import { USER_TYPE } from "../../Main home/user-type.js";

const ProjectCreationModal = ({ isOpen, onClose }) => {
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
        const userType = USER_TYPE.INDIVIDUAL; 
        console.log('current user is',userType);
    } else {
      toast.error("Please complete all fields");
    }
  };

  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-90`}
      onClick={onClose} // Close when clicking on the overlay
    >
     <div
  className={`relative w-full max-w-2xl mx-auto bg-opacity-80 p-6 rounded-lg shadow-lg ${
    isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
  }`}
  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
>
  <h1
    className={`text-2xl font-bold mb-6 ${
      isDarkMode ? "text-gray-100" : "text-gray-900"
    }`}
  >
    Let's Create Your Project
  </h1>

  <div className="space-y-6 text-left">
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
          isDarkMode ? "bg-gray-600 text-gray-100" : "bg-gray-200"
        }`}
      />
    </div>

    <div>
      <label
        className={`block text-lg ml-0 font-medium mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Description
      </label>
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
      <label
        className={`block text-lg font-medium mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Project Type
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ value: "image", label: "Object Detection", imgSrc: "/images/objectdetection.png" },
          { value: "segmentation", label: "Segmentation", imgSrc: "/images/segmentation.jpg" },
          { value: "ner_tagging", label: "NER Tagging", imgSrc: "/images/nertagging.jpg" }].map((option) => (
            <div
              key={option.value}
              onClick={() => handleTypeSelect(option.value)}
              className={`cursor-pointer p-4 rounded-md shadow-md transition-all ${
                type === option.value
                  ? "bg-green-600 text-white"
                  : isDarkMode
                  ? "bg-gray-600 text-white"
                  : "bg-gray-200 border-b border-blue-500"
              }`}
            >
              <img
                src={option.imgSrc}
                alt={option.label}
                className="w-full h-20 object-cover rounded-md"
              />
              <span className="block text-center mt-2 font-semibold">{option.label}</span>
            </div>
        ))}
      </div>
    </div>

    <div className="flex justify-start gap-4 mt-6">
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold transition-all"
      >
        Create Project
      </button>
      <button
        onClick={onClose}
        className={`px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold transition-all ${
          isDarkMode ? "bg-red-600" : "bg-red-600"
        }`}
      >
        Cancel
      </button>
    </div>
  </div>
</div>
</div>
  );
};

export default ProjectCreationModal;
