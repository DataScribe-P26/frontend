const createAutoAnnotationSlice = (set) => ({
  autoAnnotation: false,
  threshold: 25,
  trained: false,

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

  setThreshold: (projectName, value) => {
    const key = `${projectName}_threshold`;
    localStorage.setItem(key, value);
    set({ threshold: value });
  },

  loadThreshold: (projectName) => {
    const key = `${projectName}_threshold`;
    const savedThreshold = JSON.parse(localStorage.getItem(key));
    set({ threshold: savedThreshold ?? 25 });
  },

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
});

export default createAutoAnnotationSlice;
