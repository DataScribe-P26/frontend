import React from "react";

const ExportModal = ({ setExportModal }) => {
  const [splits, setSplits] = React.useState([70, 90]); // Divider positions
  const sliderRef = React.useRef(null);
  const isDragging = React.useRef(null);
  const [datasetType, setDatasetType] = React.useState("");

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
      onClick={() => setExportModal(false)}
    >
      <div
        className="w-[440px] bg-white shadow-lg rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-2xl font-semibold px-5 py-4">Export Options</div>
        <div className="px-5">
          <h2 className="text-lg font-medium">Dataset Split Configuration</h2>
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

        <div>
          <div className="px-5 mt-3">
            <h2 className="text-lg font-medium mb-2">Dataset Type</h2>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select Dataset Type</option>
              <option value="yolo">Yolo</option>
            </select>
          </div>
        </div>

        <div className="p-4  flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => {
              setExportModal(false);
            }}
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
