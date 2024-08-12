import React, { useEffect, useState } from "react";
import ImageUpload from "../image upload and display/Imageupload";
import useStore from "../../../Zustand/Alldata";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./loading_screen";

function Analysis({}) {
  const { projectName } = useParams();
  const { imageSrc, all_annotations } = useStore();
  const [annotations, setAnnotations] = useState(all_annotations);

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

    annotationList.forEach(({ class_name }) => {
      if (class_name) {
        const existingClass = classes_used.find(
          (item) => item.class_name === class_name
        );
        if (existingClass) {
          existingClass.count++;
        } else {
          classes_used.push({ class_name, count: 1 });
        }
      }
    });
  });

  const sorted_class = classes_used.sort((a, b) => b.count - a.count);
  const imagesWithoutAnnotation = totalImages - imagesAnnotated;
  const [loading, setloading] = useState(false);

  return (
    <div className="w-full h-screen flex">
      <div className="w-[60%] h-screen pt-12 px-12 rounded-r-3xl border-r-4 border-purple-900">
        <div className="text-3xl font-bold text-white">{projectName}</div>
        <div className="text-gray-400">Created On - </div>

        <div>
          <div className="text-2xl font-semibold text-white mt-10 pl-2">
            Class Statistics
          </div>
          <div
            className={`w-[70%] min-h-[150px] max-h-[250px] bg-slate-600 rounded-xl mt-3 overflow-y-auto custom-scrollbar`}
          >
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
                    {sorted_class.map(({ class_name, count }, index) => (
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
      <div className="w-[40%] h-screen flex flex-col justify-center items-center  p-6">
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
                    className="px-6 py-3 rounded-lg bg-green-500 text-white mt-20 shadow-lg hover:bg-green-600 transition"
                    onClick={() => navigate(`/project/${projectName}/main`)}
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
