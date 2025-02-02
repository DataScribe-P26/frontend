import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, ProtectedRoute } from './login/AuthContext.jsx';

// Import your components
import Home from "./image_pages/Projects section/Home.jsx";
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
                <Mainhome />
              </ProtectedRoute>
            } 
          />

          {/* Protected Image Routes */}
          <Route 
            path="/image" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/image/:projectName" 
            element={
              <ProtectedRoute>
                <Imagehome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/:name" 
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            } 
          />

          {/* Protected Text Routes */}
          <Route 
            path="/text" 
            element={
              <ProtectedRoute>
                <ProjectList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/text/:projectName" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/home/:projectName" 
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