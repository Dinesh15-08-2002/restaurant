import React from "react";

export type HeadingVariant = "display" | "h1" | "h2" | "h3";
export type TextVariant = "lead" | "body" | "caption";

export interface HeadingProps extends React.HTMLAttributes<HTMLElement> {
  variant?: HeadingVariant;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  className?: string;
  children: React.ReactNode;
}

const headingStyles: Record<HeadingVariant, string> = {
  display: "font-display font-medium text-foreground tracking-tight",
  h1: "font-h1 font-medium text-foreground tracking-tight",
  h2: "font-h2 font-medium text-foreground tracking-tight",
  h3: "font-h3 font-semibold text-foreground",
};

const defaultTagForHeading: Record<HeadingVariant, "h1" | "h2" | "h3"> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
};

export function Heading({
  variant = "h2",
  as,
  className = "",
  children,
  ...props
}: HeadingProps) {
  const Component = as || defaultTagForHeading[variant];
  return (
    <Component
      className={`${headingStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  as?: "p" | "span" | "div" | "label";
  className?: string;
  children: React.ReactNode;
}

const textStyles: Record<TextVariant, string> = {
  lead: "font-body-lead text-muted-foreground",
  body: "font-body text-foreground/90",
  caption: "font-caption text-subtle-foreground",
};

export function Text({
  variant = "body",
  as = "p",
  className = "",
  children,
  ...props
}: TextProps) {
  const Component = as;
  return (
    <Component
      className={`${textStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
