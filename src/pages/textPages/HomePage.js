import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import textStore from "../../state/store/textData/combinedTextData";
import Navbar from "./Navbar";
import Sidebar from "../../components/textProject/modals/Sidebar";
import Footer from "../../components/textProject/modals/Footer";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import { USER_TYPE } from "../../constants/user-type";
import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const projectType = localStorage.getItem("projectType");

  const {
    content,
    setContent,
    fileType,
    labels,
    emotions,
    setLabels,
    setEmotions,
    annotations,
    sentimentLabels,
    setAnnotations,
    setSentimentLabels,
    addAnnotation,
    addSentimentLabel,
    deleteAnnotation,
    deleteSentimentLabel,
    addLabel,
    addEmotion,
  } = textStore();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    // Trigger entrance animation after mount
    setIsVisible(true);

    const fetchAnnotationsAndLabels = async () => {
      try {
        setLoading(true);
        setContent(null);
        if (projectType === "ner_tagging") {
          setLabels([]); // ✅ Use setLabels for NER
          setAnnotations([]);
        } else if (projectType === "sentiment_analysis") {
          setEmotions([]); // ✅ Use setEmotions for Sentiment Analysis
          setSentimentLabels([]);
        }
        const userType =
          localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
        let response;
        if (projectType === "ner_tagging") {
          response = await axios.get(
            `http://127.0.0.1:8000/projects/ner_tagging/${userType}/${projectName}/${user.email}`
          );

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
        } else if (projectType === "sentiment_analysis") {
          const userType =
            localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
          // response = await axios.get(
          //   `http://127.0.0.1:8000/projects/sentiment_analysis/${userType}/${projectName}/${user.email}`
          // );
          response = await axios.get(
            `http://127.0.0.1:8000/get-annotations/${projectType}/${userType}/${projectName}`
          );

          if (response.data && response.data.annotations) {
            const here = response.data.annotations[0].annotations;

            let processedContent = Array.isArray(here)
              ? here
              : Object.values(here);

            setContent(processedContent);
            // if (response.data[0].annotations) {
            //   if (fileType === "csv" || fileType === "jsonl") {
            //     try {
            //       const parsedContent =
            //         typeof response.data[0].text === "string"
            //           ? JSON.parse(response.data.annotations[0].annotations)
            //           : response.data.annotations[0].annotations;
            //       console.log("lol",parsedContent);
            //       setContent(parsedContent);
            //       console.log(content);
            //     } catch (e) {
            //       console.error("Error parsing content:", e);
            //       setContent([response.data[0].text]);
            //     }
            //   } else {
            //     setContent([response.data[0]]);
            //     console.log("here");
            //   }
            // }

            // if (response.data[0].sentiments?.length) {
            //   const emotionMap = new Map();
            //   response.data[0].sentiments.forEach((sentiment) => {
            //     if (!emotionMap.has(sentiment.emotion)) {
            //       emotionMap.set(sentiment.emotion, {
            //         name: sentiment.emotion,
            //       });
            //     }
            //   });

            //   setEmotions(Array.from(emotionMap.values()));

            //   const uniqueSentiments = Array.from(
            //     new Set(
            //       response.data[0].sentiments.map((sentiment) =>
            //         JSON.stringify({
            //           text: sentiment.text,
            //           label: {
            //             name: sentiment.emotion,
            //           },
            //           index: sentiment.index || currentIndex,
            //         })
            //       )
            //     )
            //   ).map((str) => JSON.parse(str));

            //   setSentimentLabels(uniqueSentiments);
            // }
          }
        }
      } catch (error) {
        console.error("Error fetching annotations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnotationsAndLabels();
  }, [projectName]);

  const handleStartAnnotation = () => {
    if (content) {
      if (projectType == "sentiment_analysis") {
        navigate(`/text/${projectName}/contentdisplay`);
      } else {
        navigate(`/text/${projectName}/filecontentdisplay`);
      }
    } else {
      navigate(`/combined-file-content/${projectName}`);
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-r from-gray-100 to-gray-150 text-gray-800"
      }`}
    >
      <div className="flex h-screen overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <div
          className={`flex flex-col flex-1 transition-all duration-300 ${
            isCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          <Navbar />

          {loading ? (
            <div className="flex items-center justify-center flex-grow">
              <div className="text-center">
                <div
                  className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
                    isDarkMode ? "border-green-400" : "border-indigo-600"
                  }`}
                ></div>
                <p
                  className={`mt-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Loading project...
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto">
              <main className="flex flex-col p-8 h-full">
                <div
                  className={`flex flex-col items-center max-w-4xl mx-auto w-full transform transition-all duration-1000 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                >
                  <h2
                    className={`text-4xl font-bold mb-6 text-center transform transition-all duration-700 delay-300 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    } ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
                  ></h2>
                  <p
                    className={`text-lg mb-8 text-center transform transition-all duration-700 delay-500 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    } ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}
                  >
                    Use the options in the sidebar to manage datasets and labels
                    for your text annotation tasks related to {projectName}.
                  </p>
                  <p
                    className={`text-center mb-8 transform transition-all duration-700 delay-700 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    } ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Get started by selecting a dataset or creating a label!
                  </p>
                  <div
                    className={`mt-4 transform transition-all duration-700 delay-1000 ${
                      isVisible
                        ? "translate-y-0 opacity-100 scale-100"
                        : "translate-y-4 opacity-0 scale-95"
                    }`}
                  >
                    <button
                      className={`${
                        isDarkMode
                          ? "bg-purple-500 hover:bg-purple-400"
                          : "bg-purple-700 hover:bg-purple-600"
                      } text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105`}
                      onClick={handleStartAnnotation}
                    >
                      Start Annotation
                    </button>
                  </div>
                </div>
              </main>

              <div
                className={`mt-auto transform transition-opacity duration-700 delay-1000 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <Footer />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
