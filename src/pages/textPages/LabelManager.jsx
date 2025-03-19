import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faBars } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/textProject/modals/navbar";
import Sidebar from "../../components/textProject/modals/sidebar";
import toast from "react-hot-toast";
import CreateLabel from "../../components/textProject/modals/createLabel";
import textStore from "../../state/store/textStore/combinedTextSlice";
import { get } from "../../state/api-client/api";
import Footer from "../../components/textProject/modals/footer";
import { useTheme } from "../../utils/themeUtils";
import { USER_TYPE } from "../../constants/userConstants";
import { useAuth } from "../../utils/authUtils";

const LabelManager = () => {
  const { labels, addLabel, deleteLabel, setLabels } = textStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(null);
  const { projectName } = useParams();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        setLabels([]);
        const userType =
          localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
        console.log("current user is", userType);
        const response = await get(
          `/projects/ner_tagging/${userType}/${projectName}/${user.email}`
        );

        if (response.data?.[0]?.entities) {
          const uniqueLabels = Array.from(
            new Set(response.data[0].entities.map((entity) => entity.label))
          ).map((labelName) => {
            const entity = response.data[0].entities.find(
              (e) => e.label === labelName
            );
            return {
              name: labelName,
              color: entity.color || "#000000",
              bgColor: entity.bColor || "#FFFFFF",
              textColor: entity.textColor || "#000000",
            };
          });

          setLabels(uniqueLabels);
        }
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };

    if (labels.length <= 0) {
      fetchLabels();
    }
  }, [projectName, setLabels]);

  const handleCreateLabel = (newLabel) => {
    const isDuplicate = labels.some((label) => label.name === newLabel.name);

    if (isDuplicate) {
      toast.error("Label Name must be unique.");
      return;
    }
    addLabel(newLabel.name);
  };

  const handleEditLabel = (label) => {
    setCurrentLabel(label);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleUpdateLabel = (updatedLabel) => {
    const isDuplicate = labels.some(
      (label) =>
        label.name === updatedLabel.name && label.name !== currentLabel.name
    );

    if (isDuplicate) {
      toast.error("Label Name must be unique.");
      return;
    }

    const updatedLabels = labels.map((label) =>
      label.name === currentLabel.name
        ? { ...label, name: updatedLabel.name }
        : label
    );
    setLabels(updatedLabels);
    setEditMode(false);
    setModalOpen(false);
    setCurrentLabel(null);
  };

  return (
    <div
      className={`flex min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Sidebar isOpen={sidebarOpen} />

      {/* Dynamic width adjustment */}
      <div
        className={`flex flex-col transition-all duration-300 ${
          sidebarOpen
            ? "ml-64 w-[calc(100%-16rem)]"
            : "ml-16 w-[calc(100%-4rem)]"
        }`}
      >
        <Navbar />
        <div
          className={`flex items-center p-4 ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h1 className="text-3xl font-bold ml-4">Label Manager</h1>
        </div>
        <div className="flex-grow p-8 overflow-hidden">
          <button
            onClick={() => {
              setCurrentLabel(null);
              setEditMode(false);
              setModalOpen(true);
            }}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-shadow shadow-lg hover:shadow-xl mb-4"
          >
            Create Label
          </button>

          {labels.length > 0 ? (
            <div className="overflow-auto h-[30rem] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="min-w-full border border-gray-700 text-sm text-left bg-white shadow-md rounded-lg">
                <thead>
                  <tr
                    className={`bg-gray-100  ${
                      isDarkMode
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    <th className="p-2 border-b text-center">Name</th>
                    <th className="p-2 border-b text-center">Color</th>
                    <th className="p-2 border-b text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((label, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-700 ${
                        isDarkMode
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-900"
                      } `}
                    >
                      <td className="p-2 text-center">{label.name}</td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center items-center">
                          <div
                            className="w-6 h-6 rounded-full mr-2"
                            style={{ backgroundColor: label.color }}
                          ></div>
                        </div>
                      </td>
                      <td className="p-2 text-center flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditLabel(label)}
                          className="text-yellow-500 p-2 hover:text-yellow-600 transition"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => deleteLabel(label.name)}
                          className="text-red-500 p-2 hover:text-red-600 transition"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mb-8">No labels created yet.</div>
          )}
          <CreateLabel
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onCreateLabel={handleCreateLabel}
            onUpdateLabel={handleUpdateLabel}
            currentLabel={currentLabel}
            editMode={editMode}
          />
          <div className="mt-10">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelManager;
