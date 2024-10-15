import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import textStore from "../zustand/Textdata"; // Assuming your store is set up to manage text and files
import FileContentDisplay from "./FileContentDisplay";
import CombinedFileContent from "./CombinedFileContent";

const Workspace = () => {
  const { projectName } = useParams(); // Get the project name from the URL
  const { content } = textStore(); // Access the content from Zustand
  const [isAnnotationStarted, setIsAnnotationStarted] = useState(false); // State to track annotation start

  const handleStartAnnotation = () => {
    setIsAnnotationStarted(true); // Hide Navbar and Sidebar when annotation starts
  };

  return (
    <div className="flex flex-col h-screen">
      {!isAnnotationStarted && <Navbar />} {/* Conditionally render Navbar */}
      <div className="flex flex-grow">
        {!isAnnotationStarted && <Sidebar />} {/* Conditionally render Sidebar */}
        <div className="flex-grow p-8 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            {projectName} - Annotation Workspace
          </h2>
          {/* Conditionally render content */}
          {content ? (
            <FileContentDisplay />
          ) : (
            <CombinedFileContent onStartAnnotation={handleStartAnnotation} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;