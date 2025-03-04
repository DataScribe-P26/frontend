import React, { useEffect, useState, useRef } from "react";
import ImageUpload from "../image upload and display/Imageupload";
import useStore from "../../../state/Alldata";
import { useParams } from "react-router-dom";
import Spinner from "./loading_screen";
import { Bar } from "react-chartjs-2";
import Navbar from "../../ImageNavbar.jsx";
import { useTheme } from "../../../text_pages/Text/ThemeContext.jsx";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { USER_TYPE } from "../../../Main home/user-type.js";
import { Sidebar } from "./ImageSidebar.jsx";
import { useUser } from "../../../pages/Profile.jsx";
import HomePage from "../../../pages/Hero";
import ProjectsPage from "../../../pages/Projects.jsx";
import OrganizationsPage from "../../../pages/Organisation.jsx";
import { Profile } from "../../../pages/Profile.jsx";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  annotationPlugin,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function Analysis({ set_analysis_page, isCollapsed, setIsCollapsed }) {
  const [activeTab, setActiveTab] = useState("Workspace");
  const [uploadProgress, setUploadProgress] = useState(0);

  const { projectName } = useParams();
  const {
    imageSrc,
    toggleAutoAnnotation,
    all_annotations,
    add_classes,
    classes,
    project_name,
    created_on,
    autoAnnotation,
    loadAutoAnnotation,
    threshold,
    setThreshold,
    loadThreshold,
    set_allAnnotations,
    setprojectname,
  } = useStore();
  const [initialBatchProcessed, setInitialBatchProcessed] = useState(false);

  const { isDarkMode } = useTheme();

  const [annotations, setAnnotations] = useState(all_annotations);

  const classesAddedRef = useRef(false);

  if (project_name === "") {
    setprojectname(projectName);
  }

  useEffect(() => {
    loadAutoAnnotation(project_name);
    const userType = localStorage.getItem("userType");
    console.log("Current User Type:", userType);
  }, [project_name]);

  useEffect(() => {
    loadAutoAnnotation(project_name);
  }, [project_name]);

  useEffect(() => {
    loadAutoAnnotation(projectName);
    loadThreshold(projectName);
  }, [projectName, loadAutoAnnotation, loadThreshold]);

  const date = new Date(created_on);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedDate = `${date.getDate().toString().padStart(2, "0")} ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()}`;

  useEffect(() => {
    setAnnotations(all_annotations);
  }, [all_annotations, set_allAnnotations]);

  const classes_used = [];
  const totalImages = annotations?.length || 0;
  let imagesAnnotated = 0;

  annotations?.forEach((annotation) => {
    const { annotations: annotationList } = annotation;

    if (annotationList.length > 0) {
      imagesAnnotated++;
    }

    annotationList?.forEach(({ class_name, Color }) => {
      if (class_name) {
        const existingClass = classes_used?.find(
          (item) => item.class_name.toLowerCase() === class_name.toLowerCase()
        );
        if (existingClass) {
          existingClass.count++;
        } else {
          classes_used.push({ class_name, Color, count: 1 });
        }
      }
    });
  });

  useEffect(() => {
    if (!classesAddedRef.current) {
      classes_used?.forEach((clas) => {
        const newClass = clas.class_name;
        const newcolor = clas.Color;
        if (newClass !== null && newClass !== "") {
          const exists = classes?.some(
            (existingClass) =>
              existingClass.class_label.toLowerCase() === newClass.toLowerCase()
          );
          if (!exists) {
            add_classes(newClass, newcolor);
          }
        }
      });
      classesAddedRef.current = true;
    }
  }, [classes_used, add_classes, classes]);

  // Calculate the average count of annotations
  const totalClassCount = classes_used.reduce(
    (acc, curr) => acc + curr.count,
    0
  );
  const avgClassCount = totalClassCount / classes_used.length;
  // Determine if classes are balanced or imbalanced
  const classStatus = classes_used.map((item) => {
    const deviation = Math.abs(item.count - avgClassCount);
    const percentageDeviation = (deviation / avgClassCount) * 100;
    const status = percentageDeviation < 20 ? "Balanced" : "Imbalanced";
    return { ...item, status };
  });

  // Calculate the average count of balanced classes
  const balancedClasses = classStatus.filter(
    (item) =>
      item.status === "Balanced" ||
      item.status === "Imbalanced" ||
      item.status === "Overvalanced" ||
      item.status === "Underbalanced"
  );
  const balancedAverage =
    balancedClasses.reduce((acc, curr) => acc + curr.count, 0) /
    balancedClasses.length;

  // Sort the classes by count
  const sorted_class = classStatus.sort((a, b) => b.count - a.count);

  const imagesWithoutAnnotation = totalImages - imagesAnnotated;
  const [loading, setloading] = useState(false);

  const categorizedClasses = classStatus.map((item) => {
    if (item.status === "Balanced") {
      if (item.count === balancedAverage) {
        return { ...item, balanceType: "Balanced" };
      } else if (item.count > balancedAverage) {
        return { ...item, balanceType: "Overbalanced" };
      } else {
        return { ...item, balanceType: "Underbalanced" };
      }
    }
    return { ...item, balanceType: "Imbalanced" };
  });

  // Updated chart options with annotation
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "top",
        color: isDarkMode ? "#E5E7EB" : "#1f2937",
        font: {
          size: 11,
        },
        formatter: (value) => value,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Count: ${tooltipItem.raw}`,
        },
        backgroundColor: isDarkMode ? "#1f2937" : "#fff",
        titleColor: isDarkMode ? "#E5E7EB" : "#1f2937",
        bodyColor: isDarkMode ? "#E5E7EB" : "#1f2937",
        borderColor: isDarkMode ? "#E5E7EB" : "#1f2937",
        borderWidth: 1,
      },
      annotation: {
        annotations: {
          averageLine: {
            type: "line",
            yMin: balancedAverage,
            yMax: balancedAverage,
            borderColor: "green",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: `Avg Balanced (${balancedAverage.toFixed(1)})`,
              enabled: true,
              position: "end",
              color: isDarkMode ? "#E5E7EB" : "#1f2937",
              backgroundColor: "rgba(0,0,0,0.5)",
              font: {
                size: 12,
              },
            },
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? "#D1D5DB" : "#4b5563",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          borderDash: [5, 5],
          color: isDarkMode ? "#374151" : "#e5e7eb",
        },
        ticks: {
          color: isDarkMode ? "#D1D5DB" : "#4b5563",
          font: {
            size: 11,
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutCubic",
    },
  };

  // Updated chart data
  const chartData = {
    labels: categorizedClasses.map((item) => item.class_name),
    datasets: [
      {
        label: "Count",
        data: categorizedClasses.map((item) => item.count),
        backgroundColor: categorizedClasses.map((item) => item.Color),
      },
    ],
  };
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage isCollapsed={isCollapsed} />;
      case "profile":
        return <Profile />;
      case "organizations":
        return <OrganizationsPage />;
      case "projects":
        return <ProjectsPage setActiveTab={setActiveTab} />;
      case "Workspace":
        return;
      default:
        return <ProjectsPage />;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-white dark:bg-gray-900">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <div
          className={`flex-1 transition-all duration-300 ${
            isCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          <Navbar />
          {renderContent()}

          <div
            className={`w-full h-screen overflow-y-auto image_scrollbar px-8 py-4 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
            }`}
          >
            {/* Project Header */}
            <div className="flex items-center space-x-6 mb-10">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-purple-500 dark:border-purple-400">
                <img
                  src={all_annotations[0]?.image_id}
                  className="w-full h-full object-cover"
                  alt="Project thumbnail"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-300">
                  {project_name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Created on {formattedDate}
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Class Statistics */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-1 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">Class Statistics</h2>
                    <div className="relative group ml-2">
                      <HiOutlineQuestionMarkCircle className="text-gray-500 dark:text-gray-400" />
                      <div className=" h-20 mt-14 left-[60%] absolute z-20 hidden group-hover:block px-4 py-2 text-xs text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-700 rounded-lg shadow-lg -translate-y-10  top-0 w-72 transition-all duration-200 opacity-0 group-hover:opacity-100">
                        <p className="mb-1">
                          • The graph shows each class and its count.
                        </p>
                        <p>
                          • Dotted green line represents a median line which
                          indicates the average class balance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {sorted_class.length > 0 ? (
                    <>
                      <div className="mb-6 h-72">
                        <Bar data={chartData} options={chartOptions} />
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                            Class Insights
                          </h3>
                          <div className="relative group ml-2">
                            <HiOutlineQuestionMarkCircle className="text-gray-500 dark:text-gray-400 cursor-pointer" />
                            <div className="absolute z-20 hidden group-hover:block px-4 py-2 text-xs text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-700 rounded-lg shadow-lg translate-x-1/5 -translate-y-full left-1/2 top-0 w-64 transition-all duration-200 opacity-0 group-hover:opacity-100">
                              <p className="mb-1">
                                • Balanced: Near the median.
                              </p>
                              <p className="mb-1">
                                • Underbalanced: Below the median.
                              </p>
                              <p className="mb-1">
                                • Overbalanced: Above the median.
                              </p>
                              <p>• Imbalanced: Far from median.</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categorizedClasses.map((item) => (
                            <div
                              key={item.class_name}
                              className="flex items-center text-sm"
                            >
                              <span
                                className="inline-block w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                style={{ backgroundColor: item.Color }}
                              ></span>
                              <span className="font-medium">
                                {item.class_name}:
                              </span>
                              <span className="ml-1 text-gray-600 dark:text-gray-300">
                                {item.count} annotations
                              </span>
                              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600">
                                {item.balanceType}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <svg
                        className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        ></path>
                      </svg>
                      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        No Annotations Done Yet.
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Start annotating your images to see class statistics.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Image Statistics & Controls */}
              <div className="space-y-6">
                {/* Image Statistics Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-1 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold">
                        Image Statistics
                      </h2>
                      <div className="relative group ml-2">
                        <HiOutlineQuestionMarkCircle className="text-gray-500 dark:text-gray-400" />
                        <div className=" h-20 mt-14 left-[60%] absolute z-20 hidden group-hover:block px-4 py-2 text-xs text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-700 rounded-lg shadow-lg -translate-y-10  top-0 w-72 transition-all duration-200 opacity-0 group-hover:opacity-100">
                          <p className="mb-1">
                            • Displays the total number of images.
                          </p>
                          <p>• Tracks annotated vs unannotated images.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div className="flex flex-col items-center">
                          <div className="text-blue-600 dark:text-blue-400 text-3xl font-bold mb-2">
                            {totalImages}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                            Images Uploaded
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <div className="flex flex-col items-center">
                          <div className="text-green-600 dark:text-green-400 text-3xl font-bold mb-2">
                            {imagesAnnotated}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                            Images Annotated
                          </div>
                        </div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                        <div className="flex flex-col items-center">
                          <div className="text-red-600 dark:text-red-400 text-3xl font-bold mb-2">
                            {imagesWithoutAnnotation}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                            Without Annotation
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Section FIRST followed by Auto Annotation Section - Horizontal Layout */}
                <div className="grid grid-cols-5 gap-6 ">
                  {/* Upload Section - FIRST (3 columns) */}
                  <div className="col-span-3  bg-white dark:bg-purple-900/20 rounded-xl shadow-md overflow-hidden ">
                    <div className="p-4">
                      {loading ? (
                        <div className="flex justify-center py-4">
                          <Spinner />
                        </div>
                      ) : (
                        <ImageUpload
                          projectName={projectName}
                          loading={loading}
                          setloading={setloading}
                          uploadProgress={uploadProgress}
                          setUploadProgress={setUploadProgress}
                          setInitialBatchProcessed={setInitialBatchProcessed}
                        />
                      )}
                    </div>
                  </div>

                  {/* Auto Annotation - SECOND (2 columns) */}
                  <div className="col-span-2 bg-white dark:bg-purple-900/20 rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">Auto Annotation</h2>
                        <button
                          onClick={() => toggleAutoAnnotation(projectName)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            autoAnnotation
                              ? "bg-green-600"
                              : "bg-gray-400 dark:bg-gray-600"
                          }`}
                          role="switch"
                          aria-checked={autoAnnotation}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              autoAnnotation ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      {!autoAnnotation ? (
                        <div className="text-sm text-purple-600 mb-2 dark:text-gray-100">
                          <p>
                            Want to kickstart auto annotation? Set the
                            threshold, and let the magic happen!
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-3 rounded-lg shadow-md dark:bg-purple-900/20 bg-purple-600">
                          <label className="block text-sm font-medium text-gray-100 dark:text-gray-200 mb-2 text-center">
                            Set Threshold Value
                          </label>
                          <input
                            id="threshold"
                            type="number"
                            value={threshold}
                            onChange={(e) =>
                              setThreshold(projectName, e.target.value)
                            }
                            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 text-black dark:text-white bg-white dark:bg-purple-600 sm:text-sm text-center"
                            placeholder="Adjust threshold"
                          />
                        </div>
                      )}

                      {/* Continue Button - Below Auto Annotation */}
                      {imageSrc.length > 0 && (
                        <div className="flex justify-center mt-6">
                          <button
                            className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300 ease-in-out flex items-center gap-2"
                            onClick={() => {
                              set_analysis_page(false);
                              setIsCollapsed(true);
                            }}
                          >
                            <span>Continue</span>
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Analysis;
