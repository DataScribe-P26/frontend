import create from "zustand";
import createImageSlice from "./imageSlice";
import createAnnotationSlice from "./annotationSlice";
import createAutoAnnotationSlice from "./autoAnnotationConfig";
import createClassesSlice from "./classes";
import createModalSlice from "./modals";
import createProjectSlice from "./projects";

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
