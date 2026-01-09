import React from "react";
import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-white border border-gray-200",
      elevated: "bg-white shadow-lg",
      outlined: "bg-white border-2 border-primary-200",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl p-6 transition-shadow duration-200",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;

