import create from "zustand";
import createImageSlice from "./imageSlice";
import createAnnotationSlice from "./annotationSlice";
import createAutoAnnotationSlice from "./configSlice";
import createClassesSlice from "./classesSlice";
import createModalSlice from "./modalsSlice";
import createProjectSlice from "./projectsSlice";

const useStore = create((set, get) => ({
  ...createImageSlice(set, get),
  ...createAnnotationSlice(set, get),
  ...createAutoAnnotationSlice(set, get),
  ...createClassesSlice(set, get),
  ...createImageSlice(set, get),
  ...createProjectSlice(set, get),
  ...createModalSlice(set, get),
}));

export default useStore;
