import React, { useRef, useState, useEffect } from "react";
import { Group, Layer, Rect, Stage, Text, Line } from "react-konva";
import Konvaimage from "../image/Konvaimage";
import toast from "react-hot-toast";
import useStore from "../../../Zustand/Alldata";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { RxReset } from "react-icons/rx";

function Stages({ images, action, current, cl, setcl }) {
  // console.log("stages current", current);
  const stageRef = useRef();
  const [zoomEnabled, setZoomEnabled] = useState(true);

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
    if (pendingAnnotation && cl) {
      const current_class = classes.find(
        (classItem) => classItem.class_label === cl
      );

      set_allAnnotations((prevAnnotations) =>
        prevAnnotations.map((entry) =>
          entry.image_id === current
            ? {
                ...entry,
                annotations: entry.annotations.map((annotation) =>
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
    }
  }, [cl, pendingAnnotation, classes, current, set_allAnnotations]);
  const currentImage = annotations.find((image) => image.image_id === current);

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
  const current_image = images.find((image) => image.src === current);

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
    }
  };

  const onRectangleMouseDown = () => {
    const stage = stageRef.current;
    const { x, y } = getMousePos(stage);
    selectedImage_ID.current = Math.random(); // random id
    isPainting.current = true;

    let newAnnotation = {
      class_id: selectedImage_ID.current,
      class_name: "",
      x,
      y,
      width: 0,
      height: 0,
      Color: "black",
      type: "rectangle",
      edit: false,
    };

    if (class_label) {
      const current_class = classes.find(
        (classItem) => classItem.class_label === class_label
      );
      newAnnotation.class_name = current_class?.class_label || "";
      newAnnotation.Color = current_class?.color || "black";
    }

    set_allAnnotations((prevAnnotations) =>
      prevAnnotations.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: [...entry.annotations, newAnnotation],
            }
          : entry
      )
    );
  };

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

  const addPolygon = async (points) => {
    const classId = Math.random(); // random id

    let newAnnotation = {
      class_id: classId,
      class_name: "",
      points: points.map((point) => ({ x: point.x, y: point.y })),
      Color: "black",
      type: "polygon",
      edit: false,
    };
    set_allAnnotations((prevAnnotations) =>
      prevAnnotations.map((entry) =>
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
      prevAnnotations.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: entry.annotations.map((annotation) =>
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
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);
    setCurMousePos([mousePos.x, mousePos.y]);
  };

  const onPointerUp = () => {
    if (action === "rectangle" && moved.current) {
      finalizeRectangle();
    }
    isPainting.current = false;
    moved.current = false;
  };

  const finalizeRectangle = () => {
    const current_class = classes.find(
      (classItem) => classItem.class_label === class_label
    );

    set_allAnnotations((prevAnnotations) =>
      prevAnnotations.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: entry.annotations.map((annotation) =>
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

  const handleDelete = (class_id) => {
    set_allAnnotations((prevAnnotations) =>
      prevAnnotations.map((entry) =>
        entry.image_id === current
          ? {
              ...entry,
              annotations: entry.annotations.filter(
                (annotation) => annotation.class_id !== class_id
              ),
            }
          : entry
      )
    );
  };

  useEffect(() => {
    setZoomEnabled(!action);
  }, [action]);

  console.log(cl);
  return (
    <>
      {current_image && (
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={5}
          wheel={{ disabled: !zoomEnabled }}
          panning={{ disabled: !zoomEnabled }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginBottom: 10,
                  marginRight: 30,
                }}
              >
                {zoomEnabled && (
                  <>
                    <button
                      onClick={() => zoomIn()}
                      style={{
                        marginBottom: 10,
                        padding: "5px 11px",
                        fontSize: "24px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <FiZoomIn />
                    </button>
                    <button
                      onClick={() => zoomOut()}
                      style={{
                        marginBottom: 10,
                        padding: "5px 11px",
                        fontSize: "24px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <FiZoomOut />
                    </button>
                    <button
                      onClick={() => resetTransform()}
                      style={{
                        padding: "5px 11px",
                        fontSize: "24px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <RxReset />
                    </button>
                  </>
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
                  >
                    <Layer>
                      <Konvaimage image={current_image} />
                      {currentImage?.annotations?.map((annotation, index) => {
                        if (annotation.type === "rectangle") {
                          return (
                            <Group
                              key={annotation.class_id}
                              onMouseEnter={() =>
                                setHoveredId(annotation.class_id)
                              }
                              onMouseLeave={() => setHoveredId(null)}
                            >
                              <Rect
                                x={annotation.x}
                                y={annotation.y}
                                strokeWidth={2}
                                height={annotation.height}
                                width={annotation.width}
                                stroke={annotation.Color}
                              />

                              {hoveredId === annotation.class_id &&
                                annotation.edit && (
                                  <>
                                    <Rect
                                      x={annotation.x - 5}
                                      y={annotation.y - 5}
                                      width={40}
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
                                      x={annotation.x}
                                      y={annotation.y + 5}
                                      text="Delete"
                                      fontSize={16}
                                      fill="red"
                                      onClick={() =>
                                        handleDelete(
                                          annotation.class_id,
                                          annotation.type
                                        )
                                      }
                                    />
                                  </>
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
                                    text="Delete"
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
                                </>
                              )}
                            </React.Fragment>
                          );
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

                      {action === "polygon" &&
                        points.map((point, index) => {
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
