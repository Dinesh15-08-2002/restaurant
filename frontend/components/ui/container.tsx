import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  size?: "narrow" | "default" | "wide";
  children: React.ReactNode;
}

const sizeClasses = {
  narrow: "max-w-4xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

export function Container({
  size = "default",
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

