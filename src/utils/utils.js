export const loadFromLocalStorage = (key, defaultValue) => {
  const saved = localStorage.getItem(key);
  try {
    if (key === "current" && saved && saved.startsWith("data:image")) {
      return saved;
    }
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error(`Failed to parse ${key} from localStorage`, e);
    return defaultValue;
  }
};

export const processAnnotations = (image) => {
  const scale = image.width_multiplier;
  const scaledWidth = image.width * scale;
  const scaledHeight = image.height * scale;

  const offsetX = (800 - scaledWidth) / 2;
  const offsetY = (450 - scaledHeight) / 2;

  //  rectangle annotations
  const new_rectangles = image.rectangle_annotations.map((rect) => ({
    ...rect,
    x: rect.x * image.width_multiplier + offsetX,
    y: rect.y * image.height_multiplier + offsetY,
    width: rect.width * image.width_multiplier,
    height: rect.height * image.height_multiplier,
  }));

  //  polygon annotations
  const new_polygons = image.polygon_annotations.map((polygon) => ({
    ...polygon,
    points: polygon.points.map((point) => ({
      x: point.x * scale + offsetX,
      y: point.y * scale + offsetY,
    })),
  }));

  //  segmentation annotations
  const new_segmentation = image.segmentation_annotations.map((polygon) => ({
    ...polygon,
    points: polygon.points.map((point) => ({
      x: point.x * scale + offsetX,
      y: point.y * scale + offsetY,
    })),
  }));

  return {
    image_id: image.src,
    annotations: [...new_rectangles, ...new_polygons, ...new_segmentation],
    id: image.id,
    width_multiplier: image.width_multiplier,
    height_multiplier: image.height_multiplier,
    width: image.width,
    height: image.height,
    auto_annotated: image.auto_annotated,
  };
};

export const brightColors = [
  "#FFB3BA", // Soft Pink
  "#FFDFBA", // Soft Peach
  "#FFFFBA", // Soft Yellow
  "#B3FFBA", // Soft Green
  "#BAE1FF", // Soft Blue
  "#FFCCF9", // Soft Lavender
  "#C6E2FF", // Light Sky Blue
  "#FFD1DC", // Soft Coral
  "#FDFD96", // Pastel Yellow
  "#D3FFCE", // Pastel Mint Green
  "#B19CD9", // Soft Purple
  "#FFDAC1", // Peach
  "#C2C2F0", // Light Lilac
  "#FFFFCC", // Light Cream
  "#FFC0CB", // Pastel Pink
  "#E0BBE4", // Light Lavender
  "#C8A2C8", // Soft Mauve
  "#F4B8F7", // Soft Pinkish Purple
  "#FFDEAD", // Navajo White
  "#E6E6FA", // Lavender
];

export const isValidColor = (color) => /^#[0-9A-F]{6}$/i.test(color);

export const randomBrightColor = (index) =>
  brightColors[index % brightColors.length];
