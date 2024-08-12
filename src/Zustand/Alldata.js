import create from "zustand";

const isValidColor = (color) => /^#[0-9A-F]{6}$/i.test(color);
const brightColors = [
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FF4500",
  "#32CD32",
  "#8A2BE2",
  "#FFD700",
  "#ADFF2F",
  "#FF69B4",
  "#00CED1",
  "#FF6347",
  "#7FFF00",
  "#40E0D0",
  "#DA70D6",
  "#EEE8AA",
  "#8B0000",
];

const randomBrightColor = (index) => {
  return brightColors[index % brightColors.length];
};

const useStore = create((set) => ({
  imageSrc: [],
  Color: "#000000",
  action: null,
  current: 0,
  all_annotations: [],
  class_label: null,
  counter: 0,
  classes: [
    { class_label: "Dog", color: "#FF7F50" },
    { class_label: "Cat", color: "#B0E0E6" },
    { class_label: "Lion", color: "#FF69B4" },
  ],
  setImageSrc: (src) => {
    if (!Array.isArray(src)) {
      console.error("setImageSrc expects an array, but received:", src);
      return;
    }

    set(() => {
      const newAnnotations = src.map((i) => ({
        image_id: i.src,
        annotations: [...i.rectangle_annotations, ...i.polygon_annotations,...i.segmentation_annotations],
      }));
      const firstImageSrc = src.length > 0 ? src[0].src : null;
      return {
        imageSrc: src,
        all_annotations: newAnnotations,
        current: firstImageSrc,
      };
    });
  },

  setColor: (color) => {
    if (isValidColor(color)) {
      set({ Color: color });
    } else {
      console.error("Invalid color format. Must be in hex format #rrggbb.");
    }
  },

  setAction: (action) => set({ action }),

  setcurrent: (current) => set({ current }),

  set_allAnnotations: (newAnnotations) =>
    set({ all_annotations: newAnnotations }),

  set_classlabel: (class_label) => set({ class_label }),

  add_classes: (newClassLabel) =>
    set((state) => ({
      classes: [
        ...state.classes,
        { class_label: newClassLabel, color: randomBrightColor(state.counter) },
      ],
      counter: state.counter + 1,
    })),

  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),

  closeModal: (newClassLabel) =>
    set((state) => ({
      isModalOpen: false,
      class_label: newClassLabel || state.class_label,
    })),

  isProjectModalOpen: false,
  openProjectModal: () => set({ isProjectModalOpen: true }),
  closeProjectModal: () => set({ isProjectModalOpen: false }),

  projects: [],
  addProject: (project_name, project_description) =>
    set((state) => ({
      projects: [...state.projects, { project_name, project_description }],
    })),

  project_name: null,
  setprojectname: (project_name) => set({ project_name }),
}));

export default useStore;
