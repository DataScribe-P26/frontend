import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../login/AuthContext.jsx";
import { USER_TYPE } from "../../Main home/user-type.js";

const ExportModal = ({ isOpen, onClose, projectName,projectType }) => {
  const [exportFormat, setExportFormat] = useState("json");
  const { user } = useAuth();



  const handleExport = async () => {
    try {
      const userType = localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
      const response = await axios.get(
        `http://127.0.0.1:8000/projects/ner_tagging/${userType}/${projectName}/${user.email}`
      );

      const { text, entities } = response.data[0];

      if (!text || !entities || entities.length === 0) {
        throw new Error("Incomplete data: text or entities are missing.");
      }

      let fileContent;
      if (exportFormat === "json") {
        fileContent = JSON.stringify({ text, entities }, null, 2);
      } else if (exportFormat === "csv") {
        const headers = "Entity,Label,Start,End";
        const rows = entities
          .map(
            (entity) =>
              `"${entity.entity.replace(/"/g, '""')}",` +
              `"${entity.label.replace(/"/g, '""')}",` +
              `${entity.start},${entity.end}`
          )
          .join("\n");

        fileContent = `Text\n"${text.replace(/"/g, '""')}"\n\n${headers}\n${rows}`;
      } else if (exportFormat === "bio" || exportFormat === "bilou") {
        const words = text.split(/\s+/);
        let annotations = [];
        let currentEntityIndex = 0;
        let currentEntity = entities[currentEntityIndex] || null;

        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          const wordStartPosition = text.indexOf(
            word,
            i > 0 ? text.indexOf(words[i - 1]) + words[i - 1].length : 0
          );
          const wordEndPosition = wordStartPosition + word.length - 1;

          let label = "O";

          if (currentEntity && wordStartPosition >= currentEntity.start && wordEndPosition <= currentEntity.end) {
            const entityWords = text
              .slice(currentEntity.start, currentEntity.end + 1)
              .trim()
              .split(/\s+/);
            const entityLength = entityWords.length;
            const entityWordIndex = entityWords.indexOf(word);

            if (exportFormat === "bio") {
              label =
                entityWordIndex === 0
                  ? `B-${currentEntity.label}`
                  : `I-${currentEntity.label}`;
            } else if (exportFormat === "bilou") {
              if (entityLength === 1) {
                label = `U-${currentEntity.label}`;
              } else if (entityWordIndex === 0) {
                label = `B-${currentEntity.label}`;
              } else if (entityWordIndex === entityLength - 1) {
                label = `L-${currentEntity.label}`;
              } else {
                label = `I-${currentEntity.label}`;
              }
            }
          } else {
            while (currentEntity && currentEntity.end < wordEndPosition) {
              currentEntityIndex++;
              currentEntity = entities[currentEntityIndex] || null;
            }
            label = "O";
          }

          annotations.push(`${word} ${label}`);
        }

        fileContent = annotations.join("\n");
      }

      const utf8Blob = new Blob([`\uFEFF${fileContent}`], {
        type:
          exportFormat === "json"
            ? "application/json;charset=utf-8"
            : exportFormat === "csv"
            ? "text/csv;charset=utf-8"
            : "text/plain;charset=utf-8",
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
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <option value="json">JSON</option>
            {userType === "ner_tagging" ? (
              <>
                <option value="csv">CSV</option>
                <option value="bio">BIO</option>
                <option value="bilou">BILOU</option>
              </>
            ) : userType === "sentiment_analysis" ? (
              <>
                {/* Add other formats for sentiment analysis if needed */}
              </>
            ) : null}
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
