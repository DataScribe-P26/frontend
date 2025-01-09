import React, { useRef, useState, useEffect } from "react";
import { Group, Layer, Rect, Stage, Text, Line } from "react-konva";
import Konvaimage from "../image upload and display/Konvaimage";
import toast from "react-hot-toast";
import useStore from "../../../Zustand/Alldata";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { RxReset } from "react-icons/rx";
import { Transformer } from "react-konva";
import { all } from "axios";

function Stages({ images, action, current, cl, setcl }) {
  // console.log("stages current", current);
  const stageRef = useRef();
  const [zoomEnabled, setZoomEnabled] = useState(true);
  const [selectedId, setSelectedId] = useState(null); // For selecting rectangles
  const transformerRef = useRef(null); // Ref for the Transformer
  const transformRef = useRef();

  const {
    all_annotations,
    set_allAnnotations,
    classes,
    class_label,
    openModal,
    set_classlabel,
  } = useStore();

  const [annotations, setAnnotations] = useState(all_annotations);
  const [pendingAnnotation, setPendingAnnotation] = useState(null);

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
    console.log("Selected ID:", selectedId);
    console.log("Action:", action);
    console.log("Annotation id:", annotation.class_id);
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
    console.log("abcd", annotation);
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
                a.class_id === annotation.class_id
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
    console.log(abcd);
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
    console.log("Current image:", currentImage);
    console.log("Class ID:", class_id);
    console.log("Current image ID:", currentImage.id);
    const annotationToDelete = currentImage.annotations.find(
      (annotation) => annotation.class_id === class_id
    );
  
    if (!annotationToDelete) {
      console.warn("Annotation not found in the current image.");
      return;
    }
    console.log("Annotation type:", annotationToDelete.type);
    if (!currentImage) {
      console.error("No current image found for deletion.");
      return;
    }
  
    try {
      // API call to delete the bounding box from the backend
      const response = await fetch(
        `http://127.0.0.1:8000/images/${currentImage.id}/annotations/${class_id}/${annotationToDelete.type}`,
        { method: "DELETE" }
      );
  
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Annotation not found in the backend, deleting locally.");
        } else {
          const errorData = await response.json();
          console.error("Error deleting annotation:", errorData);
          throw new Error(errorData.detail || "Failed to delete annotation");
        }
      } else {
        console.log("Annotation deleted successfully from the backend");
      }
  
      // Update the state after successful deletion or if it was new
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
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Konvaimage image={current_image} />
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
                                id={annotation.class_id.toString()}
                                x={annotation.x}
                                y={annotation.y}
                                strokeWidth={2}
                                listening={true}
                                height={annotation.height}
                                width={annotation.width}
                                stroke={annotation.Color}
                                fillEnabled={false}
                                zIndex={annotation.zIndex} // Add this property for z-index
                                hitStrokeWidth={50} // Increase hit region size
                                draggable={action === "edit"}
                                rotation={annotation.rotation}
                                onDragEnd={(e) => handleDragEnd(e, annotation)}
                                onTransformEnd={(e) =>
                                  handleTransformEnd(e, annotation)
                                }
                                onClick={(e) => {
                                  e.cancelBubble = true; // Prevent click event from propagating to the stage
                                  setSelectedId(annotation.class_id);
                                }}
                                onTap={(e) => {
                                  e.cancelBubble = true; // Prevent click event from propagating to the stage
                                  setSelectedId(annotation.class_id);
                                }}
                              />

                              {hoveredId === annotation.class_id &&
                                annotation.edit && (
                                  <>
                                    <Rect
                                      x={annotation.x - 5}
                                      y={annotation.y - 5}
                                      width={25}
                                      height={30}
                                      fill="transparent"
                                      onClick={() =>
                                        handleDelete(
                                          annotation.class_id,
                                          annotation.type
                                        )
                                      }
                                    />
                                    <Text
                                      x={annotation.x + 5 + 3}
                                      y={annotation.y - 20}
                                      text="X"
                                      fontSize={16}
                                      fill="red"
                                      rotation={annotation.rotation}
                                      onClick={() =>
                                        handleDelete(
                                          annotation.class_id,
                                          annotation.type
                                        )
                                      }
                                    />

                                    <Rect
                                      x={annotation.x - 5}
                                      y={annotation.y - 5}
                                      width={40}
                                      height={30}
                                      fill="transparent"
                                      onClick={() =>
                                        handleEdit(
                                          annotation.class_id,
                                          annotation.type
                                        )
                                      }
                                    />
                                    <Text
                                      x={annotation.x + 5+3 }
                                      y={annotation.y +10}
                                      text="E"
                                      fontSize={16}
                                      fill="green"
                                      rotation={annotation.rotation}
                                      onClick={() =>
                                        handleEdit(
                                          annotation.class_id,
                                          annotation.type
                                        )
                                      }
                                    />
                                  </>
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
                          const centroid = calculateCentroid(annotation.points);
                          return (
                            <React.Fragment key={annotation.class_id}>
                              <Line
                                points={annotation.points.flatMap((point) => [
                                  point.x,
                                  point.y,
                                ])}
                                stroke={annotation.Color}
                                strokeWidth={2}
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
                                  <Rect
                                    x={centroid[0] - 25}
                                    y={centroid[1] - 15}
                                    width={50}
                                    height={30}
                                    fill="transparent"
                                    onClick={() =>
                                      handleDelete(
                                        annotation.class_id,
                                        annotation.type
                                      )
                                    }
                                  />
                                  <Text
                                    x={centroid[0] - 20}
                                    y={centroid[1] - 10}
                                    text="X"
                                    fill="red"
                                    fontSize={16}
                                    onMouseOver={() =>
                                      setHoveredTextIndex(index)
                                    }
                                    onMouseOut={() => setHoveredTextIndex(null)}
                                    onClick={() =>
                                      handleDelete(
                                        annotation.class_id,
                                        annotation.type
                                      )
                                    }
                                  />

                                  <Text
                                    x={centroid[0] - 5}
                                    y={centroid[1] - 10}
                                    text="E"
                                    fill="green"
                                    fontSize={16}
                                    onMouseOver={() =>
                                      setHoveredTextIndex(index)
                                    }
                                    onMouseOut={() => setHoveredTextIndex(null)}
                                    onClick={() =>
                                      handleEdit(
                                        annotation.class_id,
                                        annotation.type
                                      )
                                    }
                                  />
                                </>
                              )}
                            </React.Fragment>
                          );
                        } else if (annotation.type === "segmentation") {
                          {
                            const centroid = calculateCentroid(
                              annotation.points
                            );

                            return (
                              <React.Fragment key={annotation.class_id}>
                                <Line
                                  points={annotation.points.flatMap((point) => [
                                    point.x,
                                    point.y,
                                  ])}
                                  stroke={annotation.Color} // Use the color assigned to the class
                                  strokeWidth={2}
                                  fill="transparent"
                                  closed={true} // Ensure the path is closed
                                  onMouseEnter={() =>
                                    setHoveredSegmentationIndex(index)
                                  }
                                  onMouseLeave={() =>
                                    setHoveredSegmentationIndex(null)
                                  }
                                />
                                {hoveredSegmentationIndex === index && (
                                  <>
                                    <Rect
                                      x={annotation.points[0].x - 25}
                                      y={annotation.points[0].y - 15}
                                      width={50}
                                      height={30}
                                      fill="transparent"
                                      onClick={() =>
                                        handleDelete(annotation.class_id)
                                      }
                                    />
                                    <Text
                                      x={centroid[0] - 20} // Move further left from centroid
                                      y={centroid[1] - 10} // Keep the same vertical position
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
                                      x={centroid[0] + 10} // Move further right from centroid
                                      y={centroid[1] - 10} // Keep the same vertical position
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
                                  </>
                                )}
                              </React.Fragment>
                            );
                          }
                        }
                        return null;
                      })}

                      {action === "polygon" && (
                        <Line
                          points={points.flatMap((point) => [point.x, point.y])}
                          stroke="black"
                          strokeWidth={1}
                          closed={isFinished}
                        />
                      )}
                      {action === "segmentation" &&
                        segmentationPath.length > 0 && (
                          <Line
                            points={segmentationPath.flatMap((p) => [p.x, p.y])}
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