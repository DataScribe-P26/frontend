import { randomBrightColor } from "./utils";

const createClassesSlice = (set) => ({
  classes: [],
  counter: 0,
  class_label: null,

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
});

export default createClassesSlice;
