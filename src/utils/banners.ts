/**
 * Default banner images utility
 * Handles default banners from public folder
 */

export const DEFAULT_BANNERS = {
  hero: [
    "/ban_1.jpeg",
    "/ban_2.jpeg",
    "/ban_3.jpeg",
    "/ban_4.jpeg",
    "/ban_5.jpeg",
  ],
  tournament: [
    "/ban_1.jpeg",
    "/ban_2.jpeg",
    "/ban_3.jpeg",
    "/ban_4.jpeg",
    "/ban_5.jpeg",
  ],
  "page-header": [
    "/ban_1.jpeg",
    "/ban_2.jpeg",
    "/ban_3.jpeg",
    "/ban_4.jpeg",
    "/ban_5.jpeg",
  ],
  "feature-card": [
    "/ban_1.jpeg",
    "/ban_2.jpeg",
    "/ban_3.jpeg",
    "/ban_4.jpeg",
    "/ban_5.jpeg",
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
    "/ban_1.jpeg",
    "/ban_2.jpeg",
    "/ban_3.jpeg",
    "/ban_4.jpeg",
    "/ban_5.jpeg",
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
    "/ban_1.jpeg",
    "/ban_2.jpeg",
    "/ban_3.jpeg",
    "/ban_4.jpeg",
    "/ban_5.jpeg",
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
    return `/ban_${index}.jpeg`;
  }
  
  return "/ban_1.jpeg"; // Fallback
}

