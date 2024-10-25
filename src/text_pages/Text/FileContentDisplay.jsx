import React, { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import Navbar from "./Navbar"; 
import Sidebar from "./Sidebar"; 
import Footer from "./Footer"; 
import textStore from "../zustand/Textdata";
import CreateLabel from "./CreateLabel.jsx";
import axios from "axios";

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedText, setSelectedText] = useState("");
  const { projectName } = useParams();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(null);
 
  const [fetchedLabels, setFetchedLabels] = useState(false);

  const handleCreateLabel = (newLabel) => {
    const isDuplicate = labels.some((label) => label.name === newLabel.name);

    if (isDuplicate) {
      toast.error("Label Name must be unique.");
      return;
    }
    console.log(newLabel)
    addLabel(newLabel.name);
  };

  const handleUpdateLabel = (updatedLabel) => {
    const isDuplicate = labels.some(
      (label) =>
        label.name === updatedLabel.name && label.name !== currentLabel.name
    );

    if (isDuplicate) {
     toast.error ("Label Name must be unique.");
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
  
    // Get the text container by ID (ensure this ID matches the correct element)
    const textContainer = document.getElementById('text-container');
    
    // Ensure the container exists before proceeding
    if (!textContainer) {
      console.error("Text container not found!");
      return;
    }
  
    if (selectedText) {
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer;
  
      const start = calculateOffsetFromStart(textContainer, startContainer, range.startOffset);
      const end = start + selectedText.length;
  
      setSelectedText({
        text: selectedText,
        start: start,
        end: end,
      });
  
      console.log("Start: ", start, " End: ", end);
    } else {
      setSelectedText("");
    }
  };
  
// Function to calculate the offset of the selected node with respect to the container's text, accounting for line breaks
const calculateOffsetFromStart = (textContainer, startContainer, startOffset) => {
  const walker = document.createTreeWalker(textContainer, NodeFilter.SHOW_TEXT, null, false);
  let offset = 0;
  let currentNode;
  
  // Walk through the text nodes and accumulate their lengths until the startContainer is found
  while ((currentNode = walker.nextNode())) {
    if (currentNode === startContainer) {
      // Add the current startOffset within this node
      offset += startOffset;
      break;
    }
    
    // Count the number of newlines in the current node
    const lineBreaks = (currentNode.nodeValue.match(/\n/g) || []).length;
    // Add the current node's length to the offset
    offset += currentNode.nodeValue.length + lineBreaks; // Include the line breaks as part of the offset
  }
  
  return offset;  // Return the total offset
};

useEffect(() => {
  const fetchAnnotationsAndLabels = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/projects/${projectName}/ner/full-text`);
      
      // If there is content from the response
      if (response.data && response.data.length > 0) {
        // Set content if it's different
        if (!content || content !== response.data[0].text) {
          setContent(response.data[0].text);
        }

        // Handle labels and annotations merging
        if (response.data[0].entities && response.data[0].entities.length > 0) {
          // Merge fetched labels with existing ones, ensuring no duplicates
          const fetchedLabels = response.data[0].entities.map(entity => ({
            name: entity.label,
            color: entity.color,
            bgColor: entity.bColor,
            textColor: entity.textColor,
          }));

          const uniqueLabels = [
            ...labels,
            ...fetchedLabels.filter(
              (newLabel) => !labels.some((label) => label.name === newLabel.name)
            ),
          ];

          setLabels(uniqueLabels);

          // Merge fetched annotations with existing ones
          const fetchedAnnotations = response.data[0].entities.map((entity) => ({
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
          }));

          const uniqueAnnotations = [
            ...annotations,
            ...fetchedAnnotations.filter(
              (newAnnotation) => !annotations.some(
                (annotation) =>
                  annotation.text === newAnnotation.text &&
                  annotation.start === newAnnotation.start &&
                  annotation.end === newAnnotation.end
              )
            ),
          ];

          setAnnotations(uniqueAnnotations);
        }
      }
    } catch (error) {
      console.error("Error fetching annotations:", error);
    }
  };

  fetchAnnotationsAndLabels();
}, [projectName]);



  const handleLabelChange = (event) => {
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

      addAnnotation(newAnnotation);
      setSelectedText("");
    }
  };

  const colorizeText = (text) => {
    let result = "";
    let lastIndex = 0;
  
    // Sort annotations by start position to avoid overlapping issues
    const sortedAnnotations = annotations
      .filter((annotation) => fileType === "text" || annotation.index === currentIndex)
      .sort((a, b) => a.start - b.start);
  
    sortedAnnotations.forEach((annotation) => {
      // Append the text before the annotation
      result += text.slice(lastIndex, annotation.start)
        .replace(/\n/g, "<br>")
        .replace(/\s/g, "&nbsp;");
  
      // Add the highlighted annotation text
      result += `<span style="background-color: ${annotation.label.bgColor}; color: ${annotation.label.textColor}; display: inline;">${text.slice(annotation.start, annotation.end)
        .replace(/\n/g, "<br>")
        .replace(/\s/g, "&nbsp;")}</span>`;
  
      // Update the lastIndex to the end of the current annotation
      lastIndex = annotation.end;
    });
  
    // Append any remaining text after the last annotation
    result += text.slice(lastIndex)
      .replace(/\n/g, "<br>")
      .replace(/\s/g, "&nbsp;");
  
    return result;
  };  
  
  
  
  const renderContent = () => {
    if (!content) return null;

    if (fileType === "text") {
      const textContent = typeof content === "string" ? content : content.join("\n");
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
      // Use reduce to filter out duplicate annotations by their text property
    const uniqueAnnotations = annotations.reduce((unique, current) => {
      // Check if the annotation text already exists in the unique array
      if (!unique.some((annotation) => annotation.text === current.text)) {
        unique.push(current); // If not, add it
      }
      return unique;
    }, []);

    const filteredAnnotations = uniqueAnnotations.filter(
      (annotation) => fileType === "text" || annotation.index === currentIndex
    );

    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow ">
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
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/annotate/${projectName}/ner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Server responded with an error:", errorResponse);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };  
  
  return (
    <div className="flex flex-col h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <Navbar /> {/* Add Navbar */}
      <div className="flex flex-grow">
        <Sidebar /> {/* Add Sidebar */}
        <div className="flex-grow p-8 bg-gradient-to-r from-gray-100 to-gray-150 overflow-y-auto custom-scrollbar">          
          <div className="max-w-[74vw] mx-auto">
            <h2 className="text-3xl font-bold mb-6">File Content Display</h2>

           

            <div className="flex flex-col gap-4">
              <div
                className="bg-white p-4 rounded-lg shadow relative"
                onMouseUp={handleTextSelect}
              >
                
                <div className="text-l font-semibold max-h-[calc(100vh-400px)] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"  id="text-container">
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
              {renderAnnotations()}

              {/* Submit Button */}
              <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="mt-6 bg-green-700 text-white px-6 py-3 rounded-lg"
              >
                Submit Annotations
              </button>
                <CreateLabel
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              onCreateLabel={handleCreateLabel}
              onUpdateLabel={handleUpdateLabel}
              currentLabel={currentLabel}
              editMode={editMode}
            />
              </div>
              <div className="mb-8 flex justify-center"> {/* This div adds margin above the Footer and centers it */}
  <div className="max-w-md w-full"> {/* Adjust the max-width as needed */}
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