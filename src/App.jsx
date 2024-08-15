import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Projects section/Home.jsx";
import Imagehome from "./Pages/Components/ImageHome.jsx";
import Main from "./Pages/Components/Image Project/Main.jsx";

function App() {
  return (
    <div className="select-none">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:projectName" element={<Imagehome />} />
        <Route path="/project/:projectName/main" element={<Main />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
