import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useStore from "../../Zustand/Alldata";
import { useParams, Link } from "react-router-dom";
import Analysis from "./Image Project/Analysis";
import Spinner from "./Image Project/loading_screen";
import Main from "./Image Project/Main";
import { HiAnnotation } from "react-icons/hi";

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
        toast.error("Error loading project details", {
          style: {
            background: "#fff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          },
        });
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
        toast.error("Project Not Found", {
          style: {
            background: "#fff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          },
        });
        setLoading(false);
      }
    };

    if (projectName) {
      fetchImages();
    }
  }, [projectName, clear_classes, setImageSrc]);

  return (
    <div className="select-none w-full h-screen flex justify-center items-center bg-gradient-to-t from-gray-100 to-white overflow-hidden">
      <div className="w-full h-full">
        {loading ? (
          <div className="h-screen flex flex-col">
            <nav className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-5 shadow-lg">
              <div className=" flex items-center justify-between">
                <Link className="flex items-center">
                  <HiAnnotation className="mr-3 text-4xl transform transition-transform duration-300 hover:scale-110" />
                  <h1 className="text-3xl font-extrabold tracking-wide">
                    Datascribe.ai{" "}
                  </h1>
                </Link>
              </div>
            </nav>

            <div className="h-[100vh] flex items-center justify-center pb-80">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading project</p>
              </div>{" "}
            </div>
          </div>
        ) : analysis_page ? (
          <div className="w-full h-full bg-gray-50">
            <Analysis set_analysis_page={set_analysis_page} />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-50">
            <Main />
          </div>
        )}
      </div>
    </div>
  );
}

export default Imagehome;
