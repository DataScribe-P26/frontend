const createCurrentProjectSlice = (set) => ({
  projectname: "",
  project_type: "",
  setProjectName: (name) => set(() => ({ projectname: name })),  // Fixed function name style
  setProjectType: (type) => set(() => ({ project_type: type })),
});

export default createCurrentProjectSlice;
