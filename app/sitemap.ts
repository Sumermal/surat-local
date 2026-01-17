import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://surat-local.vercel.app/",
      lastModified: new Date(),
    },
    {
      url: "https://surat-local.vercel.app/services",
      lastModified: new Date(),
    },
    {
      url: "https://surat-local.vercel.app/about",
      lastModified: new Date(),
    },
  ];
}
