import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  ArrowLeft,
} from "lucide-react";
import Stages from "../../components/imageProject/annotationSection/drawing";
import Options from "../../components/imageProject/annotationSection/Options";
import useStore from "../../state/store/imageData/combinedImageData";
import toast from "react-hot-toast";
import api from "../../state/api-client/api";
import AnnotationsLabels from "../../components/imageProject/annotationSection/AnnotationsLabels";
import Modal from "../../components/imageProject/annotationSection/classaddModal";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageNavbar from "../../components/imageProject/annotationSection/ImageNavbar";
import { useTheme } from "../../utils/ThemeUtils";
import { X } from "lucide-react";
import ExportModal from "../../components/imageProject/exportOption/export_modal";
import { USER_TYPE } from "../../constants/user-type";
import { Sidebar } from "../../components/imageProject/annotationSection/ImageSidebar";
import HomePage from "../../components/home/Hero";
import ProjectsPage from "../../components/home/Projects";
import OrganizationsPage from "../../components/home/Organisation";
import { Profile } from "../../components/home/Profile";

function Main({ set_analysis_page, isCollapsed, setIsCollapsed }) {
  const {
    imageSrc,
    setImageSrc,
    action,
    setAction,
    current,
    setcurrent,
    classes,
    all_annotations,
    isModalOpen,
    currentIndex,
    setCurrentIndex,
    project_name,
    iscollap,
    setprojectType,
  } = useStore();

  const [activeTab, setActiveTab] = useState("Workspace");
  const { isDarkMode } = useTheme();
  const { projectName } = useParams();
  const [cl, setcl] = useState("");
  const [annotations, setAnnotations] = useState(all_annotations);
  const [showImages, setShowImages] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [istrainedd, setIsTrainedd] = useState(false);
  const [project_type, setproject_type] = useState(
    localStorage.getItem("projectType")
  );
  useEffect(() => {
    const project_tpe = localStorage.getItem("projectType");
    setprojectType(project_tpe);
    setproject_type(project_tpe);
  }, [projectName, project_name]);

  const [annotatedCount, setAnnotatedCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setIsTrainedd(localStorage.getItem(`${projectName}_trained`));
  }, [isProcessing, all_annotations]);

  const loadFromProjectLocalStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(`${projectName}_${key}`);
    try {
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      console.error(`Failed to parse ${key} from localStorage`, e);
      return defaultValue;
    }
  };

  useEffect(() => {
    if (imageSrc.length > 0) {
      const savedIndex = loadFromProjectLocalStorage("currentIndex", 0);

      if (savedIndex) {
        const index = parseInt(savedIndex, 10);
        if (index >= 0 && index < imageSrc.length) {
          setCurrentIndex(index);
          setcurrent(imageSrc[index].src);
        } else {
          console.warn("Invalid saved index, resetting to 0.");
          setCurrentIndex(0);
          setcurrent(imageSrc[0].src);
        }
      }
    }
  }, [imageSrc, setCurrentIndex, setcurrent, projectName]);

  useEffect(() => {
    if (current && currentIndex !== undefined) {
      localStorage.setItem(
        `${projectName}_currentIndex`,
        JSON.stringify(currentIndex)
      );
    }
  }, [current, currentIndex, projectName]);

  useEffect(() => {
    setAnnotations(all_annotations);
  }, [all_annotations]);

  let currentImage = annotations?.find((image) => image.image_id === current);

  async function submit(currentImage_c = currentImage) {
    const src = current;
    const base64String = src.split(",")[1];
    const fileName = "abcd";

    // Get dimensions from currentImage_c instead of currentImage
    const imageWidth = currentImage_c.width || 0;
    const imageHeight = currentImage_c.height || 0;
    const scale = currentImage_c.width_multiplier; // Calculate scaled dimensions
    const scaledWidth = imageWidth * scale;
    const scaledHeight = imageHeight * scale;

    // Calculate offsets for centering
    const offsetX = (800 - scaledWidth) / 2;
    const offsetY = (450 - scaledHeight) / 2;

    const rectangle_annotations = (currentImage_c?.annotations || [])
      .filter(
        (a) =>
          a.type === "rectangle" && a.class_name !== "" && a.Color !== "black"
      )
      .map((rect) => ({
        ...rect,
        x: (rect.x - offsetX) / scale,
        y: (rect.y - offsetY) / scale,
        width: rect.width / scale,
        height: rect.height / scale,
      }));

    const polygon_annotations = (currentImage_c?.annotations || [])
      .filter(
        (a) =>
          a.type === "polygon" && a.class_name !== "" && a.Color !== "black"
      )
      .map((polygon) => ({
        ...polygon,
        points: polygon.points.map((point) => ({
          x: (point.x - offsetX) / scale,
          y: (point.y - offsetY) / scale,
        })),
      }));

    const segmentation_annotations = (currentImage_c?.annotations || [])
      .filter(
        (a) =>
          a.type === "segmentation" &&
          a.class_name !== "" &&
          a.Color !== "black"
      )
      .map((polygon) => ({
        ...polygon,
        points: polygon.points.map((point) => ({
          x: (point.x - offsetX) / scale,
          y: (point.y - offsetY) / scale,
        })),
      }));

    const imageDetails = {
      width: currentImage_c.width || 0,
      height: currentImage_c.height || 0,
      width_multiplier: currentImage_c.width_multiplier || 1,
      height_multiplier: currentImage_c.height_multiplier || 1,
    };
    let text = {
      text: "",
      entities: [{}],
    };
    const data = {
      rectangle_annotations,
      polygon_annotations,
      segmentation_annotations,
      file_content: base64String,
      file_name: fileName,
      mime_type: "image/jpeg",
      image: imageDetails,
    };
    let type = "image";
    let user_type = "single";
    const userType = localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
    console.log("Current User Type:", userType);
    try {
      const response = await api.post(
        `/projects/${type}/${userType}/${projectName}/upload/`,
        { data1: data },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error(error.message);
      } else {
        console.error("Network Error:", error.message);
        toast.error("Change Not Saved");
      }
    }
  }

  const handleNext = () => {
    if (currentIndex < imageSrc.length - 1) {
      submit();

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setcurrent(imageSrc[nextIndex].src);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      submit();

      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setcurrent(imageSrc[prevIndex].src);
    }
  };

  const handleInputChange = (e) => {
    let newIndex = parseInt(e.target.value, 10) - 1;
    if (newIndex >= 0 && newIndex < imageSrc.length) {
      submit();

      setCurrentIndex(newIndex);
      setcurrent(imageSrc[newIndex].src);
    } else if (newIndex < 0) {
      setCurrentIndex(0);
      setcurrent(imageSrc[0].src);
    } else if (newIndex >= imageSrc.length) {
      const lastIndex = imageSrc.length - 1;
      setCurrentIndex(lastIndex);
      setcurrent(imageSrc[lastIndex].src);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, handlePrev]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage isCollapsed={isCollapsed} />;
      case "profile":
        return <Profile />;
      case "organizations":
        return <OrganizationsPage />;
      case "projects":
        return <ProjectsPage setActiveTab={setActiveTab} />;
      case "Workspace":
        return;
      default:
        return <ProjectsPage />;
    }
  };

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  return (
    <div className="flex flex-row h-screen w-full overflow-hidden">
      <div className={`${sidebarWidth} transition-all duration-300 h-screen`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <div className="h-16">
          <ImageNavbar />
        </div>
        {renderContent()}

        <div
          className={`flex-1 flex justify-center items-center overflow-hidden ${
            isDarkMode ? "bg-black" : "bg-white"
          }`}
        >
          {isModalOpen && <Modal classes={classes} cl={cl} setcl={setcl} />}
          {exportModal && (
            <ExportModal
              setExportModal={setExportModal}
              projectName={project_name}
            />
          )}
          {imageSrc.length > 0 ? (
            <div className="flex w-full h-full">
              <div
                className={`w-1/5 h-full py-6 pt-10 px-4 shadow-sm overflow-y-auto ${
                  isDarkMode ? "bg-slate-800" : "bg-white"
                }`}
              >
                <AnnotationsLabels
                  currentImage={currentImage}
                  classes={classes}
                  setExportModal={setExportModal}
                />
              </div>
              <div
                className={`w-4/5 h-full flex flex-col ${
                  isDarkMode ? "bg-slate-900" : "bg-slate-50"
                }`}
              >
                <div className="w-full h-full flex flex-col">
                  <div
                    className={`fixed top-[64px] right-0 z-50 transition-transform duration-300 ease-in-out ${
                      showImages ? "translate-x-0" : "translate-x-full"
                    }`}
                  >
                    <aside
                      className={`w-[300px] h-[calc(100vh-64px)] ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } shadow-xl`}
                    >
                      <button
                        onClick={() => setShowImages(false)}
                        className={`absolute top-4 right-2 p-1.5 rounded-lg ${
                          isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-200 hover:bg-gray-300"
                        } transition-colors duration-200 z-40`}
                        aria-label="Close sidebar"
                      >
                        <X
                          className={`w-5 h-5 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        />
                      </button>

                      <div className="w-full h-full overflow-y-auto image_scrollbar">
                        <div className="p-4 pt-16 space-y-3">
                          {imageSrc.map((item, index) => (
                            <div
                              key={item.id}
                              ref={
                                index === currentIndex
                                  ? (el) => {
                                      if (el && showImages) {
                                        el.scrollIntoView({
                                          behavior: "auto",
                                          block: "center",
                                        });
                                      }
                                    }
                                  : null
                              }
                              className={`group cursor-pointer relative flex items-center gap-3 p-2 rounded-lg ${
                                isDarkMode
                                  ? "bg-gray-700 hover:bg-gray-600"
                                  : "bg-gray-100 hover:bg-gray-200"
                              } transition-colors duration-200`}
                              onClick={() => {
                                setCurrentIndex(index);
                                setcurrent(imageSrc[index].src);
                              }}
                            >
                              <span
                                className={`absolute top-4 left-4 min-w-[24px] h-6 flex items-center justify-center rounded-full ${
                                  isDarkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-100 text-gray-600"
                                } text-sm font-medium z-10`}
                              >
                                {index + 1}
                              </span>

                              <div
                                className="w-full h-48"
                                onClick={() => {
                                  setCurrentIndex(index);
                                  setcurrent(imageSrc[index].src);
                                }}
                              >
                                <img
                                  src={item.src}
                                  alt={`Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </aside>
                  </div>
                  <div className="h-[8vh] flex items-center justify-between px-5">
                    <button
                      onClick={() => set_analysis_page(true)}
                      className={`
       px-4 py-2 rounded-lg transition-all duration-300 
       flex items-center gap-2
       ${
         isDarkMode
           ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
           : "bg-blue-100 text-blue-800 hover:bg-blue-200"
       }
     `}
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span className="font-medium">Back</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">
                        Annotated: {annotatedCount}
                      </span>
                      {istrainedd ? (
                        <span className="text-sm text-green-600">
                          Model Trained
                        </span>
                      ) : (
                        <>
                          {isProcessing ? (
                            <span className="text-sm text-blue-600">
                              Processing batch with YOLO...
                            </span>
                          ) : (
                            <span className="text-sm text-green-600">Idle</span>
                          )}
                        </>
                      )}
                    </div>
                    <button
                      className={`flex items-center justify-center w-10 h-10 rounded-l-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600 shadow-sm shadow-gray-600"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200 shadow-md shadow-purple-300"
                      }`}
                      onClick={() => {
                        setShowImages(true);
                      }}
                    >
                      <PanelLeftClose className="w-6 h-6 " />
                    </button>
                  </div>
                  <div
                    className="flex-1 gap-4 flex justify-center items-center animate-scaleUp overflow-hidden"
                    onClick={() => {
                      setShowImages(false);
                    }}
                  >
                    <Stages
                      imageSrc={imageSrc.find((img) => img.src === current)}
                      action={action}
                      images={imageSrc}
                      current={current}
                      cl={cl}
                      setcl={setcl}
                      submit={submit}
                      isProcessing={isProcessing}
                      setIsProcessing={setIsProcessing}
                      annotatedCount={annotatedCount}
                      setAnnotatedCount={setAnnotatedCount}
                      istrainedd={istrainedd}
                    />
                    <div>
                      <Options
                        setAction={setAction}
                        action={action}
                        submit={submit}
                        project_type={project_type}
                      />
                    </div>
                  </div>
                  <div
                    className="h-[10vh] flex justify-center items-center p-4"
                    onClick={() => {
                      setShowImages(false);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        className={`p-3 rounded-lg transition-all duration-200 hover:scale-102 ${
                          isDarkMode
                            ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                        onClick={handlePrev}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="flex items-center">
                        <input
                          type="text"
                          className={`w-12 h-10 px-2 text-center font-medium rounded-l-lg focus:outline-none ${
                            isDarkMode
                              ? "bg-gray-800 text-white border-r border-gray-700"
                              : "bg-gray-100 text-gray-900 border-r border-gray-200"
                          }`}
                          value={currentIndex + 1}
                          onChange={handleInputChange}
                          min={1}
                          max={imageSrc.length}
                          aria-label="Current image number"
                        />
                        <div
                          className={`h-10 px-3 flex items-center font-medium rounded-r-lg ${
                            isDarkMode
                              ? "bg-gray-800 text-gray-400"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {imageSrc.length}
                        </div>
                      </div>

                      <button
                        className={`p-3 rounded-lg transition-all duration-200 hover:scale-102  ${
                          isDarkMode
                            ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                        onClick={handleNext}
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
