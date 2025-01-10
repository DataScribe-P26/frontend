import { useEffect, useState } from "react";
import Imageupload from "../image upload and display/Imageupload";
import Stages from "../Drawing/Stages";
import Options from "../Drawing/Options";
import useStore from "../../../Zustand/Alldata";
import toast from "react-hot-toast";
import axios from "axios";
import AnnotationsLabels from "../Drawing/AnnotationsLabels";
import Modal from "../Drawing/Modal";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageNavbar from "../../ImageNavbar.jsx";
import { useTheme } from "../../../text_pages/Text/ThemeContext.jsx";

function Main() {
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
  } = useStore();
  const { isDarkMode } = useTheme();
  const { projectName } = useParams();
  const [cl, setcl] = useState("");
  const [annotations, setAnnotations] = useState(all_annotations);

  const navigate = useNavigate();

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
      const savedCurrent = loadFromProjectLocalStorage("current", null);
      const savedIndex = loadFromProjectLocalStorage("currentIndex", 0);

      if (savedCurrent && savedIndex) {
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
      localStorage.setItem(`${projectName}_current`, JSON.stringify(current));
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

  async function submit() {
    const src = current;
    const base64String = src.split(",")[1];
    const fileName = "abcd";

    const rectangle_annotations = (currentImage?.annotations || [])
      .filter(
        (a) =>
          a.type === "rectangle" && a.class_name !== "" && a.Color !== "black"
      )
      .map((rect) => ({
        ...rect,
        x: rect.x / (currentImage.width_multiplier || 1),
        y: rect.y / (currentImage.height_multiplier || 1),
        width: rect.width / (currentImage.width_multiplier || 1),
        height: rect.height / (currentImage.height_multiplier || 1),
      }));

    const polygon_annotations = (currentImage?.annotations || [])
      .filter(
        (a) =>
          a.type === "polygon" && a.class_name !== "" && a.Color !== "black"
      )
      .map((polygon) => ({
        ...polygon,
        points: polygon.points.map((point) => ({
          x: point.x / (currentImage.width_multiplier || 1),
          y: point.y / (currentImage.height_multiplier || 1),
        })),
      }));

    const segmentation_annotations = (currentImage?.annotations || [])
      .filter(
        (a) =>
          a.type === "segmentation" &&
          a.class_name !== "" &&
          a.Color !== "black"
      )
      .map((polygon) => ({
        ...polygon,
        points: polygon.points.map((point) => ({
          x: point.x / (currentImage.width_multiplier || 1),
          y: point.y / (currentImage.height_multiplier || 1),
        })),
      }));

    console.log(rectangle_annotations);
    const imageDetails = {
      width: currentImage.width || 0,
      height: currentImage.height || 0,
      width_multiplier: currentImage.width_multiplier || 1,
      height_multiplier: currentImage.height_multiplier || 1,
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

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/projects/${projectName}/upload/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
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
      if (currentImage?.annotations?.length > 0) {
        submit();
      }
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setcurrent(imageSrc[nextIndex].src);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      if (currentImage?.annotations?.length > 0) {
        submit();
      }
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setcurrent(imageSrc[prevIndex].src);
    }
  };

  const handleInputChange = (e) => {
    let newIndex = parseInt(e.target.value, 10) - 1;
    if (newIndex >= 0 && newIndex < imageSrc.length) {
      if (currentImage?.annotations?.length > 0) {
        submit();
      }
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

  return (
    <>
      <ImageNavbar />
      <div
        className={`select-none w-full h-[95vh] flex justify-center items-center overflow-hidden ${
          isDarkMode ? "bg-black" : "bg-white"
        }`}
      >
        {isModalOpen && <Modal classes={classes} cl={cl} setcl={setcl} />}
        {imageSrc.length > 0 ? (
          <div className="flex w-full h-full">
            <div
              className={`w-[20vw] h-screen py-6 pt-10 px-[20px] shadow-sm ${
                isDarkMode ? "bg-slate-800" : "bg-white"
              }`}
            >
              <AnnotationsLabels
                currentImage={currentImage}
                classes={classes}
              />
            </div>
            <div
              className={`w-[80vw] h-full flex-col ${
                isDarkMode ? "bg-slate-900" : "bg-slate-50"
              }`}
            >
              <div className="w-full h-full">
                <div className="w-full h-[3%] flex items-end justify-end gap-3 px-10"></div>
                <div className="h-[67.9%] gap-4 flex justify-center items-center mt-5">
                  <Stages
                    imageSrc={imageSrc.find((img) => img.src === current)}
                    action={action}
                    images={imageSrc}
                    current={current}
                    cl={cl}
                    setcl={setcl}
                  />
                  <div>
                    <Options
                      setAction={setAction}
                      action={action}
                      submit={submit}
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center p-8">
                  <div className="flex gap-3">
                    <button
                      className={`px-3 py-5 rounded-lg ${
                        isDarkMode ? "bg-gray-800" : "bg-gray-300"
                      }`}
                      onClick={handlePrev}
                    >
                      <FaArrowLeft />
                    </button>
                    <input
                      className={`w-14 px-2 py-1 rounded text-center ${
                        isDarkMode ? "text-black" : "text-black"
                      }`}
                      value={currentIndex + 1}
                      onChange={handleInputChange}
                    />
                    <button
                      className={`px-4 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-800 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                      onClick={handleNext}
                    >
                      <FaArrowRight />
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
    </>
  );
}

export default Main;
