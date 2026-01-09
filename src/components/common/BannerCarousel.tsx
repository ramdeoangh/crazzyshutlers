"use client";

import React, { useState, useEffect } from "react";
import BannerImage from "./BannerImage";
import { getAllDefaultBanners } from "@/utils/banners";

interface BannerCarouselProps {
  banners?: string[];
  interval?: number; // Auto-rotate interval in milliseconds
  className?: string;
  height?: string;
}

/**
 * Banner carousel component that rotates through banner images
 */
const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners,
  interval = 5000,
  className = "",
  height = "h-48 md:h-64",
}) => {
  const bannerList = banners || getAllDefaultBanners();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (bannerList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerList.length);
    }, interval);

    return () => clearInterval(timer);
  }, [bannerList.length, interval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerList.length) % bannerList.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerList.length);
  };

  if (bannerList.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-xl ${className}`}>
      {/* Banner Images */}
      <div className="relative w-full h-full">
        {bannerList.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <BannerImage
              src={banner}
              alt={`Banner ${index + 1}`}
              fill
              priority={index === 0}
              objectFit="cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {bannerList.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Previous banner"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Next banner"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {bannerList.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {bannerList.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;

