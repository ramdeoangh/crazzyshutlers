import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  href?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asLink = false,
      href,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg",
      secondary:
        "bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 shadow-md hover:shadow-lg",
      outline:
        "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
      ghost:
        "text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const classes = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    if (asLink && href) {
      // Check if it's an external URL
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
          >
            {children}
          </a>
        );
      }
      
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

