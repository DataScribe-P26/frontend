import React, { useEffect, useState, useRef } from "react";
import ImageUpload from "../image upload and display/Imageupload";
import useStore from "../../../Zustand/Alldata";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./loading_screen";
import { HiUpload } from "react-icons/hi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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
  const [annotations, setAnnotations] = useState(all_annotations);
  const classesAddedRef = useRef(false);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

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
      title: {
        display: true,
        text: "Class Count Statistics",
        color: darkMode ? "#f9fafb" : "#1f2937", // Change text color based on theme
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? "#e5e7eb" : "#4b5563", // Change tick color based on theme
          font: {
            size: 14,
          },
        },
      },
      y: {
        ticks: {
          color: darkMode ? "#e5e7eb" : "#4b5563", // Change tick color based on theme
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <>
      <nav className={`bg-gradient-to-r ${darkMode ? "from-gray-800 to-gray-900" : "from-indigo-600 to-indigo-800"} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wide flex items-center">
            Datascribe.
          </h1>
          <button className={`w-10 h-8 rounded-full transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
            onClick={() => setDarkMode((prev) => !prev)} // Toggle dark mode
          >
            <span className={`block w-6 h-6 rounded-full transition-transform duration-300 ${darkMode ? 'transform translate-x-2 bg-gray-800' : 'bg-white'}`}></span>
          </button>
        </div>
      </nav>
      <div className={`w-full h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`w-[60%] h-screen pt-12 px-12 pb-36 rounded-r-3xl overflow-y-auto image_scrollbar ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <div className="text-3xl font-bold">{project_name}</div>
          <div>{`Created On: ${formattedDate}`}</div>

          <div>
            <div className="text-2xl font-semibold mt-10 pl-2">
              Class Statistics
            </div>
            {sorted_class.length > 0 && (
              <div className="w-[70%] bg-white rounded-xl mt-3 p-4 shadow-md">
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
            <div className="w-[70%] min-h-[150px] max-h-[250px] bg-white rounded-xl mt-3 overflow-y-auto image_scrollbar shadow-md">
              {sorted_class.length > 0 ? (
                <div className="relative">
                  <table className="w-full text-gray-800">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 border-b">Number</th>
                        <th className="py-3 px-4 border-b">Class Name</th>
                        <th className="py-3 px-4 border-b">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted_class?.map(({ class_name, count }, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-2 px-4 text-center border-b">
                            {index + 1}
                          </td>
                          <td className="py-2 px-4 text-center border-b">
                            {class_name}
                          </td>
                          <td className="py-2 px-4 text-center border-b">
                            {count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4 mt-5">
                  No annotations available.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="text-2xl font-semibold mt-10 pl-2">
              Images Statistics
            </div>
            <div className="w-[40%] bg-white rounded-xl mt-3 overflow-y-auto shadow-md">
              <table className="w-full text-gray-800">
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">Images Uploaded</td>
                    <td className="py-2 px-4 text-center border-b">
                      {totalImages}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">Images Annotated</td>
                    <td className="py-2 px-4 text-center border-b">
                      {imagesAnnotated}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      Images Without Annotation
                    </td>
                    <td className="py-2 px-4 text-center border-b">
                      {imagesWithoutAnnotation}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section: Non-scrollable */}
        <div className={`w-[40%] h-screen flex flex-col justify-center items-center p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          {loading ? (
            <Spinner />
          ) : (
            <>
            <ImageUpload
              set_analysis_page={set_analysis_page}
              project_name={project_name}
              navigate={navigate}

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
    </>
  );
}

export default Analysis;
