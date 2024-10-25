import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import textStore from "../zustand/Textdata";
import Footer from "./Footer"; // Importing footer component

const CombinedFileContent = () => {
  const { fileType, setFileType, file, setFile, setContent, isUploaded, setIsUploaded } = textStore();
  const { projectName } = useParams();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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

  const renderUploadPage = () => (
    <div className="flex-grow p-8 bg-gradient-to-r from-gray-50 to-gray-100 flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-bold mb-6">Upload File</h2>
        <p className="text-gray-700 mb-4">Please select the type of file you want to upload.</p>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select File Type:</label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full"
          >
            <option value="text">Text File (.txt)</option>
            <option value="json">JSON File (.json)</option>
          </select>
        </div>

        <input
          type="file"
          accept={fileType === "text" ? ".txt" : ".json"}
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded-lg w-full mb-4"
        />

          <div className="flex flex-col items-center mt-8 mb-96 flex-grow">
          <button
            onClick={handleFileUpload}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg mb-60 hover:bg-purple-600 transition-shadow shadow-lg"
          >
            Upload
          </button>
          <div className="mt-12">
          <Footer />
          </div>
          
        </div>
      
      </div>
      
    </div>
  );

  const renderAlreadyUploadedPage = () => (
    <div className="flex-grow p-8 bg-gradient-to-r from-gray-100 to-gray-150 flex flex-col justify-between items-center text-center">
      <div>
        <h2 className="text-3xl font-bold mb-4">File Already Uploaded</h2>
        <p className="text-gray-700 mb-4">You have already uploaded a file for this project.</p>
        <button
          onClick={handleGoToWorkspace}
          className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-shadow shadow-lg"
        >
          Go to Workspace
        </button>
      </div>
      {/* Footer in main content area */}
      <Footer />
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar isUploaded={isUploaded} /> {/* Pass isUploaded as a prop */}
        <div className="flex-grow flex flex-col">
          {!isUploaded ? renderUploadPage() : renderAlreadyUploadedPage()}
        </div>
      </div>
    </div>
  );
};

export default CombinedFileContent;
