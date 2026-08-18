import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Shared SEO copy for Saroj Moun Jewellery.
 *
 * Titles passed to the root `template` should be short segments only
 * (e.g. "Shop Silver Jewellery") — never include "| Saroj Moun Jewellery",
 * or the brand name doubles in the SERP title.
 */

/**
 * Common misspellings & voice-search variants of the brand name.
 * Google Assistant / voice often hears "Moun" as "Mohan"/"Moon"/"Maun",
 * and "jewellery" as "jewellary" (our domain spelling), "jewelry", etc.
 */
export const BRAND_NAME_VARIANTS = [
  "Saroj Moun Jewellery",
  "Saroj Moun Jewellary",
  "Saroj Moun Jewelry",
  "Saroj Moun Jewelery",
  "Saroj Moun Jewlery",
  "Saroj Mohan Jewellery",
  "Saroj Mohan Jewellary",
  "Saroj Mohan Jewelry",
  "Saroj Moon Jewellery",
  "Saroj Moon Jewellary",
  "Saroj Maun Jewellery",
  "Saroj Maun Jewellary",
  "Saroj Moun",
  "Saroj Mohan",
  "Saroj Moon",
  "Saroj Maun",
  "Saroj Moun Fashion",
  "Saroj Moun Jewellery & Fashion",
  "sarojmounjewellary",
  "saroj moun jewellery jind",
  "saroj moun silver jewellery",
  "saroj mohan silver jewellery",
] as const;

export const SEO_KEYWORDS = [
  ...BRAND_NAME_VARIANTS,
  "silver jewellery",
  "925 silver jewellery",
  "handcrafted silver jewellery",
  "hallmark silver jewellery",
  "silver jewellery Jind",
  "silver jewellery Haryana",
  "handcrafted silver jewellery Haryana",
  "925 sterling silver",
  "buy silver jewellery online",
  "silver necklace",
  "silver earrings",
  "silver rings",
  "silver kada",
  "oxidized silver jewellery",
  "temple silver jewellery",
  "Jind silver jewellery",
  "chaandi jewellery",
  "chandi jewellery",
] as const;

export const DEFAULT_DESCRIPTION =
  "Saroj Moun Jewellery (also known as Saroj Moun Jewellary / Saroj Mohan Jewellery) — handcrafted 925 sterling silver jewellery from Jind, Haryana. Hallmark-certified necklaces, earrings, rings & kadas with wholesale pricing on live silver rates. Free shipping above ₹2999.";

export function pageMetadata({
  title,
  description,
  path,
  keywords = [...SEO_KEYWORDS],
  openGraphTitle,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  openGraphTitle?: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const url = `${SITE_URL}${canonical === "/" ? "" : canonical}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: openGraphTitle ?? `${title} | Saroj Moun Jewellery`,
      description,
      url,
      siteName: "Saroj Moun Jewellery",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle ?? `${title} | Saroj Moun Jewellery`,
      description,
    },
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}
