import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  // Middleware cannot verify a session on the Edge runtime, so each admin page
  // confirms it for itself. Without this the form shell rendered for anyone.
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return <ProductForm mode="new" />;
}
