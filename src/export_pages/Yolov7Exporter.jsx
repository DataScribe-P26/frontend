import JSZip from "jszip";

export const exportYOLOv7Dataset = async (annotations, splits, projectName) => {
  // Validate input
  if (!Array.isArray(annotations) || annotations.length === 0) {
    throw new Error("No annotations provided or invalid format");
  }

  // Extract unique classes from rectangle annotations
  const classSet = new Set();
  annotations?.forEach((item) => {
    if (
      item.rectangle_annotations &&
      Array.isArray(item.rectangle_annotations)
    ) {
      item.rectangle_annotations?.forEach((annotation) => {
        if (annotation.class_name) {
          classSet.add(annotation.class_name);
        }
      });
    }
  });

  const classes = Array.from(classSet).sort();

  // Create class to index mapping
  const classToIndex = {};
  classes?.forEach((className, index) => {
    classToIndex[className] = index;
  });

  const zip = new JSZip();

  // Create YOLOv7 Roboflow structure
  // Root folder - projectName_Yolov7
  const rootFolderName = `${projectName}_Yolov7`;
  const dataset = zip.folder(rootFolderName);

  // Create split folders with Roboflow structure
  const splitFolders = {
    train: {
      images: dataset.folder("train"),
      labels: dataset.folder("train"),
    },
    valid: {
      images: dataset.folder("valid"),
      labels: dataset.folder("valid"),
    },
    test: {
      images: dataset.folder("test"),
      labels: dataset.folder("test"),
    },
  };

  // Filter valid annotations
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

  // Calculate split sizes
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

        // Save image with numbered sequence (Roboflow style)
        const imageNumber = String(splitData.indexOf(item) + 1).padStart(
          6,
          "0"
        );
        const imageExt = filename.split(".").pop();
        const newImageName = `${splitName}_${imageNumber}.${imageExt}`;

        // Save image
        const base64Data = src.includes("base64,")
          ? src.split("base64,")[1]
          : src;
        splitFolders[splitName].images.file(newImageName, base64Data, {
          base64: true,
        });

        // Process annotations - YOLOv7 format
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

        // Save label file with matching name
        const labelName = `${splitName}_${imageNumber}.txt`;
        splitFolders[splitName].labels.file(labelName, labelLines);
      } catch (error) {
        console.error(`Error processing item ${item.filename}:`, error);
      }
    }
  }

  // Create data.yaml file with YOLOv7 Roboflow structure
  const yamlContent = `
train: ./train
val: ./valid
test: ./test

nc: ${classes.length}
names: ${JSON.stringify(classes)}
`;

  dataset.file("data.yaml", yamlContent);

  // Generate and download zip
  try {
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${rootFolderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating zip file:", error);
    throw error;
  }
};
