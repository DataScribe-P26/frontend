import React from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";

const AugmentationConfig = ({ config, setConfig, isOn, isDarkMode }) => {
  if (!isOn) return null;

  return (
    <div className="px-6 py-4">
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg border ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        } shadow-sm`}
      >
        <div
          className={`p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h3
            className={`text-base font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Augmentation Settings
          </h3>
          <p
            className={`mt-1 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Configure data augmentation parameters to enhance your dataset with
            advanced transformations.
          </p>
        </div>

        <div className="p-4 space-y-6">
          {/* Number of Augmentations */}
          <div
            className={`${
              isDarkMode ? "bg-gray-900" : "bg-gray-50"
            } p-4 rounded-lg`}
          >
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              } mb-2`}
            >
              Number of Augmentations per Image
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={config.numAugmentations}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    numAugmentations: Math.max(
                      1,
                      parseInt(e.target.value) || 1
                    ),
                  }))
                }
                className={`w-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                min="1"
                max="50"
              />
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Range: 1-50
              </span>
            </div>
          </div>

          {/* Augmentation Types */}
          <div>
            <div className="mb-3">
              <h4
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Augmentation Types
              </h4>
              <p
                className={`mt-1 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Select and configure the augmentation methods to apply to your
                dataset.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {Object.entries(config.transforms).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-3 rounded-lg border transition-colors duration-200 ${
                    value.enabled
                      ? isDarkMode
                        ? "border-blue-500 bg-blue-900/20"
                        : "border-blue-200 bg-blue-50"
                      : isDarkMode
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        type="checkbox"
                        id={key}
                        checked={value.enabled}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            transforms: {
                              ...prev.transforms,
                              [key]: { ...value, enabled: e.target.checked },
                            },
                          }))
                        }
                        className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                          isDarkMode ? "bg-gray-700 border-gray-600" : ""
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor={key}
                        className={`block text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        {value.label}
                      </label>
                      <p
                        className={`text-xs mt-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {value.description}
                      </p>
                      {value.hasParams && value.enabled && (
                        <div className="mt-2">
                          <div className="flex items-center gap-3">
                            <input
                              type={value.inputType || "number"}
                              value={value.value}
                              min={value.min}
                              max={value.max}
                              step={value.step}
                              onChange={(e) =>
                                setConfig((prev) => ({
                                  ...prev,
                                  transforms: {
                                    ...prev.transforms,
                                    [key]: {
                                      ...value,
                                      value: parseFloat(e.target.value) || 0,
                                    },
                                  },
                                }))
                              }
                              className={`w-32 p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                ${
                                  isDarkMode
                                    ? "bg-gray-800 border-gray-600 text-gray-200"
                                    : "bg-white border-gray-300 text-gray-900"
                                }`}
                            />
                            <span
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {value.unit} (Recommended: {value.recommended})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ExportModal = ({ setExportModal, projectName }) => {
  const [splits, setSplits] = React.useState([70, 90]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOn, setIsOn] = React.useState(false);
  const [error, setError] = React.useState("");
  const [selectedFormat, setSelectedFormat] = React.useState("");
  const sliderRef = React.useRef(null);
  const isDragging = React.useRef(null);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const [augConfig, setAugConfig] = React.useState({
    numAugmentations: 35,
    transforms: {
      horizontalFlip: {
        enabled: true,
        label: "Horizontal Flip",
        hasParams: false,
        description: "Flips image horizontally (left to right)",
      },
      verticalFlip: {
        enabled: true,
        label: "Vertical Flip",
        hasParams: false,
        description: "Flips image vertically (up to down)",
      },
      rotate90: {
        enabled: true,
        label: "Random Rotate 90°",
        hasParams: false,
        description: "Rotates image by 90, 180, or 270 degrees",
      },
      rotate: {
        enabled: true,
        label: "Random Rotate",
        hasParams: true,
        value: 45,
        min: -180,
        max: 180,
        step: 1,
        unit: "degrees",
        recommended: "±45°",
        description: "Rotates image by random angle within range",
      },

      brightness: {
        enabled: true,
        label: "Brightness & Contrast",
        hasParams: true,
        value: 0.3,
        min: 0.0,
        max: 1.0,
        step: 0.1,
        unit: "intensity",
        recommended: "0.2-0.4",
        description: "Adjusts image brightness and contrast",
      },
      scale: {
        enabled: true,
        label: "Random Scale",
        hasParams: true,
        value: 0.3,
        min: 0.1,
        max: 2.0,
        step: 0.1,
        unit: "factor",
        recommended: "0.8-1.2",
        description: "Randomly scales image up or down",
      },
      noise: {
        enabled: true,
        label: "Noise",
        hasParams: true,
        value: 25.0,
        min: 0,
        max: 100,
        step: 5,
        unit: "variance",
        recommended: "10-30",
        description: "Adds random Gaussian noise to image",
      },
      blur: {
        enabled: true,
        label: "Blur",
        hasParams: true,
        value: 3,
        min: 1,
        max: 15,
        step: 2,
        unit: "kernel size",
        recommended: "3-7",
        description: "Applies Gaussian blur to image",
      },
      motion: {
        enabled: true,
        label: "Motion Blur",
        hasParams: true,
        value: 5,
        min: 3,
        max: 15,
        step: 2,
        unit: "kernel size",
        recommended: "3-7",
        description: "Simulates motion blur effect",
      },
      gamma: {
        enabled: true,
        label: "Random Gamma",
        hasParams: true,
        value: 120,
        min: 50,
        max: 200,
        step: 10,
        unit: "percentage",
        recommended: "80-120",
        description: "Adjusts image gamma (brightness power law)",
      },
      shear: {
        enabled: true,
        label: "Shear",
        hasParams: true,
        value: 15,
        min: -45,
        max: 45,
        step: 5,
        unit: "degrees",
        recommended: "±15°",
        description: "Applies shear transformation to image",
      },
      perspective: {
        enabled: true,
        label: "Perspective",
        hasParams: true,
        value: 0.1,
        min: 0.05,
        max: 0.2,
        step: 0.05,
        unit: "scale",
        recommended: "0.05-0.1",
        description: "Applies perspective distortion to image",
      },
      hsvShift: {
        enabled: true,
        label: "HSV Shift",
        hasParams: true,
        value: 20,
        min: 10,
        max: 50,
        step: 5,
        unit: "intensity",
        recommended: "10-30",
        description: "Randomly shifts hue, saturation, and value",
      },
      sharpen: {
        enabled: true,
        label: "Sharpen",
        hasParams: true,
        value: 0.3,
        min: 0.1,
        max: 1.0,
        step: 0.1,
        unit: "intensity",
        recommended: "0.2-0.5",
        description: "Enhances edges to compensate for blur",
      },
      cutout: {
        enabled: true,
        label: "Cutout",
        hasParams: true,
        value: 0.2,
        min: 0.0,
        max: 0.5,
        step: 0.1,
        unit: "fraction",
        recommended: "0.1-0.3",
        description: "Removes random patches from image",
      },
      glassBlur: {
        enabled: true,
        label: "Glass Blur",
        hasParams: true,
        value: 0.7,
        min: 0.1,
        max: 1.5,
        step: 0.1,
        unit: "sigma",
        recommended: "0.5-1.0",
        description: "Simulates distortion as if viewed through frosted glass",
      },
    },
  });

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

      const response = await axios.post(
        `http://127.0.0.1:8000/export/${type}/${user_type}/${projectName}/${
          user.email
        }/${selectedFormat}/${isOn}?train_split=${splits[0]}&val_split=${
          splits[1] - splits[0]
        }&test_split=${100 - splits[1]}`,
        {
          augmentation_config: isOn
            ? {
                numAugmentations: augConfig.numAugmentations,
                transforms: augConfig.transforms,
              }
            : null,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${projectName}_${selectedFormat}_dataset.zip`
      );
      document.body.appendChild(link);
      link.click();
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
        <span
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-200" : "text-gray-900"
          }`}
        >
          {label}
        </span>
      </div>
      <span
        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        {value}%
      </span>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={() => !isLoading && setExportModal(false)}
    >
      <div
        className={`w-[800px] ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        } shadow-xl rounded-lg max-h-[85vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          } flex-shrink-0`}
        >
          <h2
            className={`text-lg font-medium ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Export Dataset
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto image_scrollbar">
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Dataset Split Configuration */}
          <div className="px-6 py-4">
            <div
              className={`text-base font-medium mb-4 ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Dataset Split Configuration
            </div>
            <div className="space-y-6">
              <div
                ref={sliderRef}
                className={`relative h-8 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                } rounded-lg cursor-pointer`}
              >
                {["blue", "green", "purple"].map((color, index) => (
                  <div
                    key={index}
                    className={`absolute h-full bg-${color}-500 ${
                      index === 0
                        ? "rounded-l-lg"
                        : index === 2
                        ? "rounded-r-lg"
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

              <div className="grid grid-cols-3 gap-6">
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
          </div>

          {/* Augmentation Toggle */}
          <div
            className={`px-6 py-4 border-0 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`text-base font-medium ${
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Data Augmentation
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Enable to generate additional training samples
                </p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <label className="  switch flex items-center gap-2">
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
              </div>
            </div>
          </div>

          {/* Augmentation Config */}
          <AugmentationConfig
            config={augConfig}
            setConfig={setAugConfig}
            isOn={isOn}
            isDarkMode={isDarkMode}
          />

          {/* Format Selection */}
          <div
            className={`px-6 py-4 border-0 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <label
              className={`block text-base font-medium ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              } mb-2`}
            >
              Dataset Format
            </label>
            <select
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
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
        </div>

        {/* Footer */}
        <div
          className={`p-4 flex justify-end space-x-3 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          } flex-shrink-0`}
        >
          <button
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              isDarkMode
                ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setExportModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
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
