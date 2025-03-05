import React, { useState } from "react";
import { FiInfo, FiUsers, FiLock, FiEdit3, FiTrash } from "react-icons/fi";
import MainhomeNavbar from "../Main home/MainhomeNavbar";
import { useTheme } from "../context/ThemeContext";

const ProjectSettings = () => {
  const { isDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState("general");
  const [project, setProject] = useState({
    name: "Sample Project",
    description: "This is a dummy project description.",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [members, setMembers] = useState([
    { name: "John Doe", role: "Admin" },
    { name: "Jane Smith", role: "Labeller" },
    { name: "Alice Johnson", role: "Reviewer" },
  ]);
  const [roleToEdit, setRoleToEdit] = useState(null);

  const handleEditChange = (e, field) => {
    setProject({ ...project, [field]: e.target.value });
  };

  const handleRoleChange = (index, newRole) => {
    const updatedMembers = [...members];
    updatedMembers[index].role = newRole;
    setMembers(updatedMembers);
    setRoleToEdit(null);
  };

  return (
    <div
      className={`h-screen flex flex-col ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Navbar */}
      <MainhomeNavbar />

      {/* Sidebar + Main Content */}
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 h-full p-6 border-r border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          <nav className="space-y-3">
            {[
              { id: "general", icon: <FiInfo />, label: "General" },
              { id: "members", icon: <FiUsers />, label: "Members" },
              { id: "permissions", icon: <FiLock />, label: "Permissions" },
            ].map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center w-full px-4 py-3 rounded-md transition-colors duration-200 ${
                  activeSection === id
                    ? "bg-purple-500 text-white"
                    : "hover:bg-purple-200 dark:hover:bg-purple-700"
                }`}
              >
                {icon} <span className="ml-3">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeSection === "general" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Project Information</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage the basic details of your project.
              </p>
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">
                    Project Name
                  </label>
                  <div className="flex items-center border p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                    {isEditing ? (
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleEditChange(e, "name")}
                        className="text-gray-700 dark:text-gray-300 flex-1 bg-transparent border-none"
                      />
                    ) : (
                      <p className="flex-1">{project.name}</p>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <div className="flex items-center border p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                    {isEditing ? (
                      <textarea
                        value={project.description}
                        onChange={(e) => handleEditChange(e, "description")}
                        className="text-gray-700 dark:text-gray-300 flex-1 bg-transparent border-none"
                      />
                    ) : (
                      <p className="flex-1">{project.description}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-4">
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
              </div>
            </div>
          )}

          {activeSection === "members" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
              <div className="space-y-4">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border p-3 rounded-md bg-gray-50 dark:bg-gray-700"
                  >
                    {/* Name */}
                    <p className="flex-1">{member.name}</p>

                    {/* Role + Dropdown */}
                    <div className="relative">
                      {roleToEdit === index ? (
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(index, e.target.value)
                          }
                          className="px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                        >
                          {["Admin", "Labeller", "Reviewer"].map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p>{member.role}</p>
                      )}
                    </div>

                    {/* Edit & Delete */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setRoleToEdit(index)}
                        className="text-purple-600"
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        onClick={() =>
                          setMembers(members.filter((_, i) => i !== index))
                        }
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

          {activeSection === "permissions" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Permissions</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage permissions here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
