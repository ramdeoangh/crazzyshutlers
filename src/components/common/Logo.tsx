"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { appConfig } from "@/config/app";

export interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Logo component with support for light and dark variants
 * 
 * Place your logo files in:
 * - public/logo-light.png (for dark backgrounds)
 * - public/logo-dark.png (for light backgrounds)
 */
const Logo: React.FC<LogoProps> = ({
  variant = "dark",
  className,
  width = 200,
  height = 200,
}) => {
  const [imageError, setImageError] = useState(false);
  const logoSrc =
    variant === "light"
      ? "/logo-light.png"
      : "/logo-dark.png";

  if (imageError) {
    // Fallback text logo if image doesn't exist
    return (
      <div
        className={cn(
          "flex items-center space-x-2 text-xl font-bold",
          variant === "light" ? "text-white" : "text-primary-700",
          className
        )}
      >
        <span className="text-2xl">🏸</span>
        <span className="hidden sm:inline">{appConfig.shortName}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Image
        src={logoSrc}
        alt={`${appConfig.name} Logo`}
        width={width}
        height={height}
        className="object-contain"
        priority
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default Logo;

