import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create initial silver rate
  const silverRate = await prisma.silverRate.upsert({
    where: { id: "initial-rate" },
    update: {},
    create: {
      id: "initial-rate",
      ratePerGram: 95.0,
      source: "Initial Seed",
    },
  });
  console.log("✅ Silver rate created:", silverRate.ratePerGram, "/gram");

  // Create site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: {},
    create: {
      id: "settings",
      siteName: "Saroj Moun Jewellery",
      tagline: "Handcrafted 925 Silver Jewellery",
      phone: "+91 81687 90171",
      whatsapp: "918168790171",
      email: "sarojmounjewellary@gmail.com",
      address: "B-90, Police Line, Jind, Haryana 126102, India",
      shippingCharge: 9900, // ₹99 in paise
      freeShippingMin: 299900, // ₹2999 in paise
      socialInstagram: "https://instagram.com/sarojmounfashion",
      socialYoutube: "https://www.youtube.com/@sarojmoun1207",
    },
  });
  console.log("✅ Site settings created");

  // Sample products
  const products = [
    {
      name: "Royal Peacock Temple Necklace",
      slug: "royal-peacock-temple-necklace",
      description: "Exquisite handcrafted temple necklace featuring intricate peacock motifs. This stunning piece showcases traditional Indian craftsmanship with modern elegance. Perfect for weddings, festivals, and special celebrations. Each detail is carefully carved by skilled artisans.",
      silverWeight: 55.5,
      makingCharges: 150000, // ₹1500 in paise
      profitPerGram: 100,
      category: "Necklaces",
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      ],
      stock: 5,
      material: "925 Sterling Silver",
      featured: true,
      bestseller: true,
      tags: ["necklace", "temple", "peacock", "wedding", "traditional"],
      metaTitle: "Royal Peacock Temple Necklace | 925 Silver | Saroj Moun",
      metaDescription: "Buy authentic handcrafted peacock temple necklace in 925 sterling silver. Perfect for weddings and festivals. Hallmark certified.",
    },
    {
      name: "Traditional Heavy Kada",
      slug: "traditional-heavy-kada",
      description: "Bold and beautiful traditional silver kada for men and women. This heavyweight piece features classic design patterns that have been passed down through generations. A statement piece that adds elegance to any outfit.",
      silverWeight: 45.0,
      makingCharges: 120000, // ₹1200 in paise
      profitPerGram: 100,
      category: "Kadas",
      images: [
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      ],
      stock: 8,
      material: "925 Sterling Silver",
      featured: true,
      bestseller: true,
      tags: ["kada", "bangle", "traditional", "unisex", "heavy"],
      metaTitle: "Traditional Heavy Silver Kada | 925 Silver | Saroj Moun",
      metaDescription: "Premium heavy silver kada in 925 sterling silver. Traditional design, hallmark certified. Free shipping above ₹2999.",
    },
    {
      name: "Elegant Jhumka Earrings",
      slug: "elegant-jhumka-earrings",
      description: "Timeless jhumka earrings that blend traditional charm with contemporary style. Features delicate bell-shaped design with intricate detailing. Lightweight and comfortable for all-day wear.",
      silverWeight: 18.5,
      makingCharges: 80000, // ₹800 in paise
      profitPerGram: 100,
      category: "Earrings",
      images: [
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      ],
      stock: 12,
      material: "925 Sterling Silver",
      featured: true,
      bestseller: false,
      tags: ["jhumka", "earrings", "traditional", "lightweight"],
      metaTitle: "Elegant Silver Jhumka Earrings | Saroj Moun Jewellery",
      metaDescription: "Beautiful silver jhumka earrings in 925 sterling silver. Traditional design, lightweight, and comfortable. Shop now!",
    },
    {
      name: "Designer Oxidized Ring",
      slug: "designer-oxidized-ring",
      description: "Stunning oxidized silver ring with intricate carved patterns. The antique finish gives it a unique vintage look. Adjustable size makes it perfect for gifting.",
      silverWeight: 8.5,
      makingCharges: 50000, // ₹500 in paise
      profitPerGram: 100,
      category: "Rings",
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      ],
      stock: 20,
      material: "925 Sterling Silver (Oxidized)",
      featured: false,
      bestseller: true,
      tags: ["ring", "oxidized", "vintage", "adjustable"],
      metaTitle: "Designer Oxidized Silver Ring | 925 Silver | Saroj Moun",
      metaDescription: "Unique oxidized silver ring with vintage look. Adjustable size, 925 sterling silver. Perfect for daily wear or gifting.",
    },
    {
      name: "Minimalist Chain Necklace",
      slug: "minimalist-chain-necklace",
      description: "Sleek and simple silver chain necklace for everyday elegance. This minimalist piece can be worn alone or layered with other necklaces. Perfect for work, casual outings, or special occasions.",
      silverWeight: 12.0,
      makingCharges: 40000, // ₹400 in paise
      profitPerGram: 100,
      category: "Necklaces",
      images: [
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
      ],
      stock: 15,
      material: "925 Sterling Silver",
      featured: false,
      bestseller: false,
      tags: ["chain", "minimalist", "everyday", "layering"],
      metaTitle: "Minimalist Silver Chain Necklace | Saroj Moun",
      metaDescription: "Simple and elegant silver chain necklace. 925 sterling silver, perfect for everyday wear. Shop now!",
    },
    {
      name: "Antique Temple Earrings",
      slug: "antique-temple-earrings",
      description: "Beautiful temple-style earrings inspired by ancient Indian temple architecture. Features goddess motifs and intricate detailing. A perfect blend of tradition and artistry.",
      silverWeight: 22.0,
      makingCharges: 90000, // ₹900 in paise
      profitPerGram: 100,
      category: "Earrings",
      images: [
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
      ],
      stock: 7,
      material: "925 Sterling Silver",
      featured: true,
      bestseller: false,
      tags: ["temple", "earrings", "antique", "goddess"],
      metaTitle: "Antique Temple Silver Earrings | Saroj Moun Jewellery",
      metaDescription: "Traditional temple earrings in 925 sterling silver. Handcrafted with goddess motifs. Hallmark certified.",
    },
    {
      name: "Sleek Silver Bangle Set",
      slug: "sleek-silver-bangle-set",
      description: "Set of 4 elegant silver bangles with smooth polished finish. These stackable bangles add grace to any outfit. Perfect for daily wear or special occasions.",
      silverWeight: 40.0,
      makingCharges: 100000, // ₹1000 in paise
      profitPerGram: 100,
      category: "Kadas",
      images: [
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      ],
      stock: 6,
      material: "925 Sterling Silver",
      featured: false,
      bestseller: true,
      tags: ["bangle", "set", "stackable", "polished"],
      metaTitle: "Silver Bangle Set of 4 | Saroj Moun Jewellery",
      metaDescription: "Elegant set of 4 silver bangles in 925 sterling silver. Stackable design, perfect for any occasion.",
    },
    {
      name: "Statement Cocktail Ring",
      slug: "statement-cocktail-ring",
      description: "Bold statement ring perfect for parties and special events. Features a large dome design with geometric patterns. A conversation starter piece that showcases your unique style.",
      silverWeight: 15.0,
      makingCharges: 70000, // ₹700 in paise
      profitPerGram: 100,
      category: "Rings",
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      ],
      stock: 10,
      material: "925 Sterling Silver",
      featured: true,
      bestseller: false,
      tags: ["ring", "statement", "cocktail", "party"],
      metaTitle: "Statement Silver Cocktail Ring | Saroj Moun",
      metaDescription: "Bold statement cocktail ring in 925 sterling silver. Perfect for parties and special events. Shop now!",
    },
  ];

  // Create products
  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
    console.log(`✅ Product created: ${created.name}`);
  }

  console.log("\n🎉 Seeding completed!");
  console.log(`   - ${products.length} products created`);
  console.log(`   - Silver rate: ₹${silverRate.ratePerGram}/gram`);
  console.log(`   - Site settings configured`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
