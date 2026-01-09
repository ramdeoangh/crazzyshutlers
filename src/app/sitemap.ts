import { MetadataRoute } from "next";
import { appConfig } from "@/config/app";
import { ROUTES } from "@/utils/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = appConfig.domain;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}${ROUTES.TOURNAMENT}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}${ROUTES.REGISTER}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}${ROUTES.ABOUT}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}${ROUTES.CONTACT}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}

