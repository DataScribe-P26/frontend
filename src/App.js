import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";

// Import your components

import Imagehome from "./pages/imagePages/mainAnnotation";
import Mainhome from "./Main home/Mainhome";
import Login from "./pages/authPages/Login";
import Register from "./login/Register";
import HomePage from "./pages/textPages/HomePage";
import LabelManager from "./pages/textPages/LabelManager";
import CombinedFileContent from "./components/textProject/fileUpload/uploadFile";
import FileContentDisplay from "./components/textProject/textAnnotation/nerAnnotation";
import Analysis from "./image_pages/Components/Image Project/Analysis";
import ProjectSection from "./Projects section/ProjectSection";
import CreateOrgProject from "./components/organizations/CreateOrgProject";

import Dashboard from "./pages/organizations/Dashboard";
import LandingPage from "../src/Main home/landing";
import PricingPage from "./components/landing/PricingPage";
import ContentDisplay from "./components/textProject/textAnnotation/sentimentAnnotation";

function App() {
  return (
    <AuthProvider>
      <div className="">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/price" element={<PricingPage />} />
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

          <Route path="/CreateOrgProject" element={<CreateOrgProject />} />

          <Route path="/organizations" element={<Dashboard />} />

          <Route path="/dashboard" element={<Dashboard />} />

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
            path="/user-project/sentiment_analysis/:projectName"
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
          <Route
            path="/text/:projectName/contentdisplay"
            element={
              <ProtectedRoute>
                <ContentDisplay />
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
