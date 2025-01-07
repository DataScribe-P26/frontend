import React from "react";

function ImageUpload({ setImageSrc }) {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const images = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          images.push({
            src: img.src,
            file: file, // Store the file object
            rectangle_annotations: [],
            polygon_annotations: [],
            segmentation_annotations: [],
          });

          if (images.length === files.length) {
            setImageSrc(images);
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      multiple
      className="mb-4 file:px-3 file:py-2 file:rounded-full file:bg-blue-600 file:border-none file:text-white file:cursor-pointer bg-slate-500 px-3 py-2 rounded-full text-white/80"
    />
  );
}

export default ImageUpload;
