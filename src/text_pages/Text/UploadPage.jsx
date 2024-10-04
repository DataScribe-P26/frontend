import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const UploadPage = () => {
  const [fileType, setFileType] = useState("text");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { projectName } = useParams();

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
      const content = e.target.result;

      let processedContent;
      if (fileType === "text") {
        processedContent = content.split("\n");
      } else if (fileType === "json") {
        try {
          const jsonContent = JSON.parse(content);
          processedContent = Array.isArray(jsonContent)
            ? jsonContent
            : [jsonContent];
        } catch (error) {
          alert("Invalid JSON file. Please upload a valid JSON file.");
          return;
        }
      }

      navigate(`/text/${projectName}/content`, {
        state: { fileContent: processedContent, fileType },
      });

      setFile(null);
    };

    reader.readAsText(file);
    console.log(`Uploading file: ${file.name} of type: ${fileType}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-8 bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-3xl font-bold mb-6">Upload File</h2>
          <p className="text-gray-700 mb-4">
            Please select the type of file you want to upload.
          </p>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Select File Type:
            </label>
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
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-shadow shadow-lg"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
