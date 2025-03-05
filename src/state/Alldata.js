import create from "zustand";
import createImageSlice from "./imageData/imageSlice";
import createAnnotationSlice from "./imageData/annotationSlice";
import createAutoAnnotationSlice from "./imageData/autoAnnotationConfig";
import createClassesSlice from "./imageData/classes";
import createModalSlice from "./imageData/modals";
import createProjectSlice from "./imageData/projects";

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
