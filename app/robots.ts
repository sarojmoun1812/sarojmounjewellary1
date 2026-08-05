import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Generated rather than a static public/robots.txt, so the sitemap link follows
 * the configured domain instead of being frozen at whatever was typed once.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
