import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Menu, Home, Database, Tag, Grid, Upload, Download } from "lucide-react";
import { HiAnnotation } from "react-icons/hi";
import textStore from "../zustand/Textdata";
import { useTheme } from "../../text_pages/Text/ThemeContext.jsx";
import ExportModal from "./ExportModal.jsx";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDatasetOpen, setDatasetOpen] = useState(true);
  const { projectName } = useParams();
  const { isUploaded, content } = textStore();
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shouldShowImport = !isUploaded && !content;

  return (
    <div
      className={`fixed z-50 left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo and Toggle Button */}
      <div className={`flex items-center mb-6 ${isCollapsed ? "flex-col" : "justify-between"}`}>
        <Link to="/home" className="flex items-center gap-3">
          <div className="flex items-center">
            <HiAnnotation
              className={`text-4xl text-purple-400 transform transition-transform duration-300 hover:scale-110 ${
                isCollapsed ? "mb-2" : "mr-2"
              }`}
            />
            {!isCollapsed && (
              <h1 className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                Datascribe.ai
              </h1>
            )}
          </div>
        </Link>

        {/* <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
            isCollapsed ? "mt-2" : ""
          }`}
        >
          <Menu size={22} />
        </button> */}
      </div>

      {/* Sidebar Items */}
      <div className="space-y-6">
        {/* Home Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">
              MAIN
            </h3>
          )}
          <Link
            to={`/user-project/ner_tagging/${projectName}`}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <Home size={18} className="shrink-0" />
            {!isCollapsed && <span>Home</span>}
          </Link>
        </div>

        {/* Dataset Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">
              DATASET
            </h3>
          )}
          <button
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setDatasetOpen(!isDatasetOpen)}
          >
            <div className="flex items-center space-x-3">
              <Database size={18} className="shrink-0" />
              {!isCollapsed && <span>Dataset</span>}
            </div>
          </button>

          {isDatasetOpen && !isCollapsed && (
            <div className="pl-4 mt-2 space-y-1">
              {shouldShowImport && (
                <Link
                  to={`/text/${projectName}/content`}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <Upload size={18} className="shrink-0" />
                  <span>Import</span>
                </Link>
              )}
              <button
                className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setIsModalOpen(true)}
              >
                <Download size={18} className="shrink-0" />
                <span>Export</span>
              </button>
            </div>
          )}
        </div>

        {/* Label Section */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">
              LABELING
            </h3>
          )}
          <Link
            to={`/text/${projectName}/labelManager`}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <Tag size={18} className="shrink-0" />
            {!isCollapsed && <span>Label</span>}
          </Link>
        </div>

        {/* Workspace Section */}
        {content && (
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">
                WORKSPACE
              </h3>
            )}
            <Link
              to={`/text/${projectName}/filecontentdisplay`}
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <Grid size={18} className="shrink-0" />
              {!isCollapsed && <span>Workspace</span>}
            </Link>
          </div>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectName={projectName}
      />
    </div>
  );
};

export default Sidebar;
