// HelpModal.jsx
import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const HelpModal = ({ isOpen, onClose }) => {
  return (
    <Modal open={isOpen} onClose={onClose} center classNames={{ modal: "customModal" }}>
      <div className="bg-gray-200 p-6 rounded-lg shadow-xl max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-purple-700">Help Center</h2>
        <p className="mb-6 text-gray-700">
          Here is a step-by-step guide on how to use the text annotation feature.
        </p>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Upload a File</h3>
        <p className="text-gray-600 mb-4">
          Begin by uploading the text file you want to annotate by selecting the "Import " option under Dataset in the sidebar.
        </p>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Create Labels</h3>
        <p className="text-gray-600 mb-4">
          After uploading the file, click on "Label" in the sidebar to define the categories you want to annotate.
        </p>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Start Annotation</h3>
        <p className="text-gray-600 mb-4">
          Once the file and labels are ready, navigate to the "Start Annotation" section where you can select text and assign labels.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Save and Review</h3>
        <p className="text-gray-600 mb-4">
          After annotating, save your progress. You can always return to review and edit your annotations later.
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

export default HelpModal;