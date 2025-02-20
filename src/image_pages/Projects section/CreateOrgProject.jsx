import React, { useState } from "react";
import { Settings, ExternalLink, Plus, X, ArrowRight,Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../login/AuthContext";
import { useTheme } from "../../text_pages/Text/ThemeContext";
import useStore from "../../Zustand/Alldata";
import { useEffect } from "react";
import { USER_TYPE } from "../../Main home/user-type";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";



const ObjectDetectionIllustration = () => (
    <svg
      viewBox="0 0 400 300"
      className="w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="400" height="300" fill="#EFF6FF" rx="8" />

      {/* Car */}
      <g className="animate-[pulse_3s_ease-in-out_infinite]">
        {/* Car body */}
        <path
          d="M50 140 L70 140 L80 120 L140 120 L150 140 L170 140 L170 160 L50 160 Z"
          fill="#93C5FD"
        />
        <circle cx="70" cy="160" r="10" fill="#60A5FA" />
        <circle cx="150" cy="160" r="10" fill="#60A5FA" />
        {/* Bounding box */}
        <rect
          x="45"
          y="110"
          width="130"
          height="65"
          fill="none"
          stroke="#2563EB"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <text
          x="110"
          y="105"
          textAnchor="middle"
          fill="#2563EB"
          className="text-xs"
        >
          Car
        </text>
      </g>

      {/* Cat */}
      <g className="animate-[pulse_3s_ease-in-out_infinite]">
        {/* Cat body */}
        <path
          d="M250 80 C270 80 280 100 280 110 C280 120 270 130 260 130 C250 130 240 120 240 110 C240 100 250 80 250 80"
          fill="#93C5FD"
        />
        {/* Cat ears */}
        <path d="M245 85 L240 70 L250 80" fill="#93C5FD" />
        <path d="M255 85 L260 70 L250 80" fill="#93C5FD" />
        {/* Cat tail */}
        <path
          d="M260 125 C270 130 280 120 285 110"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="4"
        />
        {/* Bounding box */}
        <rect
          x="235"
          y="65"
          width="55"
          height="70"
          fill="none"
          stroke="#2563EB"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <text
          x="262"
          y="60"
          textAnchor="middle"
          fill="#2563EB"
          className="text-xs"
        >
          Cat
        </text>
      </g>

      {/* Person */}
      <g className="animate-[pulse_3s_ease-in-out_infinite]">
        {/* Head */}
        <circle cx="200" cy="180" r="10" fill="#93C5FD" />
        {/* Body */}
        <path d="M200 190 L200 230" stroke="#93C5FD" strokeWidth="4" />
        {/* Arms */}
        <path d="M200 200 L180 220" stroke="#93C5FD" strokeWidth="4" />
        <path d="M200 200 L220 220" stroke="#93C5FD" strokeWidth="4" />
        {/* Legs */}
        <path d="M200 230 L190 260" stroke="#93C5FD" strokeWidth="4" />
        <path d="M200 230 L210 260" stroke="#93C5FD" strokeWidth="4" />
        {/* Bounding box */}
        <rect
          x="175"
          y="170"
          width="50"
          height="95"
          fill="none"
          stroke="#2563EB"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <text
          x="200"
          y="165"
          textAnchor="middle"
          fill="#2563EB"
          className="text-xs"
        >
          Person
        </text>
      </g>
    </svg>
  );

  const SegmentationIllustration = () => (
    <svg
      viewBox="0 0 400 300"
      className="w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="400" height="300" fill="#ECFDF5" rx="8" />

      {/* Car Segmentation */}
      <g className="animate-[pulse_3s_ease-in-out_infinite]">
        <path
          d="M50 140 C60 130 70 135 80 120 C100 115 130 115 140 120 C150 130 160 135 170 140 C170 150 170 155 170 160 C160 165 60 165 50 160 C50 150 50 145 50 140"
          fill="#A7F3D0"
          stroke="#059669"
          strokeWidth="2"
        />
        <circle
          cx="70"
          cy="160"
          r="10"
          fill="#6EE7B7"
          stroke="#059669"
          strokeWidth="2"
        />
        <circle
          cx="150"
          cy="160"
          r="10"
          fill="#6EE7B7"
          stroke="#059669"
          strokeWidth="2"
        />
        <text
          x="110"
          y="145"
          textAnchor="middle"
          fill="#059669"
          className="text-xs"
        >
          Car
        </text>
      </g>

      {/* Cat Segmentation */}
      <g className="animate-[pulse_3s_ease-in-out_infinite]">
        <path
          d="M250 80 C270 80 285 100 285 110 C285 125 270 135 260 135 C250 135 235 125 235 110 C235 100 250 80 250 80 M245 85 L240 70 L250 80 M255 85 L260 70 L250 80"
          fill="#A7F3D0"
          stroke="#059669"
          strokeWidth="2"
        />
        <path
          d="M260 130 C270 135 280 125 290 115"
          fill="none"
          stroke="#059669"
          strokeWidth="3"
        />
        <text
          x="260"
          y="105"
          textAnchor="middle"
          fill="#059669"
          className="text-xs"
        >
          Cat
        </text>
      </g>

      {/* Person Segmentation */}
      <g className="animate-[pulse_3s_ease-in-out_infinite]">
        <path
          d="M200 170 C210 170 220 180 220 190 C220 200 210 210 200 210 C190 210 180 200 180 190 C180 180 190 170 200 170"
          fill="#A7F3D0"
          stroke="#059669"
          strokeWidth="2"
        />
        <path
          d="M195 210 C180 220 175 240 185 260 C195 270 205 270 215 260 C225 240 220 220 205 210"
          fill="#A7F3D0"
          stroke="#059669"
          strokeWidth="2"
        />
        <path
          d="M190 210 L170 230 M210 210 L230 230"
          stroke="#059669"
          strokeWidth="3"
        />
        <text
          x="200"
          y="240"
          textAnchor="middle"
          fill="#059669"
          className="text-xs"
        >
          Person
        </text>
      </g>
    </svg>
  );

  const NLPIllustration = () => (
    <svg
      viewBox="0 0 400 300"
      className="w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="400" height="300" fill="#FDF2F8" rx="8" />

      <g transform="translate(50, 50)">
        <rect
          width="300"
          height="200"
          fill="white"
          stroke="#DB2777"
          strokeWidth="2"
          rx="8"
        />

        {/* Text Annotation */}
        <g className="animate-[pulse_3s_ease-in-out_infinite]">
          <rect x="20" y="20" width="260" height="40" fill="#FBCFE8" rx="4" />
          <text x="30" y="45" fill="#DB2777" className="text-sm">
            The quick brown fox jumps
          </text>
          <path d="M30 55 L180 55" stroke="#DB2777" strokeWidth="2" />
          <text x="210" y="45" fill="#DB2777" fontSize="10">
            [Action]
          </text>
        </g>

        {/* Entity Recognition */}
        <g className="animate-[pulse_3s_ease-in-out_infinite]">
          <rect x="20" y="80" width="260" height="40" fill="#FBCFE8" rx="4" />
          <text x="30" y="105" fill="#DB2777" className="text-sm">
            Sarah visited Paris last summer
          </text>
          <path d="M30 92 L70 92" stroke="#DB2777" strokeWidth="2" />
          <path d="M80 92 L120 92" stroke="#DB2777" strokeWidth="2" />
          <text x="35" y="88" fill="#DB2777" fontSize="10">
            [Person]
          </text>
          <text x="85" y="88" fill="#DB2777" fontSize="10">
            [Location]
          </text>
        </g>

        {/* Sentiment Classification */}
        <g className="animate-[pulse_3s_ease-in-out_infinite]">
          <rect x="20" y="140" width="260" height="40" fill="#FBCFE8" rx="4" />
          <text x="30" y="165" fill="#DB2777" className="text-sm">
            Great product, highly recommend! ⭐️⭐️⭐️⭐️⭐️
          </text>
          <path d="M250 140 L280 140" stroke="#DB2777" strokeWidth="2" />
          <text x="255" y="135" fill="#DB2777" fontSize="10">
            [Positive]
          </text>
        </g>
      </g>
    </svg>
  );

  const SentimentAnalysisIllustration = () => (
    <svg
      viewBox="0 0 400 300"
      className="w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="400" height="300" fill=" #FFFCF2" rx="8" />
  
      <g transform="translate(50, 50)">
        <rect
          width="300"
          height="200"
          fill="white"
          stroke="#DB2777"
          strokeWidth="2"
          rx="8"
        />
  
        {/* Positive Sentiment */}
        <g className="animate-[pulse_3s_ease-in-out_infinite]">
          <rect x="20" y="20" width="260" height="40" fill="#D1FAE5" rx="4" />
          <text x="30" y="45" fill="#10B981" className="text-sm">
            "Amazing service! Highly recommend!"
          </text>
          <path d="M250 20 L280 20" stroke="#10B981" strokeWidth="2" />
          <text x="255" y="15" fill="#10B981" fontSize="10">
            [Positive]
          </text>
        </g>
  
        {/* Neutral Sentiment */}
        <g className="animate-[pulse_3s_ease-in-out_infinite]">
          <rect x="20" y="80" width="260" height="40" fill="#FEF3C7" rx="4" />
          <text x="30" y="105" fill="#D97706" className="text-sm">
            "The product was okay, nothing special."
          </text>
          <path d="M250 80 L280 80" stroke="#D97706" strokeWidth="2" />
          <text x="255" y="75" fill="#D97706" fontSize="10">
            [Neutral]
          </text>
        </g>
  
        {/* Negative Sentiment */}
        <g className="animate-[pulse_3s_ease-in-out_infinite]">
          <rect x="20" y="140" width="260" height="40" fill="#FECACA" rx="4" />
          <text x="30" y="165" fill="#DC2626" className="text-sm">
            "Terrible experience, very disappointed!"
          </text>
          <path d="M250 140 L280 140" stroke="#DC2626" strokeWidth="2" />
          <text x="255" y="135" fill="#DC2626" fontSize="10">
            [Negative]
          </text>
        </g>
      </g>
    </svg>
  );

  const CombinedIllustration = () => (
    <svg
      viewBox="0 0 240 240"
      className="w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <circle cx="120" cy="120" r="90" fill="#EFF6FF" className="animate-pulse" />

      {/* Main image frame */}
      <rect x="70" y="60" width="100" height="100" fill="#BFDBFE" rx="8" />

      {/* Annotation boxes */}
      <rect
        x="85"
        y="75"
        width="30"
        height="30"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        className="animate-[ping_3s_ease-in-out_infinite]"
        strokeDasharray="4 4"
      />
      <rect
        x="125"
        y="95"
        width="30"
        height="40"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        className="animate-[ping_3s_ease-in-out_infinite]"
        strokeDasharray="4 4"
      />

      {/* Segmentation polygon */}
      <path
        d="M95 115 L105 125 L85 135 L95 115"
        fill="none"
        stroke="#1D4ED8"
        strokeWidth="2"
        className="animate-[pulse_2s_ease-in-out_infinite]"
      />

      {/* Labels */}
      <rect x="85" y="70" width="25" height="12" fill="#2563EB" rx="6" />
      <rect x="125" y="90" width="25" height="12" fill="#2563EB" rx="6" />

      {/* Cursor */}
      <g transform="translate(160, 70)" className="animate-bounce">
        <path d="M0 0 L10 20 L5 20 L0 30 L-5 20 L0 20 Z" fill="#3B82F6" />
      </g>

      {/* Object detection points */}
      <circle cx="100" cy="90" r="2" fill="#2563EB" />
      <circle cx="140" cy="115" r="2" fill="#2563EB" />
      <circle cx="90" cy="130" r="2" fill="#2563EB" />

      {/* Floating UI elements */}
      <g className="animate-pulse">
        <rect x="175" y="80" width="20" height="6" fill="#93C5FD" rx="3" />
        <rect x="175" y="90" width="15" height="6" fill="#93C5FD" rx="3" />
        <rect x="175" y="100" width="25" height="6" fill="#93C5FD" rx="3" />
      </g>

      {/* Connection lines */}
      <line
        x1="115"
        y1="76"
        x2="170"
        y2="76"
        stroke="#93C5FD"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <line
        x1="155"
        y1="96"
        x2="170"
        y2="96"
        stroke="#93C5FD"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
    </svg>
  );

  const CreateOrgProjectModal = ({ isOpen, onClose, onCreateProject }) => {
    const { isDarkMode } = useTheme();
    const [step, setStep] = useState(1); // 1 for project details, 2 for member selection
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [organizationName, setOrganizationName] = useState("");
    const [availableMembers, setAvailableMembers] = useState([]);
    const { addProject, setprojectname, setCreatedOn, set_allAnnotations, reset } = useStore();
    var storedOrgName='';

    const [projectData, setProjectData] = useState({
      name: "",
      description: "",
      type: "",
    });
    const navigate = useNavigate();
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
      if (step === 2) {
        fetchAvailableMembers();
      }
    }, [step, organizationName]);

    const fetchAvailableMembers = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/organization-members/?org_name=${organizationName}`
        );
        setAvailableMembers(response.data.members || []);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    useEffect(() => {
      console.log(organizationName);
      const userType = USER_TYPE.ORGANIZATION;
      console.log('current user is',userType);
      localStorage.setItem("userType", USER_TYPE.ORGANIZATION);

        },[organizationName])
    const projectTypes = [
      {
        id: "image",
        title: "Object Detection",
        description: "Detect and locate objects within images with bounding boxes",
        illustration: ObjectDetectionIllustration,
        color: "blue",
      },
      {
        id: "instance-segmentation",
        title: "Instance Segmentation",
        description: "Precise object segmentation with polygon masks",
        illustration: SegmentationIllustration,
        color: "green",
      },
      {
        id: "ner_tagging",
        title: "Natural Language Processing",
        description: "Advanced text analysis and processing",
        illustration: NLPIllustration,
        color: "pink",
      },

      
      {
        id: "sentiment_analysis",
        title: "Sentiment Analysis",
        description: "Detecting emotions and attitudes in text",
        illustration: SentimentAnalysisIllustration ,
        color: "yellow",
      },
    ];

    const handleInputChange = (e) => {
      setProjectData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    };

    const handleTypeSelect = (typeId) => {
      setProjectData((prev) => ({
        ...prev,
        type: typeId,
      }));
    };

    const handleClose = () => {
      setStep(1);
      setProjectData({ name: "", description: "", type: "" });
      setSelectedMembers([]);
      onClose();
    };

    const isFormValid =
      projectData.name.trim() !== "" &&
      projectData.description.trim() !== "" &&
      projectData.type !== "";

      const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
          setSearchResults([]);
          return;
        }

        try {

          const response = await axios.get(
            `http://127.0.0.1:8000/organization-members/search?org_name=${organizationName}&query=${query}`
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
    const formatDateToCustomString = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const handleNext = () => {
        if (isFormValid) {
          setShowMemberModal(true);
          onClose();
        }
      };


    const handleSubmit = () => {
      const currentDate = new Date();
      const isoDate = formatDateToCustomString(currentDate);
      addProject(projectData.name, projectData.description, projectData.type);
      if (isFormValid) {
        axios
          .post("http://127.0.0.1:8000/create-org-projects/", {
            email:user?.email,
            name: projectData.name,
            description: projectData.description,
            type: projectData.type,
            org_id: organizationName,
            created_by: user?.email,
            team_members: selectedMembers,
          })
          .then((response) => {
            toast.success("Project created successfully!");
            //onCreateProject(response.data); // Pass the created project data to the parent component
            setprojectname(name);
            setCreatedOn(isoDate);
            reset();
            set_allAnnotations([]);
            navigate(`/user-project/${projectData.type}/${projectData.name}`);
            setProjectData({ name: "", description: "", type: "" });
            onClose();
          })
          .catch((error) => {
            console.error("Error creating project:", error);
            toast.error("Failed to create project. Please try again.");
          });
      } else {
        toast.error("Please complete all fields.");
      }
    };

    if (!isOpen) return null;

    const selectedType = projectTypes.find((type) => type.id === projectData.type);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50  dark:text-gray-100">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 my-6 dark:bg-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between p-5 border-b dark:bg-gray-900 dark:text-gray-100 ">
          <h2 className="text-xl font-semibold text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            {step === 1 ? "Create New Project" : "Add Team Members"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors dark:bg-gray-800 dark:text-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {step === 1 ? (
            // Project Details Form
            <div className="flex gap-8">
              <div className="w-1/2 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg dark:bg-gray-900 dark:text-gray-100">
                {selectedType ? (
                  <>
                    <div className="w-full">
                      <selectedType.illustration />
                    </div>
                    <div className="text-center mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                        {selectedType.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-100">
                        {selectedType.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full">
                    <CombinedIllustration />
                    <div className="text-center mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                        Automate Your Data Annotation Process
                      </h3>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-1/2 p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-100" >
                    Project Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={projectData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-100" >
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={projectData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:bg-gray-900 dark:text-gray-100">
                    Project Type
                  </label>
                  <div className="grid grid-cols-1 gap-4 dark:bg-gray-900 dark:text-gray-100 py-4 w-100">
                    {projectTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleTypeSelect(type.id)}
                        className={`p-2 border rounded-lg text-left transition-all duration-300 ${
                          projectData.type === type.id
                            ? `ring-2 ring-${type.color}-500 border-${type.color}-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-100`
                            : "hover:border-gray-100 dark:bg-gray-900"
                        }`}
                      >
                        <h3 className="font-semibold text-gray-900  dark:text-gray-100 ">{type.title}</h3>
                        <p className="text-sm text-gray-500 mt-1  dark:text-gray-100">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Member Selection Form
            <div className="flex gap-8 dark:bg-gray-900 dark:text-gray-100">
              <div className="w-1/2">
                <h3 className="text-lg font-semibold mb-4 dark:bg-gray-900 dark:text-gray-100">Available Members</h3>
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:bg-gray-900 dark:text-gray-100"
                    placeholder="Search members..."
                  />
                  <UserPlus className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:bg-gray-900 dark:text-gray-100" />
                </div>
                <div className="h-96 overflow-y-auto border rounded-lg p-4">
                  {(searchQuery ? searchResults : availableMembers).map((member) => (
                    <div
                      key={member.email}
                      className="flex items-center justify-between p-2  rounded-lg cursor-pointer"
                      onClick={() => handleSelectMember(member.email)}
                    >
                      <span>{member.email}</span>
                      <button className="bg-purple-600 text-white hover:bg-blue-900 dark:bg-red-700 rounded-lg px-2  dark:text-white dark:hover:bg-red-900 ">Add</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-1/2">
                <h3 className="text-lg font-semibold mb-4 dark:bg-gray-900 dark:text-gray-100">Selected Members</h3>
                <div className="h-96 overflow-y-auto border rounded-lg p-4">
                  {selectedMembers.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2 dark:bg-gray-900 dark:text-gray-100"
                    >
                      <span>{email}</span>
                      <button
                        onClick={() => handleRemoveMember(email)}
                        className="bg-red-600 hover:bg-red-900 rounded-lg px-2 py-1 text-white"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6 dark:bg-gray-900 dark:text-gray-100">
            <button
              onClick={step === 1 ? handleClose : () => setStep(1)}
              className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-gray-600  dark:text-gray-100"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <button
              onClick={step === 1 ? () => setStep(2) : handleSubmit}
              disabled={step === 1 && !isFormValid}
              className={`px-5 py-2 rounded-md bg-purple-600 text-gray-100 dark:text-gray-100 ${
                step === 1 && !isFormValid
                  ? "bg-gray-300  cursor-not-allowed dark:bg-purple-700 dark:text-gray-100"
                  : " text-white hover:bg-purple-700 dark:bg-purple-600 dark:text-gray-100"
              }`}
            >
              {step === 1 ? "Next" : "Create Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

    export default CreateOrgProjectModal;
