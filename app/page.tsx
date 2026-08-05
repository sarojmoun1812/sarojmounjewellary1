import { getHomeData } from "@/lib/home";
import { HomeClient } from "./home-client";

// Prices track the live silver rate and the catalogue changes from the admin
// panel, so the homepage must not be captured at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { featuredProducts, categories } = await getHomeData();

  return <HomeClient featuredProducts={featuredProducts} categories={categories} />;
}
