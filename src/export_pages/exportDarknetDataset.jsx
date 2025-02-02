import JSZip from "jszip";

export const exportDarknetDataset = async (
  annotations,
  splits,
  projectName
) => {
  if (!Array.isArray(annotations) || annotations.length === 0) {
    throw new Error("No annotations provided or invalid format");
  }

  // Extract unique classes
  const classSet = new Set();
  annotations?.forEach((item) => {
    item.rectangle_annotations?.forEach((annotation) => {
      if (annotation.class_name) {
        classSet.add(annotation.class_name);
      }
    });
  });

  const classes = Array.from(classSet).sort();
  const classToIndex = {};
  classes?.forEach((className, index) => {
    classToIndex[className] = index;
  });

  const zip = new JSZip();

  // Create Roboflow-style folder structure
  const datasetFolders = {
    train: zip.folder("train"),
    valid: zip.folder("valid"),
    test: zip.folder("test"),
  };

  // Create _darknet.labels file content
  const darknetLabels = classes
    .map((className, index) => `${className}: ${index}`)
    .join("\n");

  // Add _darknet.labels to each folder
  Object.values(datasetFolders).forEach((folder) => {
    folder.file("_darknet.labels", darknetLabels);
  });

  // Validate annotations
  const validAnnotations = annotations?.filter((item) => {
    return (
      item &&
      item.src &&
      item.filename &&
      item.width &&
      item.height &&
      item.rectangle_annotations &&
      Array.isArray(item.rectangle_annotations) &&
      item.rectangle_annotations.some(
        (anno) => anno.class_name && anno.type === "rectangle"
      )
    );
  });

  if (validAnnotations.length === 0) {
    throw new Error("No valid annotations found with required properties");
  }

  // Normalize coordinates function
  const normalizeCoordinates = (x, y, width, height, imgWidth, imgHeight) => {
    const center_x = (x + width / 2) / imgWidth;
    const center_y = (y + height / 2) / imgHeight;
    const norm_width = width / imgWidth;
    const norm_height = height / imgHeight;

    return [
      Math.min(Math.max(center_x, 0), 1),
      Math.min(Math.max(center_y, 0), 1),
      Math.min(Math.max(norm_width, 0), 1),
      Math.min(Math.max(norm_height, 0), 1),
    ];
  };

  // Shuffle and split data
  const shuffledData = [...validAnnotations].sort(() => Math.random() - 0.5);
  const totalFiles = shuffledData.length;
  const trainSize = Math.floor(totalFiles * (splits.training / 100));
  const testSize = Math.floor(totalFiles * (splits.testing / 100));

  const dataSplits = {
    train: shuffledData.slice(0, trainSize),
    test: shuffledData.slice(trainSize, trainSize + testSize),
    valid: shuffledData.slice(trainSize + testSize),
  };

  // Process each split
  for (const [splitName, splitData] of Object.entries(dataSplits)) {
    for (const item of splitData) {
      try {
        const { filename, src, width: imgWidth, height: imgHeight } = item;
        const imageNumber = String(splitData.indexOf(item) + 1).padStart(
          6,
          "0"
        );
        const imageExt = filename.split(".").pop();
        const newImageName = `${imageNumber}.${imageExt}`;
        const labelName = `${imageNumber}.txt`;

        // Save image
        const base64Data = src.includes("base64,")
          ? src.split("base64,")[1]
          : src;
        datasetFolders[splitName].file(newImageName, base64Data, {
          base64: true,
        });

        // Create label file
        const labelLines = item.rectangle_annotations
          ?.filter(
            (annotation) =>
              annotation.class_name && annotation.type === "rectangle"
          )
          .map((annotation) => {
            const classIndex = classToIndex[annotation.class_name];
            if (classIndex === undefined) {
              console.warn(`Unknown class found: ${annotation.class_name}`);
              return null;
            }

            const [center_x, center_y, norm_width, norm_height] =
              normalizeCoordinates(
                annotation.x,
                annotation.y,
                annotation.width,
                annotation.height,
                imgWidth,
                imgHeight
              );

            return `${classIndex} ${center_x.toFixed(6)} ${center_y.toFixed(
              6
            )} ${norm_width.toFixed(6)} ${norm_height.toFixed(6)}`;
          })
          ?.filter((line) => line !== null)
          .join("\n");

        datasetFolders[splitName].file(labelName, labelLines);
      } catch (error) {
        console.error(`Error processing item ${item.filename}:`, error);
      }
    }
  }

  // Create data.yaml file at root level
  const yamlContent = `
train: ./train
val: ./valid
test: ./test

nc: ${classes.length}  # number of classes
names: ${JSON.stringify(classes)}  # class names
`.trim();

  zip.file("data.yaml", yamlContent);

  // Generate and download zip file
  try {
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName}_darknet.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating zip file:", error);
    throw error;
  }
};
