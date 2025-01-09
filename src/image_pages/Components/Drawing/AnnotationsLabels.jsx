import React from "react";
import { useTheme } from "../../../text_pages/Text/ThemeContext";

function AnnotationsLabels({ currentImage, classes }) {
  const { isDarkMode } = useTheme();

  const annotations = currentImage?.annotations || [];
  const classList = Array.isArray(classes) ? classes : [];

  const counts = classList
    .map((c) => ({
      class_label: c.class_label,
      count: annotations.filter(
        (item) => item.class_name === c.class_label && item.width !== 0
      ).length,
      color: c.color,
    }))
    .filter((c) => c.count > 0);

  return (
    <>
      <div
        className={`${
          isDarkMode ? "text-white" : "text-black"
        } text-center text-2xl font-semibold mb-6`}
      >
        Annotations
      </div>
      <div className="px-3">
        {counts.length > 0 ? (
          <div className="space-y-2">
            {counts.map((item) => (
              <div
                key={item.class_label}
                className="flex justify-between items-center bg-white border border-gray-200 py-3 rounded-lg px-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-[30%] font-medium text-gray-700">
                  {item.class_label}
                </div>
                <div className="w-[30%] text-center text-gray-600">
                  {item.count}
                </div>
                <div className="w-[30%] flex justify-center">
                  <div
                    className="w-[50px] h-[22px] rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No annotations available
          </div>
        )}
      </div>
    </>
  );
}

export default AnnotationsLabels;
