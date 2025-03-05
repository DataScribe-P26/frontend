const createFileSlice = (set) => ({
  fileType: "text",
  file: null,
  content: null,
  setFileType: (fileType) => set({ fileType }),
  setFile: (file) => set({ file }),
  setContent: (content) => set({ content }),
  resetStore: () => set({ fileType: "text", file: null, content: null }),
});

export default createFileSlice;
