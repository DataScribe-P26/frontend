import { brightColors } from "../constants/colorConstants";

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

  const new_rectangles = image.rectangle_annotations.map((rect) => ({
    ...rect,
    x: rect.x * image.width_multiplier + offsetX,
    y: rect.y * image.height_multiplier + offsetY,
    width: rect.width * image.width_multiplier,
    height: rect.height * image.height_multiplier,
  }));

  const new_polygons = image.polygon_annotations.map((polygon) => ({
    ...polygon,
    points: polygon.points.map((point) => ({
      x: point.x * scale + offsetX,
      y: point.y * scale + offsetY,
    })),
  }));

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

export const isValidColor = (color) => /^#[0-9A-F]{6}$/i.test(color);

export const randomBrightColor = (index) =>
  brightColors[index % brightColors.length];
