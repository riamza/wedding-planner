import React from "react";

export const Card = ({ children, className = "", style, ...props }) => {
  return (
    <div className={`ui-card ${className}`} style={style} {...props}>
      {children}
    </div>
  );
};
