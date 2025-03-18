import React, { useState } from "react";
import useStore from "../../../state/store/imageStore/combinedImageData";
import toast from "react-hot-toast";
import { useTheme } from "../../../utils/ThemeUtils";

function Modal({ classes, setcl }) {
  const { isDarkMode } = useTheme();

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

  // Handle click outside the modal box
  const handleBackgroundClick = (e) => {
    closeModal();
  };

  // Prevent modal close on click inside the modal content
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-start bg-black/30 w-100vw h-full pl-60"
      onClick={handleBackgroundClick} // Click event for outside the modal
    >
      <div
        className="bg-white rounded-lg p-6 w-3/4 max-w-md h-auto relative pt-14"
        onClick={handleModalClick} // Prevent click event from closing modal
      >
        {
          <button
            className="absolute top-5 right-5 font-semibold text-xl p-2 text-red-700"
            onClick={() => closeModal()}
          >
            X
          </button>
        }
        <form
          onSubmit={handle_add_class}
          className="flex h-[5rem] items-center gap-5"
        >
          <input
            value={newclass}
            onChange={(e) => setnewclass(e.target.value)}
            className="bg-slate-200 px-3 py-3 rounded-lg text-black"
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
          <h2
            className={`${
              isDarkMode ? "text-black" : "text-black"
            } text-xl font-semibold `}
          >
            Select class
          </h2>
        </div>
        <div className="mt-4 mb-8">
          {classes.length > 0 &&
            classes.map((classs, index) => (
              <>
                <div
                  className="flex justify-left items-center bg-slate-200 hover:bg-slate-300 px-2 rounded-md py-[8px] m-1 gap-5"
                  onClick={() => {
                    setcl(classs.class_label);
                    closeModal(classs.class_label);
                  }}
                >
                  <div
                    className="w-10  h-6 border-[0.5px] border-black rounded-full"
                    style={{ backgroundColor: classs.color }}
                  ></div>

                  <div
                    key={index}
                    className="cursor-pointer "
                    style={{ color: "black" }}
                    onClick={() => {
                      setcl(classs.class_label);
                      closeModal(classs.class_label);
                    }}
                  >
                    {classs.class_label}
                  </div>
                </div>
              </>
            ))}
          {classes.length == 0 && (
            <div className="mt3 mb-4">No Class Added</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
