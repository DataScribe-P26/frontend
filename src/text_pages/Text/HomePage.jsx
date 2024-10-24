import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const HomePage = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  };

  const handleStartAnnotation = () => {
    navigate(`/combined-file-content/${projectName}`);
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gradient-to-r from-blue-50 to-blue-100"}`}>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow flex items-start justify-center p-8">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-bold mb-6">Welcome to the {projectName} Project</h2>
            <p className="text-gray-700 text-lg mb-4 text-center">
              Use the options in the sidebar to manage datasets and labels for your text annotation tasks related to {projectName}.
            </p>
            <p className="text-gray-500 mb-6 text-center">Get started by selecting a dataset or creating a label!</p>
            <div className="mt-4">
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-shadow shadow-lg"
                onClick={handleStartAnnotation}
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
