// LabelManager.jsx
import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CreateLabel from "./CreateLabel";

const LabelManager = () => {
  const [labels, setLabels] = useState([]); // Start with an empty labels array
  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(null); // Track the label being edited

  const handleCreateLabel = (newLabel) => {
    const isDuplicate = labels.some(
      (label) => label.name === newLabel.name || label.key === newLabel.key
    );

    if (isDuplicate) {
      alert("Label Name and Label Key must be unique.");
      return;
    }

    setLabels([...labels, newLabel]);
  };

  const handleDeleteLabel = (labelKey) => {
    const updatedLabels = labels.filter((label) => label.key !== labelKey);
    setLabels(updatedLabels);
  };

  const handleEditLabel = (label) => {
    setCurrentLabel(label);
    setEditMode(true); // Switch to edit mode
    setModalOpen(true); // Open modal to edit the label
  };

  const handleUpdateLabel = (updatedLabel, oldLabelKey) => {
    // Ensure the labelName and labelKey don't conflict with existing labels
    const isDuplicate = labels.some(
      (label) =>
        (label.name === updatedLabel.name || label.key === updatedLabel.key) &&
        label.key !== oldLabelKey // Ensure we're not comparing against the label being edited
    );

    if (isDuplicate) {
      alert("Label Name and Label Key must be unique.");
      return;
    }

    const updatedLabels = labels.map((label) =>
      label.key === oldLabelKey ? updatedLabel : label
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
              setCurrentLabel(null); // Clear current label when creating a new one
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
                  <th className="p-2">Key</th>
                  <th className="p-2">Color</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {labels.map((label, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{label.name}</td>
                    <td className="p-2">{label.key}</td>
                    <td className="p-2">
                      <span
                        className="inline-block w-4 h-4"
                        style={{ backgroundColor: label.color }}
                      ></span>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleEditLabel(label)} // Edit button
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-400 transition mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLabel(label.key)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-400 transition"
                      >
                        Delete
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
            onUpdateLabel={handleUpdateLabel} // Pass the update function
            currentLabel={currentLabel} // Pass the current label to edit
            editMode={editMode} // Pass the edit mode status
            oldLabelKey={currentLabel?.key} // Pass old label key for comparison
          />
        </div>
      </div>
    </div>
  );
};

export default LabelManager;
