import React, { useState, useEffect } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { TopBar } from "../navbar/Navbar";
import { Profile } from "../home/Profile";
import { useUser } from "../home/useUser";
import OrganizationsPage from "../home/Organisation";
import ProjectsPage from "../home/Projects";
import HomePage from "../home/Hero";
import Login from "../../pages/authPages/Login";

const ProjectSection = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, loading, error, updateUser } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 dark:text-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "home":
        return "Home";
      case "profile":
        return "Public Profile";
      case "organizations":
        return "Organizations";
      case "projects":
        return "ALL Projects";
      default:
        return "";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage isCollapsed={isCollapsed} />;
      case "profile":
        return <Profile user={user} onUpdateProfile={updateUser} />;
      case "organizations":
        return <OrganizationsPage />;
      case "projects":
        return <ProjectsPage />;
      default:
        return <HomePage isCollapsed={isCollapsed} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <TopBar title={getPageTitle()} user={user} isCollapsed={isCollapsed} />
        <main
          className={`container mx-auto transition-all duration-300 dark:bg-gray-900 dark:text-gray-100 ${
            activeTab === "home" ? "p-0" : "p-8"
          }`}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ProjectSection;
