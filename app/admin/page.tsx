import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, Users, Plus } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-heading font-bold text-primary">
          Admin Dashboard
        </h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-primary mt-1">0</p>
            </div>
            <Package className="h-12 w-12 text-accent" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-primary mt-1">0</p>
            </div>
            <ShoppingBag className="h-12 w-12 text-accent" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-3xl font-bold text-primary mt-1">0</p>
            </div>
            <Users className="h-12 w-12 text-accent" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/products" className="block">
          <div className="bg-white p-6 rounded-lg border hover:border-accent transition-colors">
            <Package className="h-8 w-8 text-accent mb-3" />
            <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
            <p className="text-gray-600">Add, edit, or remove products from your store</p>
          </div>
        </Link>

        <Link href="/admin/orders" className="block">
          <div className="bg-white p-6 rounded-lg border hover:border-accent transition-colors">
            <ShoppingBag className="h-8 w-8 text-accent mb-3" />
            <h2 className="text-xl font-semibold mb-2">Manage Orders</h2>
            <p className="text-gray-600">View and process customer orders</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
