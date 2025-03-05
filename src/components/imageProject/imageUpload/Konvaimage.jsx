import { Image } from "react-konva";
import useImage from "use-image";

function KonvaImage({ image, onLoad }) {
  const [img] = useImage(image.src);

  if (!img) {
    return null;
  }

  // Calculate scaling that maintains aspect ratio
  const scaleX = 800 / img.width;
  const scaleY = 450 / img.height;
  const scale = Math.min(scaleX, scaleY);

  // Calculate actual dimensions after scaling
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;

  // Center the image
  const x = (800 - scaledWidth) / 2;
  const y = (450 - scaledHeight) / 2;

  // Call onLoad with the dimensions and scale
  if (onLoad) {
    onLoad({
      width: img.width,
      height: img.height,
      width_multiplier: scale, // Same scale for both to maintain aspect ratio
      height_multiplier: scale, // Same scale for both to maintain aspect ratio
      x: x,
      y: y,
    });
  }

  return (
    <Image
      image={img}
      width={img.width}
      height={img.height}
      scale={{ x: scale, y: scale }}
      x={x}
      y={y}
    />
  );
}

export default KonvaImage;
