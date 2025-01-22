import JSZip from "jszip";

export const exportYOLOv5Dataset = async (annotations, splits, projectName) => {
  if (!Array.isArray(annotations) || annotations.length === 0) {
    throw new Error("No annotations provided or invalid format");
  }

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
  const classToIndex = {};
  classes?.forEach((className, index) => {
    classToIndex[className] = index;
  });

  const zip = new JSZip();
  const dataset = zip.folder("dataset");

  // YOLOv5 folder structure
  const datasetFolders = {
    images: {
      train: dataset.folder("images/train"),
      val: dataset.folder("images/val"),
      test: dataset.folder("images/test"),
    },
    labels: {
      train: dataset.folder("labels/train"),
      val: dataset.folder("labels/val"),
      test: dataset.folder("labels/test"),
    },
  };

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

  const shuffledData = [...validAnnotations].sort(() => Math.random() - 0.5);
  const totalFiles = shuffledData.length;
  const trainSize = Math.floor(totalFiles * (splits.training / 100));
  const testSize = Math.floor(totalFiles * (splits.testing / 100));

  const dataSplits = {
    train: shuffledData.slice(0, trainSize),
    test: shuffledData.slice(trainSize, trainSize + testSize),
    val: shuffledData.slice(trainSize + testSize),
  };

  for (const [splitName, splitData] of Object.entries(dataSplits)) {
    for (const item of splitData) {
      try {
        const { filename, src, width: imgWidth, height: imgHeight } = item;
        const imageNumber = String(splitData.indexOf(item) + 1).padStart(
          6,
          "0"
        );
        const imageExt = filename.split(".").pop();
        const newImageName = `${splitName}_${imageNumber}.${imageExt}`;

        const base64Data = src.includes("base64,")
          ? src.split("base64,")[1]
          : src;
        datasetFolders.images[splitName].file(newImageName, base64Data, {
          base64: true,
        });

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

        const labelName = `${splitName}_${imageNumber}.txt`;
        datasetFolders.labels[splitName].file(labelName, labelLines);
      } catch (error) {
        console.error(`Error processing item ${item.filename}:`, error);
      }
    }
  }

  const yamlContent = `
# Change Path
path: ../dataset
train: images/train
val: images/val
test: images/test

# Classes
nc: ${classes.length}  # number of classes
names: ${JSON.stringify(classes)}  # class names
`.trim();

  dataset.file("data.yaml", yamlContent);

  try {
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "yolov5_dataset.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating zip file:", error);
    throw error;
  }
};
