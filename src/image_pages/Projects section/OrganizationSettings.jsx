import React, { useState } from 'react';
import { FiInfo, FiUsers, FiTrash, FiEdit3, FiLayers } from 'react-icons/fi';
import MainhomeNavbar from '../../Main home/MainhomeNavbar';
import { useTheme } from '../../text_pages/Text/ThemeContext';

const OrganizationSettings = () => {
  const { isDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState('general');
  const [organization, setOrganization] = useState({
    name: 'My Organization',
    description: 'This is a sample organization description.',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState([
    { name: 'Project Alpha' },
    { name: 'Project Beta' },
    { name: 'Project Gamma' },
  ]);
  const [members, setMembers] = useState([
    { name: 'John Doe', role: 'Admin' },
    { name: 'Jane Smith', role: 'Labeller' },
    { name: 'Alice Johnson', role: 'Reviewer' },
  ]);

  const handleEditChange = (e, field) => {
    setOrganization({ ...organization, [field]: e.target.value });
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Navbar */}
      <MainhomeNavbar />

      {/* Sidebar + Main Content */}
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 h-full p-6 border-r border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          <nav className="space-y-3">
            {[
              { id: 'general', icon: <FiInfo />, label: 'General' },
              { id: 'projects', icon: <FiLayers />, label: 'Projects' },
              { id: 'members', icon: <FiUsers />, label: 'Members' },
            ].map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center w-full px-4 py-3 rounded-md transition-colors duration-200 ${
                  activeSection === id
                    ? 'bg-purple-500 text-white'
                    : 'hover:bg-purple-200 dark:hover:bg-purple-700'
                }`}
              >
                {icon} <span className="ml-3">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Organization Information</h2>
              <p className="text-gray-600 dark:text-gray-300">Manage the basic details of your organization.</p>
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">Organization Name</label>
                  <div className="flex items-center border p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                    {isEditing ? (
                      <input
                        type="text"
                        value={organization.name}
                        onChange={(e) => handleEditChange(e, 'name')}
                        className="text-gray-700 dark:text-gray-300 flex-1 bg-transparent border-none"
                      />
                    ) : (
                      <p className="flex-1">{organization.name}</p>
                    )}
                  </div>
                </div>


              </div>
              <div className="mt-4 flex justify-between">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    Save
                  </button>
                )}

                {/* Delete Organization */}
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                  Delete Organization
                </button>
              </div>
            </div>
          )}

          {/* Organization Projects */}
          {activeSection === 'projects' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Projects</h2>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="flex justify-between items-center border p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                    {/* Project Name */}
                    <p className="flex-1">{project.name}</p>

                    {/* Delete Project */}
                    <button
                      className="text-red-500"
                      onClick={() => setProjects(projects.filter((_, i) => i !== index))}
                    >
                      <FiTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organization Members */}
          {activeSection === 'members' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
              <div className="space-y-4">
                {members.map((member, index) => (
                  <div key={index} className="flex justify-between items-center border p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                    {/* Name */}
                    <p className="flex-1">{member.name}</p>

                    {/* Role */}
                    <p>{member.role}</p>

                    {/* Edit & Delete */}
                    <div className="flex space-x-3">
                      <button className="text-purple-600">
                        <FiEdit3 />
                      </button>
                      <button
                        onClick={() => setMembers(members.filter((_, i) => i !== index))}
                        className="text-red-500"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationSettings;
