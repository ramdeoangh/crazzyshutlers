import React from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

export interface BannerImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

/**
 * Optimized banner image component using Next.js Image
 * Supports both fill and fixed dimensions
 */
const BannerImage: React.FC<BannerImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  fill = false,
  width,
  height,
  objectFit = "cover",
}) => {
  // Handle external URLs (cloud storage) vs local paths
  const isExternal = src.startsWith("http://") || src.startsWith("https://");
  
  // For Next.js Image, we need to configure external domains
  const imageProps: any = {
    src,
    alt,
    className: cn(className),
    priority,
    quality: 90,
    ...(objectFit && { style: { objectFit } }),
  };

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          {...imageProps}
          alt={alt || ""}
          fill
          sizes="100vw"
          unoptimized={isExternal} // External images may need optimization via cloud service
        />
      </div>
    );
  }

  if (width && height) {
    return (
      <Image
        {...imageProps}
        alt={alt || ""}
        width={width}
        height={height}
        unoptimized={isExternal}
      />
    );
  }

  // Fallback for cases without dimensions
  return (
    <div className="relative w-full h-full">
      <Image
        {...imageProps}
        alt={alt || ""}
        fill
        sizes="100vw"
        unoptimized={isExternal}
      />
    </div>
  );
};

export default BannerImage;

