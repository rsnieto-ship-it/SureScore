"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "gradient" | "glass";
  hover?: "lift" | "glow" | "scale" | "none";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = "lift", children, ...props }, ref) => {
    const baseStyles = "rounded-2xl transition-all duration-300";

    const variants = {
      default: "bg-white border border-gray-200",
      elevated: "bg-white shadow-lg",
      gradient: "bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] text-white",
      glass: "glass",
    };

    const hovers = {
      lift: "hover:-translate-y-2 hover:shadow-xl",
      glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
      scale: "hover:scale-105",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], hovers[hover], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pb-0", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
