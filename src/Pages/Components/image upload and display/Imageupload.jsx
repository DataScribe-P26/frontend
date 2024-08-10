import React, { useState } from "react";
import useStore from "../../../Zustand/Alldata";
import axios from "axios";
import toast from "react-hot-toast";
import { MdCloudUpload } from "react-icons/md";
import Spinner from "../Image Project/loading_screen";

function ImageUpload({ projectName, loading, setloading }) {
  const { imageSrc, setImageSrc } = useStore();

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setloading(true);
    const images = [];
    let processedFiles = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const exists = imageSrc.some((imgg) => imgg.src === img.src);

          if (!exists) {
            images.push({
              src: img.src,
              file: file,
              rectangle_annotations: [],
              polygon_annotations: [],
            });
          }

          processedFiles += 1;

          if (processedFiles === files.length) {
            const updatedImages = [...imageSrc, ...images];
            setImageSrc(updatedImages);
            uploadImagesSequentially(images);
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadImagesSequentially = async (images) => {
    for (const image of images) {
      try {
        const base64String = image.src.split(",")[1];
        const fileName = image.file.name || "default_filename";

        const data = {
          rectangle_annotations: image.rectangle_annotations,
          polygon_annotations: image.polygon_annotations,
          file_content: base64String,
          file_name: fileName,
          mime_type: "image/jpeg",
        };

        console.log("Uploading image:", data); // Debugging line

        await axios.post(
          `http://127.0.0.1:8000/projects/${projectName}/upload/`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(`Image ${fileName} uploaded successfully.`); // Debugging line
      } catch (error) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          toast.error("Image upload failed.");
        } else {
          console.error("Network Error:", error.message);
          toast.error("Image upload failed.");
        }
      }
    }

    setloading(false);
  };

  return (
    <div className="flex flex-col items-center bg-slate-500 p-6 rounded-lg shadow-lg">
      {!loading && (
        <>
          {" "}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            multiple
            id="file-upload"
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center px-6 py-3 rounded-full bg-blue-600 text-white cursor-pointer shadow-md hover:bg-blue-700 transition"
          >
            <MdCloudUpload className="text-xl mr-2" />
            Choose Files
          </label>
        </>
      )}
      {loading && <Spinner />}
    </div>
  );
}

export default ImageUpload;
