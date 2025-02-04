import React, { useEffect, useRef, useState } from "react";

const NeonCursor = ({ containerRef }) => {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null); // Reference to the neon cursor element
  const trailsRef = useRef([]); // Declare trailsRef to store trail data
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); // Track cursor position
  const [isLeftSide, setIsLeftSide] = useState(true); // State to track if the cursor is on the left side of the screen

  useEffect(() => {
    // Ensure containerRef is defined before applying styles
    if (containerRef?.current) {
      containerRef.current.style.cursor = "none"; // Disable default cursor in the container
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set the canvas size to the left half of the screen
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight;

    const handleMouseMove = (e) => {
      const isLeft = e.clientX <= window.innerWidth / 2;
      setIsLeftSide(isLeft); // Update if the mouse is on the left side

      if (isLeft) {
        setCursorPosition({ x: e.clientX, y: e.clientY }); // Update the cursor position
        trailsRef.current.push({ x: e.clientX, y: e.clientY, alpha: 1 }); // Capture the trail data for neon effect
      }
    };

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and filter trails (just for the line effect)
      trailsRef.current = trailsRef.current
        .map((trail) => ({
          ...trail,
          alpha: trail.alpha - 0.02, // Gradual fading effect
        }))
        .filter((trail) => trail.alpha > 0);

      // Draw neon line trails
      trailsRef.current.forEach((trail, index, arr) => {
        if (index === 0) return; // Skip the first trail (no previous point to connect to)

        const prevTrail = arr[index - 1];

        ctx.beginPath();
        ctx.moveTo(prevTrail.x, prevTrail.y); // Move to the previous trail point
        ctx.lineTo(trail.x, trail.y); // Draw line to current trail point

        // Set neon line properties
        ctx.strokeStyle = `rgba(255, 255, 255, ${trail.alpha})`; // White neon color
        ctx.lineWidth = 4; // Line thickness
        ctx.lineCap = "round"; // Rounded end for smooth look
        ctx.shadowBlur = 20; // Shadow for the neon effect
        ctx.shadowColor = "cyan"; // Neon glow color

        ctx.stroke(); // Apply the line drawing
      });

      requestAnimationFrame(drawTrail);
    };

    window.addEventListener("mousemove", handleMouseMove);
    drawTrail();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      // Reset the default cursor when the component is unmounted (if container exists)
      if (containerRef?.current) {
        containerRef.current.style.cursor = "auto";
      }
    };
  }, [containerRef]);

  return (
    <>
      {/* Canvas for neon line trails */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none", // Ensures the canvas does not interfere with other elements
          backgroundColor: "transparent", // Background should be transparent
        }}
      />

      {/* Custom neon dot cursor */}
      {isLeftSide && (
        <div
          ref={cursorRef}
          style={{
            position: "absolute",
            top: `${cursorPosition.y - 6}px`, // Adjusted to center the smaller dot
            left: `${cursorPosition.x - 6}px`, // Adjusted to center the smaller dot
            width: "12px", // Smaller dot size
            height: "12px", // Smaller dot size
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: "0 0 10px cyan, 0 0 20px cyan", // Neon glow effect
            pointerEvents: "none", // Prevents the cursor from interacting with other elements
            transition: "transform 0.1s ease-out", // Smooth movement
          }}
        ></div>
      )}
    </>
  );
};

export default NeonCursor;
