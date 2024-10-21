import { RiRectangleLine } from "react-icons/ri";
import { BsVectorPen } from "react-icons/bs";
import { BiPolygon } from "react-icons/bi";
import { FaLock, FaRegSave } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaAnchorLock } from "react-icons/fa6";
import toast from "react-hot-toast";

function Options({ action, setAction, submit }) {
  return (
    <div>
      <div className="w-[3.43rem] h-auto bg-white border border-slate-200 rounded-2xl flex flex-col justify-center items-center gap-3 py-4 shadow-md">
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
      </div>
    </div>
  );
}
export default Options;
