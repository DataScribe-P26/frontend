import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../text_pages/Text/ThemeContext";
import { useAuth } from "../../login/AuthContext";
import useStore from "../../Zustand/Alldata";
import toast from "react-hot-toast";
import axios from "axios";
import { USER_TYPE } from "../../Main home/user-type.js";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import MainhomeNavbar from "../../Main home/MainhomeNavbar.jsx";

const CreateOrgProject = () => {
  const { addProject, setprojectname, setCreatedOn, set_allAnnotations, reset } = useStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [members, setMembers] = useState([]); // List of all members
  const [selectedMembers, setSelectedMembers] = useState([]); // Selected members
  const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
      const [searchResults, setSearchResults] = useState([]);
      const [organizationName, setOrganizationName] = useState("");
      var storedOrgName='';
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  useEffect(() => {
    storedOrgName = localStorage.getItem("organizationName");
    console.log('hellouu',storedOrgName);
    if (storedOrgName) {
      setOrganizationName(storedOrgName);
      console.log('hellouu123',organizationName);
    }
    console.log('hellouu123',organizationName);
  }, [organizationName]);
  
  useEffect(() => {
console.log(organizationName);
const userType = USER_TYPE.ORGANIZATION; 
console.log('current user is',userType);
localStorage.setItem("userType", USER_TYPE.ORGANIZATION);

  },[organizationName])

 

  const formatDateToCustomString = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = () => {
    if (name && description && type) {
      const currentDate = new Date();
      const isoDate = formatDateToCustomString(currentDate);

      addProject(name, description, type);

      axios.post("http://127.0.0.1:8000/create-org-projects/", {
        name:name,
        description:description,
        type:type,
        org_id: organizationName,
        created_by: user?.email,
        team_members: selectedMembers,
      })
      .then((response) => {
        toast.success("Project Added");
        console.log(response.data);
        setprojectname(name);
        setCreatedOn(isoDate);
        reset();
        set_allAnnotations([]);
        setTimeout(() => {
          navigate(`/user-project/${type}/${name}`);
        }, 10);
      })
      .catch(error => {
        console.error(error);
        toast.error("Error adding project");
      });
    } else {
      toast.error("Please complete all fields");
    }
  };

  const handleTypeSelect = (selectedType) => setType(selectedType);

  
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
      console.log(selectedMembers);
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
  // IMPLEMENT HERE
  const handleMemberSelect = async() => {
    if (selectedMembers.length === 0) {
      console.error("No members selected");
      return;
    }
    console.log(organizationName,
      selectedMembers);
      let data={
        org_name: organizationName,
        user_emails: selectedMembers,
      }
      console.log(data);


    try {
      const response = await axios.post("http://127.0.0.1:8000/organizations/add-members", data
      );
  
      if (response.status === 200) {
        console.log("Members added successfully:", response.data);
        navigate("/CreateOrgProject"); // Navigate after successful API call
      }
    } catch (error) {
      console.error("Error adding members:", error);
    }
    navigate("/CreateOrgProject");
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
    <div
      className={`min-h-screen  flex flex-col ${
        isDarkMode ? "text-white" : "text-black"
      } bg-cover bg-center`}
      style={{
        backgroundImage: `url('/images/image3.png')`,
      }}
    >
      <MainhomeNavbar />

      <div className="flex flex-col justify-center mt-2 items-center flex-1 px-4 bg-opacity-70 backdrop-blur-sm">
        <h1
          className={`text-3xl font-extrabold text-center mb-6 ${
            isDarkMode ? "text-gray-400" : "text-white"
          } transition-all`}
        >
          Let's Create Your Project
        </h1>

        <div
          className={`w-full max-w-2xl space-y-6 rounded-xl p-6 mb-4 transition-all bg-opacity-80 ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
          }`}
        >
          <div>
            <label className="block text-lg text-black font-medium mb-2">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className={`w-full p-3 rounded-md border focus:ring-2 focus:ring-green-500 outline-none ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="block text-lg text-black font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              className={`w-full p-3 h-24 rounded-md border focus:ring-2 focus:ring-green-500 outline-none ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-gray-100"
              }`}
            />
          </div>

          <div>
            <label className="block text-lg text-black font-medium mb-4">Project Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[{ value: "image", label: "Object Detection", imgSrc: "/images/objectdetection.png" },
                { value: "segmentation", label: "Segmentation", imgSrc: "/images/segmentation.jpg" },
                { value: "ner_tagging", label: "NER Tagging", imgSrc: "/images/nertagging.jpg" }]
                .map(option => (
                  <div
                    key={option.value}
                    onClick={() => handleTypeSelect(option.value)}
                    className={`cursor-pointer p-4 rounded-md shadow-md transition-all ${
                      type === option.value
                        ? "bg-green-600 text-white"
                        : isDarkMode
                        ? "bg-gray-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <img src={option.imgSrc} alt={option.label} className="w-full h-20 object-cover rounded-md" />
                    <span className="block text-center mt-2 font-semibold">{option.label}</span>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Add Members</label>
            <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } backdrop-blur-lg rounded-lg shadow-xl bg-opacity-50`}
          >
              {/* Search Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={`w-full p-3 pl-10 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-indigo-500 transition-all`}
                    placeholder="Search members..."
                  />
                  <UserPlus className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
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
       
          
              </motion.div>
             
              </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold transition-all"
            >
              Create Project
            </button>
            <button
              onClick={() => navigate("/Dashboard")}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold transition-all"
            >
              skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrgProject;
