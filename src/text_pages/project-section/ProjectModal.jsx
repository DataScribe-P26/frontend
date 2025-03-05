import React, { useState } from "react";
import toast from "react-hot-toast";
import textStore from "../../state/textData/combinedTextData";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Text/ThemeContext";

const ProjectModal = ({ onAddProject, onClose }) => {
  const { projects } = textStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [annotation_type, setType] = useState("NER"); // Default to NER
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme(); // Use the theme context

  const handleSubmit = () => {
    // Ensure all fields are filled before submission
    if (!name || !description) {
      toast.error("Please fill out all fields!");
      return;
    }
    const projectExists = projects.find((project) => project.name === name);

    if (projectExists) {
      toast.error("Project Already Exists");
    } else {
      toast.success("Project creation!");

      onAddProject({ name, description, annotation_type });
      submit_project();
      setName(name);
      setDescription(description);
      setType(annotation_type);
      setTimeout(() => {
        navigate(`/text/${name}`);
      }, 100);
      setName("");
      setDescription("");
      onClose();
    }
  };
  function submit_project() {
    axios
      .post("http://127.0.0.1:8000/textprojects", {
        name,
        description,
        annotation_type,
      })
      .then((result) => {
        console.log(result.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Project creation failed!");
      });
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black      }`}
    >
      <div
        className={` p-6 rounded-md shadow-lg w-full max-w-md ${
          isDarkMode ? "text-white bg-slate-700" : "text-black bg-white"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>

        {/* Project Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            required
          />
        </div>

        {/* Project Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            required
          ></textarea>
        </div>

        {/* Annotation Type Dropdown */}
        <div className="mb-4 ">
          <label className="block text-sm font-medium mb-1">
            Annotation Type
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 text-black"
            value={annotation_type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="NER">NER</option>
            <option value="Sentiment Analysis">Sentiment Analysis</option>
            {/* Add more types if necessary */}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
