import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import TeamMemberModal from './TeamMemberModal.jsx'; 
import { useAuth } from '../../login/AuthContext.jsx';
import axios from 'axios';

import { USER_TYPE } from '../../Main home/user-type.js';

const ProjectSettingsModal = ({ 
  isOpen, 
  onClose, 
  project, 
  organizationName,
  onUpdateProject,
  onDeleteProject
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editedProject, setEditedProject] = useState(project);
  const modalRef = useRef(null);
  const { user } = useAuth();
  const [userType, setUserType] = useState(USER_TYPE.INDIVIDUAL);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType') || USER_TYPE.INDIVIDUAL;
    setUserType(storedUserType);
    console.log(project);
    setEditedProject(project);
    console.log(editedProject);
  }, [project]);
    useEffect(() => {
    console.log("isEditing updated:", isEditing);
  }, [isEditing]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose]);

const handleDeleteProject = async () => {
  if (window.confirm('Are you sure you want to delete this project?')) {
    try {
      const endpoint =
        userType === USER_TYPE.INDIVIDUAL
          ? `http://127.0.0.1:8000/delete-project/${user.email}/${editedProject.name}`
          : `http://127.0.0.1:8000/delete-org-project/${user.email}/${editedProject.name}/${organizationName}`;
      await axios.delete(endpoint);
      alert('Project deleted successfully!');
      onDeleteProject(editedProject.name);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete the project. Please try again.');
    }
    onClose();
  }
};
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMembers = async (newMembers) => {
    try {
      // API call to add members
      console.log(editedProject.name," ",organizationName," ",newMembers)
      const response = await fetch('http://127.0.0.1:8000/add-members-to-project', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_name: editedProject.name,
          org_id: organizationName,
          new_team_members: newMembers
        }),
      });

      if (response.ok) {
        const updatedMembers = [...editedProject.team_members, ...newMembers];
        setEditedProject(prev => ({
          ...prev,
          team_members: updatedMembers
        }));
      }
      else {
        const errorDetails = await response.json();
        console.error('Failed to add members:', errorDetails.detail);
      }
    } catch (error) {
      console.error('Error adding members:', error);
    }
  };

  const handleSave = async () => {
    try {
      const endpoint =
        userType === USER_TYPE.INDIVIDUAL
          ? 'http://127.0.0.1:8000/user-projects/update'
          : 'http://127.0.0.1:8000/projects/update';
      const payload =
        userType === USER_TYPE.INDIVIDUAL
          ? {
              old_name: project.name,
              new_name: editedProject.name,
              description: editedProject.description,
              user_email: user.email,
            }
          : {
              org_name: organizationName,
              old_name: project.name,
              new_name: editedProject.name,
              description: editedProject.description,
              team_members: editedProject.team_members,
            };
            console.log(payload);
        const response = await axios.put(endpoint, payload, {
              headers: { "Content-Type": "application/json" },
            });

      if (response.status === 200) {
        onUpdateProject(project.name, editedProject);
        setIsEditing(false);
        onClose();
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-[32rem] max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Project Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedProject.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{project.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            {isEditing ? (
              <textarea
                name="description"
                value={editedProject.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{project.description}</p>
            )}
          </div>
          {userType !== USER_TYPE.INDIVIDUAL && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Members</h3>
              {isEditing && (
                <button
                  onClick={() => setIsTeamModalOpen(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  + Add Members
                </button>
              )}
            </div>
              {editedProject?.team_members && editedProject?.team_members?.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-900 dark:text-white">
                {editedProject.team_members.map((member, index) => (
                  <li key={index} className="py-1">
                    {typeof member === 'string' ? member : member.email}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No team members added yet.</p>
            )}  
          </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setEditedProject(project);
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </>
          ) : (
            <div className="flex gap-4">
                <button
                    onClick={() =>{
                      setIsEditing(true)
                      console.log(userType);
                      console.log(isEditing);
                    }} 
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Edit Project
                </button>
                <button
                    onClick={handleDeleteProject} // Define this function for delete action
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                    Delete Project
                </button>
                </div>

          )}
        </div>
      </div>

      <TeamMemberModal
        isteamOpen={isTeamModalOpen}
        onCloseteam={() => setIsTeamModalOpen(false)}
        organizationName={organizationName}
        onSubmit={(members) => {
            console.log(members);
          handleAddMembers(members);
          setIsTeamModalOpen(false);
        }}
      />
    </div>
  );
};

export default ProjectSettingsModal;