import React, { useState } from "react";
import useStore from "../../Zustand/Alldata";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../text_pages/Text/ThemeContext";
import { useAuth } from "../../login/AuthContext";

const ProjectAddModal = ({ names }) => {
  const {
    isProjectModalOpen,
    closeProjectModal,
    addProject,
    setprojectname,
    setCreatedOn,
    set_allAnnotations,
    reset,
  } = useStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  if (!isProjectModalOpen) return null;

  const formatDateToCustomString = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/users/search?query=${query}`
      );
      setSearchResults(response.data.matches);
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };

  const handleSelectMember = (email) => {
    if (!selectedMembers.includes(email)) {
      setSelectedMembers([...selectedMembers, email]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveMember = (email) => {
    setSelectedMembers(selectedMembers.filter((member) => member !== email));
  };

  const handleSubmit = () => {
    if (name && description) {
      const projectExists = names.find(
        (nameObj) => nameObj.toLowerCase() === name.toLowerCase()
      );

      if (!projectExists) {
        const currentDate = new Date();
        const isoDate = formatDateToCustomString(currentDate);

        addProject(name, description);

        axios
          .post("http://127.0.0.1:8000/projects/", {
            name,
            description,
            team_leads: user?.email,
            team_members: selectedMembers,
          })
          .then(() => {
            toast.success("Project Added");
            setprojectname(name);
            setCreatedOn(isoDate);
            reset();
            set_allAnnotations([]);
            setTimeout(() => {
              navigate(`/image/${name}`);
            }, 10);
            handleClose();
          })
          .catch((error) => {
            console.error(error);
            toast.error("Error adding project");
          });
      } else {
        toast.error("Project Name Already Taken");
      }
    } else {
      toast.error("Please complete all fields");
    }
  };

  const handleClose = () => {
    closeProjectModal();
    setName("");
    setDescription("");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedMembers([]);
  };
  

  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      zIndex: 50,
    },
    modal: {
      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
      borderRadius: "0.5rem",
      padding: "1.5rem",
      width: "100%",
      maxWidth: "500px",
      position: "relative",
      boxShadow: isDarkMode
        ? "0 4px 6px rgba(0, 0, 0, 0.3)"
        : "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    header: {
      marginBottom: "1.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: isDarkMode ? "#ffffff" : "#111827",
    },
    closeButton: {
      backgroundColor: "transparent",
      border: "none",
      color: isDarkMode ? "#9ca3af" : "#6b7280",
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "0.375rem",
      fontSize: "1.25rem",
      transition: "all 0.2s",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: isDarkMode ? "#d1d5db" : "#374151",
    },
    input: {
      padding: "0.75rem",
      borderRadius: "0.375rem",
      border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
      backgroundColor: isDarkMode ? "#374151" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
      width: "100%",
      transition: "all 0.2s",
    },
    textarea: {
      padding: "0.75rem",
      borderRadius: "0.375rem",
      border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
      backgroundColor: isDarkMode ? "#374151" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
      width: "100%",
      minHeight: "100px",
      resize: "vertical",
      transition: "all 0.2s",
    },
    submitButton: {
      marginTop: "1rem",
      padding: "0.75rem 1rem",
      backgroundColor: "#10b981",
      color: "#ffffff",
      border: "none",
      borderRadius: "0.375rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
      ":hover": {
        backgroundColor: "#059669",
      },
    },
  };

  const dropdownStyles = {
    list: {
      position: "absolute",
      zIndex: 10,
      backgroundColor: isDarkMode ? "#374151" : "#ffffff",
      border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
      borderRadius: "0.375rem",
      top: "80%",
      width: "90%",
      maxHeight: "150px",
      overflowY: "auto",
      margin: 0,
      padding: "0.5rem 0",
      boxShadow: isDarkMode
        ? "0 4px 6px rgba(0, 0, 0, 0.3)"
        : "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    listItem: {
      padding: "0.75rem",
      cursor: "pointer",
      color: isDarkMode ? "#ffffff" : "#000000",
      transition: "all 0.2s",
      ":hover": {
        backgroundColor: isDarkMode ? "#4b5563" : "#F3E5F5",
      },
    },
  };
  

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>Add New Project</h2>
          <button onClick={handleClose} style={modalStyles.closeButton}>
            ✕
          </button>
        </div>

        <div style={modalStyles.form}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              style={modalStyles.input}
            />
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              style={modalStyles.textarea}
            />
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Search and Add Members</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by email"
              style={modalStyles.input}
            />
            {searchResults.length > 0 && (
              <ul style={dropdownStyles.list}>
                {searchResults.map((result) => (
                  <li
                    key={result.email}
                    onClick={() => handleSelectMember(result.email)}
                    style={dropdownStyles.listItem}
                  >
                    {result.email}
                  </li>
                ))}
              </ul>
            )}

          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              columnGap: "4px", // Tight gap between emails horizontally
              rowGap: "4px",    // Minimal vertical spacing if wrapping occurs
            }}
          >
            {selectedMembers.map((member) => (
              <div
                key={member}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  backgroundColor: isDarkMode ? "#374151" : "#e3f2fd", // Light and Dark theme background
                  padding: "4px 8px",
                  borderRadius: "12px",
                  boxShadow: isDarkMode
                    ? "0px 1px 2px rgba(0, 0, 0, 0.3)"  // Dark mode shadow
                    : "0px 1px 2px rgba(0, 0, 0, 0.15)", // Light mode shadow
                }}
              >
                <span
                  style={{
                    color: isDarkMode ? "#ffffff" : "#1a237e", // Light and Dark theme text color
                    fontWeight: "500",
                    marginRight: "6px",
                  }}
                >
                  {member}
                </span>
                <button
                  onClick={() => handleRemoveMember(member)}
                  style={{
                    background: "none",
                    border: "none",
                    color: isDarkMode ? "#f44336" : "#d32f2f", // Dark and light theme for button color
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>



          <button onClick={handleSubmit} style={modalStyles.submitButton}>
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectAddModal;
