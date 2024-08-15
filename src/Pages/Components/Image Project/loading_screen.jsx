import React from "react";

const Spinner = () => {
  const spinnerStyle = {
    width: "97px",
    height: "97px",
    display: "inline-block",
    overflow: "hidden",
    background: "none",
  };

  const ldioStyle = {
    width: "100%",
    height: "100%",
    position: "relative",
    transform: "translateZ(0) scale(0.97)",
    backfaceVisibility: "hidden",
    transformOrigin: "0 0",
  };

  const divStyle = {
    position: "absolute",
    left: "48px",
    top: "24px",
    width: "4px",
    height: "12px",
    background: "#000000",
    borderRadius: "2px / 6px",
    transformOrigin: "2px 26px",
    animation: "ldio-x2uulkbinbj linear 1s infinite",
  };

  const keyframes = `
    @keyframes ldio-x2uulkbinbj {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }
  `;

  const createDivStyle = (index) => ({
    ...divStyle,
    transform: `rotate(${index * 30}deg)`,
    animationDelay: `-${(12 - index) / 12}s`,
    background: index % 2 === 0 ? "#000000" : "#428bca",
  });

  return (
    <div style={spinnerStyle}>
      <style>{keyframes}</style>
      <div style={ldioStyle}>
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} style={createDivStyle(index)} />
        ))}
      </div>
    </div>
  );
};

export default Spinner;
