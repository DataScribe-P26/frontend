import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import textStore from "../../state/store/textData/combinedTextData.js";
import CreateLabel from "./CreateLabel.jsx";
import { useTheme } from "./ThemeContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { USER_TYPE } from "../../Main home/user-type.js";
import { useAuth } from "../../login/AuthContext.jsx";

const FileContentDisplay = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const {
    content,
    setContent,
    fileType,
    labels,
    setLabels,
    annotations,
    setAnnotations,
    addAnnotation,
    deleteAnnotation,
    addLabel,
  } = textStore();
  const { isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const { projectName } = useParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(null);
  const { user } = useAuth();

  const [fetchedLabels, setFetchedLabels] = useState(false);
  const [autoAnnotationEnabled, setAutoAnnotationEnabled] = useState(false);

  const projectType = localStorage.getItem("projectType"); // Get projectType from localStorage
  // useEffect(() => {
  //   localStorage.removeItem("sentimentResult"); // Clear the stored sentiment data
  //_id:ObjectId('67bd923af3116dc3d253524d')

  // }, []);

  useEffect(() => {
    // Activate auto-annotation button if more than one annotation exists
    setAutoAnnotationEnabled(annotations.length > 1);
  }, [annotations]);

  const handleAutoAnnotation = async () => {
    await handleSubmit();
    try {
      const userType = localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
      const response = await axios.post(
        `http://127.0.0.1:8000/process_text/${projectName}`,
        null, // No request body
        {
          params: { user_type: userType }, // Sending user_type as a query parameter
        }
      );

      console.log("Pipeline Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during auto-annotation:", error);
    }
  };

  const handleCreateLabel = (newLabel) => {
    const isDuplicate = labels.some((label) => label.name === newLabel.name);

    if (isDuplicate) {
      toast.error("Label Name must be unique.");
      return;
    }
    console.log(newLabel);
    addLabel(newLabel.name);
  };

  const handleUpdateLabel = (updatedLabel) => {
    const isDuplicate = labels.some(
      (label) =>
        label.name === updatedLabel.name && label.name !== currentLabel.name
    );

    if (isDuplicate) {
      toast.error("Label Name must be unique.");
      return;
    }

    const updatedLabels = labels.map((label) =>
      label.name === currentLabel.name
        ? { ...label, name: updatedLabel.name }
        : label
    );
    setLabels(updatedLabels);
    setEditMode(false);
    setModalOpen(false);
    setCurrentLabel(null);
  };

  const handleTextSelect = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    const textContainer = document.getElementById("text-container");

    if (!textContainer) {
      console.error("Text container not found!");
      return;
    }

    if (selectedText) {
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer;

      const { offset: start, lineNumber } = calculateOffsetAndLineNumber(
        textContainer,
        startContainer,
        range.startOffset
      );

      const end = start + selectedText.length;

      setSelectedText({
        text: selectedText,
        start: start,
        end: end,
        lineNumber: lineNumber,
      });

      console.log("Start:", start, "End:", end, "Line Number:", lineNumber);
    } else {
      setSelectedText("");
    }
  };

  const calculateOffsetAndLineNumber = (
    textContainer,
    startContainer,
    startOffset
  ) => {
    let totalOffset = 0;
    let lineNumber = 1;
    let found = false;

    // Traverse nodes and calculate offsets and line numbers
    const traverseNodes = (node) => {
      if (found) return; // Stop traversal once we find the target node

      if (node === startContainer) {
        totalOffset += startOffset;
        found = true;
        return;
      }

      if (node.nodeType === Node.TEXT_NODE) {
        totalOffset += node.textContent.length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === "BR") {
          lineNumber++;
          totalOffset++; // Account for line break
        } else {
          for (const child of node.childNodes) {
            traverseNodes(child);
            if (found) return; // Stop further traversal
          }
          if (getComputedStyle(node).display === "block") {
            lineNumber++; // Increment for block-level elements
          }
        }
      }
    };

    traverseNodes(textContainer);

    return { offset: totalOffset, lineNumber };
  };

  useEffect(() => {
    const fetchAnnotationsAndLabels = async () => {
      try {
        setContent(null);
        // Clear existing data when project changes
        setLabels([]);
        setAnnotations([]);
        let user_type = "single";
        const userType =
          localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
        console.log("current user is", userType);
        const response = await axios.get(
          `http://127.0.0.1:8000/projects/ner_tagging/${userType}/${projectName}/${user.email}`
        );
        console.log("hello------", response.data[0]);
        if (response.data?.[0]) {
          setContent(response.data[0].text || null);

          if (response.data[0].entities?.length) {
            const labelMap = new Map();
            response.data[0].entities.forEach((entity) => {
              if (!labelMap.has(entity.label)) {
                labelMap.set(entity.label, {
                  name: entity.label,
                  color: entity.color,
                  bgColor: entity.bColor,
                  textColor: entity.textColor,
                });
              }
            });

            setLabels(Array.from(labelMap.values()));

            // Create unique annotations using Set
            const uniqueAnnotations = Array.from(
              new Set(
                response.data[0].entities.map((entity) =>
                  JSON.stringify({
                    text: entity.entity,
                    label: {
                      name: entity.label,
                      color: entity.color,
                      bgColor: entity.bColor,
                      textColor: entity.textColor,
                    },
                    start: entity.start,
                    end: entity.end,
                    index: -1,
                  })
                )
              )
            ).map((str) => JSON.parse(str));

            setAnnotations(uniqueAnnotations);
          }
        }
      } catch (error) {
        console.error("Error fetching annotations:", error);
      } finally {
      }
    };

    if (!content || !annotations || !labels) {
      fetchAnnotationsAndLabels();
    }
  }, [projectName]);

  const handleLabelChange = async (event) => {
    const labelName = event.target.value;
    const label = labels.find((label) => label.name === labelName);

    if (label && selectedText.text) {
      const newAnnotation = {
        text: selectedText.text,
        label: label,
        start: selectedText.start,
        end: selectedText.end,
        index: fileType === "text" ? -1 : currentIndex,
      };

      try {
        addAnnotation(newAnnotation);
        setSelectedText("");
        await handleSubmit();
      } catch (error) {
        console.error("Error submitting annotation:", error);
      }
    }
  };

  const colorizeText = (text) => {
    let result = "";
    let lastIndex = 0;

    // Sort annotations by start position
    const sortedAnnotations = annotations
      .filter(
        (annotation) => fileType === "text" || annotation.index === currentIndex
      )
      .sort((a, b) => a.start - b.start);

    sortedAnnotations.forEach((annotation, index) => {
      // Add non-highlighted text before the current annotation
      if (annotation.start > lastIndex) {
        result += text
          .slice(lastIndex, annotation.start)
          .replace(/\n/g, "<br>")
          .replace(/\s/g, "&nbsp;");
      }

      // Skip if this annotation has already been processed
      if (annotation.start < lastIndex) {
        return;
      }

      // Handle overlapping annotations
      let overlapEnd = annotation.end;
      const overlappingAnnotations = [annotation];

      // Look ahead for overlapping annotations
      for (let j = index + 1; j < sortedAnnotations.length; j++) {
        const nextAnnotation = sortedAnnotations[j];
        if (nextAnnotation.start < overlapEnd) {
          overlapEnd = Math.max(overlapEnd, nextAnnotation.end);
          overlappingAnnotations.push(nextAnnotation);
        } else {
          break;
        }
      }

      // Process each segment within the overlapping range
      let currentPosition = annotation.start;
      while (currentPosition < overlapEnd) {
        // Find the next split point
        const splitPoint = Math.min(
          ...overlappingAnnotations.map((a) =>
            a.start > currentPosition ? a.start : Infinity
          ),
          ...overlappingAnnotations.map((a) =>
            a.end > currentPosition ? a.end : Infinity
          ),
          overlapEnd
        );

        const segmentText = text.slice(currentPosition, splitPoint);

        // Find active annotations for the current segment
        const activeAnnotations = overlappingAnnotations.filter(
          (a) => a.start <= currentPosition && a.end >= splitPoint
        );

        if (activeAnnotations.length > 0) {
          // Apply the last annotation's style to the segment
          const { bgColor, textColor } =
            activeAnnotations[activeAnnotations.length - 1].label;
          const underline = activeAnnotations.length > 1;
          result += `<span style="background-color: ${bgColor}; color: ${textColor}; ${
            underline ? "text-decoration: underline;" : ""
          } display: inline;">${segmentText
            .replace(/\n/g, "<br>")
            .replace(/\s/g, "&nbsp;")}</span>`;
        }

        currentPosition = splitPoint;
      }

      // Update lastIndex to the end of the current overlap group
      lastIndex = overlapEnd;
    });

    // Add remaining text after the last annotation
    if (lastIndex < text.length) {
      result += text
        .slice(lastIndex)
        .replace(/\n/g, "<br>")
        .replace(/\s/g, "&nbsp;");
    }

    return result;
  };

  const renderContent = () => {
    if (!content) return null;

    if (fileType === "text") {
      const textContent =
        typeof content === "string" ? content : content.join("\n");
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
    if (projectType !== "ner_tagging") return null;

    // Use reduce to filter out duplicate annotations by their text property
    const uniqueAnnotations = annotations.reduce((unique, current) => {
      if (!unique.some((annotation) => annotation.text === current.text)) {
        unique.push(current);
      }
      return unique;
    }, []);

    const filteredAnnotations = uniqueAnnotations.filter(
      (annotation) => fileType === "text" || annotation.index === currentIndex
    );

    return (
      <div
        className={`mt-4 p-4 bg-white rounded-lg shadow ${
          isDarkMode ? "bg-black" : "bg-gray-700"
        }`}
      >
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
            className="bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      );
    }
    return null;
  };
  const handleSubmit = async () => {
    const dataToSend = {
      text: Array.isArray(content) ? content.join("\n") : content,
      entities: annotations.map((annotation) => ({
        entity: annotation.text,
        label: annotation.label.name,
        color: annotation.label.color,
        bColor: annotation.label.bgColor,
        textColor: annotation.label.textColor,
        start: annotation.start,
        end: annotation.end,
      })),
    };

    console.log("Submitting data:", JSON.stringify(dataToSend, null, 2));
    const user_type = "single";

    let image = null;
    let data = { image, dataToSend };
    console.log(data);
    const userType = localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
    console.log("current user is", userType);
    const type = projectType;
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/projects/${type}/${userType}/${projectName}/upload/`,
        { data2: dataToSend },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error(error.message);
      } else {
        console.error("Network Error:", error.message);
        toast.error("Change Not Saved");
      }
    }
  };
  const handleExitProject = async () => {
    const dataToSend = {
      text: Array.isArray(content) ? content.join("\n") : content,
      entities: annotations.map((annotation) => ({
        entity: annotation.text,
        label: annotation.label.name,
        color: annotation.label.color,
        bColor: annotation.label.bgColor,
        textColor: annotation.label.textColor,
        start: annotation.start,
        end: annotation.end,
      })),
    };
    const userType = localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
    const type = projectType;
    // Display confirmation popup
    if (
      window.confirm(
        "You are exiting the project. Your progress will be auto-saved."
      )
    ) {
      try {
        // Save progress to the backend
        const response = await axios.post(
          `http://127.0.0.1:8000/projects/${type}/${userType}/${projectName}/upload/`,
          { data2: dataToSend },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.ok);
        if (response.status == 200) {
          console.log("Progress saved successfully.");
        } else {
          console.error("Failed to save progress.");
        }
      } catch (error) {
        console.error("Error saving progress:", error);
      }

      // Clear content and related states
      setContent("");
      setLabels([]);
      setAnnotations([]);

      // Navigate to the project selection screen
      navigate("/home");
    }
  };

  // Add a button or trigger this function when navigating back to the project selection
  const handleNavigateBack = () => {
    handleExitProject();
  };
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Navbar />
        <div
          className={`flex-grow h-screen p-8 bg-gradient-to-r bg-gray-100 overflow-y-auto custom-scrollbar ${
            isDarkMode ? "bg-gray-900" : ""
          }`}
        >
          <div className="max-w-[74vw] mx-auto ">
            <h2
              className={`text-3xl font-bold mb-6 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              WorkSpace
            </h2>

            <div className="flex flex-col gap-4">
              <div
                className="bg-white p-4 rounded-lg shadow relative"
                onMouseUp={handleTextSelect}
              >
                <div
                  className="text-l font-semibold max-h-[calc(100vh-400px)] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  id="text-container"
                >
                  {renderContent()}
                </div>

                {selectedText && projectType === "ner_tagging" && (
                  <div className="mt-4">
                    <select
                      onChange={handleLabelChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      value=""
                    >
                      <option value="">Select a label</option>
                      {[...new Set(labels.map((label) => label.name))].map(
                        (uniqueLabel) => (
                          <option key={uniqueLabel} value={uniqueLabel}>
                            {uniqueLabel}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setEditMode(false); // Switch to create mode
                        setCurrentLabel(null); // Clear current label for creation
                        setModalOpen(true); // Open the modal
                      }}
                    >
                      + Create New Label
                    </button>
                  </div>
                )}
              </div>

              {renderNavigation()}
              {/* Submit Button */}
              <div className="flex justify-center  space-x-4">
                <button
                  onClick={handleSubmit}
                  className="mt-6 bg-green-700 text-white px-6 py-3 rounded-lg"
                >
                  Save Annotations
                </button>
                <CreateLabel
                  isOpen={isModalOpen}
                  onClose={() => setModalOpen(false)}
                  onCreateLabel={handleCreateLabel}
                  onUpdateLabel={handleUpdateLabel}
                  currentLabel={currentLabel}
                  editMode={editMode}
                />
                <button
                  onClick={handleNavigateBack}
                  className="mt-6 bg-red-700 text-white px-6 py-3 rounded-lg w-45 text-center"
                >
                  Exit Project
                </button>
                {projectType === "ner_tagging" && (
                  <button
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={handleAutoAnnotation}
                  >
                    Auto Annotate
                  </button>
                )}
              </div>

              {/* {projectType === "sentiment_analysis" && (
                  <div
                    className={`mt-6 p-6 rounded-lg shadow-lg transition-all duration-300 ${
                      isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                    }`}
                  >
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                      Sentiment Analysis Result
                    </h2>
                    {localStorage.getItem("sentimentResult") ? (
                      <div>
                        <p className="text-lg font-medium mb-2">Predicted Sentiments:</p>
                        <div className="flex flex-wrap gap-3">
                          {JSON.parse(localStorage.getItem("sentimentResult")).results.predicted_emotions.map(
                            (emotion, index) => (
                              <span
                                key={index}
                                className="px-4 py-2 rounded-md shadow-md transition-all duration-300 
                                bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold text-sm"
                              >
                                {emotion}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-lg">No result found</p>
                    )}
                  </div>
                )} */}

              {renderAnnotations()}

              <div className="mb-8 flex justify-center">
                {" "}
                {/* This div adds margin above the Footer and centers it */}
                <div className="max-w-md w-full">
                  {" "}
                  {/* Adjust the max-width as needed */}
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileContentDisplay;
