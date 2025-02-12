import React, { useState } from "react";
import useStore from "../../../Zustand/Alldata";
import axios from "axios";
import toast from "react-hot-toast";
import { MdCloudUpload } from "react-icons/md";
import Spinner from "../Image Project/loading_screen";
import { USER_TYPE} from "../../../Main home/user-type";
function ImageUpload({ projectName, loading, setloading }) {
  const { imageSrc, setImageSrc } = useStore();

  const handleImageUpload = async (files) => {
    const fileArray = Array.from(files);

    // Filter files to include only images
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const validImageFiles = fileArray.filter((file) => {
      if (!validImageTypes.includes(file.type)) {
        return false;
      }
      return true;
    });

    if (validImageFiles.length === 0) {
      toast.error("No valid image files selected.", {
        style: {
          background: "#fff",
          color: "#1f2937",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        },
      });
      return;
    }

    setloading(true);
    const images = [];
    let processedFiles = 0;

    validImageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const exists = imageSrc.some((imgg) => imgg.src === img.src);
          const scaleX = 800 / img.width;
          const scaleY = 450 / img.height;
          const scale = Math.min(scaleX, scaleY);

          if (!exists) {
            images.push({
              src: img.src,
              file: file,
              rectangle_annotations: [],
              polygon_annotations: [],
              segmentation_annotations: [],
              width: img.width,
              height: img.height,
              width_multiplier: scale,
              height_multiplier: scale,
            });
          }

          processedFiles += 1;

          if (processedFiles === validImageFiles.length) {
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
        let text={
          "text": "",
          "entities": [
            {
            }
          ]
        }
        let type="image";
        let user_type='single';
        const userType = localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
            console.log("Current User Type:", userType);
            
            await axios.post(
              `http://127.0.0.1:8000/projects/image/${userType}/${projectName}/upload/`,
        {data1:data},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error uploading image:", error.message);
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

    setloading(false);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[20vh]">
        <Spinner />
      </div>
    );
  } else {
    return (
      <>
        <div className="bg-gray-100 p-8 rounded-xl shadow-md border border-gray-200 flex flex-col items-center mt-4">
          <div className="flex items-center text-lg mb-1 text-black">
            Upload More Images
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            multiple
            id="file-upload"
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="group flex items-center justify-center w-48 px-6 py-3 rounded-lg bg-purple-600 text-white cursor-pointer hover:bg-blue-700 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md mb-2"
          >
            <MdCloudUpload className="text-l mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Upload Files</span>
          </label>

          {/* Folder Upload */}
          <input
            type="file"
            accept="image/*"
            webkitdirectory="true"
            mozdirectory="true"
            onChange={(e) => handleImageUpload(e.target.files)}
            id="folder-upload"
            className="hidden"
          />
          <label
            htmlFor="folder-upload"
            className="group flex items-center justify-center w-48 px-6 py-3 rounded-lg bg-purple-600 text-white cursor-pointer hover:bg-blue-700 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
          >
            <MdCloudUpload className="text-l mr-2 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Upload Folder</span>
          </label>

          <p className="mt-2 text-sm text-gray-500 text-center">
            Select images or folders to upload.
          </p>
        </div>
      </>
    );
  }
}

export default ImageUpload;
