import React, { useEffect, useState, useRef } from "react";
import ImageUpload from "../image upload and display/Imageupload";
import useStore from "../../../Zustand/Alldata";
import { useParams } from "react-router-dom";
import Spinner from "./loading_screen";
import { Bar } from "react-chartjs-2";
import Navbar from "../../../text_pages/Text/Navbar.jsx";
import { useTheme } from "../../../text_pages/Text/ThemeContext.jsx";

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

ChartJS.register(
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
    all_annotations,
    add_classes,
    classes,
    project_name,
    setprojectname,
    created_on,
  } = useStore();
  const { isDarkMode } = useTheme();
  const [annotations, setAnnotations] = useState(all_annotations);
  const classesAddedRef = useRef(false);

  if (project_name === "") {
    setprojectname(projectName);
  }

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
  }, [all_annotations]);

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
  const totalClassCount = classes_used.reduce((acc, curr) => acc + curr.count, 0);
  const avgClassCount = totalClassCount / classes_used.length;

  // Determine if classes are balanced or imbalanced
  const classStatus = classes_used.map((item) => {
    const deviation = Math.abs(item.count - avgClassCount);
    const percentageDeviation = (deviation / avgClassCount) * 100;
    const status = percentageDeviation < 20 ? "Balanced" : "Imbalanced";
    return { ...item, status };
  });

  // Sort the classes by count
  const sorted_class = classStatus.sort((a, b) => b.count - a.count);

  const imagesWithoutAnnotation = totalImages - imagesAnnotated;
  const [loading, setloading] = useState(false);

  const chartData = {
    labels: sorted_class.map((item) => item.class_name),
    datasets: [
      {
        label: "Count",
        data: sorted_class.map((item) => item.count),
        backgroundColor: sorted_class.map((item) => item.Color),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
     
      datalabels: {
        anchor: "end",
        align: "top",
        color: isDarkMode ? "#E5E7EB" : "#1f2937",
        font: {
          size: 11,
        },
        formatter: (value) => value,
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "#D1D5DB" : "#4b5563",
          font: {
            size: 11,
          },
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? "#D1D5DB" : "#4b5563",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <>
      <Navbar />
      <div
        className={`w-full h-screen overflow-y-auto px-12 pt-12 pb-36 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-3xl font-bold">{project_name}</div>
        <div>{formattedDate}</div>
  
        <div className="mt-8 flex justify-between gap-12">
          {/* Class Statistics Section */}
          <div className="flex-1">
            <div className="text-2xl font-semibold mb-4">Class Statistics</div>
            {sorted_class.length > 0 && (
              <div className="w-full">
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
            {/* Display Class Balance Status */}
            <div className="mt-4">
  {sorted_class.map((item) => (
    <div
      key={item.class_name}
      className={`flex justify-between items-center p-2 mb-1 rounded-lg shadow-sm ${
        item.status === "Balanced" ? "bg-green-100" : "bg-red-100"
      }`}
    >
      <div className="flex items-center">
        <div
          className={`w-2 h-2 rounded-full mr-2 ${
            item.status === "Balanced" ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="font-medium text-base">{item.class_name}</span>
      </div>
      <div
        className={`font-semibold text-sm ${
          item.status === "Balanced" ? "text-green-600" : "text-red-600"
        }`}
      >
        {item.status}
      </div>
    </div>
  ))}
</div>


          </div>
  
          {/* Image Statistics Section */}
          <div className="flex-1">
            <div className="text-2xl font-semibold mb-10">Image Statistics</div>
            <div
              className={`bg-${isDarkMode ? "gray-700" : "gray-100"} p-6 rounded-lg shadow-md space-y-4`}
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium">Images Uploaded</div>
                <div className="text-xl font-bold text-green-500">{totalImages}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium">Images Annotated</div>
                <div className="text-xl font-bold text-blue-500">{imagesAnnotated}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium">Images Without Annotation</div>
                <div className="text-xl font-bold text-red-500">
                  {imagesWithoutAnnotation}
                </div>
              </div>
            </div>
            {/* Remaining Content */}
        <div className="mt-12 flex flex-col items-center">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className="text-lg mb-4">Upload More Images?</div>
              <ImageUpload
                projectName={projectName}
                loading={loading}
                setloading={setloading}
              />
              <button
                className="mt-8 px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300 ease-in-out flex items-center"
                onClick={() => set_analysis_page(false)}
              >
                Continue
              </button>
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
