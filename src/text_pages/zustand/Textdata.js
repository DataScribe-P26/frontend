import { create } from "zustand";

const uniqueColorCombinations = [
  ["#ef4444", "#fef2f2", "#991b1b"], // Red
  ["#22c55e", "#f0fdf4", "#166534"], // Green
  ["#3b82f6", "#eff6ff", "#1e40af"], // Blue
  ["#f59e0b", "#fffbeb", "#b45309"], // Amber
  ["#8b5cf6", "#f5f3ff", "#5b21b6"], // Purple
  ["#ec4899", "#fdf2f8", "#9d174d"], // Pink
  ["#06b6d4", "#ecfeff", "#0e7490"], // Cyan
  ["#14b8a6", "#f0fdfa", "#0f766e"], // Teal
  ["#84cc16", "#f7fee7", "#4d7c0f"], // Lime
  ["#eab308", "#fefce8", "#a16207"], // Yellow
  ["#f43f5e", "#fff1f2", "#be123c"], // Rose
  ["#6366f1", "#eef2ff", "#4338ca"], // Indigo
  ["#0ea5e9", "#f0f9ff", "#0369a1"], // Light Blue
  ["#10b981", "#ecfdf5", "#047857"], // Emerald
  ["#a855f7", "#faf5ff", "#6b21a8"], // Fuchsia
  ["#f97316", "#fff7ed", "#c2410c"], // Orange
  ["#64748b", "#f8fafc", "#334155"], // Slate
  ["#d946ef", "#fdf4ff", "#86198f"], // Magenta
  ["#6b7280", "#f9fafb", "#374151"], // Gray
  ["#78716c", "#fafaf9", "#44403c"], // Warm Gray
  ["#0f766e", "#f0fdfa", "#134e4a"], // Dark Teal
  ["#b91c1c", "#fee2e2", "#7f1d1d"], // Dark Red
  ["#4338ca", "#e0e7ff", "#3730a3"], // Dark Indigo
  ["#15803d", "#dcfce7", "#166534"], // Dark Green
  ["#854d0e", "#fef9c3", "#713f12"], // Dark Yellow
];

const textStore = create((set) => ({
  //project
  projects: [],
  setProjects: (newProjects) => set(() => ({ projects: newProjects })),
  showModal: false,
  setShowModal: (isVisible) => set(() => ({ showModal: isVisible })),

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
