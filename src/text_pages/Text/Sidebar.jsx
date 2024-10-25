import React, { useState } from "react";
import {
  AiOutlineDatabase,
  AiOutlineTag,
  AiOutlineDown,
  AiOutlineUp,
  AiOutlineHome,  // Home icon
} from "react-icons/ai";
import { BsFillGridFill } from "react-icons/bs"; // Workspace icon
import { FiUpload } from "react-icons/fi";
import { LuDownload } from "react-icons/lu";
import { Link, useParams } from "react-router-dom"; // Import necessary hooks
import textStore from "../zustand/Textdata"; // Import Zustand store

const Sidebar = () => {
  const [isDatasetOpen, setDatasetOpen] = useState(true); // Initially open
  const { projectName } = useParams(); // Get project name from URL
  const { isUploaded, content } = textStore(); // Get isUploaded and content from Zustand store

  // Determine if the import option should be shown
  const shouldShowImport = !isUploaded && !content;

  return (
    <div className="flex flex-col bg-white h-screen w-64 p-5 shadow-xl border-r border-gray-200 ">
      <h2 className="text-lg font-semibold mb-5">Menu</h2>
      <ul className="space-y-3">
        {/* Home Button */}
        <li>
          <Link
            to={`/home/${projectName}`} // Link to HomePage with projectName in URL
            className="flex items-center w-full text-left p-3 rounded-lg hover:bg-purple-600 hover:text-white transition"
          >
            <AiOutlineHome className="mr-2" />
            Home
          </Link>
        </li>

        {/* Dataset Section */}
        <li>
          <button
            className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-purple-600 hover:text-white transition"
            onClick={() => setDatasetOpen(!isDatasetOpen)} // Toggle open/close
          >
            <div className="flex items-center">
              <AiOutlineDatabase className="mr-2" />
              Dataset
            </div>
            {isDatasetOpen ? <AiOutlineUp /> : <AiOutlineDown />}
          </button>
          {isDatasetOpen && (
            <ul className="pl-4 mt-2 space-y-1">
              {/* Conditionally render Import option */}
              {shouldShowImport && (
                <li>
                  <Link
                    to={`/text/${projectName}/content`} // Import page link
                    className="flex items-center w-full text-left p-2 rounded-lg hover:bg-purple-200 transition"
                  >
                    <FiUpload className="mr-2" />
                    Import
                  </Link>
                </li>
              )}
              <li>
                <button className="flex items-center w-full text-left p-2 rounded-lg hover:bg-purple-200 transition">
                  <LuDownload className="mr-2" />
                  Export
                </button>
              </li>
            </ul>
          )}
        </li>

        {/* Label Section */}
        <li>
          <Link
            to={`/text/${projectName}/labelManager`} // LabelManager page link
            className="flex items-center w-full text-left p-3 rounded-lg hover:bg-purple-600 hover:text-white transition"
          >
            <AiOutlineTag className="mr-2" />
            Label
          </Link>
        </li>

        {/* Workspace Section */}
        <li>
          <Link
            to={`/text/${projectName}/filecontentdisplay`} // Correctly points to FileContentDisplay
            className="flex items-center w-full text-left p-3 rounded-lg hover:bg-purple-600 hover:text-white transition"
          >
            <BsFillGridFill className="mr-2" />
            Workspace
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;