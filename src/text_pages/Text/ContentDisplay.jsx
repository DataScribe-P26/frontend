import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import textStore from "../../state/store/textData/combinedTextData.js";
import CreateEmotion from "./CreateEmotion.jsx";
import { useTheme } from "./ThemeContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { USER_TYPE } from "../../Main home/user-type.js";
import { useAuth } from "../../login/AuthContext.jsx";

const ContentDisplay = () => {
  const navigate = useNavigate();
  const {
    content,
    setContent,
    fileType,
    labels: emotions,
    setLabels: setEmotions,
    annotations: sentimentLabels,
    setAnnotations: setSentimentLabels,
    addAnnotation: addSentimentLabel,
    deleteAnnotation: deleteSentimentLabel,
    addLabel: addEmotion,
  } = textStore();

  const { isDarkMode } = useTheme();
  const { projectName } = useParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const { user } = useAuth();
  const [fetchedEmotions, setFetchedEmotions] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(() => {
    // Try to get saved index from localStorage on initial load
    const savedIndex = localStorage.getItem(`${projectName}-currentIndex`);
    return savedIndex ? parseInt(savedIndex, 0) : 0;
  });

  useEffect(() => {
    if (projectName) {
      localStorage.setItem(
        `${projectName}-currentIndex`,
        currentIndex.toString()
      );
    }
  }, [currentIndex, projectName]);

  const projectType = "sentiment_analysis";
  useEffect(() => {
    const fetchSentimentsAndEmotions = async () => {
      try {
        // Clear existing data when project changes - for new projects, this ensures clean state
        setEmotions([]);
        setSentimentLabels([]);

        const userType =
          localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;

        const response = await axios.get(
          `http://127.0.0.1:8000/get-annotations/${projectType}/${userType}/${projectName}`
        );

        if (
          response.data &&
          response.data.annotations &&
          response.data.annotations.length > 0
        ) {
          // Ensure it's an array before setting state
          const annotationsData = response.data.annotations[0].annotations;

          let processedContent = Array.isArray(annotationsData)
            ? annotationsData
            : Object.values(annotationsData);

          // Extract unique emotions from the content using a Set to prevent duplicates
          const uniqueEmotions = new Set();
          processedContent.forEach((item) => {
            if (item.emotion) {
              uniqueEmotions.add(item.emotion);
            }
          });

          // Add unique emotions to the emotions list - convert Set to Array
          const emotionsArray = Array.from(uniqueEmotions);
          const formattedEmotions = emotionsArray.map((emotionName) => ({
            name: emotionName,
          }));
          setEmotions(formattedEmotions);

          // Create sentiment labels for items that already have emotions
          const labels = [];
          processedContent.forEach((item, index) => {
            if (item.emotion) {
              const emotionObj = { name: item.emotion };
              labels.push({
                text: item.text,
                label: emotionObj,
                index: index,
              });
            }
          });

          setSentimentLabels(labels);
          setContent(processedContent);
          console.log("Loaded content and labels:", processedContent, labels);
        } else {
          console.log(
            "No annotations found for this project - might be a new project"
          );
          // For new projects, keep content that might already be set
          // but initialize empty emotions and sentiment labels
          if (!content || content.length === 0) {
            console.log("Setting empty content");
            setContent([]);
          }
        }
      } catch (error) {
        console.error("Error fetching sentiments:", error);
      }
    };

    fetchSentimentsAndEmotions();
  }, [projectName]);

  const handleCreateEmotion = (newEmotion) => {
    const isDuplicate = emotions.some(
      (emotion) => emotion.name === newEmotion.name
    );

    if (isDuplicate) {
      toast.error("Emotion name must be unique.");
      return;
    }
    console.log(newEmotion);
    addEmotion(newEmotion.name);
    setModalOpen(false);
  };

  const handleUpdateEmotion = (updatedEmotion) => {
    const isDuplicate = emotions.some(
      (emotion) =>
        emotion.name === updatedEmotion.name &&
        emotion.name !== currentEmotion.name
    );

    if (isDuplicate) {
      toast.error("Emotion name must be unique.");
      return;
    }

    const updatedEmotions = emotions.map((emotion) =>
      emotion.name === currentEmotion.name
        ? { ...emotion, name: updatedEmotion.name }
        : emotion
    );
    setEmotions(updatedEmotions);
    setEditMode(false);
    setModalOpen(false);
    setCurrentEmotion(null);
  };

  const handleEmotionChange = async (event) => {
    const emotionName = event.target.value;
    console.log(emotionName);
    setSelectedEmotion(emotionName);

    if (emotionName && content && content[currentIndex]) {
      // Find the emotion object
      const emotion = emotions.find((e) => e.name === emotionName) || {
        name: emotionName,
      };

      // Update the content with the selected emotion
      const updatedContent = [...content];
      updatedContent[currentIndex] = {
        ...updatedContent[currentIndex],
        emotion: emotionName,
      };
      setContent(updatedContent);

      // Check if this sentence already has a sentiment label
      const existingLabelIndex = sentimentLabels.findIndex(
        (label) => label.index === currentIndex
      );

      if (existingLabelIndex !== -1) {
        // Update existing sentiment label
        const updatedLabels = [...sentimentLabels];
        updatedLabels[existingLabelIndex] = {
          ...updatedLabels[existingLabelIndex],
          label: emotion,
        };
        setSentimentLabels(updatedLabels);
      } else {
        // Add new sentiment label
        const newSentimentLabel = {
          text: updatedContent[currentIndex].text,
          label: emotion,
          index: currentIndex,
        };

        try {
          addSentimentLabel(newSentimentLabel);
          setTimeout(() => {
            handleSubmit(updatedContent);
          }, 100);
          await handleSubmit(updatedContent);
        } catch (error) {
          console.error("Error submitting sentiment label:", error);
        }
      }
    }
  };

  const getCurrentSentimentEmotion = () => {
    // First check the content array
    if (content && content[currentIndex] && content[currentIndex].emotion) {
      return content[currentIndex].emotion;
    }

    // Then check sentiment labels
    const currentSentiment = sentimentLabels.find(
      (label) => label.index === currentIndex
    );
    return currentSentiment ? currentSentiment.label.name : "";
  };

  useEffect(() => {
    setSelectedEmotion(getCurrentSentimentEmotion());
  }, [currentIndex, sentimentLabels]);

  const renderContent = () => {
    if (!content || content.length === 0)
      return (
        <p className="text-gray-500 dark:bg-gray-700 dark:text-gray-100">
          No content to display
        </p>
      );

    // For sentiment analysis, display the current sentence
    return (
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-600 dark:text-gray-100">
        <p className="text-lg">
          {content[currentIndex]?.text || "No text available"}
        </p>
      </div>
    );
  };

  // Add this useEffect to handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Navigate to previous sentence with left arrow key
      if (event.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }

      // Navigate to next sentence with right arrow key
      if (
        event.key === "ArrowRight" &&
        content &&
        currentIndex < content.length - 1
      ) {
        setCurrentIndex(Math.min(content.length - 1, currentIndex + 1));
      }
    };

    // Add the event listener when component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Remove the event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, content]); // Re-add listener when these values change

  const renderNavigation = () => {
    if (!content || content.length <= 1) return null;

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
          Sentence {currentIndex + 1} of {content.length}
        </span>
        <button
          onClick={() => {
            setCurrentIndex(Math.min(content.length - 1, currentIndex + 1));
            handleSubmit();
          }}
          disabled={currentIndex === content.length - 1}
          className="bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  const handleSubmit = async (contentToSave = content) => {
    if (!contentToSave || contentToSave.length === 0) {
      console.warn("No content to save");
      return;
    }
    const currentContent = contentToSave || textStore.getState().content;
    const currentSentimentLabels = textStore.getState().annotations;

    console.log("Submitting content:", currentContent);
    console.log("Current sentiment labels:", currentSentimentLabels);

    let hasSuccess = false;
    let hasError = false;

    const requests = contentToSave.map(async (item) => {
      // Find emotion from sentimentLabels if it exists
      const sentimentLabel = sentimentLabels.find(
        (label) => label.text === item.text
      );
      const emotion = sentimentLabel ? sentimentLabel.label.name : item.emotion;
      const userType = localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
      // Skip API call if emotion is null or empty
      if (!emotion) return;

      try {
        await axios.post(
          `http://127.0.0.1:8000/annotate/${projectType}/${userType}`,
          null,
          {
            params: {
              project_name: projectName,
              text: item.text,
              emotion: emotion,
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        hasSuccess = true;
      } catch (error) {
        console.error(
          "Error submitting annotation:",
          error.response?.data || error.message
        );
        hasError = true;
      }
    });

    await Promise.all(requests); // Ensure all API calls are completed

    // Show only one toast message
    if (hasSuccess) toast.success("Sentiment labels saved successfully");
    if (hasError) toast.error("Some annotations failed to save");
  };

  // Add this helper function to calculate current progress percentage
  const calculateProgress = () => {
    if (!content || content.length === 0) return 0;

    const labeledCount = content.filter((item, index) => {
      return (
        item.emotion || sentimentLabels.some((label) => label.index === index)
      );
    }).length;

    return Math.round((labeledCount / content.length) * 100);
  };

  // Add this function to handle auto-annotation
  // Add this function to handle auto-annotation
  const handleAutoAnnotation = async () => {
    try {
      const userType = localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
      const response = await axios.post(
        `http://localhost:8000/train-model/${projectType}/${userType}/${projectName}`
      );
      console.log("Success:", response.data);
      alert("Model trained and missing emotions predicted successfully!");
    } catch (error) {
      console.error(
        "API call failed:",
        error.response?.data?.message || error.message
      );
      alert(
        `Error: ${error.response?.data?.message || "Something went wrong."}`
      );
    }
  };

  const handleExitProject = async () => {
    // Same structure as handleSubmit but with confirmation
    const dataToSend = {
      text: content
        ? content.map((item, index) => {
            const sentimentLabel = sentimentLabels.find(
              (label) => label.index === index
            );
            const emotion = sentimentLabel
              ? sentimentLabel.label.name
              : item.emotion;

            return {
              text: item.text,
              emotion: emotion,
            };
          })
        : [],
    };

    const userType = localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;

    // Display confirmation popup
    if (
      window.confirm(
        "You are exiting the project. Your progress will be auto-saved."
      )
    ) {
      try {
        // Save progress to the backend
        const response = await axios.post(
          `http://127.0.0.1:8000/projects/${projectType}/${userType}/${projectName}/upload/`,
          { data2: dataToSend },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          console.log("Progress saved successfully.");
        } else {
          console.error("Failed to save progress.");
        }
      } catch (error) {
        console.error("Error saving progress:", error);
      }

      // Clear content and related states
      setContent([]);
      setEmotions([]);
      setSentimentLabels([]);

      // Navigate to the project selection screen
      navigate("/home");
    }
  };

  const renderSummary = () => {
    if (!content || content.length === 0) return null;

    // Count occurrences of each emotion from both content and sentimentLabels
    const emotionCounts = {};

    // First count from sentimentLabels
    sentimentLabels.forEach((label) => {
      const emotion = label.label.name;
      if (emotion) {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      }
    });

    // Then count from content (for items not in sentimentLabels)
    content.forEach((item, index) => {
      if (
        !sentimentLabels.some((label) => label.index === index) &&
        item.emotion
      ) {
        emotionCounts[item.emotion] = (emotionCounts[item.emotion] || 0) + 1;
      }
    });
    const labeledCount = content.filter((item, index) => {
      return (
        item.emotion || sentimentLabels.some((label) => label.index === index)
      );
    }).length;

    return (
      <div className="mt-4 p-4 bg-white rounded-lg shadow dark:bg-gray-700 dark:text-gray-100">
        <h3 className="text-xl font-semibold mb-2">Sentiment Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(emotionCounts).map(([emotion, count]) => (
            <div
              key={emotion}
              className="p-2 bg-gray-100 rounded-lg flex justify-between dark:text-gray-100 dark:bg-gray-600"
            >
              <span>{emotion}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-100">
            Progress: {labeledCount} of {content.length} sentences labeled (
            {Math.round((labeledCount / content.length) * 100)}%)
          </p>
        </div>
      </div>
    );
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
          <div className="max-w-[74vw] mx-auto">
            <h2
              className={`text-3xl font-bold mb-6 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Sentiment Analysis Workspace
            </h2>

            <div className="flex flex-col gap-4">
              {/* Main content area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Text display panel */}
                <div className="bg-white p-6 rounded-lg shadow relative dark:bg-gray-700 dark:text-gray-100">
                  <h3 className="text-xl font-semibold mb-4">Text</h3>
                  <div className="min-h-[200px] ">{renderContent()}</div>
                </div>

                {/* Sentiment selection panel */}
                <div className="bg-white p-6 rounded-lg shadow relative dark:bg-gray-700 dark:text-gray-100">
                  <h3 className="text-xl font-semibold mb-4">
                    Assign Sentiment
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:bg-gray-700 dark:text-gray-100">
                      Select emotion for this text:
                    </label>
                    <select
                      onChange={handleEmotionChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 hover:border-purple-500"
                      value={selectedEmotion}
                    >
                      <option value="">Select an emotion</option>
                      {emotions.map((emotion) => (
                        <option key={emotion.name} value={emotion.name}>
                          {emotion.name}
                        </option>
                      ))}
                    </select>
                              
                  </div>

                  <button
                    className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => {
                      setEditMode(false); // Switch to create mode
                      setCurrentEmotion(null); // Clear current emotion for creation
                      setModalOpen(true); // Open the modal
                    }}
                  >
                    + Create New Emotion
                  </button>
                </div>
              </div>

              {renderNavigation()}
              {renderSummary()}

              {/* Action buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleSubmit()}
                  className="mt-6 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
                >
                  Save Sentiment Labels
                </button>

                <button
                  onClick={handleAutoAnnotation}
                  disabled={calculateProgress() < 10}
                  className={`mt-6 px-6 py-3 rounded-lg transition-colors ${
                    calculateProgress() >= 10
                      ? "bg-blue-700 text-white hover:bg-blue-800"
                      : "bg-blue-300 text-gray-100 cursor-not-allowed opacity-50"
                  }`}
                  title={
                    calculateProgress() < 10
                      ? "Complete at least 10% annotations to unlock"
                      : "Auto-annotate remaining sentences"
                  }
                >
                  Auto Annotation
                </button>

                <CreateEmotion
                  isOpen={isModalOpen}
                  onClose={() => setModalOpen(false)}
                  onCreateEmotion={handleCreateEmotion}
                  onUpdateEmotion={handleUpdateEmotion}
                  currentEmotion={currentEmotion}
                  editMode={editMode}
                />

                <button
                  onClick={handleNavigateBack}
                  className="mt-6 bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
                >
                  Exit Project
                </button>
              </div>

              <div className="mb-8 flex justify-center">
                <div className="max-w-md w-full">
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

export default ContentDisplay;
