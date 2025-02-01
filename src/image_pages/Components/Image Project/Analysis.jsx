import React, { useEffect, useState, useRef } from "react";
import ImageUpload from "../image upload and display/Imageupload";
import useStore from "../../../Zustand/Alldata";
import { useParams } from "react-router-dom";
import Spinner from "./loading_screen";
import { Bar } from "react-chartjs-2";
import ImageNavbar from "../../ImageNavbar.jsx";
import { useTheme } from "../../../text_pages/Text/ThemeContext.jsx";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

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

function Analysis({ set_analysis_page }) {
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
  const { isDarkMode } = useTheme();

  const [annotations, setAnnotations] = useState(all_annotations);

  const classesAddedRef = useRef(false);

  if (project_name === "") {
    setprojectname(projectName);
  }

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
    (item) => item.status === "Balanced"
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
  return (
    <>
      <ImageNavbar />
      <div
        className={`w-full  h-screen overflow-y-auto image_scrollbar  px-12 pt-2 pb-28 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="mt-8 flex justify-between gap-12">
          {/* Class Statistics Section */}
          <div className="flex-1">
            <div className="flex flex-row justify-left gap-10 items-center ">
              <div className="w-[100px] h-[100px] rounded-full">
                <img
                  src={all_annotations[0]?.image_id}
                  className="w-full h-full rounded-full"
                />
              </div>
              <div>
                <div className="text-3xl font-bold">{project_name}</div>
                <div className="">Created on {formattedDate}</div>
              </div>
            </div>
            <div className="relative group pt-10">
              <div className="relative flex items-center text-2xl font-semibold mb-4 group">
                Class Statistics
                <HiOutlineQuestionMarkCircle className="ml-2" />
                {/* Tooltip Popup */}
                <div className=" absolute z-10  group-hover:block px-8 py-2 text-xs font-normal text-gray-900 bg-gray-200 border border-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 top-[-60px] left-[30%] transform -translate-x-[5%] max-w-[1600px] w-auto flex flex-row">
                  <p>• The graph shows each class and its count.</p>
                  <p>
                    • Dotted green line represents a median line which indicates
                    the average class balance.
                  </p>
                </div>
              </div>
            </div>

            {sorted_class.length > 0 ? (
              <div className="w-full animate-scaleUp">
                <Bar data={chartData} options={chartOptions} />
                <div className="mt-4 p-4 text-gray-500 bg-gray-100 rounded-lg shadow">
                  <h4 className="flex items-center font-semibold mb-2 group relative">
                    Class Insights
                    <HiOutlineQuestionMarkCircle className="ml-2 cursor-pointer" />
                    <div className="absolute z-10  group-hover:block px-8 py-2 text-xs font-normal text-gray-900 bg-gray-200 border border-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 top-[-70px] left-[30%] transform -translate-x-[30%] max-w-[1600px] w-auto flex flex-row">
                      <p>•Balanced: Near the median.</p>
                      <p>•Underbalanced: Below the median.</p>
                      <p>•Overbalanced: Above the median.</p>
                      <p>•Imbalanced: Far from median.</p>
                    </div>
                  </h4>

                  {categorizedClasses.map((item) => (
                    <p key={item.class_name} className="text-sm mb-1">
                      <span
                        className="inline-block w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: item.Color }}
                      ></span>
                      <strong>{item.class_name}:</strong> {item.count}{" "}
                      annotations - {item.balanceType}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`flex items-start justify-center h-full pt-7 animate-scaleUp ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  } p-6 rounded-lg shadow-md space-y-4`}
                >
                  <div className="text-lg font-semibold">
                    No Annotations Done Yet.
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Image Statistics Section */}
          <div className="flex-1">
            <div className="relative group">
              <div className="flex items-center text-2xl font-semibold mb-4">
                Image Statistics
                <HiOutlineQuestionMarkCircle className="ml-2" />
              </div>

              {/* Tooltip */}
              <div className="absolute z-10  group-hover:block px-8 py-2 text-xs font-normal text-gray-900 bg-gray-200 border border-gray-200 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out top-[-45px] left-[30%] transform -translate-x-[5%] max-w-[1600px] w-auto flex flex-row">
                <p>• Displays the total number of images.</p>
                <p>• Tracks annotated vs unannotated images.</p>
              </div>
            </div>
            <div
              className={`bg-${
                isDarkMode ? "gray-700" : "gray-100"
              } p-6 rounded-lg animate-scaleUp shadow-md space-y-4`}
            >
              <div className="flex items-center justify-between">
                <div className="relative group">
                  <div className="flex items-center text-lg font-medium">
                    Images Uploaded
                  </div>
                </div>
                <div className="text-xl font-bold text-green-500">
                  {totalImages}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-lg font-medium">
                  Images Annotated
                </div>
                <div className="text-xl font-bold text-blue-500">
                  {imagesAnnotated}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-lg font-medium">
                  Images Without Annotation
                </div>
                <div className="text-xl font-bold text-red-500">
                  {imagesWithoutAnnotation}
                </div>
              </div>
            </div>{" "}
            <div className="space-y-2">
              <div className="flex items-center gap-4 p-4">
                <div className="font-medium text-lg">Auto Annotation</div>
                <button
                  onClick={() => toggleAutoAnnotation(projectName)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    autoAnnotation ? "bg-blue-600" : "bg-gray-200"
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

              {autoAnnotation && (
                <div className="px-4">
                  <label className="block text-sm font-medium ">
                    Threshold
                  </label>
                  <input
                    id="threshold"
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(projectName, e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-none sm:text-sm text-black"
                  />
                </div>
              )}
            </div>
            <div className=" flex flex-col items-center">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <div className="flex justify-between items-center gap-10 animate-scaleUp">
                    <ImageUpload
                      projectName={projectName}
                      loading={loading}
                      setloading={setloading}
                    />
                    {imageSrc.length > 0 && (
                      <button
                        className="mt-2 px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300 ease-in-out flex items-center"
                        onClick={() => set_analysis_page(false)}
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Analysis;
