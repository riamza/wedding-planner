import React from "react";

export const Input = ({ label, type = "text", className = "", ...props }) => {
  return (
    <div className={`flex-col gap-2 w-full ${className}`}>
      {label && <label className="ui-label">{label}</label>}
      {type === "textarea" ? (
        <textarea className="ui-input" {...props} />
      ) : (
        <input type={type} className="ui-input" {...props} />
      )}
    </div>
  );
};
