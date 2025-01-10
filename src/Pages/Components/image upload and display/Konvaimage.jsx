import { Image } from "react-konva";
import useImage from "use-image";

function Konvaimage({ image }) {
  const [img] = useImage(image.src);

  return <Image image={img} width={800} height={450} />;
}

export default Konvaimage;
