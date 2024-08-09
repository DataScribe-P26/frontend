import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Projects section/Home.jsx";
import Imagehome from "./Pages/Components/ImageHome.jsx";

function App() {
  return (
    <div className=" select-none">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/project/:projectName" element={<Imagehome />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
