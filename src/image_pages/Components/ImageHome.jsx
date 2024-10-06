import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useStore from "../../Zustand/Alldata";
import { useParams } from "react-router-dom";
import Analysis from "./Image Project/Analysis";
import Spinner from "./Image Project/loading_screen";
import Main from "./Image Project/Main";

function Imagehome() {
  const {
    setImageSrc,
    imageSrc,
    clear_classes,
    setcurrent,
    setCurrentIndex,
    setCreatedOn,
    created_on,
  } = useStore();
  const { projectName } = useParams();
  const [loading, setLoading] = useState(false);
  const [annots, setAnnots] = useState([]);
  const [analysis_page, set_analysis_page] = useState(true);

  if (created_on === "" || created_on == null) {
    axios
      .get("http://127.0.0.1:8000/projects")
      .then((response) => {
        const projects = response.data;
        const project = projects.find((p) => p.name === projectName);
        if (project) {
          setCreatedOn(project.created_on);
        } else {
          console.log("Project not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setImageSrc([]);
        setLoading(true);
        clear_classes();
        const response = await axios.get(
          `http://127.0.0.1:8000/projects/${projectName}/images/`
        );
        console.log(response.data);
        if (response.data.length > 0) {
          const formattedImages = response.data.map((image) => ({
            src: `data:image/jpeg;base64,${image.src}`,
            rectangle_annotations: image.rectangle_annotations,
            polygon_annotations: image.polygon_annotations,
            segmentation_annotations: image.segmentation_annotations,
            id: image.image_id,
            width_multiplier: image.width_multiplier,
            height_multiplier: image.height_multiplier,
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
  }, [projectName, clear_classes, setImageSrc]);

  return (
    <div className="select-none w-full h-screen flex justify-center items-center bg-gradient-to-t from-purple-900 to-slate-900 overflow-hidden">
      {loading ? (
        <Spinner />
      ) : analysis_page ? (
        <Analysis set_analysis_page={set_analysis_page} />
      ) : (
        <Main />
      )}
    </div>
  );
}

export default Imagehome;