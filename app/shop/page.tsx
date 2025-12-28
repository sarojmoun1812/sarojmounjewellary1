import { ProductCard } from "@/components/product-card";

// This would be fetched from database with filters
const products = [
  {
    id: "1",
    name: "Handcrafted Silver Kada",
    slug: "handcrafted-silver-kada",
    price: 349900,
    image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    badge: "Best Seller",
  },
  // Add more products...
];

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold text-primary mb-2">
          Shop Collection
        </h1>
        <p className="text-gray-600">
          Discover our complete range of handcrafted silver jewellery
        </p>
      </div>

      {/* Filters would go here */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
