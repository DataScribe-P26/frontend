import React, { useState } from "react";
import {
  AiOutlineDatabase,
  AiOutlineTag,
  AiOutlineDown,
  AiOutlineUp,
  AiOutlineHome, // Home icon
} from "react-icons/ai";
import { BsFillGridFill } from "react-icons/bs"; // Workspace icon
import { FiUpload } from "react-icons/fi";
import { LuDownload } from "react-icons/lu";
import { Link, useParams } from "react-router-dom"; // Import necessary hooks
import textStore from "../zustand/Textdata"; // Import Zustand store

const Sidebar = ({ darkMode }) => { // Accept darkMode prop
  const [isDatasetOpen, setDatasetOpen] = useState(true); // Initially open
  const { projectName } = useParams(); // Get project name from URL
  const { isUploaded } = textStore(); // Get isUploaded from Zustand store

  return (
    <div className={`flex flex-col h-screen w-64 p-5 shadow-xl border-r ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h2 className={`text-lg font-semibold mb-5 ${darkMode ? 'text-white' : 'text-black'}`}>Menu</h2>
      <ul className="space-y-3">
        {/* Home Button */}
        <li>
          <Link
            to={`/home/${projectName}`} // Link to HomePage with projectName in URL
            className={`flex items-center w-full text-left p-3 rounded-lg hover:bg-indigo-500 hover:text-white transition ${darkMode ? 'text-white' : 'text-black'}`}
          >
            <AiOutlineHome className="mr-2" />
            Home
          </Link>
        </li>

        {/* Dataset Section */}
        <li>
          <button
            className={`flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-indigo-500 hover:text-white transition ${darkMode ? 'text-white' : 'text-black'}`}
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
              {!isUploaded && (
                <li>
                  <Link
                    to={`/text/${projectName}/content`} // Import page link
                    className={`flex items-center w-full text-left p-2 rounded-lg hover:bg-indigo-100 transition ${darkMode ? 'text-white hover:bg-indigo-700' : 'text-black hover:bg-indigo-100'}`}
                  >
                    <FiUpload className="mr-2" />
                    Import
                  </Link>
                </li>
              )}
              <li>
                <button className={`flex items-center w-full text-left p-2 rounded-lg hover:bg-indigo-100 transition ${darkMode ? 'text-white hover:bg-indigo-700' : 'text-black hover:bg-indigo-100'}`}>
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
            className={`flex items-center w-full text-left p-3 rounded-lg hover:bg-indigo-500 hover:text-white transition ${darkMode ? 'text-white' : 'text-black'}`}
          >
            <AiOutlineTag className="mr-2" />
            Label
          </Link>
        </li>

        {/* Workspace Section */}
        <li>
          <Link
            to={`/text/${projectName}/filecontentdisplay`} // Correctly points to FileContentDisplay
            className={`flex items-center w-full text-left p-3 rounded-lg hover:bg-indigo-500 hover:text-white transition ${darkMode ? 'text-white' : 'text-black'}`}
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
