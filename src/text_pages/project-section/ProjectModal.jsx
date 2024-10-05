import React, { useState } from "react";
import toast from "react-hot-toast";
import textStore from "../zustand/Textdata";

const ProjectModal = ({ onAddProject, onClose }) => {
  const { projects } = textStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("NER"); // Default to NER

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
      onAddProject({ name, description, type });
      setName("");
      setDescription("");
      setType("NER");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>

        {/* Project Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
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
            className="w-full border border-gray-300 rounded-md p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            required
          ></textarea>
        </div>

        {/* Annotation Type Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Annotation Type
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={type}
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
