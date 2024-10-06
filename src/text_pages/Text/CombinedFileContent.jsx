import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import textStore from "../zustand/Textdata";

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
    <div className="flex-grow p-8 bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col justify-start">
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

        
          <button
            onClick={handleFileUpload}
            className="bg-indigo-600 text-white px-1 py-2 rounded-lg hover:bg-indigo-500 transition-shadow shadow-lg"
          >
            Upload
          </button>
        
    </div>
  );

  const renderAlreadyUploadedPage = () => (
    <div className="flex-grow p-8 bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col justify-start items-center text-center">
      <h2 className="text-3xl font-bold mb-4">File Already Uploaded</h2>
      <p className="text-gray-700 mb-4">You have already uploaded a file for this project.</p>
      <button
        onClick={handleGoToWorkspace}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-shadow shadow-lg"
      >
        Go to Workspace
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        {!isUploaded ? renderUploadPage() : renderAlreadyUploadedPage()}
      </div>
    </div>
  );
};

export default CombinedFileContent;
