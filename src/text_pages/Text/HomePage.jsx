import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import textStore from "../zustand/Textdata";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useTheme } from "../../text_pages/Text/ThemeContext.jsx";
import axios from "axios";
import { USER_TYPE } from "../../Main home/user-type.js";
import { useAuth } from "../../login/AuthContext.jsx";
const HomePage = () => {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Changed to boolean
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
   const { user } = useAuth();

  useEffect(() => {
    const fetchAnnotationsAndLabels = async () => {
      try {
        setLoading(true);
        setContent(null);
        // Clear existing data when project changes
        setLabels([]);
        setAnnotations([]);
        const userType = localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
        console.log('current user is',userType);
        let user_type='single';
        const response = await axios.get(
          `http://127.0.0.1:8000/projects/ner_tagging/${userType}/${projectName}/${user.email}`
        );

        if (response.data?.[0]) {
          setContent(response.data[0].text || null);

          if (response.data[0].entities?.length) {
            // Create unique labels using Map
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
        setLoading(false);
      }
    };

    fetchAnnotationsAndLabels();
  }, [projectName]);

  const handleStartAnnotation = () => {
    if (content) {
      navigate(`/text/${projectName}/filecontentdisplay`);
    } else {
      navigate(`/combined-file-content/${projectName}`);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen overflow-hidden ${
        isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-r from-gray-100 to-gray-150 text-gray-800"
      }`}
    >
      <Navbar />
      {loading ? (
        <div className="text-center py-8">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
              isDarkMode ? "border-green-400" : "border-indigo-600"
            }`}
          ></div>
          <p
            className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Loading project...
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-grow">
            <Sidebar />
            <main className="flex-grow flex flex-col justify-between p-8">
              <div className="flex flex-col items-center mb-8 flex-grow">
                <h2
                  className={`text-4xl font-bold mb-6 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Welcome to the {projectName} Project
                </h2>
                <p
                  className={`text-lg mb-8 text-center ${
                    isDarkMode ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Use the options in the sidebar to manage datasets and labels
                  for your text annotation tasks related to {projectName}.
                </p>
                <p
                  className={`text-gray-500 mb-8 text-center ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Get started by selecting a dataset or creating a label!
                </p>
                <div className="mt-4 mb-96">
                  <button
                    className={`${
                      isDarkMode
                        ? "bg-purple-500 hover:bg-purple-400"
                        : "bg-purple-700 hover:bg-purple-600"
                    } text-white px-6 py-2 rounded-lg transition-shadow shadow-lg`}
                    onClick={handleStartAnnotation}
                  >
                    Start Annotation
                  </button>
                </div>
                <div className="mt-70">
                  <Footer />
                </div>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
