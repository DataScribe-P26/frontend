import { useEffect, useRef, useState } from "react";
import Imageupload from "../image upload and display/Imageupload";
import Stages from "../Drawing/Stages";
import Options from "../Drawing/Options";
import useStore from "../../../Zustand/Alldata";
import toast from "react-hot-toast";
import axios from "axios";
import AnnotationsLabels from "../Drawing/AnnotationsLabels";
import Modal from "../Drawing/Modal";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { MdCloudUpload } from "react-icons/md";

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
  } = useStore();
  const { projectName } = useParams();
  const [cl, setcl] = useState("");
  const [annotations, setAnnotations] = useState(all_annotations);

  useEffect(() => {
    setAnnotations(all_annotations);
  }, [all_annotations]);

  const currentImage = annotations.find((image) => image.image_id === current);

  async function submit() {
    if (
      !currentImage ||
      !imageSrc ||
      typeof current !== "string" ||
      !imageSrc.find((img) => img.src === current)
    ) {
      console.error("Invalid inputs:", {
        currentImage,
        imageSrc,
        current,
        projectName,
      });
      toast.error("Invalid input data.");
      return;
    }

    const src = current;
    const base64String = src.split(",")[1];
    const fileName = "abcd";

    const rectangle_annotations = currentImage.annotations.filter(
      (a) => a.type === "rectangle"
    );
    const polygon_annotations = currentImage.annotations.filter(
      (a) => a.type === "polygon"
    );
    console.log("rec", rectangle_annotations);
    console.log("poly", polygon_annotations);

    const data = {
      rectangle_annotations,
      polygon_annotations,
      file_content: base64String,
      file_name: fileName,
      mime_type: "image/jpeg",
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
        toast.error("Change Not Saved");
      } else {
        console.error("Network Error:", error.message);
        toast.error("Change Not Saved");
      }
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < imageSrc.length - 1) {
      if (currentImage?.annotations?.length > 0) {
        submit();
      }
      setCurrentIndex(currentIndex + 1);
      setcurrent(imageSrc[currentIndex + 1].src);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      if (currentImage?.annotations?.length > 0) {
        submit();
      }
      setCurrentIndex(currentIndex - 1);
      setcurrent(imageSrc[currentIndex - 1].src);
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

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handle_more_image = (e) => {
    const files = Array.from(e.target.files);
    const images = [];
    let processedFiles = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const exists = imageSrc.some((imgg) => imgg.src === img.src);

          if (!exists) {
            images.push({
              src: img.src,
              file: file, // Store the file object
              rectangle_annotations: [],
              polygon_annotations: [],
            });
          }

          processedFiles += 1;

          if (processedFiles === files.length) {
            const newImages = [...(imageSrc || []), ...images];
            console.log("Updating imageSrc with:", newImages);
            setImageSrc(newImages);
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <div className="select-none w-full h-screen flex justify-center items-center bg-gradient-to-t from-purple-900 to-slate-900 overflow-hidden">
        {isModalOpen && <Modal classes={classes} cl={cl} setcl={setcl} />}
        {imageSrc?.length > 0 ? (
          <div className="flex w-full h-screen">
            <div className="w-[20vw] h-screen rounded-r-xl bg-gradient-to-t from-purple-900 to-neutral-900 border-r-4 border-purple-900 py-6 pt-10 px-[20px]">
              <AnnotationsLabels
                currentImage={currentImage}
                classes={classes}
              />
            </div>
            <div className="w-[80vw] h-screen flex-col">
              <div className="w-full h-[100vh] ">
                <div className="w-full h-[10vh] flex items-end justify-end gap-3 px-10"></div>
                <div className=" h-[70vh] gap-4 flex justify-center items-center mt-5">
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
                <div className="w-full h-[15vh]  flex justify-center">
                  <div className="h-[4rem] flex items-center">
                    <button
                      className="h-[3rem] py-3 bg-slate-400 px-4 flex items-center rounded-l-xl"
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                    >
                      <FaArrowLeft />
                    </button>
                    <div className="h-[3rem] py-1 flex items-center bg-slate-300 pr-5 pl-2">
                      <input
                        type="number"
                        value={currentIndex + 1}
                        onChange={handleInputChange}
                        min={0}
                        max={imageSrc.length}
                        className="text-end bg-slate-300 flex justify-end no-spinner w-5 min-w-[20px] max-w-[30px]"
                      />
                      /{imageSrc.length}
                    </div>
                    <button
                      className="h-[3rem] py-1 bg-slate-400 px-4 flex items-center rounded-r-xl"
                      onClick={handleNext}
                      disabled={currentIndex === imageSrc.length - 1}
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Imageupload setImageSrc={setImageSrc} />
          </>
        )}
      </div>
    </>
  );
}

export default Main;
