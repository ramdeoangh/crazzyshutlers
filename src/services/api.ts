/**
 * API service functions for fetching data
 */

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  registrationUrl: string | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  isActive: boolean;
  isFeatured: boolean;
  categories: string | null;
  matchFormat: string | null;
  schedule: string | null;
  city: string | null;
  state: string | null;
  venue: string | null;
  registrationFee: number | null;
  currentParticipants: number;
  maxParticipants: number | null;
}

export interface Banner {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  imageAlt: string | null;
  type: "hero" | "tournament" | "page-header" | "feature-card";
  page: string | null;
  isActive: boolean;
  order: number;
}

/**
 * Fetch all events
 */
export async function getEvents(params?: {
  featured?: boolean;
  active?: boolean;
}): Promise<Event[]> {
  const searchParams = new URLSearchParams();
  if (params?.featured) searchParams.set("featured", "true");
  if (params?.active) searchParams.set("active", "true");

  const url = `${API_BASE}/api/events${searchParams.toString() ? `?${searchParams}` : ""}`;
  const response = await fetch(url, { cache: "no-store" });
  
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  
  return response.json();
}

/**
 * Fetch a single event by ID
 */
export async function getEvent(id: string): Promise<Event> {
  const response = await fetch(`${API_BASE}/api/events/${id}`, {
    cache: "no-store",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }
  
  return response.json();
}

/**
 * Fetch featured event (first featured active event)
 */
export async function getFeaturedEvent(): Promise<Event | null> {
  try {
    const events = await getEvents({ featured: true, active: true });
    return events.length > 0 ? events[0] : null;
  } catch {
    return null;
  }
}

/**
 * Fetch all banners
 */
export async function getBanners(params?: {
  type?: "hero" | "tournament" | "page-header" | "feature-card";
  page?: string;
  active?: boolean;
}): Promise<Banner[]> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set("type", params.type);
  if (params?.page) searchParams.set("page", params.page);
  if (params?.active) searchParams.set("active", "true");

  const url = `${API_BASE}/api/banners${searchParams.toString() ? `?${searchParams}` : ""}`;
  const response = await fetch(url, { cache: "no-store" });
  
  if (!response.ok) {
    throw new Error("Failed to fetch banners");
  }
  
  return response.json();
}

/**
 * Fetch banner by type and page
 * Falls back to default banners if none found in database
 */
export async function getBanner(
  type: "hero" | "tournament" | "page-header" | "feature-card",
  page?: string
): Promise<Banner | null> {
  try {
    const banners = await getBanners({ type, page, active: true });
    if (banners.length > 0) {
      return banners[0];
    }
    
    // Fallback to default banner
    const { getDefaultBanner } = await import("@/utils/banners");
    const defaultBannerUrl = getDefaultBanner(type);
    
    return {
      id: `default-${type}`,
      title: `${type} Banner`,
      description: null,
      imageUrl: defaultBannerUrl,
      imageAlt: `${type} banner`,
      type,
      page: page || null,
      isActive: true,
      order: 0,
    };
  } catch {
    // Return default banner on error
    const { getDefaultBanner } = await import("@/utils/banners");
    const defaultBannerUrl = getDefaultBanner(type);
    
    return {
      id: `default-${type}`,
      title: `${type} Banner`,
      description: null,
      imageUrl: defaultBannerUrl,
      imageAlt: `${type} banner`,
      type,
      page: page || null,
      isActive: true,
      order: 0,
    };
  }
}

