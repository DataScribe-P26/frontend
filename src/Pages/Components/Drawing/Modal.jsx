import React, { useState } from "react";
import useStore from "../../../Zustand/Alldata";
import toast from "react-hot-toast";

function Modal({ classes, setcl }) {
  const { isModalOpen, closeModal, add_classes } = useStore((state) => ({
    isModalOpen: state.isModalOpen,
    closeModal: state.closeModal,
    add_classes: state.add_classes,
  }));

  const [newclass, setnewclass] = useState("");

  function handle_add_class(e) {
    e.preventDefault();
    if (newclass !== null && newclass !== "") {
      const exists = classes.some(
        (clas) => clas.class_label.toLowerCase() === newclass.toLowerCase()
      );
      if (!exists) {
        add_classes(newclass);
        setnewclass("");
        toast.success("Added the class");
      } else {
        toast.error("Class Already Exists");
      }
    }
  }

  

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-start bg-black/30 w-full h-full pl-12 ">
      <div className="bg-white rounded-lg p-6 w-3/4 max-w-md h-auto relative pt-14">
        <button
          className="absolute top-5 right-5 font-semibold text-xl p-2 text-red-700"
          onClick={() => closeModal()}
        >
          X
        </button>
        <form
          onSubmit={handle_add_class}
          className="flex h-[5rem] items-center gap-5"
        >
          <input
            value={newclass}
            onChange={(e) => setnewclass(e.target.value)}
            className="bg-slate-300 px-3 py-3 rounded-lg"
            placeholder="Add New Class?"
          />
          <button
            type="submit"
            className="px-3 py-3 text-white bg-green-500 rounded-md"
          >
            Add Class +
          </button>
        </form>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select the class</h2>
        </div>
        <div className="mt-4">
          {classes.map((classs, index) => (
            <div
              key={index}
              className="cursor-pointer hover:bg-slate-400 px-2 hover:rounded-md py-1"
              style={{ color: classs.color }}
              onClick={() => {
                setcl(classs.class_label);
                closeModal(classs.class_label);
              }}
            >
              {classs.class_label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Modal;
