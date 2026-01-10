/**
 * Default banner images utility
 * Handles default banners from public folder
 */

export const DEFAULT_BANNERS = {
  hero: [
    "/ban_1.jpg",
    "/ban_2.jpg",
    "/ban_3.jpg",
    "/ban_4.jpg",
    "/ban_5.jpg",
  ],
  tournament: [
    "/ban_1.jpg",
    "/ban_2.jpg",
    "/ban_3.jpg",
    "/ban_4.jpg",
    "/ban_5.jpg",
  ],
  "page-header": [
    "/ban_1.jpg",
    "/ban_2.jpg",
    "/ban_3.jpg",
    "/ban_4.jpg",
    "/ban_5.jpg",
  ],
  "feature-card": [
    "/ban_1.jpg",
    "/ban_2.jpg",
    "/ban_3.jpg",
    "/ban_4.jpg",
    "/ban_5.jpg",
  ],
} as const;

/**
 * Get a random default banner for a type
 */
export function getDefaultBanner(
  type: "hero" | "tournament" | "page-header" | "feature-card"
): string {
  const banners = DEFAULT_BANNERS[type];
  const randomIndex = Math.floor(Math.random() * banners.length);
  return banners[randomIndex];
}

/**
 * Get a specific default banner by index (1-5)
 */
export function getDefaultBannerByIndex(index: number): string {
  const banners = [
    "/ban_1.jpg",
    "/ban_2.jpg",
    "/ban_3.jpg",
    "/ban_4.jpg",
    "/ban_5.jpg",
  ];
  
  if (index < 1 || index > 5) {
    return banners[0]; // Default to first banner
  }
  
  return banners[index - 1];
}

/**
 * Get all default banners
 * Returns array of banner paths
 */
export function getAllDefaultBanners(): string[] {
  return [
    "/ban_1.jpg",
    "/ban_2.jpg",
    "/ban_3.jpg",
    "/ban_4.jpg",
    "/ban_5.jpg",
  ];
}

/**
 * Get default banners with fallback handling
 * Tries common extensions if file doesn't exist
 */
export function getDefaultBannerWithFallback(
  index: number
): string {
  // All banners are JPEG format
  if (index >= 1 && index <= 5) {
    return `/ban_${index}.jpg`;
  }
  
  return "/ban_1.jpg"; // Fallback
}

