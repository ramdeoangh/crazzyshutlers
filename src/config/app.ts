/**
 * Application-wide configuration
 * Centralized config for easy environment-based overrides
 */

export const appConfig = {
  name: "Crazzy Shuttlers Badminton Federation Pune",
  shortName: "CSF",
  domain: "https://crazzyshuttlersbadminton.com",
  organization: "Crazzy Shuttlers Badminton Federation Pune",
  description:
    "Crazzy Shuttlers Badminton Federation Pune - Building a vibrant badminton community. Join us for tournaments, events, and connect with fellow players.",
  social: {
    email: "contact@crazzyshuttlersbadminton.com",
    phone: "+1 (555) 123-4567", // Placeholder - update with real contact
    facebook: "#",
    instagram: "#",
    twitter: "#",
  },
  tournament: {
    name: "Crazzy Shuttlers Badminton Tournament",
    dates: {
      start: "2025-02-07",
      end: "2025-02-08",
      display: "7–8 February 2025",
    },
    registrationFormUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSfj17VpGx9T8GKuNN8RGyCd0bOfhVgD66yp68thj3xVQA_6Jg/viewform",
  },
} as const;

export type AppConfig = typeof appConfig;

