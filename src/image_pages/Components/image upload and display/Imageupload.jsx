import React, { useState, useCallback } from "react";
import useStore from "../../../state/Alldata";
import axios from "axios";
import toast from "react-hot-toast";
import { MdCloudUpload } from "react-icons/md";
import { USER_TYPE } from "../../../Main home/user-type";

function ImageUpload({
  projectName,
  loading,
  setloading,
  setUploadProgress,
  setInitialBatchProcessed,
}) {
  const { imageSrc, setImageSrc, addSetImageSrc } = useStore();

  // Process image in main thread when worker fails
  const processImageMainThread = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Calculate dimensions
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio while resizing if needed
          if (width > 2048) {
            height = (height * 2048) / width;
            width = 2048;
          }
          if (height > 2048) {
            width = (width * 2048) / height;
            height = 2048;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Calculate quality based on file size
          const quality = calculateQuality(width, height, file.size);
          const compressed = canvas.toDataURL("image/jpeg", quality);

          resolve({
            src: compressed,
            file: file,
            rectangle_annotations: [],
            polygon_annotations: [],
            segmentation_annotations: [],
            width: width,
            height: height,
            width_multiplier: 800 / width,
            height_multiplier: 450 / height,
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const calculateQuality = (width, height, fileSize) => {
    const imageArea = width * height;
    const imageSizeInMB = fileSize / (1024 * 1024);

    if (imageSizeInMB <= 0.5) return 0.85;
    if (imageSizeInMB <= 1) return 0.8;
    if (imageSizeInMB <= 2) return 0.75;
    if (imageSizeInMB <= 4) return 0.7;
    if (imageArea > 4000 * 3000) return 0.6;
    return 0.65;
  };

  const createWorker = () => {
    const workerCode = `
      self.onmessage = async function(e) {
        try {
          const { file, maxWidth, maxHeight } = e.data;
          
          const arrayBuffer = await file.arrayBuffer();
          const blob = new Blob([arrayBuffer], { type: file.type });
          const bitmapImage = await createImageBitmap(blob);
          
          let width = bitmapImage.width;
          let height = bitmapImage.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
          const scaleX = 800 / width;
          const scaleY = 450 / height;
          const scale = Math.min(scaleX, scaleY);
          
          const canvas = new OffscreenCanvas(width, height);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(bitmapImage, 0, 0, width, height);
          
          const imageArea = width * height;
          const imageSizeInMB = file.size / (1024 * 1024);
          let quality = 0.65;
          
          if (imageSizeInMB <= 0.5) quality = 0.85;
          else if (imageSizeInMB <= 1) quality = 0.8;
          else if (imageSizeInMB <= 2) quality = 0.75;
          else if (imageSizeInMB <= 4) quality = 0.7;
          else if (imageArea > 4000 * 3000) quality = 0.6;
          
          const blob_compressed = await canvas.convertToBlob({
            type: 'image/jpeg',
            quality: quality
          });
          
          const reader = new FileReader();
          reader.readAsDataURL(blob_compressed);
          
          reader.onloadend = function() {
            self.postMessage({
              success: true,
              data: {
                src: reader.result,
                width: width,
                height: height,
                width_multiplier: scale,
                height_multiplier: scale
              }
            });
          };
        } catch (error) {
          self.postMessage({ 
            success: false, 
            error: error.message 
          });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    return new Worker(URL.createObjectURL(blob));
  };

  const processImage = useCallback(async (file) => {
    try {
      const result = await new Promise((resolve, reject) => {
        const worker = createWorker();

        worker.onmessage = (e) => {
          worker.terminate();
          if (e.data.success) {
            resolve(e.data.data);
          } else {
            reject(new Error(e.data.error));
          }
        };

        worker.onerror = (error) => {
          worker.terminate();
          reject(error);
        };

        worker.postMessage({
          file: file,
          maxWidth: 2048,
          maxHeight: 2048,
        });
      });

      return {
        src: result.src,
        file: file,
        rectangle_annotations: [],
        polygon_annotations: [],
        segmentation_annotations: [],
        width: result.width,
        height: result.height,
        width_multiplier: result.width_multiplier,
        height_multiplier: result.height_multiplier,
      };
    } catch (error) {
      console.log(
        `Worker processing failed for ${file.name}, using main thread fallback:`,
        error
      );
      return await processImageMainThread(file);
    }
  }, []);

  const processImageBatch = async (files, startProgress, endProgress) => {
    const processedImages = [];
    const chunkSize = 4;
    const chunks = [];

    for (let i = 0; i < files.length; i += chunkSize) {
      chunks.push(files.slice(i, i + chunkSize));
    }

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkResults = await Promise.all(
        chunk.map(async (file) => {
          try {
            return await processImage(file);
          } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
            try {
              return await processImageMainThread(file);
            } catch (finalError) {
              console.error(
                `Final attempt failed for ${file.name}:`,
                finalError
              );
              toast.error(`Failed to process ${file.name}`);
              return null;
            }
          }
        })
      );

      const validResults = chunkResults.filter((result) => result !== null);
      processedImages.push(...validResults);

      const progressRange = endProgress - startProgress;
      const progress =
        startProgress + (progressRange * (i + 1)) / chunks.length;
      setUploadProgress(progress);
    }

    return processedImages;
  };

  const uploadImages = async (images, startProgress, endProgress) => {
    const uploadBatchSize = 4;
    const uploadedImages = [];

    for (let i = 0; i < images.length; i += uploadBatchSize) {
      const batch = images.slice(i, i + uploadBatchSize);
      const batchResults = await Promise.all(
        batch.map(async (image) => {
          try {
            const base64String = image.src.split(",")[1];
            const data = {
              rectangle_annotations: image.rectangle_annotations,
              polygon_annotations: image.polygon_annotations,
              segmentation_annotations: image.segmentation_annotations,
              file_content: base64String,
              file_name: image.file.name || "default_filename",
              mime_type: image.file.type || "image/jpeg",
              image: {
                width: image.width,
                height: image.height,
                width_multiplier: image.width_multiplier,
                height_multiplier: image.height_multiplier,
              },
            };

            const userType =
              localStorage.getItem("userType") || USER_TYPE.INDIVIDUAL;
            const response = await axios.post(
              `http://127.0.0.1:8000/projects/image/${userType}/${projectName}/upload/`,
              { data1: data },
              {
                headers: { "Content-Type": "application/json" },
              }
            );

            // Add MongoDB ID to the image object
            return {
              ...image,
              id: response.data.image_id,
            };
          } catch (error) {
            console.error(`Error uploading ${image.file.name}:`, error);
            toast.error(`Failed to upload ${image.file.name}`);
            return null;
          }
        })
      );

      const validResults = batchResults.filter((result) => result !== null);
      uploadedImages.push(...validResults);

      const progressRange = endProgress - startProgress;
      const progress =
        startProgress + (progressRange * (i + batch.length)) / images.length;
      setUploadProgress(Math.min(progress, 100));
    }

    return uploadedImages;
  };

  const handleImageUpload = async (files) => {
    const fileArray = Array.from(files);
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const validImageFiles = fileArray.filter((file) =>
      validImageTypes.includes(file.type)
    );

    if (validImageFiles.length === 0) {
      toast.error("No valid image files selected.");
      return;
    }

    setloading(true);
    setUploadProgress(0);

    try {
      const initialBatch = validImageFiles.slice(0, 10);
      const remainingFiles = validImageFiles.slice(10);

      // Process and upload initial batch
      const initialProcessedImages = await processImageBatch(
        initialBatch,
        0,
        25
      );
      const uploadedInitialImages = await uploadImages(
        initialProcessedImages,
        25,
        50
      );

      // Filter out duplicates
      const newInitialImages = uploadedInitialImages.filter(
        (img) => !imageSrc.some((existingImg) => existingImg.src === img.src)
      );

      if (newInitialImages.length > 0) {
        if (imageSrc.length === 0) {
          setImageSrc(newInitialImages);
        } else {
          addSetImageSrc(newInitialImages);
        }
        setInitialBatchProcessed(true);
      }

      // Process and upload remaining files
      if (remainingFiles.length > 0) {
        const remainingProcessedImages = await processImageBatch(
          remainingFiles,
          50,
          75
        );
        const uploadedRemainingImages = await uploadImages(
          remainingProcessedImages,
          75,
          100
        );

        const newRemainingImages = uploadedRemainingImages.filter(
          (img) => !imageSrc.some((existingImg) => existingImg.src === img.src)
        );

        if (newRemainingImages.length > 0) {
          addSetImageSrc(newRemainingImages);
          toast.success("Images uploaded successfully.");
        }
      }

      if (newInitialImages.length === 0 && remainingFiles.length === 0) {
        toast.error("No new images to upload.");
      }
    } catch (error) {
      console.error("Upload process error:", error);
      toast.error(error.message || "Upload process failed.");
    } finally {
      setloading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className=" p-6 rounded-xl shadow-md flex flex-col items-center  dark:text-gray-100">
      
        <span className="p-1 mb-2 font-medium border-b border-gray-200 dark:border-gray-700">Upload More Images</span>
      
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

      <p className="mt-2 text-sm text-gray-500 text-center  dark:text-gray-100">
        Select images or folders to upload.
      </p>
    </div>
  );
}

export default ImageUpload;
