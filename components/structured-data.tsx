import { SITE_URL } from "@/lib/site";
import { BRAND_NAME_VARIANTS, DEFAULT_DESCRIPTION } from "@/lib/seo";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["JewelryStore", "LocalBusiness"],
    name: "Saroj Moun Jewellery",
    // Voice search & typos: Moun→Mohan/Moon/Maun, jewellery→jewellary/jewelry
    alternateName: [...BRAND_NAME_VARIANTS].filter(
      (name) => name !== "Saroj Moun Jewellery"
    ),
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/saroj.jpeg`,
    image: `${SITE_URL}/saroj.jpeg`,
    telephone: "+91-81687-90171",
    email: "sarojmounjewellary@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "B-90, Police Line",
      addressLocality: "Jind",
      addressRegion: "Haryana",
      postalCode: "126102",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "29.3167",
      longitude: "76.3167",
    },
    areaServed: [
      { "@type": "City", name: "Jind" },
      { "@type": "State", name: "Haryana" },
      { "@type": "Country", name: "India" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00",
      },
    ],
    sameAs: [
      "https://instagram.com/sarojmounfashion",
      "https://www.youtube.com/@sarojmoun1207",
    ],
    priceRange: "₹₹-₹₹₹",
    paymentAccepted: ["Cash", "UPI", "Bank Transfer"],
    currenciesAccepted: "INR",
    knowsAbout: [
      "925 sterling silver jewellery",
      "handcrafted silver jewellery",
      "hallmark silver jewellery",
      "oxidized silver jewellery",
      "temple silver jewellery",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema({ product }: { product: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku || product.slug,
    category: product.category,
    material: "925 Sterling Silver",
    brand: {
      "@type": "Brand",
      name: "Saroj Moun Jewellery",
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Saroj Moun Jewellery",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Saroj Moun Jewellery",
    alternateName: [
      "Saroj Moun Jewellary",
      "Saroj Mohan Jewellery",
      "Saroj Moon Jewellery",
      "Saroj Moun",
      "sarojmounjewellary",
    ],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "en-IN",
    publisher: {
      "@type": "Organization",
      name: "Saroj Moun Jewellery",
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
