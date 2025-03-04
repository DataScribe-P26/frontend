import { create } from "zustand";
import createProjectsSlice from "./projectsStore";
import createCurrentProjectSlice from "./currentProjectStore";
import createLabelsSlice from "./labelsStore";
import createFileSlice from "./fileStore";
import createAnnotationsSlice from "./annotationsStore";

// Create a Single Zustand Store with All Slices
const textStore = create((set, get) => ({
  ...createProjectsSlice(set, get),
  ...createCurrentProjectSlice(set, get),
  ...createLabelsSlice(set, get),
  ...createFileSlice(set, get),
  ...createAnnotationsSlice(set, get),
}));

export default textStore;
