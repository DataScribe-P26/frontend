import JSZip from "jszip";

export const exportPascalVOCDataset = async (
  annotations,
  splits,
  projectName
) => {
  // Validate input
  if (!Array.isArray(annotations) || annotations.length === 0) {
    throw new Error("No annotations provided or invalid format");
  }

  // Extract unique classes
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

  const zip = new JSZip();
  const dataset = zip.folder(`${projectName}_PascalVOC`);

  // Create dataset structure following exact Roboflow format
  const splitFolders = {
    train: dataset.folder("train"),
    test: dataset.folder("test"),
    valid: dataset.folder("valid"),
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

  // Generate Roboflow-style filename
  const generateRoboflowFilename = (originalFilename, index) => {
    const ext = originalFilename.split(".").pop();
    const baseName = originalFilename.split(".")[0];
    // Generate a random hash (simplified version)
    const hash =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    return `${String(index + 1).padStart(
      3,
      "0"
    )}__${baseName}.rf.${hash}.${ext}`;
  };

  // Generate Pascal VOC XML format
  const generateXML = (image, annotations, filename) => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<annotation>
    <folder>images</folder>
    <filename>${filename}</filename>
    <path>${filename}</path>
    <source>
        <database>${projectName}</database>
    </source>
    <size>
        <width>${image.width}</width>
        <height>${image.height}</height>
        <depth>3</depth>
    </size>
    <segmented>0</segmented>
    ${annotations
      .map(
        (anno) => `
    <object>
        <name>${anno.class_name}</name>
        <pose>Unspecified</pose>
        <truncated>0</truncated>
        <difficult>0</difficult>
        <bndbox>
            <xmin>${Math.round(anno.x)}</xmin>
            <ymin>${Math.round(anno.y)}</ymin>
            <xmax>${Math.round(anno.x + anno.width)}</xmax>
            <ymax>${Math.round(anno.y + anno.height)}</ymax>
        </bndbox>
    </object>`
      )
      .join("")}
</annotation>`;

    return xmlContent;
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
    splitData.forEach((item, index) => {
      try {
        const { src } = item;
        const roboflowFilename = generateRoboflowFilename(item.filename, index);

        // Save image
        const base64Data = src.includes("base64,")
          ? src.split("base64,")[1]
          : src;
        splitFolders[splitName].file(roboflowFilename, base64Data, {
          base64: true,
        });

        // Generate and save XML annotation
        const validAnnotations = item.rectangle_annotations?.filter(
          (annotation) =>
            annotation.class_name && annotation.type === "rectangle"
        );

        if (validAnnotations && validAnnotations.length > 0) {
          const xmlContent = generateXML(
            item,
            validAnnotations,
            roboflowFilename
          );
          const xmlFilename = roboflowFilename.replace(/\.[^/.]+$/, ".xml");
          splitFolders[splitName].file(xmlFilename, xmlContent);
        }
      } catch (error) {
        console.error(`Error processing item ${item.filename}:`, error);
      }
    });
  }

  // Generate and download zip
  try {
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName}_PascalVOC_dataset.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating zip file:", error);
    throw error;
  }
};
