import React from "react";

export const Heading = ({
  level = 1,
  children,
  className = "",
  color = "var(--color-text)",
  style,
  ...props
}) => {
  const Tag = `h${level}`;
  const sizes = {
    1: "3rem",
    2: "2rem",
    3: "1.5rem",
    4: "1.2rem",
    5: "1rem",
    6: "0.85rem",
  };

  return (
    <Tag
      style={{ fontSize: sizes[level], color, ...style }}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  );
};

export const Text = ({
  children,
  secondary = false,
  className = "",
  style,
  ...props
}) => {
  return (
    <p
      style={{
        color: secondary ? "var(--color-text-secondary)" : "var(--color-text)",
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </p>
  );
};
