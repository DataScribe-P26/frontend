const createProjectsSlice = (set) => ({
  projects: [],
  setProjects: (newProjects) => set(() => ({ projects: newProjects })),
  showModal: false,
  setShowModal: (isVisible) => set(() => ({ showModal: isVisible })),
  isUploaded: false,
  setIsUploaded: (status) => set({ isUploaded: status }),
});

export default createProjectsSlice;
