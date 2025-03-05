const createAnnotationSlice = (set) => ({
  all_annotations: [],
  export_annotations: [],

  set_allAnnotations: (updater) => {
    set((state) => {
      const newAnnotations =
        typeof updater === "function"
          ? updater(state.all_annotations)
          : updater;
      return { all_annotations: newAnnotations };
    });
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

  setExportAnnotations: (export_annotations) => {
    const filteredAnnotations = export_annotations.filter(
      (annotation) => annotation.rectangle_annotations.length > 0
    );

    console.log("filteredAnnotations export", filteredAnnotations);

    set({
      export_annotations: filteredAnnotations,
    });
  },
});

export default createAnnotationSlice;
