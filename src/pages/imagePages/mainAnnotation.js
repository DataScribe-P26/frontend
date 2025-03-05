import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useStore from "../../state/store/imageData/combinedImageData";
import { useParams, Link } from "react-router-dom";
import Analysis from "./Image Project/Analysis";
import Main from "./Main";
import Navbar from "../../text_pages/Text/Navbar";
import { useTheme } from "../../context/ThemeContext"; // Import dark mode context
import { useAuth } from "../../context/AuthContext";
import TopBar from "../../components/navbar/Navbar";
import { Sidebar } from "../../components/imageProject/annotationSection/ImageSidebar";

function Imagehome() {
  const {
    setImageSrc,
    imageSrc,
    clear_classes,
    setcurrent,
    setCurrentIndex,
    setCreatedOn,
    created_on,
    project_name,
  } = useStore();

  const [activeTab, setActiveTab] = useState("Workspace");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { projectName } = useParams();
  const [loading, setLoading] = useState(false);
  const [annots, setAnnots] = useState([]);
  const [analysis_page, set_analysis_page] = useState(true);
  const { user } = useAuth();

  // Access dark mode state
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Apply the dark mode class to the body tag
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    return () => {
      // Clean up on component unmount
      document.body.classList.remove("dark");
    };
  }, [isDarkMode]);

  if (created_on === "" || created_on == null) {
    axios
      .get(`http://127.0.0.1:8000/user-projects/?email=${user.email}`)
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
    // Create a new controller for each effect instance
    const controller = new AbortController();

    const fetchImages = async () => {
      setLoading(true);
      let user_type = "single";
      const userType = localStorage.getItem("userType");
      console.log("Current User Type:", userType);

      try {
        setImageSrc([]);
        clear_classes();

        const response = await axios.get(
          `http://127.0.0.1:8000/projects/image/${userType}/${projectName}/${user.email}`,
          { signal: controller.signal }
        );

        if (response.data.length > 0) {
          console.log(response.data);
          const formattedImages = response.data.map((image) => ({
            src: `data:image/jpeg;base64,${image.src}`,
            rectangle_annotations: image.rectangle_annotations,
            polygon_annotations: image.polygon_annotations,
            segmentation_annotations: image.segmentation_annotations,
            id: image.image_id,
            width_multiplier: image.width_multiplier,
            height_multiplier: image.height_multiplier,
            width: image.width,
            height: image.height,
            auto_annotated: image.auto_anotated,
          }));
          setImageSrc(formattedImages);
        } else {
          setImageSrc([]);
        }
      } catch (error) {
        // Only show error if it's not a cancellation
        if (!axios.isCancel(error)) {
          console.error("Error fetching images:", error);
          toast.error("Project Not Found", {
            style: {
              background: "#fff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            },
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (projectName) {
      fetchImages();
    }

    // Cleanup function will be called when either projectName or project_name changes
    // or when the component unmounts
    return () => {
      console.log("Aborting previous request");
      controller.abort();
    };
  }, [projectName, project_name, clear_classes, setImageSrc]);

  return (
    <div
      className={`select-none w-full h-screen flex justify-center items-center ${
        isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-t from-gray-100 to-white text-gray-800"
      } overflow-hidden`}
    >
      <div className="w-full h-full">
        {loading ? (
          <div className="h-screen flex flex-col">
            <TopBar />
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
            <div className="h-[100vh] flex items-center justify-center pb-80">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading project</p>
              </div>{" "}
            </div>
          </div>
        ) : analysis_page ? (
          <div
            className={`w-full h-full ${
              isDarkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <Analysis
              set_analysis_page={set_analysis_page}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          </div>
        ) : (
          <div
            className={`w-full h-full ${
              isDarkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <Main
              projectName={projectName}
              set_analysis_page={set_analysis_page}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Imagehome;
