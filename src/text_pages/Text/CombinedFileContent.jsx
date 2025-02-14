import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import textStore from "../zustand/Textdata";
import Footer from "./Footer"; // Importing footer component
import { useTheme } from "../../text_pages/Text/ThemeContext"; // Import useTheme hook

const CombinedFileContent = () => {
  const { fileType, setFileType, file, setFile, setContent, isUploaded, setIsUploaded } = textStore();
  const { projectName } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // Access dark mode state from ThemeContext

  const handleFileChange = (event) => {
    const fileInput = event.target; // Get the file input element
    const selectedFile = fileInput.files[0];
    const allowedFileTypes = ["text/plain", "application/json"]; // Allowed MIME types for .txt and .json files

    if (!selectedFile) {
      alert("No file selected.");
      return;
    }

    if (!allowedFileTypes.includes(selectedFile.type)) {
      alert("Uploaded file format not supported. Please upload text (.txt) or JSON (.json) files only.");
      fileInput.value = ""; // Clear the file input value
      return;
    }

    setFile(selectedFile); // Set the valid file
  };



  const handleFileUpload = () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;

      let processedContent;
      if (fileType === "text") {
        processedContent = fileContent.split("\n");
      } else if (fileType === "json") {
        try {
          const jsonContent = JSON.parse(fileContent);
          processedContent = Array.isArray(jsonContent) ? jsonContent : [jsonContent];
        } catch (error) {
          alert("Invalid JSON file. Please upload a valid JSON file.");
          return;
        }
      }

      setContent(processedContent);
      setIsUploaded(true); // Mark that the file has been uploaded
    };

    reader.readAsText(file);
  };

  const handleGoToWorkspace = () => {
    navigate(`/text/${projectName}/filecontentdisplay`);
  };

  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderUploadPage = () => (
    <div className={`flex-grow p-8 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gradient-to-r from-gray-50 to-gray-100'} flex flex-col justify-between`}>
      <div>
        <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Upload File</h2>
        <p className={`mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Please select the type of file you want to upload.</p>

        <div className="mb-4">
  <label className={`block mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
    Select File Type:
  </label>
  <select
    value={fileType}
    onChange={(e) => setFileType(e.target.value)}
    className={`${
      isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
    } p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500`}
  >
    <option value="text" className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}>
      Text File (.txt)
    </option>
    <option value="json" className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}>
      JSON File (.json)
    </option>
  </select>
</div>


        <input
          type="file"
          accept={fileType === "text" ? ".txt" : ".json"}
          onChange={handleFileChange}
          className={`border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} p-2 rounded-lg w-full mb-4`}
        />

        <div className="flex flex-col items-center mb-80 flex-grow">
          <button
            onClick={handleFileUpload}
            className={`bg-purple-700 text-white px-6 py-2 rounded-lg mb-60 hover:bg-purple-600 transition-shadow shadow-lg ${isDarkMode ? 'hover:bg-purple-500' : ''}`}
          >
            Upload
          </button>
          <Footer />
        </div>
      </div>
    </div>
  );

  const renderAlreadyUploadedPage = () => (
    <div className={`flex-grow p-8 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gradient-to-r from-gray-100 to-gray-150'} flex flex-col justify-between items-center text-center`}>
      <div>
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>File Already Uploaded</h2>
        <p className={`mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>You have already uploaded a file for this project.</p>
        <button
          onClick={handleGoToWorkspace}
          className={`bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-shadow shadow-lg ${isDarkMode ? 'hover:bg-purple-500' : ''}`}
        >
          Go to Workspace
        </button>
      </div>
      {/* Footer in main content area */}
      <Footer />
    </div>
  );

  return (
    <div className={`flex flex-col min-h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900' : ''}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar with transition */}
        <Sidebar
          isUploaded={isUploaded}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          className={`transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}
        />

        {/* Main Content Adjusts Dynamically */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>

          <Navbar />
          <div className="flex-grow flex flex-col">
            {!isUploaded ? renderUploadPage() : renderAlreadyUploadedPage()}
          </div>
        </div>
      </div>
    </div>
  );

};

export default CombinedFileContent;
