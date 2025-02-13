import React from "react";

import axios from "axios";
import { useAuth } from "../login/AuthContext";

const ExportModal = ({ setExportModal, projectName }) => {
  const [splits, setSplits] = React.useState([70, 90]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOn, setIsOn] = React.useState(false);
  const [error, setError] = React.useState("");
  const [selectedFormat, setSelectedFormat] = React.useState("");
  const sliderRef = React.useRef(null);
  const isDragging = React.useRef(null);
  const { user } = useAuth();

  const exportFormats = [
    { value: "pascalvoc", label: "Pascal VOC Format" },
    { value: "darknet", label: "YOLO Darknet Format" },
    { value: "yolov8", label: "YOLO v8 Format" },
    { value: "yolov7", label: "YOLO v7 Format" },
    { value: "yolov6", label: "YOLO v6 Format" },
    { value: "yolov5", label: "YOLO v5 Format" },
    { value: "yolor", label: "YOLO-R Format" },
    { value: "yolov8obb", label: "YOLO v8-OBB Format" },
    { value: "yoloseg", label: "YOLO v8-SEG Format" },
    { value: "yoloseg", label: "YOLO v7-SEG Format" },
    { value: "yoloseg", label: "YOLO v6-SEG Format" },
  ];

  const currentSplits = React.useMemo(
    () => ({
      training: splits[0],
      testing: splits[1] - splits[0],
      validation: 100 - splits[1],
    }),
    [splits]
  );

  const handleMouseDown = (e, index) => {
    e.preventDefault();
    isDragging.current = index;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isDragging.current === null || !sliderRef.current) return;

    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const percentage = Math.min(
      100,
      Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)
    );

    setSplits((prev) => {
      const newSplits = [...prev];
      if (isDragging.current === 0 && percentage < newSplits[1] - 5) {
        newSplits[0] = Math.round(percentage);
      } else if (isDragging.current === 1 && percentage > newSplits[0] + 5) {
        newSplits[1] = Math.round(percentage);
      }
      return newSplits;
    });
  };

  const handleMouseUp = () => {
    isDragging.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);
      setError("");
      const type = "detection";
      const user_type = "single";
      console.log(splits);
      const test_split = 100 - (splits[0] + splits[1]);
      console.log(splits[0], splits[1] - splits[0], 100 - splits[1]);

      const response = await axios.get(
        `http://127.0.0.1:8000/export/${type}/${user_type}/${projectName}/${user.email}/${selectedFormat}/${isOn}`,
        {
          params: {
            train_split: splits[0],
            val_split: splits[1] - splits[0],
            test_split: 100 - splits[1],
          },
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${projectName}_${selectedFormat}_dataset.zip`
      );
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setExportModal(false);
    } catch (error) {
      console.error("Export failed:", error);
      setError(
        error.response?.data?.detail ||
          "Failed to export dataset. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const Section = ({ color, label, value }) => (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 ${color} rounded-full`} />
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-gray-500">{value}%</span>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm flex justify-center items-center text-black"
      onClick={() => !isLoading && setExportModal(false)}
    >
      <div
        className="w-[440px] bg-white shadow-lg rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-2xl font-semibold px-5 py-4">Export Dataset</div>

        {error && (
          <div className="mx-5 mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="px-5 py-1">
          <div className="text-xl text-black font-medium">
            Dataset Configuration
          </div>
        </div>

        <div className="px-6 pt-4 space-y-6">
          <div
            ref={sliderRef}
            className="relative h-8 bg-gray-100 rounded-md cursor-pointer"
          >
            {["blue", "green", "purple"].map((color, index) => (
              <div
                key={index}
                className={`absolute h-full bg-${color}-500 ${
                  index === 0
                    ? "rounded-l-md"
                    : index === 2
                    ? "rounded-r-md"
                    : ""
                }`}
                style={{
                  left: index === 0 ? "0%" : `${splits[index - 1]}%`,
                  width:
                    index === 0
                      ? `${currentSplits.training}%`
                      : index === 1
                      ? `${currentSplits.testing}%`
                      : `${currentSplits.validation}%`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                  {index === 0
                    ? currentSplits.training
                    : index === 1
                    ? currentSplits.testing
                    : currentSplits.validation}
                  %
                </div>
              </div>
            ))}

            {splits.map((split, index) => (
              <div
                key={index}
                className="absolute top-0 w-1 h-full bg-white cursor-col-resize group"
                style={{
                  left: `${split}%`,
                  transform: "translateX(-50%)",
                }}
                onMouseDown={(e) => handleMouseDown(e, index)}
              >
                <div className="absolute inset-y-0 left-1/2 w-4 transform -translate-x-1/2 hover:bg-black/10" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <Section
              color="bg-blue-500"
              label="Training"
              value={currentSplits.training}
            />
            <Section
              color="bg-green-500"
              label="Testing"
              value={currentSplits.testing}
            />
            <Section
              color="bg-purple-500"
              label="Validation"
              value={currentSplits.validation}
            />
          </div>
        </div>
        <label className=" px-5 mt-5 switch flex items-center gap-2">
          <span>Do You Want Augmentation's?</span>
          <input
            type="checkbox"
            checked={isOn}
            onChange={() => setIsOn(!isOn)}
          />
          <div className="slider mt-2">
            <div className="circle">
              {isOn ? (
                <svg
                  className="checkmark"
                  viewBox="0 0 24 24"
                  height="10"
                  width="10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      fill="currentColor"
                      d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                    />
                  </g>
                </svg>
              ) : (
                <svg
                  className="cross"
                  viewBox="0 0 365.696 365.696"
                  height="6"
                  width="6"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      fill="currentColor"
                      d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"
                    />
                  </g>
                </svg>
              )}
            </div>
          </div>
        </label>

        <div className="px-5 py-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Dataset Format
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="">Select a version</option>
            {exportFormats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            onClick={() => setExportModal(false)}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
            onClick={handleExport}
            disabled={isLoading || !selectedFormat}
          >
            {isLoading ? "Processing..." : "Export Dataset"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
