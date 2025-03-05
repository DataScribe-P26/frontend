import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";

const CreateEmotion = ({
  isOpen,
  onClose,
  onCreateEmotion,
  onUpdateEmotion,
  currentEmotion,
  editMode,
}) => {
  const [emotionName, setEmotionName] = useState("");
  const { isDarkMode } = useTheme();
  useEffect(() => {
    if (currentEmotion && editMode) {
      setEmotionName(currentEmotion.name);
    } else {
      setEmotionName("");
    }
  }, [currentEmotion, editMode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emotionName.trim()) {
      return;
    }

    if (editMode && currentEmotion) {
      onUpdateEmotion({ name: emotionName });
    } else {
      onCreateEmotion({ name: emotionName });
    }

    setEmotionName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full  dark:bg-gray-600 dark:text-gray-100">
        <h2 className="text-2xl font-bold mb-4">
          {editMode ? "Edit Emotion" : "Create New Emotion"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 dark:text-gray-100">
              Emotion Name
            </label>
            <input
              type="text"
              value={emotionName}
              onChange={(e) => setEmotionName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500  dark:bg-gray-500 dark:text-gray-100"
              placeholder="Enter emotion name (e.g., Happy, Sad, Angry)"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-400 dark:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmotion;
