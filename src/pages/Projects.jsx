import React, { useState } from "react";
import { Settings, ExternalLink, Plus, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../login/AuthContext";
import { useTheme } from "../text_pages/Text/ThemeContext";
import useStore from "../Zustand/Alldata";
import { useEffect } from "react";
import { USER_TYPE } from "../Main home/user-type";
import axios from "axios";
import toast from "react-hot-toast";

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

  const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
    const [projectData, setProjectData] = useState({
      name: "",
      description: "",
      type: "",
    });
    const { setprojectname, setCreatedOn, set_allAnnotations, reset } =
        useStore();
    const navigate = useNavigate();
    const { user } = useAuth();

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

    const isFormValid =
      projectData.name.trim() !== "" &&
      projectData.description.trim() !== "" &&
      projectData.type !== "";

    const handleSubmit = () => {
      if (isFormValid) {
        axios
          .post("http://127.0.0.1:8000/user-projects/", {
            email:user?.email,
            name: projectData.name,
            description: projectData.description,
            type: projectData.type,
          })
          .then((response) => {
            toast.success("Project created successfully!");
            setprojectname(projectData.name);
            //onCreateProject(response.data); // Pass the created project data to the parent component
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 my-6">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Project
            </h2>
            <button
              onClick={() => {
                setProjectData({ name: "", description: "", type: "" });
                onClose();
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5">
            <div className="flex gap-8">
              <div className="w-1/2 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                {selectedType ? (
                  <>
                    <div className="w-full">
                      <selectedType.illustration />
                    </div>
                    <div className="text-center mt-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedType.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedType.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full">
                  <CombinedIllustration />
                  <div className="text-center mt-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Automate Your Data Annotation Process
                    </h3>
                  </div>
                </div>
                )}
              </div>
              <div className="w-1/2">
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Project Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={projectData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Project Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={projectData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>

                  <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {projectTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleTypeSelect(type.id)}
                        className={`p-4 border rounded-lg text-left transition-all duration-300 ${
                          projectData.type === type.id
                            ? `ring-2 ring-${type.color}-500 border-${type.color}-500`
                            : "hover:border-gray-300"
                        }`}
                      >
                        <h3 className="font-semibold text-gray-900">
                          {type.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {type.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6"> <button
                onClick={onClose}
                className="ml-4 px-5 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`px-5 py-2 rounded-md ${
                  isFormValid
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Create Project
              </button>

            </div>
          </div>
        </div>
      </div>
    );
  };

const ProjectCard = ({ project, onProjectClick }) => {


    return (
        <div
          onClick={() => onProjectClick(project)}
          className="bg-white text-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer dark:bg-gray-700 dark:text-gray-100"
        >
          <div className="flex items-center justify-between dark:bg-gray-700 dark:text-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-semibold text-blue-600 ">
                  {project.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <div className="flex items-center mt-1">
                  <span className="px-3 py-1 text-sm rounded-full bg-purple-300 text-purple-800">
                    {project.type}
                  </span>
                </div>
                <p className="text-sm mt-2 text-gray-600 dark:bg-gray-700 dark:text-gray-100">
                  Created on: {new Date(project.created_on).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md hover:bg-gray-100">
                <Settings size={18} />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
          <p className="mt-4 text-gray-600 dark:bg-gray-700 dark:text-gray-100">
            {project.description?.length > 100
              ? `${project.description.substring(0, 100)}...`
              : project.description}
          </p>
        </div>
      );
    };

    const ProjectsPage = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [projects, setProjects] = useState([]);
      const [loading, setLoading] = useState(false);
      const navigate = useNavigate();
      const { user } = useAuth();
      const {
        setprojectname,
        setCreatedOn,
        set_allAnnotations,
        reset,
      } = useStore();

      const fetchProjects = async () => {
        try {
          setLoading(true);
          localStorage.setItem("userType", USER_TYPE.INDIVIDUAL);
          const response = await axios.get(`http://127.0.0.1:8000/user-projects/?email=${user.email}`);
          setProjects(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching projects:", error);
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchProjects();
      }, [user.email]);

      const handleProjectClick = (project) => {
        setprojectname(project.name);
        setCreatedOn(project.created_on);
        reset();
        set_allAnnotations([]);
        navigate(`/user-project/${project.type}/${project.name}`);
      };

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
          <div className="container mx-auto p-8 dark:bg-gray-900 dark:text-gray-100">
            <div className="flex items-center justify-between mb-8 dark:bg-gray-900 dark:text-gray-100">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                  Projects
                </h1>
                <p className="text-gray-500 mt-1 dark:bg-gray-900 dark:text-gray-100">
                  Manage and track your annotation projects efficiently.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center bg-purple-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md  dark:text-gray-100"
              >
                <Plus size={18} className="mr-2" />
                New Project
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12 dark:bg-gray-900 dark:text-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:bg-gray-900 dark:text-gray-100"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 text-gray-600 dark:bg-gray-900 dark:text-gray-100">
                <p className="text-xl">No projects available</p>
                <p className="mt-2 dark:bg-gray-900 dark:text-gray-100">Click 'New Project' to create your first project.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 dark:bg-gray-900 dark:text-gray-100">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onProjectClick={handleProjectClick}
                  />
                ))}
              </div>
            )}

            <CreateProjectModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onCreateSuccess={() => {
                fetchProjects();
              }}
            />
          </div>
        </div>
      );
    };

    export default ProjectsPage;
