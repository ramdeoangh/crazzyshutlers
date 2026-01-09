import { Metadata } from "next";
import { appConfig } from "./app";

/**
 * Default metadata for the application
 * Can be extended per page using Next.js metadata API
 */
export const defaultMetadata: Metadata = {
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
  keywords: [
    "badminton",
    "badminton federation",
    "badminton pune",
    "tournament",
    "sports",
    "community",
    "Crazzy Shuttlers",
    "badminton competition",
    "CSF",
    "badminton events",
  ],
  authors: [{ name: appConfig.organization }],
  creator: appConfig.organization,
  publisher: appConfig.organization,
  metadataBase: new URL(appConfig.domain),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appConfig.domain,
    siteName: appConfig.name,
    title: appConfig.name,
    description: appConfig.description,
    images: [
      {
        url: "/og-image.jpg", // Placeholder - add actual OG image
        width: 1200,
        height: 630,
        alt: appConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: appConfig.name,
    description: appConfig.description,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

