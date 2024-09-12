import create from "zustand";

const isValidColor = (color) => /^#[0-9A-F]{6}$/i.test(color);
const brightColors = [
  "#FF7F50",
  "#FF69B4",
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

const randomBrightColor = (index) => brightColors[index % brightColors.length];

const loadFromLocalStorage = (key, defaultValue) => {
  const saved = localStorage.getItem(key);
  try {
    if (key === "current" && saved && saved.startsWith("data:image")) {
      return saved;
    }
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error(`Failed to parse ${key} from localStorage`, e);
    return defaultValue;
  }
};

const useStore = create((set) => ({
  imageSrc: [],
  Color: "#000000",
  action: null,
  current: null,
  all_annotations: [],
  class_label: null,
  counter: 0,
  currentIndex: 0,
  classes: [],
  project_name: "",

  setImageSrc: (src) => {
    if (!Array.isArray(src)) {
      console.error("setImageSrc expects an array, but received:", src);
      return;
    }

    set(() => {
      const newAnnotations = src.map((i) => {
        const new_rectangles = i.rectangle_annotations.map((rect) => ({
          ...rect,
          x: rect.x * i.width_multiplier,
          y: rect.y * i.height_multiplier,
          width: rect.width * i.width_multiplier,
          height: rect.height * i.height_multiplier,
        }));

        const new_polygons = i.polygon_annotations.map((polygon) => ({
          ...polygon,
          points: polygon.points.map((point) => ({
            x: point.x * i.width_multiplier,
            y: point.y * i.height_multiplier,
          })),
        }));

        const new_segmentation = i.segmentation_annotations.map((polygon) => ({
          ...polygon,
          points: polygon.points.map((point) => ({
            x: point.x * i.width_multiplier,
            y: point.y * i.height_multiplier,
          })),
        }));

        return {
          image_id: i.src,
          annotations: [
            ...new_rectangles,
            ...new_polygons,
            ...new_segmentation,
          ],
          id: i.id,
          width_multiplier: i.width_multiplier,
          height_multiplier: i.height_multiplier,
        };
      });

      const firstImageSrc =
        src.length > 0 && !loadFromLocalStorage("current", null)
          ? src[0].src
          : loadFromLocalStorage("current", null);

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

  update_class_name: (class_id, new_class_name) => {
    set((state) => ({
      allAnnotations: state.allAnnotations.map((annotation) =>
        annotation.class_id === class_id
          ? { ...annotation, class_label: new_class_name }
          : annotation
      ),
    }));
  },
  

  setAction: (action) => set({ action }),

  setcurrent: (current) => {
    set({ current });
    const { project_name } = useStore.getState();
    if (project_name) {
      localStorage.setItem(`${project_name}_current`, current);
    }
  },

  setCurrentIndex: (currentIndex) => {
    set({ currentIndex });
    const { project_name } = useStore.getState();
    if (project_name) {
      localStorage.setItem(
        `${project_name}_currentIndex`,
        JSON.stringify(currentIndex)
      );
    }
  },

  set_allAnnotations: (newAnnotations) =>
    set({ all_annotations: newAnnotations }),

  set_classlabel: (class_label) => set({ class_label }),

  add_classes: (newClassLabel, newcolor) =>
    set((state) => ({
      classes: [
        ...state.classes,
        {
          class_label: newClassLabel,
          color: newcolor || randomBrightColor(state.counter),
        },
      ],
      counter: state.counter + 1,
    })),

  set_classes: (classLabels) =>
    set((state) => {
      const uniqueClasses = classLabels.filter((newClassLabel) => {
        return !state.classes.some(
          (existingClass) =>
            existingClass.class_label.toLowerCase() ===
            newClassLabel.toLowerCase()
        );
      });

      const newClasses = uniqueClasses.map((classLabel, index) => ({
        class_label: classLabel,
        color: randomBrightColor(state.counter + index),
      }));

      return {
        classes: [...state.classes, ...newClasses],
        counter: state.counter + newClasses.length,
      };
    }),

  clear_classes: () =>
    set(() => ({
      classes: [],
      counter: 0,
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

  setprojectname: (project_name) => {
    set({ project_name });

    const savedCurrent = loadFromLocalStorage(`${project_name}_current`, null);
    const savedCurrentIndex = loadFromLocalStorage(
      `${project_name}_currentIndex`,
      0
    );

    set({
      current: savedCurrent,
      currentIndex: savedCurrentIndex,
    });

    if (!savedCurrent && !savedCurrentIndex) {
      localStorage.setItem(`${project_name}_current`, null);
      localStorage.setItem(`${project_name}_currentIndex`, JSON.stringify(0));
    }
  },
}));

export default useStore;
