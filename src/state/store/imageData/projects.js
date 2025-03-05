import { loadFromLocalStorage } from "./utils";

const createProjectSlice = (set) => ({
  project_name: "",
  projects: [],
  created_on: null,
  projecttype: "",
  organizations: [],

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
      localStorage.setItem(`${project_name}_currentIndex`, JSON.stringify(0));
    }
  },

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

  setOrganizations: (organizations) => set({ organizations }),

  setprojectType: (projecttype) => set({ projecttype }),
});

export default createProjectSlice;
