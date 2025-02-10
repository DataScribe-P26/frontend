import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, ProtectedRoute } from './login/AuthContext.jsx';

// Import your components

import Imagehome from "./image_pages/Components/ImageHome.jsx";
import Mainhome from "./Main home/Mainhome.jsx";
import Login from "./login/Login.jsx"
import Register from "./login/Register.jsx";
import ProjectList from "./text_pages/project-section/ProjectList.jsx";
import HomePage from "./text_pages/Text/HomePage.jsx";
import LabelManager from "./text_pages/Text/LabelManager.jsx";
import CombinedFileContent from "./text_pages/Text/CombinedFileContent.jsx";
import FileContentDisplay from "./text_pages/Text/FileContentDisplay.jsx";
import Analysis from "./image_pages/Components/Image Project/Analysis.jsx";
import ProjectSection from "./image_pages/Projects section/ProjectSection.jsx";
import ProjectCreationPage from "./image_pages/Projects section/ProjectCreationPage.jsx";
import OrganizationCreationPage from "./image_pages/Projects section/OrganizationCreationPage.jsx";
import CreateOrgProject from "./image_pages/Projects section/CreateOrgProject.jsx";
import AddMembers from "./image_pages/Projects section/AddMembers.jsx";
import Dashboard from "./image_pages/Projects section/Dashboard.jsx";

function App() {
  return (
    <AuthProvider>
      <div className="">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <ProjectSection />
              </ProtectedRoute>
            } 
          />
          <Route 
          path="/create-project" 
          element={<ProjectCreationPage />} />

          <Route
          path="/add-members"
          element={<AddMembers />} />

          <Route 
          path="/create-organization" 
          element={<OrganizationCreationPage />} />

          <Route 
          path="/CreateOrgProject" 
          element={<CreateOrgProject />} />


          <Route 
          path="/dashboard" 
          element={<Dashboard />} />

          {/* Protected Image Routes */}
          
          <Route 
            path="/user-project/image/:projectName" 
            element={
              <ProtectedRoute>
                <Imagehome />
              </ProtectedRoute>
            } 
          />
         
          {/* Protected Text Routes */}
          
          <Route 
            path="/user-project/ner_tagging/:projectName" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/text/:projectName/content" 
            element={
              <ProtectedRoute>
                <CombinedFileContent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/combined-file-content/:projectName" 
            element={
              <ProtectedRoute>
                <CombinedFileContent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/text/:projectName/labelManager" 
            element={
              <ProtectedRoute>
                <LabelManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/text/:projectName/filecontentdisplay" 
            element={
              <ProtectedRoute>
                <FileContentDisplay />
              </ProtectedRoute>
            } 
          />
        </Routes>

        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;