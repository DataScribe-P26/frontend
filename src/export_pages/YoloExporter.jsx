import JSZip from "jszip";

export const exportYOLODataset = async (annotations, splits) => {
  // Validate input
  if (!Array.isArray(annotations) || annotations.length === 0) {
    throw new Error("No annotations provided or invalid format");
  }

  const zip = new JSZip();
  const dataset = zip.folder("yolo_dataset");
  const images = dataset.folder("images");
  const labels = dataset.folder("labels");

  // Create split folders
  const splitFolders = {
    train: { images: images.folder("train"), labels: labels.folder("train") },
    test: { images: images.folder("test"), labels: labels.folder("test") },
    val: { images: images.folder("val"), labels: labels.folder("val") },
  };

  // Filter valid annotations and shuffle
  const validAnnotations = annotations.filter((item) => {
    return item && item.src && item.filename && item.width && item.height;
  });

  if (validAnnotations.length === 0) {
    throw new Error("No valid annotations found with required properties");
  }

  // Since there are no class annotations in this format, we'll create an empty classes file
  dataset.file("classes.names", "");

  const shuffledData = [...validAnnotations].sort(() => Math.random() - 0.5);
  const totalFiles = shuffledData.length;
  const trainSize = Math.floor(totalFiles * (splits.training / 100));
  const testSize = Math.floor(totalFiles * (splits.testing / 100));

  const dataSplits = {
    train: shuffledData.slice(0, trainSize),
    test: shuffledData.slice(trainSize, trainSize + testSize),
    val: shuffledData.slice(trainSize + testSize),
  };

  // Process each split
  for (const [splitName, splitData] of Object.entries(dataSplits)) {
    const splitImages = [];

    for (const item of splitData) {
      try {
        const { filename, src } = item;

        // Save image
        images.file(`${splitName}/${filename}`, src, { base64: true });
        splitImages.push(`./yolo_dataset/images/${splitName}/${filename}`);

        // Create empty label file since there are no annotations
        const baseName = filename.split(".")[0];
        labels.file(`${splitName}/${baseName}.txt`, "");
      } catch (error) {
        console.error(`Error processing item ${item.filename}:`, error);
      }
    }

    // Create list files
    dataset.file(`${splitName}.txt`, splitImages.join("\n"));
  }

  // Create data.yaml
  const yamlContent = `
path: ./yolo_dataset
train: ./yolo_dataset/images/train
val: ./yolo_dataset/images/val
test: ./yolo_dataset/images/test

nc: 0
names: []
`.trim();

  dataset.file("data.yaml", yamlContent);

  // Generate and download zip
  try {
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "yolo_dataset.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating zip file:", error);
    throw error;
  }
};
