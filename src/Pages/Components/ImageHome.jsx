import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useStore from "../../Zustand/Alldata";
import { useParams } from "react-router-dom";
import Analysis from "./Image Project/Analysis";
import Spinner from "./Image Project/loading_screen";

function Imagehome() {
  const { setImageSrc, imageSrc, setcurrent } = useStore();
  const { projectName } = useParams();
  const [loading, setLoading] = useState(false);
  const [annots, setAnnots] = useState([]);

  useEffect(() => {
    console.log("image", imageSrc);
  }, [imageSrc]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setImageSrc([]);
        setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/projects/${projectName}/images/`
        );

        if (response.data.length > 0) {
          const formattedImages = response.data.map((image) => ({
            src: `data:image/jpeg;base64,${image.src}`,
            rectangle_annotations: image.rectangle_annotations,
            polygon_annotations: image.polygon_annotations,
            id: image.image_id,
          }));

          setAnnots(formattedImages);
          setImageSrc(formattedImages);
        } else {
          setImageSrc([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        toast.error("Project Not Found");
        setLoading(false);
      }
    };

    if (projectName) {
      fetchImages();
    }
  }, [projectName, setImageSrc]);

  return (
    <div className="select-none w-full h-screen flex justify-center items-center bg-gradient-to-t from-purple-900 to-slate-900 overflow-hidden">
      {loading ? (
        <Spinner />
      ) : (
        <Analysis annotations={annots} imageSrc={imageSrc} />
      )}
    </div>
  );
}

export default Imagehome;
