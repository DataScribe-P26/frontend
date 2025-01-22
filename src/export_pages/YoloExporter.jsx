import JSZip from "jszip";

export const exportYOLODataset = async (annotations, splits, projectName) => {
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
  const dataset = zip.folder(`${projectName}_Yolov8`); // Dynamically set folder name

  // Create split folders with updated structure
  const splitFolders = {
    train: {
      images: dataset.folder("train").folder("images"),
      labels: dataset.folder("train").folder("labels"),
    },
    valid: {
      images: dataset.folder("valid").folder("images"),
      labels: dataset.folder("valid").folder("labels"),
    },
    test: {
      images: dataset.folder("test").folder("images"),
      labels: dataset.folder("test").folder("labels"),
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

        // Save image
        const base64Data = src.includes("base64,")
          ? src.split("base64,")[1]
          : src;
        splitFolders[splitName].images.file(filename, base64Data, {
          base64: true,
        });

        // Process annotations
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

        const baseName = filename.split(".")[0];
        splitFolders[splitName].labels.file(`${baseName}.txt`, labelLines);
      } catch (error) {
        console.error(`Error processing item ${item.filename}:`, error);
      }
    }
  }

  // Create data.yaml file with updated paths
  const yamlContent = `
path: ./${projectName}_Yolov8
train: train/images
val: valid/images
test: test/images
nc: ${classes.length}
names: ${JSON.stringify(classes)}
`.trim();

  dataset.file("data.yaml", yamlContent);

  // Generate and download zip
  try {
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName}_Yolov8_dataset.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating zip file:", error);
    throw error;
  }
};
