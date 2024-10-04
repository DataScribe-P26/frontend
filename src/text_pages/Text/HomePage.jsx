import React from "react";
import { useParams } from "react-router-dom"; // Import useParams from react-router-dom
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const HomePage = () => {
  const { projectName } = useParams(); // Get project name from URL

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
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
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-shadow shadow-lg">
              Start Annotation
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
