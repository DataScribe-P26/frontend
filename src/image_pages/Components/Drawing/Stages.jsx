import React, { useRef, useState, useEffect } from "react";
import { Group, Layer, Rect, Stage, Text, Line, Circle } from "react-konva";
import Konvaimage from "../image upload and display/Konvaimage";
import toast from "react-hot-toast";
import useStore from "../../../state/imageData/Alldata";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { RxReset } from "react-icons/rx";
import { Transformer } from "react-konva";
import { all } from "axios";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../login/AuthContext";

function Stages({
  images,
  action,
  current,
  cl,
  setcl,
  submit,
  isProcessing,
  setIsProcessing,
  annotatedCount,
  setAnnotatedCount,
}) {
  // console.log("stages current", current);
  const stageRef = useRef();
  const [zoomEnabled, setZoomEnabled] = useState(true);
  const [selectedId, setSelectedId] = useState(null); // For selecting rectangles
  const transformerRef = useRef(null); // Ref for the Transformer
  const transformRef = useRef();
  const { user } = useAuth();

  const {
    all_annotations,
    set_allAnnotations,
    classes,
    class_label,
    openModal,
    set_classlabel,
    setImageSrc,
    threshold,
    currentIndex,
    setLast,
    last,
    setTrained,
    loadTrained,
  } = useStore();

  const [annotations, setAnnotations] = useState(all_annotations);
  const [pendingAnnotation, setPendingAnnotation] = useState(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  const { projectName } = useParams();

  const triggerTrainingAndInference = async () => {
    if (isProcessing) return;
    const trained = JSON.parse(localStorage.getItem(`${projectName}_trained`));
    if (trained == true) return;
    console.log("Model Training");
    try {
      setIsProcessing(true);
      const user_type = localStorage.getItem("userType");
      const email = user.email;
      console.log(email);
      if (trained == true) return;
      const response = await axios.post(
        `http://127.0.0.1:8000/api/train-and-infer/${projectName}?user_type=${user_type}&email=${email}` // Use & instead of ?
      );
      console.log(response.data);
      if (response.data) {
        // console.log("111", last);
        // const updatedAnnotations = all_annotations?.map((item) => {
        //   // Skip if item is null/undefined
        //   if (!item) return item;

        //   // Find matching response item, ensuring response.data exists and is an array
        //   const responseItem = Array.isArray(response?.data)
        //     ? response.data.find((r) => r?.id === item?.id)
        //     : null;

        //   if (!responseItem) return item;

        //   // Ensure annotations are arrays
        //   const existingAnnotations = Array.isArray(item?.annotations)
        //     ? item.annotations
        //     : [];
        //   const responseAnnotations = Array.isArray(responseItem?.annotations)
        //     ? responseItem.annotations
        //     : [];

        //   return {
        //     ...item,
        //     annotations:
        //       existingAnnotations.length > 0
        //         ? existingAnnotations
        //         : responseAnnotations,
        //   };
        // });

        // set_allAnnotations(updatedAnnotations);
        // console.log(updatedAnnotations);
        toast.success("Auto Annotation Done.");
        setTrained(projectName, true);
      }
    } catch (error) {
      console.error("Error during training and inference:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    loadTrained(projectName);
  }, [projectName]);

  useEffect(() => {
    const performInference = async (imageIds) => {
      try {
        const user_type = localStorage.getItem("userType");
        const email = user.email;
        console.log(email);
        const response = await axios.post(
          `http://127.0.0.1:8000/api/infer/${projectName}`,
          {
            image_ids: imageIds,
            user_type: user_type,
            email: email,
          }
        );

        console.log(response.data);
        if (response.data) {
          const updatedAnnotations = all_annotations?.map((item) => {
            if (!item) return item;
            const responseItem = Array.isArray(response?.data)
              ? response.data.find((r) => r?.id === item?.id)
              : null;

            if (!responseItem) return item;
            const existingAnnotations = Array.isArray(item?.annotations)
              ? item.annotations
              : [];
            const responseAnnotations = Array.isArray(responseItem?.annotations)
              ? responseItem.annotations
              : [];

            return {
              ...item,
              annotations:
                existingAnnotations.length > 0
                  ? existingAnnotations
                  : responseAnnotations,
            };
          });
          updatedAnnotations[currentIndex].auto_annotated = true;
          set_allAnnotations(updatedAnnotations);
          if (response.data.count > 0) {
            toast.success("Auto Annotation Complete");
          }
        }
      } catch (error) {
        console.error("Error during inference:", error);
        toast.error("Inference failed");
      }
    };
    console.log(all_annotations);
    const trained = JSON.parse(localStorage.getItem(`${projectName}_trained`));
    if (
      annotatedCount >= Number(threshold) &&
      trained === true &&
      isProcessing === false
    ) {
      const currentImage = all_annotations?.[currentIndex];
      if (currentImage?.auto_annotated == true) {
        return;
      }
      const hasNoAnnotations = !currentImage?.annotations?.length;

      if (hasNoAnnotations) {
        const imageIds = [currentImage?.id?.toString()].filter(Boolean);
        if (imageIds.length > 0) {
          const toastId = toast.loading("Inferencing...");

          console.log("infer-->", currentIndex + 1);

          performInference(imageIds).finally(() => {
            toast.dismiss(toastId); // Properly dismiss the loading toast
          });
        }
      }
    }
  }, [
    currentIndex,
    annotatedCount,
    threshold,
    isProcessing,
    all_annotations,
    projectName,
  ]);

  useEffect(() => {
    let imagesAnnotated = 0;

    annotations?.forEach((annotation) => {
      const { annotations: annotationList } = annotation;

      if (annotationList?.length > 0) {
        for (const aa of annotationList) {
          if (aa.type == "rectangle" && aa.class_name != "") {
            imagesAnnotated++;
            break;
          }
        }
      }
    });

    setAnnotatedCount(imagesAnnotated);
    if (
      imagesAnnotated > 0 &&
      annotatedCount >= Number(threshold) &&
      !isProcessing
    ) {
      const trained = JSON.parse(
        localStorage.getItem(`${projectName}_trained`)
      );
      const processAnnotations = async () => {
        await submit();
        console.log("trained", trained);
        if (trained == true) return;
        triggerTrainingAndInference();
      };

      processAnnotations();
    }
  }, [all_annotations, annotations, isProcessing]);

  useEffect(() => {
    setAnnotations(all_annotations);
  }, [all_annotations]);

  useEffect(() => {
    transformRef.current?.resetTransform();
  }, [current]);

  useEffect(() => {
    if (pendingAnnotation && cl) {
      const current_class = classes?.find(
        (classItem) => classItem.class_label === cl
      );

      set_allAnnotations((prevAnnotations) =>
        prevAnnotations?.map((entry) =>
          entry.image_id === current
            ? {
                ...entry,
                annotations: entry.annotations?.map((annotation) =>
                  annotation.class_id === pendingAnnotation.class_id
                    ? {
                        ...annotation,
                        class_name: current_class?.class_label || "",
                        Color: current_class?.color,
                        edit: true,
                      }
                    : annotation
                ),
              }
            : entry
        )
      );
      set_classlabel(null);
      setcl(null);
      setPendingAnnotation(null);
      setIsFinished(true); // End the segmentation function
    }
  }, [cl, pendingAnnotation, classes, current, set_allAnnotations]);
  const currentImage = annotations?.find((image) => image.image_id === current);

  // console.log("Current Image:", currentImage);
  // console.log("Images Prop:", images);
  // console.log("Current Image Src:", current);

  const selectedImage_ID = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  const isPainting = useRef(false);
  const moved = useRef(false);

  const [points, setPoints] = useState([]);
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [hoveredPolygonIndex, setHoveredPolygonIndex] = useState(null);
  const [hoveredTextIndex, setHoveredTextIndex] = useState(null);
  const [segmentationPath, setSegmentationPath] = useState([]);
  const [hoveredSegmentationIndex, setHoveredSegmentationIndex] =
    useState(null);

  const current_image = images?.find((image) => image.src === current);

  const getMousePos = (stage) => {
    const pointerPosition = stage.getPointerPosition();
    if (pointerPosition) {
      return { x: pointerPosition.x, y: pointerPosition.y };
    }
    return { x: 0, y: 0 };
  };

  const handleMouseDown = (event) => {
    if (action === "rectangle") {
      onRectangleMouseDown();
    } else if (action === "polygon") {
      handleClick(event);
    } else if (action === "segmentation") {
      handleSegmentationMouseDown(event);
    }
  };

  const onRectangleMouseDown = () => {
    const stage = stageRef.current;
    const { x, y } = getMousePos(stage);
    selectedImage_ID.current = Math.random(); // random id
    isPainting.current = true;

    let newAnnotation = {
      class_id: selectedImage_ID.current || Math.random(),
      class_name: "",
      x,
      y,
      width: 0,
      height: 0,
      Color: "black",
      type: "rectangle",
      edit: false,
      rotation: 0,
    };

    if (class_label) {
      const current_class = classes?.find(
        (classItem) => classItem.class_label === class_label
      );
      newAnnotation.class_name = current_class?.class_label || "";
      newAnnotation.Color = current_class?.color || "black";
    }

    set_allAnnotations((prevAnnotations) =>
      prevAnnotations?.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: [...entry.annotations, newAnnotation],
            }
          : entry
      )
    );
  };

  const handleRectSelect = (annotation) => {
    setSelectedId(annotation.class_id.toString());
  };

  const handleDragEnd = (e, annotation) => {
    const newX = e.target.x();
    const newY = e.target.y();

    set_allAnnotations((prevAnnotations) =>
      prevAnnotations?.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: entry.annotations?.map((a) =>
                a.class_id === annotation.class_id
                  ? {
                      ...a,
                      x: newX,
                      y: newY,
                    }
                  : a
              ),
            }
          : entry
      )
    );
  };

  const handleTransformEnd = (e, annotation) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();
    const newRotation = node.rotation();

    const abcd = set_allAnnotations((prevAnnotations) =>
      prevAnnotations?.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: entry.annotations?.map((a) =>
                a.class_id === annotation?.class_id
                  ? {
                      ...a,
                      x: newX,
                      y: newY,
                      width: node.width() * node.scaleX(),
                      height: node.height() * node.scaleY(),
                      rotation: newRotation,
                    }
                  : a
              ),
            }
          : entry
      )
    );
    //  node.scaleX(1);
    //  node.scaleY(1);
    // Delay the scale reset slightly to ensure state update is applied.
    setTimeout(() => {
      node.scaleX(1);
      node.scaleY(1);
    }, 1);
  };

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    const selectedNode = stageRef.current.findOne(`#${selectedId}`);
    transformer.nodes(selectedNode ? [selectedNode] : []);
    transformer.getLayer().batchDraw();
  }, [selectedId]);

  const handleClick = (event) => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    if (isFinished) {
      setPoints([]);
      setIsFinished(false);
      setIsMouseOverStartPoint(false);
      return;
    }

    // Check if mouse is over the start point and there are enough points
    if (isMouseOverStartPoint && points.length >= 2) {
      addPolygon(points);
      setPoints([]);
      setIsFinished(true);
      setIsMouseOverStartPoint(false);
    } else {
      setPoints((prevPoints) => [...prevPoints, mousePos]);
    }
  };

  const handleSegmentationMouseDown = (event) => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    if (!isPainting.current) {
      selectedImage_ID.current = Math.random(); // random id
      isPainting.current = true;
      setSegmentationPath([mousePos]);
    } else {
      setSegmentationPath((prevPath) => [...prevPath, mousePos]);
    }
    // Check if the current point is near the starting point
    if (segmentationPath.length > 2) {
      const distance = Math.sqrt(
        Math.pow(mousePos.x - segmentationPath[0].x, 2) +
          Math.pow(mousePos.y - segmentationPath[0].y, 2)
      );

      if (distance < 10) {
        closeSegmentationMask();
      }
    }
  };

  const addPolygon = async (points) => {
    const classId = Math.random(); // random id

    let newAnnotation = {
      class_id: classId,
      class_name: "",
      points: points?.map((point) => ({ x: point.x, y: point.y })),
      Color: "black",
      type: "polygon",
      edit: false,
    };
    set_allAnnotations((prevAnnotations) =>
      prevAnnotations?.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: [...entry.annotations, newAnnotation],
            }
          : entry
      )
    );

    openModal();
    setPendingAnnotation({
      class_id: classId,
    });
  };

  const addSegmentationMask = async (path) => {
    const classId = selectedImage_ID.current;
    const current_class = classes?.find(
      (classItem) => classItem.class_label === cl // use the selected class label
    );

    let newAnnotation = {
      class_id: classId,
      class_name: current_class?.class_label || "",
      points: path,
      Color: current_class?.color || "rgba(0, 0, 0, 0.5)", // Use the class color here
      type: "segmentation",
      edit: false,
    };
    set_allAnnotations((prevAnnotations) =>
      prevAnnotations?.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: [...entry.annotations, newAnnotation],
            }
          : entry
      )
    );

    openModal();
    setPendingAnnotation({
      class_id: classId,
    });
  };

  const onMouseMove = (event) => {
    // Get mouse position for cursor guidelines regardless of painting

    if (!action) return;

    const stage = stageRef.current;
    if (stage && action === "rectangle") {
      const mousePos = stage.getPointerPosition();
      if (mousePos) {
        setPosition({
          x: mousePos.x,
          y: mousePos.y,
        });
      }
    }
    if (!action || !isPainting.current) return;

    if (action === "rectangle") {
      onRectangleMouseMove();
    } else if (action === "polygon") {
      handleMouseMove(event);
    } else if (action === "segmentation") {
      const stage = stageRef.current;
      const mousePos = getMousePos(stage);
      setSegmentationPath((prevPath) => [...prevPath, mousePos]);
    }
  };
  const finalizeAnnotation = () => {
    set_classlabel(null); // Reset class label
    setcl(null);
  };

  const onRectangleMouseMove = () => {
    const stage = stageRef.current;
    const { x, y } = getMousePos(stage);
    moved.current = true;

    set_allAnnotations((prevAnnotations) =>
      prevAnnotations?.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: entry.annotations?.map((annotation) =>
                annotation.class_id === selectedImage_ID.current
                  ? {
                      ...annotation,
                      width: x - annotation.x,
                      height: y - annotation.y,
                    }
                  : annotation
              ),
            }
          : entry
      )
    );
  };

  const handleMouseMove = (event) => {
    if (isFinished) return; // Stop updating points when finished
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);
    setCurMousePos([mousePos.x, mousePos.y]);
  };

  const onPointerUp = () => {
    if (action === "rectangle" && moved.current) {
      finalizeRectangle();
    }
    if (action === "segmentation" && isPainting.current) {
      closeSegmentationMask();
    }
    isPainting.current = false;
    moved.current = false;
  };

  const finalizeRectangle = () => {
    const current_class = classes?.find(
      (classItem) => classItem.class_label === class_label
    );

    set_allAnnotations((prevAnnotations) =>
      prevAnnotations?.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: entry.annotations?.map((annotation) =>
                annotation.class_id === selectedImage_ID.current
                  ? {
                      ...annotation,
                      class_name: current_class?.class_label || "",
                      Color: current_class?.color || "black",
                      edit: true,
                    }
                  : annotation
              ),
            }
          : entry
      )
    );

    if (!class_label) {
      // Open modal if no class label is selected
      openModal();
      setPendingAnnotation({
        class_id: selectedImage_ID.current,
      });
      finalizeAnnotation();
    }
  };

  const handleMouseOverStartPoint = (event) => {
    if (isFinished || points.length < 3) return;
    event.target.to({
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 0,
    });
    setIsMouseOverStartPoint(true);
  };

  const handleMouseOutStartPoint = (event) => {
    event.target.to({
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 0.1,
    });
    setIsMouseOverStartPoint(false);
  };

  const calculateCentroid = (points) => {
    const numPoints = points.length;
    let centroidX = 0;
    let centroidY = 0;

    for (let i = 0; i < numPoints; i++) {
      centroidX += points[i].x;
      centroidY += points[i].y;
    }

    return [centroidX / numPoints, centroidY / numPoints];
  };

  const handleDelete = async (class_id) => {
    let currentImage = annotations?.find((image) => image.image_id === current);

    const annotationToDelete = currentImage.annotations.find(
      (annotation) => annotation.class_id === class_id
    );

    if (!annotationToDelete) {
      console.warn("Annotation not found in the current image.");
      return;
    }
    if (!currentImage) {
      console.error("No current image found for deletion.");
      return;
    }

    try {
      // API call to delete the bounding box from the backend
      set_allAnnotations((prevAnnotations) =>
        prevAnnotations?.map((entry) =>
          entry.image_id === current
            ? {
                ...entry,
                annotations: entry.annotations?.filter(
                  (annotation) => annotation.class_id !== class_id
                ),
              }
            : entry
        )
      );
      let currentImage = annotations?.find(
        (image) => image.image_id === current
      );

      const new_anno = currentImage.annotations.filter(
        (annotation) => annotation.class_id != class_id
      );
      currentImage.annotations = new_anno;
      submit(currentImage);
      const response = await fetch(
        `http://127.0.0.1:8000/images/${currentImage.id}/annotations/${class_id}/${annotationToDelete.type}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(
            "Annotation not found in the backend, deleting locally."
          );
        } else {
          const errorData = await response.json();
          console.error("Error deleting annotation:", errorData);
          throw new Error(errorData.detail || "Failed to delete annotation");
        }
      } else {
        console.log("Annotation deleted successfully from the backend");
      }
    } catch (error) {
      console.error("Error deleting annotation:", error.message);
    }
  };
  const handleEdit = (class_id) => {
    openModal();
    setPendingAnnotation({
      class_id: class_id, // Set the class_id to the selected annotation's ID
      type: "rectangle", // Adjust the type if needed
    });
    finalizeAnnotation();
  };

  const closeSegmentationMask = () => {
    if (segmentationPath.length > 1) {
      setSegmentationPath((prevPath) => [...prevPath, prevPath[0]]);
      addSegmentationMask([...segmentationPath, segmentationPath[0]]); // Close the path
    }
    setIsFinished(true);
    isPainting.current = false;
    setSegmentationPath([]);
  };

  useEffect(() => {
    setZoomEnabled(!action);
  }, [action]);

  return (
    <>
      {current_image && (
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          minScale={0.5}
          maxScale={5}
          wheel={{ disabled: !zoomEnabled }}
          panning={{ disabled: !zoomEnabled }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="flex gap-3 mb-4">
                {zoomEnabled && (
                  <div className="flex flex-col gap-3 mr-4">
                    <div className="w-[3.43rem] bg-white border border-slate-200 rounded-2xl flex flex-col justify-center items-center gap-3 py-4 shadow-md">
                      <button
                        onClick={() => zoomIn()}
                        className="rounded-xl w-11 h-11 flex items-center justify-center transition-all duration-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800"
                      >
                        <FiZoomIn className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => zoomOut()}
                        className="rounded-xl w-11 h-11 flex items-center justify-center transition-all duration-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800"
                      >
                        <FiZoomOut className="w-5 h-5" />
                      </button>
                      <div className="w-8 border-t border-slate-200 my-1"></div>
                      <button
                        onClick={() => resetTransform()}
                        className="rounded-xl w-11 h-11 flex items-center justify-center transition-all duration-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800"
                      >
                        <RxReset className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="overflow-hidden border-2">
                <TransformComponent>
                  <div
                    className="relative"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <Stage
                      ref={stageRef}
                      width={800}
                      height={450}
                      onMouseDown={handleMouseDown}
                      onMouseMove={onMouseMove}
                      onMouseUp={onPointerUp}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedId(null)}
                    >
                      <Layer>
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          <Konvaimage image={current_image} />
                          {isHovering && action === "rectangle" && (
                            <>
                              {/* Vertical guideline with enhanced styling */}
                              <Line
                                points={[
                                  position.x,
                                  0,
                                  position.x,
                                  stageRef.current?.attrs?.height || 450,
                                ]}
                                stroke="#000000" // Dark black color
                                strokeWidth={0.75} // Thinner line for precision
                                dash={[6, 3]} // Professional dash pattern
                                listening={false}
                                strokeScaleEnabled={false}
                                opacity={0.85} // Slightly transparent
                              />
                              {/* Ruler marks on vertical line */}
                              <Line
                                points={[
                                  position.x - 5,
                                  position.y,
                                  position.x + 5,
                                  position.y,
                                ]}
                                stroke="#000000"
                                strokeWidth={1.5}
                                listening={false}
                                strokeScaleEnabled={false}
                              />

                              {/* Horizontal guideline with enhanced styling */}
                              <Line
                                points={[
                                  0,
                                  position.y,
                                  stageRef.current?.attrs?.width || 800,
                                  position.y,
                                ]}
                                stroke="#000000" // Dark black color
                                strokeWidth={0.75} // Thinner line for precision
                                dash={[6, 3]} // Professional dash pattern
                                listening={false}
                                strokeScaleEnabled={false}
                                opacity={0.85} // Slightly transparent
                              />
                              {/* Ruler marks on horizontal line */}
                              <Line
                                points={[
                                  position.x,
                                  position.y - 5,
                                  position.x,
                                  position.y + 5,
                                ]}
                                stroke="#000000"
                                strokeWidth={1.5}
                                listening={false}
                                strokeScaleEnabled={false}
                              />

                              {/* Intersection point */}
                              <Circle
                                x={position.x}
                                y={position.y}
                                radius={2}
                                fill="#000000"
                                listening={false}
                                strokeScaleEnabled={false}
                              />
                            </>
                          )}
                        </div>

                        {currentImage?.annotations?.map((annotation, index) => {
                          if (annotation.type === "rectangle") {
                            return (
                              <Group
                                key={annotation.class_id}
                                onMouseEnter={() =>
                                  setHoveredId(annotation.class_id)
                                }
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => handleRectSelect(annotation)}
                              >
                                <Rect
                                  id={annotation?.class_id?.toString()}
                                  x={annotation.x}
                                  y={annotation.y}
                                  strokeWidth={2}
                                  listening={true}
                                  height={annotation.height}
                                  width={annotation.width}
                                  stroke={annotation.Color}
                                  fillEnabled={false}
                                  zIndex={annotation.zIndex}
                                  hitStrokeWidth={30}
                                  draggable={action === "edit"}
                                  rotation={annotation.rotation}
                                  onDragEnd={(e) =>
                                    handleDragEnd(e, annotation)
                                  }
                                  onTransformEnd={(e) =>
                                    handleTransformEnd(e, annotation)
                                  }
                                  onClick={(e) => {
                                    e.cancelBubble = true;
                                    setSelectedId(annotation.class_id);
                                  }}
                                  onTap={(e) => {
                                    e.cancelBubble = true;
                                    setSelectedId(annotation.class_id);
                                  }}
                                />

                                {hoveredId === annotation.class_id &&
                                  annotation.edit && (
                                    <Group
                                      x={annotation.x}
                                      y={annotation.y}
                                      rotation={annotation.rotation}
                                    >
                                      {/* Controls container - positioned at center of top edge */}
                                      <Group
                                        x={annotation.width / 2} // Center horizontally
                                        y={0} // At top edge
                                      >
                                        <Rect
                                          x={-20}
                                          y={-8}
                                          width={40}
                                          height={16}
                                          fill="transparent"
                                          opacity={0.8}
                                          cornerRadius={3}
                                        />
                                        <Text
                                          x={-12}
                                          y={2}
                                          text="X"
                                          fontSize={16}
                                          fill="red"
                                          onClick={() =>
                                            handleDelete(
                                              annotation.class_id,
                                              annotation.type
                                            )
                                          }
                                        />
                                        <Text
                                          x={2}
                                          y={2}
                                          text="E"
                                          fontSize={16}
                                          fill="green"
                                          onClick={() =>
                                            handleEdit(
                                              annotation.class_id,
                                              annotation.type
                                            )
                                          }
                                        />
                                      </Group>
                                    </Group>
                                  )}

                                {selectedId === annotation.class_id &&
                                  action === "edit" && (
                                    <Transformer
                                      ref={transformerRef}
                                      anchorSize={10}
                                      borderStrokeWidth={2}
                                      rotationSnaps={[0, 90, 180, 270]}
                                      rotateEnabled={true}
                                      resizeEnabled={true}
                                      anchorStroke="black"
                                      borderStroke="blue"
                                      onTransformEnd={handleTransformEnd}
                                    />
                                  )}
                              </Group>
                            );
                          } else if (annotation.type === "polygon") {
                            const getEdgeMiddlePoint = () => {
                              const p1 = annotation.points[0];
                              const p2 = annotation.points[1];

                              // Calculate angle and offset
                              const angle = Math.atan2(
                                p2.y - p1.y,
                                p2.x - p1.x
                              );
                              const offsetDistance = 5; // Reduced from 15 to 5 pixels

                              // Calculate the middle point of the edge
                              const midX = (p1.x + p2.x) / 2;
                              const midY = (p1.y + p2.y) / 2;

                              // Calculate perpendicular angle
                              const perpAngle = angle + Math.PI / 2;

                              // Offset the point slightly towards inside of polygon
                              return {
                                x: midX + offsetDistance * Math.cos(perpAngle),
                                y: midY + offsetDistance * Math.sin(perpAngle),
                                angle: angle,
                              };
                            };

                            const controlPoint = getEdgeMiddlePoint();
                            return (
                              <React.Fragment key={annotation.class_id}>
                                <Line
                                  points={annotation.points.flatMap((point) => [
                                    point.x,
                                    point.y,
                                  ])}
                                  stroke={annotation.Color}
                                  strokeWidth={2}
                                  hitStrokeWidth={30}
                                  fillEnabled={false}
                                  closed
                                  onMouseOver={() =>
                                    setHoveredPolygonIndex(index)
                                  }
                                  onMouseOut={() => {
                                    if (hoveredTextIndex !== index) {
                                      setHoveredPolygonIndex(null);
                                    }
                                  }}
                                />
                                {hoveredPolygonIndex === index && (
                                  <>
                                    <Group
                                      x={controlPoint.x}
                                      y={controlPoint.y}
                                      rotation={
                                        controlPoint.angle * (180 / Math.PI)
                                      }
                                    >
                                      <Rect
                                        x={-20}
                                        y={-8}
                                        width={40}
                                        height={16}
                                        fill="transparent"
                                        opacity={0.8}
                                        cornerRadius={3}
                                      />
                                      <Text
                                        x={-12}
                                        y={-5}
                                        text="X"
                                        fill="red"
                                        fontSize={16}
                                        onMouseOver={() =>
                                          setHoveredTextIndex(index)
                                        }
                                        onMouseOut={() =>
                                          setHoveredTextIndex(null)
                                        }
                                        onClick={() =>
                                          handleDelete(
                                            annotation.class_id,
                                            annotation.type
                                          )
                                        }
                                      />
                                      <Text
                                        x={2}
                                        y={-5}
                                        text="E"
                                        fill="green"
                                        fontSize={16}
                                        onMouseOver={() =>
                                          setHoveredTextIndex(index)
                                        }
                                        onMouseOut={() =>
                                          setHoveredTextIndex(null)
                                        }
                                        onClick={() =>
                                          handleEdit(
                                            annotation.class_id,
                                            annotation.type
                                          )
                                        }
                                      />
                                    </Group>
                                  </>
                                )}
                              </React.Fragment>
                            );
                          } else if (annotation.type === "segmentation") {
                            // Calculate a position along one of the edges
                            const getEdgeMiddlePoint = () => {
                              const p1 = annotation.points[0];
                              const p2 = annotation.points[1];

                              // Calculate angle and offset
                              const angle = Math.atan2(
                                p2.y - p1.y,
                                p2.x - p1.x
                              );
                              const offsetDistance = 5; // Small offset from the line

                              // Calculate the middle point of the edge
                              const midX = (p1.x + p2.x) / 2;
                              const midY = (p1.y + p2.y) / 2;

                              // Calculate perpendicular angle
                              const perpAngle = angle + Math.PI / 2;

                              // Offset the point slightly towards inside
                              return {
                                x: midX + offsetDistance * Math.cos(perpAngle),
                                y: midY + offsetDistance * Math.sin(perpAngle),
                                angle: angle,
                              };
                            };

                            const controlPoint = getEdgeMiddlePoint();

                            return (
                              <React.Fragment key={annotation.class_id}>
                                <Line
                                  points={annotation.points.flatMap((point) => [
                                    point.x,
                                    point.y,
                                  ])}
                                  hitStrokeWidth={30}
                                  stroke={annotation.Color}
                                  strokeWidth={2}
                                  fillEnabled={false}
                                  fill="transparent"
                                  closed={true}
                                  onMouseEnter={() =>
                                    setHoveredSegmentationIndex(index)
                                  }
                                  onMouseLeave={() =>
                                    setHoveredSegmentationIndex(null)
                                  }
                                />
                                {hoveredSegmentationIndex === index && (
                                  <>
                                    <Group
                                      x={controlPoint.x}
                                      y={controlPoint.y}
                                      rotation={
                                        controlPoint.angle * (180 / Math.PI)
                                      }
                                    >
                                      <Rect
                                        x={-20}
                                        y={-8}
                                        width={40}
                                        height={16}
                                        fill="transparent"
                                        opacity={0.8}
                                        cornerRadius={3}
                                      />
                                      <Text
                                        x={-12}
                                        y={-5}
                                        text="X"
                                        fill="red"
                                        fontSize={16}
                                        onMouseEnter={() =>
                                          setHoveredSegmentationIndex(index)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSegmentationIndex(null)
                                        }
                                        onClick={() =>
                                          handleDelete(annotation.class_id)
                                        }
                                      />
                                      <Text
                                        x={2}
                                        y={-5}
                                        text="E"
                                        fill="green"
                                        fontSize={16}
                                        onMouseEnter={() =>
                                          setHoveredSegmentationIndex(index)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSegmentationIndex(null)
                                        }
                                        onClick={() =>
                                          handleEdit(annotation.class_id)
                                        }
                                      />
                                    </Group>
                                  </>
                                )}
                              </React.Fragment>
                            );
                          }
                          return null;
                        })}

                        {action === "polygon" && (
                          <Line
                            points={points.flatMap((point) => [
                              point.x,
                              point.y,
                            ])}
                            stroke="black"
                            strokeWidth={1}
                            closed={isFinished}
                          />
                        )}
                        {action === "segmentation" &&
                          segmentationPath.length > 0 && (
                            <Line
                              points={segmentationPath.flatMap((p) => [
                                p.x,
                                p.y,
                              ])}
                              stroke="red" // Change this color to make the line visible
                              strokeWidth={2}
                              lineJoin="round"
                              lineCap="round"
                              closed={isFinished}
                            />
                          )}
                        {action === "polygon" &&
                          points?.map((point, index) => {
                            const width = 6;
                            const x = point.x - width / 2;
                            const y = point.y - width / 2;
                            const isStartPoint = index === 0;
                            return (
                              <Rect
                                key={`point-${index}`}
                                x={x}
                                y={y}
                                width={width}
                                height={width}
                                fill={isStartPoint ? "gold" : "white"}
                                stroke={isStartPoint ? "gold" : "black"}
                                strokeWidth={1}
                                onMouseOver={
                                  isStartPoint
                                    ? handleMouseOverStartPoint
                                    : undefined
                                }
                                onMouseOut={
                                  isStartPoint
                                    ? handleMouseOutStartPoint
                                    : undefined
                                }
                              />
                            );
                          })}
                      </Layer>
                    </Stage>
                  </div>
                </TransformComponent>
              </div>
            </>
          )}
        </TransformWrapper>
      )}
    </>
  );
}

export default Stages;
