import React from "react";

// Styles for the spinner wrapper and animation
const spinnerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "30vh", // Full-page height, adjust as needed
  textAlign: "center",
  padding: "2rem",
};

// Keyframes for the spinning animation
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

// Spinner circle styles
const ldioStyle = {
  display: "inline-block",
  width: "3rem", // Adjust size as needed
  height: "3rem",
  border: "0.25rem solid rgba(0, 0, 0, 0.1)",
  borderTop: "0.25rem solid #6366F1", // Indigo-600 color
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

// Text below the spinner
const textStyle = {
  marginTop: "1rem",
  color: "#4B5563", // Tailwind's text-gray-600 equivalent
};

const Spinner = () => {
  return (
    <div style={spinnerStyle}>
      <style>{keyframes}</style>
      <div style={ldioStyle}></div>
    </div>
  );
};

export default Spinner;
