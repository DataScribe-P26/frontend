import React, { useState, useEffect, useRef } from "react";

const CreateLabel = ({
  isOpen,
  onClose,
  onCreateLabel,
  currentLabel,
  onUpdateLabel,
  editMode,
}) => {
  const [labelName, setLabelName] = useState("");
  const inputRef = useRef(null); // Ref for the input field

  useEffect(() => {
    if (currentLabel) {
      setLabelName(currentLabel.name);
    } else {
      setLabelName("");
    }
  }, [currentLabel]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus(); // Automatically focus the input field when the modal opens
    }
  }, [isOpen]);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!labelName) {
      alert("Please enter a label name.");
      return;
    }

    const newLabel = { name: labelName };

    if (editMode && currentLabel) {
      onUpdateLabel(newLabel);
    } else {
      onCreateLabel(newLabel);
    }

    setLabelName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        className="bg-gray-200 rounded-lg shadow-lg z-10 p-5"
        style={{ width: "400px", height: "300px" }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4 text-black">
          {editMode ? "Edit Label" : "Create a New Label"}
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-4 overflow-auto">
          <div className="group mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Label Name
            </label>
            <input
              type="text"
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              ref={inputRef} // Attach ref to the input
              className="border-2 border-gray-300 p-3 rounded-lg w-full text-gray-700 focus:border-purple-600 focus:outline-none focus:ring focus:ring-purple-300 transition"
              placeholder="Enter label name"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-shadow shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {editMode ? "Update Label" : "Create Label"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLabel;
