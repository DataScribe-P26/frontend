import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Navbar from "./Navbar"; // Import the Navbar component
import Sidebar from "./Sidebar"; // Import the Sidebar component

const HomePage = () => {
  const { projectName } = useParams(); // Get project name from URL
  const navigate = useNavigate(); // Initialize navigate function

  const handleStartAnnotation = () => {
    // Navigate to the CombinedFileContent page
    navigate(`/combined-file-content/${projectName}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-blue-100"> {/* Bluish gradient background */}
      <Navbar /> {/* Add Navbar here */}
      <div className="flex flex-grow">
        <Sidebar /> {/* Add Sidebar here */}
        <main className="flex-grow flex items-start justify-center p-8"> {/* Center horizontally, align to the top */}
          <div className="flex flex-col items-center"> {/* Center items in the column */}
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Welcome to the {projectName} Project
            </h2>
            <p className="text-gray-700 text-lg mb-4 text-center">
              Use the options in the sidebar to manage datasets and labels for
              your text annotation tasks related to {projectName}.
            </p>
            <p className="text-gray-500 mb-6 text-center">
              Get started by selecting a dataset or creating a label!
            </p>
            <div className="mt-4">
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-shadow shadow-lg"
                onClick={handleStartAnnotation} // Add onClick handler
              >
                Start Annotation
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
