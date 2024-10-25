import React, { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";
import CreateLabel from "./CreateLabel";
import textStore from "../zustand/Textdata";
import axios from "axios";
import Footer from "./Footer";

const LabelManager = () => {
  const { labels, addLabel, deleteLabel, setLabels } = textStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(null);
  const { projectName } = useParams();
  const [fetchedLabels, setFetchedLabels] = useState(false);
  
  useEffect(() => {
    const fetchLabels = async () => {
      if (fetchedLabels|| labels.length > 0) return;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/projects/${projectName}/ner/full-text`);
        
        const uniqueLabels = Array.from(new Set(response.data[0].entities.map(entity => entity.label)));

        const newLabels = uniqueLabels.map((name) => {
          const labelEntity = response.data[0].entities.find(entity => entity.label === name);
          return {
            name,
            color: labelEntity.color,
            bgColor: labelEntity.bColor,
            textColor: labelEntity.textColor,
          };
        });
        setLabels(newLabels);
        setFetchedLabels(true);
      } catch (error) {
        console.error("Error fetching annotations:", error);
      }
    };

    fetchLabels();
  }, [projectName, setLabels, labels.length, fetchedLabels]);

  const handleCreateLabel = (newLabel) => {
    const isDuplicate = labels.some((label) => label.name === newLabel.name);

    if (isDuplicate) {
      toast.error("Label Name must be unique.");
      return;
    }
    console.log(newLabel)
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
     toast.error ("Label Name must be unique.");
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
  console.log(labels)
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-8 bg-gradient-to-r from-gray-50 to-gray-100">
          <h1 className="text-3xl font-bold mb-4">Label Manager</h1>
          <button
            onClick={() => {
              setCurrentLabel(null);
              setEditMode(false);
              setModalOpen(true);
            }}
            className="bg-purple-700 text-white  mt-14 mb-14 px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-shadow shadow-lg hover:shadow-xl mb-4"
          >
            Create Label
          </button>
          {labels.length > 0 ? (
            <div>
            <div className="overflow-auto items-center h-[30rem] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="min-w-full border border-gray-300 text-sm text-left bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 border-b border-gray-300 text-center">Name</th>
                  <th className="p-2 border-b border-gray-300 text-center">Color</th>
                  <th className="p-2 border-b border-gray-300 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {labels.map((label, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 border-b border-gray-300 text-center">{label.name}</td>
                    <td className="p-2 border-b border-gray-300 text-center">
                      <div className="flex justify-center items-center">
                        <div
                          className="w-6 h-6 rounded-full mr-2"
                          style={{ backgroundColor: label.color }}
                        ></div>
                      </div>
                    </td>
                    <td className="p-2 border-b border-gray-300 text-center flex justify-center space-x-2">
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
          <div className="mt-10">
            <Footer />
            </div>
            </div>
          
          
          
          ) : (
            
            <div className="mb-8">
              No labels created yet.
            </div>
          
            
          )}
          
          <CreateLabel
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onCreateLabel={handleCreateLabel}
            onUpdateLabel={handleUpdateLabel}
            currentLabel={currentLabel}
            editMode={editMode}
          />
          <div className="mt-96">
          <Footer />

          </div>
        
        </div>
        
        
      </div>
      
    </div>
    
    
  );
};

export default LabelManager;
