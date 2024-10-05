import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CreateLabel from "./CreateLabel";
import textStore from "../zustand/Textdata";

const LabelManager = () => {
  const { labels, addLabel, deleteLabel, setLabels } = textStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(null);

  const handleCreateLabel = (newLabel) => {
    const isDuplicate = labels.some((label) => label.name === newLabel.name);

    if (isDuplicate) {
      alert("Label Name must be unique.");
      return;
    }

    addLabel(newLabel.name);
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

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-8 bg-gradient-to-r from-gray-50 to-gray-100">
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
                <tr className="bg-gray-100 border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Color</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {labels.map((label, index) => (
                  <tr key={index} className="border-b">
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
