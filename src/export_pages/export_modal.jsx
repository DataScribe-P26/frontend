import React from "react";
import useStore from "../Zustand/Alldata";
import { exportYOLODataset } from "./YoloExporter";
import { exportYOLOv7Dataset } from "./Yolov7Exporter";
import { exportYOLOv6Dataset } from "./exportYOLOv6Dataset";
import { exportYOLOv5Dataset } from "./exportYOLOv5Dataset";
import axios from "axios";

const ExportModal = ({ setExportModal, projectName }) => {
  const [splits, setSplits] = React.useState([70, 90]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [selectedFormat, setSelectedFormat] = React.useState("");
  const sliderRef = React.useRef(null);
  const isDragging = React.useRef(null);

  const exportFormats = [
    { value: "yolov8", label: "YOLO v8 Format" },
    { value: "yolov7", label: "YOLO v7 Format" },
    { value: "yolov6", label: "YOLO v6 Format" },
    { value: "yolov5", label: "YOLO v5 Format" },
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
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/projects/${projectName}/images/`
      );

      const all_annotations = response.data?.filter(
        (annotation) => annotation.rectangle_annotations.length > 0
      );

      if (!selectedFormat) {
        throw new Error("Please select an export format");
      }

      if (
        !all_annotations ||
        !Array.isArray(all_annotations) ||
        all_annotations.length === 0
      ) {
        throw new Error("No images available to export");
      }

      // Handle different YOLO versions
      switch (selectedFormat) {
        case "yolov8":
          await exportYOLODataset(all_annotations, currentSplits, projectName);
          break;
        case "yolov7":
          await exportYOLOv7Dataset(
            all_annotations,
            currentSplits,
            projectName
          );
          break;
        case "yolov6":
          await exportYOLOv6Dataset(
            all_annotations,
            currentSplits,
            projectName
          );
          break;
        case "yolov5":
          await exportYOLOv5Dataset(
            all_annotations,
            currentSplits,
            projectName
          );
          break;
        default:
          throw new Error("Unsupported YOLO version");
      }

      setExportModal(false);
    } catch (error) {
      console.error("Export failed:", error);
      setError(error.message || "Failed to export dataset. Please try again.");
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

        <div className="px-5 py-4 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            YOLO Version
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
