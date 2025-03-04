const createAnnotationsSlice = (set) => ({
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
    emotions: [],  
    setEmotions: (newEmotions) => set({ emotions: newEmotions }),  

    sentimentLabels: [],
    setSentimentLabels: (newSentimentLabels) => set({ sentimentLabels: newSentimentLabels }),

});

export default createAnnotationsSlice;
