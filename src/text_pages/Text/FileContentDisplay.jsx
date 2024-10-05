import React, { useState } from "react";
import textStore from "../zustand/Textdata";

const FileContentDisplay = () => {
  const {
    content,
    fileType,
    labels,
    annotations,
    addAnnotation,
    deleteAnnotation,
  } = textStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedText, setSelectedText] = useState("");

  const handleTextSelect = () => {
    const selection = window.getSelection().toString().trim();
    if (selection) {
      setSelectedText(selection);
    } else {
      setSelectedText("");
    }
  };

  const handleLabelChange = (event) => {
    const labelName = event.target.value;
    const label = labels.find((label) => label.name === labelName);

    if (label && selectedText) {
      const newAnnotation = {
        text: selectedText,
        label: label,
        index: fileType === "text" ? -1 : currentIndex,
      };

      addAnnotation(newAnnotation);
      setSelectedText("");
    }
  };

  const colorizeText = (text) => {
    let result = text;
    const annotationsSorted = annotations
      .filter(
        (annotation) => fileType === "text" || annotation.index === currentIndex
      )
      .sort((a, b) => b.text.length - a.text.length);

    annotationsSorted.forEach((annotation) => {
      const escapedText = annotation.text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      const regex = new RegExp(`(${escapedText})`, "g");
      result = result.replace(
        regex,
        `<span style="background-color: ${annotation.label.bgColor}; color: ${annotation.label.textColor}">$1</span>`
      );
    });
    return result;
  };

  const renderContent = () => {
    if (!content) return null;

    if (fileType === "text") {
      const textContent = Array.isArray(content) ? content.join("\n") : content;
      const colorizedText = colorizeText(textContent);
      return (
        <pre
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: colorizedText }}
        />
      );
    } else if (fileType === "json") {
      const jsonContent = content[currentIndex];
      const colorizedJson = colorizeText(JSON.stringify(jsonContent, null, 2));
      return (
        <pre
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: colorizedJson }}
        />
      );
    }
  };

  const renderAnnotations = () => {
    const filteredAnnotations = annotations.filter(
      (annotation) => fileType === "text" || annotation.index === currentIndex
    );

    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Annotations</h3>
        {filteredAnnotations.length === 0 ? (
          <p className="text-gray-500">No annotations yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredAnnotations.map((annotation, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-100 rounded"
              >
                <span className="text-sm font-medium">
                  <div
                    className="px-2 py-1 rounded-md text-white"
                    style={{ backgroundColor: annotation.label.textColor }}
                  >
                    {annotation.label.name}
                  </div>
                </span>
                <span className="annotation-text ml-4 w-[85%] overflow-auto text-ellipsis whitespace-nowrap custom-scrollbar">
                  {annotation.text}
                </span>
                <div className="ml-auto">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer"
                    onClick={() => {
                      if (confirm("Do you want to delete this annotation?")) {
                        deleteAnnotation(annotation);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderNavigation = () => {
    if (fileType === "json" && Array.isArray(content)) {
      return (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="self-center text-gray-700">
            Item {currentIndex + 1} of {content.length}
          </span>
          <button
            onClick={() =>
              setCurrentIndex(Math.min(content.length - 1, currentIndex + 1))
            }
            disabled={currentIndex === content.length - 1}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-grow p-8 bg-gradient-to-r from-blue-50 to-blue-100 overflow-y-auto custom-scrollbar">
      <div className="max-w-[74vw] mx-auto">
        <h2 className="text-3xl font-bold mb-6">File Content Display</h2>

        <div className="flex flex-col gap-4">
          <div
            className="bg-white p-4 rounded-lg shadow relative"
            onMouseUp={handleTextSelect}
          >
            <div className="text-xl font-semibold max-h-[calc(100vh-400px)] overflow-y-auto overflow-x-auto custom-scrollbar">
              {renderContent()}
            </div>

            {selectedText && (
              <div className="mt-4">
                <select
                  onChange={handleLabelChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  value=""
                >
                  <option value="">Select a label</option>
                  {labels.map((label) => (
                    <option key={label.name} value={label.name}>
                      {label.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {renderNavigation()}
          {renderAnnotations()}
        </div>
      </div>
    </div>
  );
};

export default FileContentDisplay;
