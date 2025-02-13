import create from "zustand";

const isValidColor = (color) => /^#[0-9A-F]{6}$/i.test(color);
const brightColors = [
  "#FFB3BA", // Soft Pink
  "#FFDFBA", // Soft Peach
  "#FFFFBA", // Soft Yellow
  "#B3FFBA", // Soft Green
  "#BAE1FF", // Soft Blue
  "#FFCCF9", // Soft Lavender
  "#C6E2FF", // Light Sky Blue
  "#FFD1DC", // Soft Coral
  "#FDFD96", // Pastel Yellow
  "#D3FFCE", // Pastel Mint Green
  "#B19CD9", // Soft Purple
  "#FFDAC1", // Peach
  "#C2C2F0", // Light Lilac
  "#FFFFCC", // Light Cream
  "#FFC0CB", // Pastel Pink
  "#E0BBE4", // Light Lavender
  "#C8A2C8", // Soft Mauve
  "#F4B8F7", // Soft Pinkish Purple
  "#FFDEAD", // Navajo White
  "#E6E6FA", // Lavender
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
        const scale = i.width_multiplier;
        const scaledWidth = i.width * scale;
        const scaledHeight = i.height * scale;

        const offsetX = (800 - scaledWidth) / 2;
        const offsetY = (450 - scaledHeight) / 2;
        const new_rectangles = i.rectangle_annotations.map((rect) => ({
          ...rect,
          x: rect.x * i.width_multiplier + offsetX,
          y: rect.y * i.height_multiplier + offsetY,
          width: rect.width * i.width_multiplier,
          height: rect.height * i.height_multiplier,
        }));

        const new_polygons = i.polygon_annotations.map((polygon) => ({
          ...polygon,
          points: polygon.points.map((point) => ({
            x: point.x * scale + offsetX,
            y: point.y * scale + offsetY,
          })),
        }));

        const new_segmentation = i.segmentation_annotations.map((polygon) => ({
          ...polygon,
          points: polygon.points.map((point) => ({
            x: point.x * scale + offsetX,
            y: point.y * scale + offsetY,
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
          width: i.width,
          height: i.height,
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
  set_allAnnotations: (updater) => {
    set((state) => {
      const newAnnotations =
        typeof updater === "function"
          ? updater(state.all_annotations)
          : updater;
      return { all_annotations: newAnnotations };
    });
  },

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
  created_on: null,
  setCreatedOn: (date) => set({ created_on: date }),
  reset: () =>
    set(() => ({
      imageSrc: [],
      current: null,
      all_annotations: [],
      class_label: null,
      currentIndex: 0,
      classes: [],
      export_annotations: [],
    })),
  export_annotations: [],
  setExportAnnotations: (export_annotations) => {
    const filteredAnnotations = export_annotations.filter(
      (annotation) => annotation.rectangle_annotations.length > 0
    );

    console.log("filteredAnnotations export", filteredAnnotations); // Log filtered annotations for debugging.

    set({
      export_annotations: filteredAnnotations,
    });
  },
  autoAnnotation: false,

  toggleAutoAnnotation: (projectName) => {
    set((state) => {
      const key = `${projectName}_autoAnnotation`;
      const newState = !state.autoAnnotation;
      localStorage.setItem(key, JSON.stringify(newState));
      return { autoAnnotation: newState };
    });
  },

  loadAutoAnnotation: (projectName) => {
    const key = `${projectName}_autoAnnotation`;
    const savedAutoAnnotation = JSON.parse(localStorage.getItem(key));
    set({ autoAnnotation: savedAutoAnnotation ?? false });
  },

  threshold: 25,
  setThreshold: (projectName, value) => {
    const key = `${projectName}_threshold`;
    localStorage.setItem(key, JSON.stringify(value));
    set({ threshold: value });
  },
  loadThreshold: (projectName) => {
    const key = `${projectName}_threshold`;
    const savedThreshold = JSON.parse(localStorage.getItem(key));
    set({ threshold: savedThreshold ?? 25 });
  },
  organizations: [],
  setOrganizations: (organizations) => set({ organizations }),
  trained: false,
  setTrained: (projectName, value) => {
    const key = `${projectName}_trained`;
    localStorage.setItem(key, JSON.stringify(value));
    set({ trained: Boolean(value) });
  },
  loadTrained: (projectName) => {
    const key = `${projectName}_trained`;
    const savedTrained = JSON.parse(localStorage.getItem(key));
    set({ trained: savedTrained ?? false });
  },
}));

export default useStore;
