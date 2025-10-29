"use client";

import ResetViewButton from "./ResetViewButton";

const UiOverlay = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.75rem",
        zIndex: 10,
        color: "#d6daff",
        textAlign: "right",
        maxWidth: "240px",
      }}
    >
      <p style={{ fontSize: "0.8rem", lineHeight: 1.5, opacity: 0.85 }}>
        Click the cover to open. While open, click inside left to close to the front or
        inside right to close to the back. Drag anywhere to orbit.
      </p>
      <ResetViewButton />
    </div>
  );
};

export default UiOverlay;
