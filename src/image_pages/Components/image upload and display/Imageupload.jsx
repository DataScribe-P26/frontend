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
              segmentation_annotations: [],
              width: img.width,
              height: img.height,
              width_multiplier: 800 / img.width,
              height_multiplier: 450 / img.height,
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
          segmentation_annotations: image.segmentation_annotations,
          file_content: base64String,
          file_name: fileName,
          mime_type: image.file.type || "image/jpeg",
          image: {
            width: image.width,
            height: image.height,
            width_multiplier: image.width_multiplier,
            height_multiplier: image.height_multiplier,
          },
        };

        await axios.post(
          `http://127.0.0.1:8000/projects/${projectName}/upload/`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Success toast with professional styling
        toast.success("Image uploaded successfully", {
          style: {
            background: "#fff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          },
        });
      } catch (error) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          toast.error(
            `Image upload failed: ${
              error.response.data.detail || "Unknown error"
            }`,
            {
              style: {
                background: "#fff",
                color: "#1f2937",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              },
            }
          );
        } else {
          console.error("Network Error:", error.message);
          toast.error("Image upload failed.", {
            style: {
              background: "#fff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            },
          });
        }
      }
    }

    setloading(false);
  };

  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-md border border-gray-200">
      {!loading && (
        <>
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
            className="group flex items-center px-6 py-3 rounded-lg bg-purple-600 text-white cursor-pointer hover:bg-blue-700 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
          >
            <MdCloudUpload className="text-xl mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Choose Files</span>
          </label>
          <p className="mt-3 text-sm text-gray-500">Select images to upload</p>
        </>
      )}
      {loading && (
        <div className="py-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
