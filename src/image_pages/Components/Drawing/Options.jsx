import { RiRectangleLine } from "react-icons/ri";
import { BsVectorPen } from "react-icons/bs";
import { BiPolygon } from "react-icons/bi";
import { FaLock, FaRegSave } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaAnchorLock } from "react-icons/fa6";
import toast from "react-hot-toast";
import useStore from "../../../state/store/imageData/Alldata";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Options({ action, setAction, submit, project_type }) {
  const {
    projecttype,
    setprojectType,
    currentIndex,
    all_annotations,
    set_allAnnotations,
    setAnnotations,
    current,
    setcurrent,
    setCurrentIndex,
    imageSrc,
    setImageSrc,
  } = useStore();
  const { projectName } = useParams();
  // Delete image function

  const deleteImage = async () => {
    const image_id = all_annotations[currentIndex].id;
    const userType = localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/images/${projectName}/${userType}/${image_id}`
      );

      // Filter out the deleted annotation
      const updatedAnnotations = all_annotations.filter(
        (annotation) => annotation.id !== image_id
      );
      set_allAnnotations(updatedAnnotations);
      //setAnnotations((prev) => prev.filter((annotation) => annotation.id !== image_id));
      const updatedImageSrc = imageSrc.filter((image) => image.id !== image_id);

      setImageSrc(updatedImageSrc);
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error(error.message);
      } else {
        console.error("Network Error:", error.message);
        toast.error("Image not deleted!");
      }
    }
  };

  // Effect to check imageSrc after update
  useEffect(() => {
    console.log("Check imageSrc:", imageSrc);
  }, [imageSrc]);
  return (
    <div>
      <div className="w-[3.43rem] h-auto bg-white border border-slate-200 rounded-2xl flex flex-col justify-center items-center gap-3 py-4 shadow-md">
        {project_type === "image" && (
          <button
            className={`rounded-xl w-11 h-11 flex items-center justify-center transition-all duration-200
            ${
              action === "rectangle"
                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800"
            }`}
            onClick={() => setAction(action === "rectangle" ? "" : "rectangle")}
          >
            <RiRectangleLine style={{ width: "50%", height: "50%" }} />
          </button>
        )}
        {project_type === "instance-segmentation" && (
          <>
            {" "}
            <button
              className={`rounded-xl w-11 h-11 flex items-center justify-center transition-all duration-200
            ${
              action === "polygon"
                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800"
            }`}
              onClick={() => setAction(action === "polygon" ? "" : "polygon")}
            >
              <BsVectorPen style={{ width: "50%", height: "50%" }} />
            </button>
            <button
              className={`rounded-xl w-11 h-11 flex items-center justify-center transition-all duration-200
            ${
              action === "segmentation"
                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800"
            }`}
              onClick={() =>
                setAction(action === "segmentation" ? "" : "segmentation")
              }
            >
              <BiPolygon style={{ width: "50%", height: "50%" }} />
            </button>
          </>
        )}
        <button
          className={`rounded-xl w-11 h-11 flex items-center justify-center transition-all duration-200
            ${
              action === "edit"
                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800"
            }`}
          onClick={() => setAction(action === "edit" ? "" : "edit")}
        >
          <FaAnchorLock style={{ width: "50%", height: "50%" }} />
        </button>
        <div className="w-8 border-t border-slate-200 my-1"></div>
        <button
          className="rounded-xl w-11 h-11 flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all duration-200 shadow-sm"
          onClick={() => {
            submit();
            toast.success("Changes Saved");
          }}
        >
          <FaRegSave style={{ width: "45%", height: "45%" }} />
        </button>
        <button
          className="rounded-xl w-11 h-11 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 shadow-sm"
          onClick={() => {
            deleteImage();
          }}
        >
          <RiDeleteBin5Fill style={{ width: "45%", height: "45%" }} />
        </button>
      </div>
    </div>
  );
}
export default Options;
