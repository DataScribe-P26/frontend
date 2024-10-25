import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import textStore from "../zustand/Textdata";
import Navbar from "./Navbar"; // Import the Navbar component
import Sidebar from "./Sidebar"; // Import the Sidebar component
import Footer from "./Footer"; // Importing footer component

const HomePage = () => {
  const { projectName } = useParams(); // Get project name from URL
  const navigate = useNavigate(); // Initialize navigate function
  const { content } = textStore(); // Access content from Zustand store

  const handleStartAnnotation = () => {
    // Check if content exists before navigating
    if (content) {
      // If content exists, navigate to the FileContentDisplay page
      navigate(`/text/${projectName}/filecontentdisplay`);
    } else {
      // If no content, navigate to the CombinedFileContent page
      navigate(`/combined-file-content/${projectName}`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-r from-gray-100 to-gray-150">
      <Navbar /> {/* Add Navbar here */}
      <div className="flex flex-grow">
        <Sidebar /> {/* Add Sidebar here */}
        <main className="flex-grow flex flex-col justify-between p-8">
          {/* Content section */}
          <div className="flex flex-col items-center mb-8 flex-grow ">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Welcome to the {projectName} Project
            </h2>
            <p className="text-gray-700 text-lg mb-8 text-center">
              Use the options in the sidebar to manage datasets and labels for
              your text annotation tasks related to {projectName}.
            </p>
            <p className="text-gray-500 mb-8 text-center">
              Get started by selecting a dataset or creating a label!
            </p>
            <div className="mt-4 mb-96">
              <button
                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-shadow shadow-lg"
                onClick={handleStartAnnotation} // Add onClick handler
              >
                Start Annotation
              </button>
            </div>
            {/* Footer positioned near the bottom but within visible screen */}
          <div className="mt-70 ">
          <Footer /> 
          </div>
          </div>

          
        </main>
      </div>
    </div>
  );
};

export default HomePage;