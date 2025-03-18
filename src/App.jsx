import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import useAuthStore from "./state/store/authStore/authSlice";
import { useAuthCheck } from "./utils/authUtils";
// Import your components
import Imagehome from "./pages/imagePages/mainAnnotation";
import Login from "./pages/authPages/login";
import Register from "./pages/authPages/register";
import HomePage from "./pages/textPages/homePage";
import LabelManager from "./pages/textPages/labelManager";
import CombinedFileContent from "./components/textProject/fileUpload/uploadFile";
import FileContentDisplay from "./components/textProject/textAnnotation/nerAnnotation";
import ProjectSection from "./components/organizations/projectSection";
import CreateOrgProject from "./components/organizations/createOrgProject";
import Dashboard from "./pages/organizationsPages/dashboard";
import PricingPage from "./components/landing/pricingPage";
import ContentDisplay from "./components/textProject/textAnnotation/sentimentAnnotation";
import LandingPage from "./pages/landingPage/landingPage";

const RequireAuth = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    console.log("amsmcm", location);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  useAuthCheck();

  return (
    <div className="">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/price" element={<PricingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <RequireAuth>
              <ProjectSection />
            </RequireAuth>
          }
        />
        <Route
          path="/CreateOrgProject"
          element={
            <RequireAuth>
              <CreateOrgProject />
            </RequireAuth>
          }
        />
        <Route
          path="/organizations"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        {/* Protected Image Routes */}
        <Route
          path="/user-project/image/:projectName"
          element={
            <RequireAuth>
              <Imagehome />
            </RequireAuth>
          }
        />

        {/* Protected Text Routes */}
        <Route
          path="/user-project/ner_tagging/:projectName"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />

        <Route
          path="/user-project/sentiment_analysis/:projectName"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />

        <Route
          path="/text/:projectName/content"
          element={
            <RequireAuth>
              <CombinedFileContent />
            </RequireAuth>
          }
        />

        <Route
          path="/combined-file-content/:projectName"
          element={
            <RequireAuth>
              <CombinedFileContent />
            </RequireAuth>
          }
        />

        <Route
          path="/text/:projectName/labelManager"
          element={
            <RequireAuth>
              <LabelManager />
            </RequireAuth>
          }
        />

        <Route
          path="/text/:projectName/filecontentdisplay"
          element={
            <RequireAuth>
              <FileContentDisplay />
            </RequireAuth>
          }
        />

        <Route
          path="/text/:projectName/contentdisplay"
          element={
            <RequireAuth>
              <ContentDisplay />
            </RequireAuth>
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
