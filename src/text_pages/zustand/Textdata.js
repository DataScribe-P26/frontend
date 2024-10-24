import { create } from "zustand";

const uniqueColorCombinations = [
  ["#F8BBD0", "#FEE4E4", "#D67A7A"], // Pastel Red
  ["#A5D6A7", "#E8F5E9", "#6B9A3A"], // Pastel Green
  ["#90CAF9", "#E3F2FD", "#1E88E5"], // Pastel Blue
  ["#FFCC80", "#FFF8E1", "#BF8C00"], // Pastel Amber
  ["#D7B2E1", "#F3E5F5", "#6A1B9A"], // Pastel Purple
  ["#F48FB1", "#F8BBD0", "#D81B60"], // Pastel Pink
  ["#80DEEA", "#E0F7FA", "#0097A7"], // Pastel Cyan
  ["#B2E1D6", "#E0F2F1", "#00796B"], // Pastel Teal
  ["#D4E157", "#F3FCE0", "#8BCA0F"], // Pastel Lime
  ["#FDD835", "#FEF9E0", "#A7A600"], // Pastel Yellow
  ["#F48FB1", "#FFEBEE", "#C2185B"], // Pastel Rose
  ["#9FA8DA", "#E8EAF6", "#3949AB"], // Pastel Indigo
  ["#81D4FA", "#E1F5FE", "#0288D1"], // Pastel Light Blue
  ["#80E3B2", "#E0F7FA", "#009688"], // Pastel Emerald
  ["#EAB8F1", "#FAF5FF", "#A03A80"], // Pastel Fuchsia
  ["#FFB74D", "#FFF3E0", "#FF8F00"], // Pastel Orange
  ["#B0BEC5", "#F8FAFA", "#455A64"], // Pastel Slate
  ["#E91E63", "#F3E5F5", "#9C27B0"], // Pastel Magenta
  ["#B0BEC5", "#FAFAFA", "#607D8B"], // Pastel Gray
  ["#B2A99C", "#FAFAF9", "#7A7C6D"], // Pastel Warm Gray
  ["#A7D6D5", "#E0F2F1", "#0E4B42"], // Pastel Dark Teal
  ["#E57373", "#FCE4EC", "#C62828"], // Pastel Dark Red
  ["#9C6FEC", "#E3F2FD", "#5C6BC0"], // Pastel Dark Indigo
  ["#A5D6A7", "#E8F5E9", "#4B8A3B"], // Pastel Dark Green
  ["#D7A25E", "#FFF4E1", "#9A6A33"], // Pastel Dark Orange
];

const textStore = create((set) => ({
  //project
  projects: [],
  setProjects: (newProjects) => set(() => ({ projects: newProjects })),
  showModal: false,
  setShowModal: (isVisible) => set(() => ({ showModal: isVisible })),
  isDarkMode: false, // Add dark mode state
  setIsDarkMode: (isDarkMode) => set({ isDarkMode }), // Function to set dark mode


  isUploaded: false,
  setIsUploaded: (status) => set({ isUploaded: status }),

  //current project
  projectname: "",
  project_type: "",
  setprojectname: (name) => set(() => ({ projectname: name })),
  setproject_type: (type) => set(() => ({ project_type: type })),

  //labels
  labels: [],
  counter: 0,

  addLabel: (name) =>
    set((state) => {
      const colorSet =
        uniqueColorCombinations[
          state.labels.length % uniqueColorCombinations.length
        ];

      return {
        labels: [
          ...state.labels,
          {
            name,
            color: colorSet[0],
            bgColor: colorSet[1],
            textColor: colorSet[2],
          },
        ],
        counter: state.labels.length + 1,
      };
    }),
  setLabels: (newLabelsArray) =>
    set((state) => {
      return {
        labels: [...newLabelsArray],
        counter: newLabelsArray.length + 1,
      };
    }),
  deleteLabel: (labelName) =>
    set((state) => {
      const updatedLabels = state.labels.filter(
        (label) => label.name !== labelName
      ); // Remove the label by name
      return {
        labels: updatedLabels, // Update the labels to the filtered array
        counter: updatedLabels.length, // Update the counter to reflect the new number of labels
      };
    }),

  //file
  fileType: "text",
  file: null,
  content: null,
  setFileType: (fileType) => set({ fileType }),
  setFile: (file) => set({ file }),
  setContent: (content) => set({ content }),
  resetStore: () => set({ fileType: "text", file: null, content: null }),

  //annotations
  annotations: [],
  setAnnotations: (annotations) => set({ annotations }),
  addAnnotation: (annotation) =>
    set((state) => ({
      annotations: [...state.annotations, annotation],
    })),
  deleteAnnotation: (annotationToDelete) =>
    set((state) => ({
      annotations: state.annotations.filter(
        (annotation) =>
          !(
            annotation.text === annotationToDelete.text &&
            annotation.label.name === annotationToDelete.label.name
          )
      ),
    })),
}));

export default textStore;
