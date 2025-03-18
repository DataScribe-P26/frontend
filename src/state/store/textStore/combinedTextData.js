import { create } from "zustand";
import createProjectsSlice from "./projectsSlice";
import createCurrentProjectSlice from "./CurrentProjectSlice";
import createLabelsSlice from "./labelsSlice";
import createFileSlice from "./fileSlice";
import createAnnotationsSlice from "./annotationsSlice";

// Create a Single Zustand Store with All Slices
const textStore = create((set, get) => ({
  ...createProjectsSlice(set, get),
  ...createCurrentProjectSlice(set, get),
  ...createLabelsSlice(set, get),
  ...createFileSlice(set, get),
  ...createAnnotationsSlice(set, get),
}));

export default textStore;
