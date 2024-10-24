import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CreateLabel from "./CreateLabel";
import textStore from "../zustand/Textdata";
import axios from "axios";

const LabelManager = () => {
  const { labels, addLabel, deleteLabel, setLabels } = textStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(null);
  const { projectName } = useParams();
  const [fetchedLabels, setFetchedLabels] = useState(false);

  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchLabels = async () => {
      if (fetchedLabels || labels.length > 0) return;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/projects/${projectName}/ner/full-text`);

        const uniqueLabels = Array.from(new Set(response.data[0].entities.map(entity => entity.label)));

        const newLabels = uniqueLabels.map((name) => {
          const labelEntity = response.data[0].entities.find(entity => entity.label === name);
          return {
            name,
            color: labelEntity.color,
            bgColor: labelEntity.bColor,
            textColor: labelEntity.textColor,
          };
        });
        setLabels(newLabels);
        setFetchedLabels(true);
      } catch (error) {
        console.error("Error fetching annotations:", error);
      }
    };

    fetchLabels();
  }, [projectName, setLabels, labels.length, fetchedLabels]);

  const handleCreateLabel = (newLabel) => {
    const isDuplicate = labels.some((label) => label.name === newLabel.name);

    if (isDuplicate) {
      alert("Label Name must be unique.");
      return;
    }
    addLabel(newLabel);
  };

  const handleEditLabel = (label) => {
    setCurrentLabel(label);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleUpdateLabel = (updatedLabel) => {
    const isDuplicate = labels.some(
      (label) =>
        label.name === updatedLabel.name && label.name !== currentLabel.name
    );

    if (isDuplicate) {
      alert("Label Name must be unique.");
      return;
    }

    const updatedLabels = labels.map((label) =>
      label.name === currentLabel.name
        ? { ...label, name: updatedLabel.name }
        : label
    );
    setLabels(updatedLabels);
    setEditMode(false);
    setModalOpen(false);
    setCurrentLabel(null);
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={isDarkMode} />
      <div className="flex flex-grow">
        <Sidebar />
        <div className={`flex-grow p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
          <h1 className="text-3xl font-bold mb-4">Label Manager</h1>
          <button
            onClick={() => {
              setCurrentLabel(null);
              setEditMode(false);
              setModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition-shadow shadow-lg hover:shadow-xl mb-4"
          >
            Create Label
          </button>
          {labels.length > 0 ? (
            <table className="min-w-full border text-sm text-left bg-white shadow-md rounded-lg">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <th className="p-2">Name</th>
                  <th className="p-2">Color</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {labels.map((label, index) => (
                  <tr key={index} className={`border-b ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <td className="p-2">{label.name}</td>
                    <td className="p-2">
                      <div className="flex items-center">
                        <div
                          className="w-6 h-6 rounded-full mr-2"
                          style={{ backgroundColor: label.color }}
                        ></div>
                      </div>
                    </td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => handleEditLabel(label)}
                        className="text-yellow-500 p-2 hover:text-yellow-600 transition"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => deleteLabel(label.name)}
                        className="text-red-500 p-2 hover:text-red-600 transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No labels created yet.</p>
          )}
          <CreateLabel
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onCreateLabel={handleCreateLabel}
            onUpdateLabel={handleUpdateLabel}
            currentLabel={currentLabel}
            editMode={editMode}
          />
        </div>
      </div>
    </div>
  );
};

export default LabelManager;
