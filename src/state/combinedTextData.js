import { create } from "zustand";
import createProjectsSlice from "./textData/projectsStore";
import createCurrentProjectSlice from "./textData/CurrentProjectStore";
import createLabelsSlice from "./textData/labelsStore";
import createFileSlice from "./textData/fileStore";
import createAnnotationsSlice from "./textData/annotationsStore";

// Create a Single Zustand Store with All Slices
const textStore = create((set, get) => ({
  ...createProjectsSlice(set, get),
  ...createCurrentProjectSlice(set, get),
  ...createLabelsSlice(set, get),
  ...createFileSlice(set, get),
  ...createAnnotationsSlice(set, get),
}));

export default textStore;
