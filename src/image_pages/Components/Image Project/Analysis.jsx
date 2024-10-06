import React, { useEffect, useState, useRef } from "react";
import ImageUpload from "../image upload and display/Imageupload";
import useStore from "../../../Zustand/Alldata";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./loading_screen";
import { HiUpload } from "react-icons/hi";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const [annotations, setAnnotations] = useState(all_annotations);
  const classesAddedRef = useRef(false);

  if (project_name === "") {
    setprojectname(projectName);
  }

  useEffect(() => {
    setAnnotations(all_annotations);
  }, [all_annotations]);

  const classes_used = [];
  const totalImages = annotations?.length || 0;
  let imagesAnnotated = 0;

  const navigate = useNavigate();

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

  const sorted_class = classes_used.sort((a, b) => b.count - a.count);
  const imagesWithoutAnnotation = totalImages - imagesAnnotated;
  const [loading, setloading] = useState(false);

  // Chart data with dynamic colors
  const chartData = {
    labels: sorted_class.map((item) => item.class_name),
    datasets: [
      {
        label: 'Count',
        data: sorted_class.map((item) => item.count),
        backgroundColor: sorted_class.map((item) => item.Color), // Use class colors
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Class Count Statistics' },
    },
    scales: {
      x: {
        ticks: {
          color: sorted_class.map((item) => item.Color), // Apply class color to x-axis labels
          font: {
            size: 14, // Customize font size for the x-axis labels
          },
        },
      },
      y: {
        ticks: {
          color: sorted_class.length > 0 ? sorted_class[0].Color : 'white', // Use the color of the first class for y-axis labels or default color
          font: {
            size: 14, // Customize font size for the y-axis labels
          },
        },
      },
    },
  };
  

  

  return (
    <div className="w-full h-screen flex ">
      {/* Left Section: Scrollable */}
      <div className="w-[60%] h-screen pt-12 px-12 rounded-r-3xl border-r-4 border-purple-900 overflow-y-auto custom-scrollbar">
        <div className="text-3xl font-bold text-white">{project_name}</div>
        <div className="text-gray-400">Created On: {created_on}</div>

        <div>
          <div className="text-2xl font-semibold text-white mt-10 pl-2">
            Class Statistics
          </div>
          <div className="w-[70%] min-h-[150px] max-h-[250px] bg-slate-600 rounded-xl mt-3 overflow-y-auto image_scrollbar">
            {sorted_class.length > 0 ? (
              <div className="relative">
                <table className="w-full text-white">
                  <thead className="sticky top-0 bg-gray-700">
                    <tr>
                      <th className="py-3 px-4">Number</th>
                      <th className="py-3 px-4">Class Name</th>
                      <th className="py-3 px-4">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted_class?.map(({ class_name, count }, index) => (
                      <tr key={index} className="hover:bg-slate-400">
                        <td className="py-2 px-4 text-center">{index + 1}</td>
                        <td className="py-2 px-4 text-center">{class_name}</td>
                        <td className="py-2 px-4 text-center">{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-300 py-4 mt-5">
                No annotations available.
              </div>
            )}
          </div>
        </div>

        {/* Class count graph */}
        <div className="w-[70%] bg-slate-600 rounded-xl mt-8 p-4">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div>
          <div className="text-2xl font-semibold text-white mt-10 pl-2">
            Images Statistics
          </div>
          <div className="w-[40%] bg-slate-600 rounded-xl mt-3 overflow-y-auto custom-scrollbar">
            <table className="w-full text-white">
              <tbody>
                <tr className="hover:bg-slate-400">
                  <td className="py-2 px-4">Images Uploaded</td>
                  <td className="py-2 px-4 text-center">{totalImages}</td>
                </tr>
                <tr className="hover:bg-slate-400">
                  <td className="py-2 px-4 ">Images Annotated</td>
                  <td className="py-2 px-4 text-center">{imagesAnnotated}</td>
                </tr>
                <tr className="hover:bg-slate-400">
                  <td className="py-2 px-4 ">Images Without Annotation</td>
                  <td className="py-2 px-4 text-center">
                    {imagesWithoutAnnotation}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Section: Non-scrollable */}
      <div className="w-[40%] h-screen flex flex-col justify-center items-center p-6">
        <>
          {loading ? (
            <Spinner />
          ) : (
            <>
              {imageSrc.length > 0 ? (
                <div className="flex flex-col items-center">
                  <div className="text-white text-lg mb-4">
                    Upload More Images?
                  </div>
                  <ImageUpload
                    projectName={projectName}
                    loading={loading}
                    setloading={setloading}
                  />
                  <button
                    className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-300 ease-in-out flex items-center"
                    onClick={() => set_analysis_page(false)}
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-screen">
                  <div className="text-center">
                    <div className="mb-8 text-white text-xl">
                      No Images Uploaded Yet.
                    </div>
                    <ImageUpload
                      projectName={projectName}
                      loading={loading}
                      setloading={setloading}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
}

export default Analysis;