"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] focus:ring-[var(--primary-500)] shadow-lg hover:shadow-xl hover:-translate-y-0.5",
      secondary:
        "bg-[var(--secondary-500)] text-white hover:bg-[var(--secondary-600)] focus:ring-[var(--secondary-500)] shadow-lg hover:shadow-xl hover:-translate-y-0.5",
      outline:
        "border-2 border-[var(--primary-500)] text-[var(--primary-500)] hover:bg-[var(--primary-500)] hover:text-white focus:ring-[var(--primary-500)]",
      ghost:
        "text-[var(--primary-500)] hover:bg-[var(--primary-50)] focus:ring-[var(--primary-500)]",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
      xl: "px-10 py-5 text-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
