/**
 * Application constants
 */

export const ROUTES = {
  HOME: "/",
  TOURNAMENT: "/tournament",
  REGISTER: "/login?tab=register",
  EVENTS: "/events",
  ABOUT: "/about",
  CONTACT: "/contact",
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Events", href: ROUTES.EVENTS },
  { label: "Tournament", href: ROUTES.TOURNAMENT },
  { label: "Member Registration", href: ROUTES.REGISTER },
  { label: "About", href: ROUTES.ABOUT },
  { label: "Contact", href: ROUTES.CONTACT },
] as const;

