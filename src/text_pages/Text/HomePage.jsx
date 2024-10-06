import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const HomePage = () => {
  const { projectName } = useParams(); // Get project name from URL
  const navigate = useNavigate(); // Initialize navigate function

  const handleStartAnnotation = () => {
    // Navigate to the CombinedFileContent page
    navigate(`/combined-file-content/${projectName}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Removed Navbar and Sidebar */}
      <main className="flex-grow p-8 bg-gradient-to-r from-blue-50 to-blue-100">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">
          Welcome to the {projectName} Project
        </h2>{" "}
        {/* Display the project name */}
        <p className="text-gray-700 text-lg mb-4">
          Use the options in the sidebar to manage datasets and labels for
          your text annotation tasks related to {projectName}.
        </p>
        <p className="text-gray-500">
          Get started by selecting a dataset or creating a label!
        </p>
        <div className="mt-8">
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-shadow shadow-lg"
            onClick={handleStartAnnotation} // Add onClick handler
          >
            Start Annotation
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
