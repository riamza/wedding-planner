import React from "react";

export const Badge = ({ children, color = "var(--color-primary)" }) => {
  return (
    <span
      style={{
        background: `${color}20`,
        color: color,
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "0.8rem",
        fontWeight: 600,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
};
