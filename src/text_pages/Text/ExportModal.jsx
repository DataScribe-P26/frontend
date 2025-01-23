import React, { useState } from "react";
import axios from "axios";

const ExportModal = ({ isOpen, onClose, projectName }) => {
  const [exportFormat, setExportFormat] = useState("json");

  const handleExport = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/projects/${projectName}/ner/full-text`
      );
  
      const { text, entities } = response.data[0];
  
      if (!text || !entities || entities.length === 0) {
        throw new Error("Incomplete data: text or entities are missing.");
      }
  
      let fileContent;
      if (exportFormat === "json") {
        // Include both text and entities in the JSON export
        fileContent = JSON.stringify({ text, entities }, null, 2);
      } else if (exportFormat === "csv") {
        // Convert text and entities to CSV
        const headers = "Entity,Label,Start,End";
        const rows = entities
          .map(
            (entity) =>
              `"${entity.entity.replace(/"/g, '""')}",` + // Escape quotes
              `"${entity.label.replace(/"/g, '""')}",` +
              `${entity.start},${entity.end}`
          )
          .join("\n");
  
        // Prepend the text and add a new line
        fileContent = `Text\n"${text.replace(/"/g, '""')}"\n\n${headers}\n${rows}`;
      }
  
      // Create and download the file with proper encoding
      const utf8Blob = new Blob([`\uFEFF${fileContent}`], {
        type:
          exportFormat === "json"
            ? "application/json;charset=utf-8"
            : "text/csv;charset=utf-8",
      });
  
      const url = window.URL.createObjectURL(utf8Blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${projectName || "project"}_data.${exportFormat}`
      );
  
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
  
      onClose();
    } catch (error) {
      console.error("Error exporting data:", error.message);
    }
  };
  
  
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-lg shadow-lg p-6 w-96 relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Export Options
        </h3>
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Select Export Format</span>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="block w-full mt-2 p-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white appearance-none"
            style={{
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for dropdown
            }}
          >
            <option value="json" className="text-gray-900 bg-gray-50">
              JSON
            </option>
            <option value="csv" className="text-gray-900 bg-gray-50">
              CSV
            </option>
          </select>
        </label>
        <div className="flex justify-end mt-6">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            onClick={handleExport}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
