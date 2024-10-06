import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./image_pages/Projects section/Home.jsx";
import Imagehome from "./image_pages/Components/ImageHome.jsx";
import Mainhome from "./Main home/Mainhome.jsx";
import ProjectList from "./text_pages/project-section/ProjectList.jsx";
import HomePage from "./text_pages/Text/HomePage.jsx";
import LabelManager from "./text_pages/Text/LabelManager.jsx";
import CombinedFileContent from "./text_pages/Text/CombinedFileContent.jsx";
import FileContentDisplay from "./text_pages/Text/FileContentDisplay.jsx";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Mainhome />} />
        <Route path="/image" element={<Home />} />
        <Route path="/image/:projectName" element={<Imagehome />} />

        {/* text */}

        <Route path="/text" element={<ProjectList />} />
        <Route path="/text/:projectName" element={<HomePage />} />
        <Route path="/home/:projectName" element={<HomePage />} />

        <Route
          path="/text/:projectName/content"
          element={<CombinedFileContent />}
        />
        <Route path="/combined-file-content/:projectName" element={<CombinedFileContent />} />

        <Route
          path="/text/:projectName/labelManager"
          element={<LabelManager />}
        />
        <Route
          path="/text/:projectName/filecontentdisplay"
          element={<FileContentDisplay />}
        />



        <Route 
          path="/text/:projectName/filecontentdisplay" 
          element={<FileContentDisplay />} 
        /> 
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;