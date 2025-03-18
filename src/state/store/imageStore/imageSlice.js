import { loadFromLocalStorage, processAnnotations } from "../../../utils/utils";

const createImageSlice = (set, get) => ({
  imageSrc: [],
  current: null,
  currentIndex: 0,
  action: null,
  Color: "#000000",

  setImageSrc: (src) => {
    if (!Array.isArray(src)) {
      console.error("setImageSrc expects an array, but received:", src);
      return;
    }

    set(() => {
      const newAnnotations = src.map(processAnnotations);

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

  addSetImageSrc: (newSrc) => {
    if (!Array.isArray(newSrc)) {
      console.error("addSetImageSrc expects an array, but received:", newSrc);
      return;
    }

    set((state) => {
      const newAnnotations = newSrc.map(processAnnotations);

      const updatedImageSrc = [...state.imageSrc, ...newSrc];
      const updatedAnnotations = [...state.all_annotations, ...newAnnotations];

      const current =
        state.current || (newSrc.length > 0 ? newSrc[0].src : null);

      return {
        imageSrc: updatedImageSrc,
        all_annotations: updatedAnnotations,
        current: current,
      };
    });
  },

  setColor: (color) => {
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      set({ Color: color });
    } else {
      console.error("Invalid color format. Must be in hex format #rrggbb.");
    }
  },

  setAction: (action) => set({ action }),

  setcurrent: (current) => {
    set({ current });
  },

  setCurrentIndex: (currentIndex) => {
    set({ currentIndex });
    const { project_name } = get();
    if (project_name) {
      localStorage.setItem(
        `${project_name}_currentIndex`,
        JSON.stringify(currentIndex)
      );
    }
  },
});

export default createImageSlice;
