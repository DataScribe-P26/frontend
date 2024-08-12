import { RiRectangleLine } from "react-icons/ri";
import { BsVectorPen } from "react-icons/bs";
import { BiPolygon } from "react-icons/bi";
import { FaRegSave } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";

function Options({ action, setAction, submit }) {
  return (
    <div>
      <div className="w-[3.43rem] h-[6.92rem] bg-slate-500 rounded-full flex flex-col justify-center items-center gap-[6px] mt-6">
        <button
          className={`rounded-full w-11 h-11 flex items-center justify-center bg-slate-400 `}
          onClick={() => {
            const a = confirm("Do you want to delete");
            if (a) {
            }
          }}
        >
          <MdDelete style={{ width: "50%", height: "50%", color: "red" }} />
        </button>
        <button
          className={`rounded-full w-11 h-11 flex items-center justify-center bg-slate-400`}
          onClick={() => {
            submit();
            toast.success("Changes Saved");
          }}
        >
          <FaRegSave style={{ width: "50%", height: "50%", color: "green" }} />
        </button>
      </div>

      <div className="w-[3.43rem] h-[10rem] bg-slate-500 rounded-full flex flex-col justify-center items-center gap-[6px] mt-6">
        <button
          className={`rounded-full w-11 h-11 flex items-center justify-center ${
            action === "rectangle" ? "bg-slate-200" : "bg-slate-400"
          }`}
          onClick={() => {
            if (action == "rectangle") {
              setAction("");
            } else {
              setAction("rectangle");
            }
          }}
        >
          <RiRectangleLine style={{ width: "60%", height: "60%" }} />
        </button>
        <button
          className={`rounded-full w-11 h-11 flex items-center justify-center ${
            action === "polygon" ? "bg-gray-200" : "bg-slate-400"
          }`}
          onClick={() => {
            if (action == "polygon") {
              setAction("");
            } else {
              setAction("polygon");
            }
          }}
        >
          <BsVectorPen style={{ width: "60%", height: "60%" }} />
        </button>
        <button
          className={`rounded-full w-11 h-11 flex items-center justify-center ${
            action === "segmentation" ? "bg-gray-200" : "bg-slate-400"
          }`}
          onClick={() => {
            if (action == "segmentation") {
              setAction("");
            } else {
              setAction("segmentation");
            }
          }}
        >
          <BiPolygon style={{ width: "60%", height: "60%" }} />
        </button>
      </div>
    </div>
  );
}

export default Options;
