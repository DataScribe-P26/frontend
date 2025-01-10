// HelpModalImg.jsx
import React from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const HelpModalImg = ({ isOpen, onClose }) => {
  return (
    <Modal open={isOpen} onClose={onClose} center classNames={{ modal: "customModal" }}>
      <div className="bg-gray-200 p-6 rounded-lg shadow-xl max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-purple-700">How to Use Image Annotation?</h2>
        <p className="mb-6 text-gray-700">
          Follow these steps to annotate images effectively using Datascribe.ai.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Create a Project</h3>
        <p className="text-gray-600 mb-4">
          Start by creating a project to organize your dataset.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Upload Files</h3>
        <p className="text-gray-600 mb-4">
          Upload image files or folders.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Proceed to Annotation</h3>
        <p className="text-gray-600 mb-4">
          Click "Continue" to access the main annotation page.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Annotate Images</h3>
        <p className="text-gray-600 mb-4">
          Use tools like Rectangle, Polygon, or Segmentation Mask to draw annotations and assign class labels.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">5. Manage Class Labels</h3>
        <p className="text-gray-600 mb-4">
          Create or select class labels from the modal after drawing.
        </p>

        <button
          className="bg-purple-700 text-white px-4 py-2 mt-4 rounded-lg hover:bg-purple-600 transition duration-300"
          onClick={onClose}
        >
          Got it!
        </button>
      </div>
    </Modal>
  );
};

export default HelpModalImg;
