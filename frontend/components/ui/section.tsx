import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg";
  variant?: "default" | "subtle" | "surface";
  className?: string;
  children: React.ReactNode;
}

const spacingStyles = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-32",
};

const variantStyles = {
  default: "bg-background",
  subtle: "bg-surface-subtle",
  surface: "bg-surface border-y border-border/40",
};

export function Section({
  spacing = "md",
  variant = "default",
  className = "",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={`relative w-full ${spacingStyles[spacing]} ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </section>
  );
}

