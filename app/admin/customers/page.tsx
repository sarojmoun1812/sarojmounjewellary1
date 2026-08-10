import { containsInsensitive, prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

// Force dynamic rendering
export const dynamic = "force-dynamic";
import Link from "next/link";
import { Search, ShoppingBag, Phone, Mail } from "lucide-react";

async function getCustomers(search?: string) {
  const where: any = {};

  if (search) {
    where.OR = [
      { name: containsInsensitive(search) },
      { phone: containsInsensitive(search) },
      { email: containsInsensitive(search) },
    ];
  }

  return prisma.customer.findMany({
    where,
    include: {
      _count: { select: { orders: true } },
      orders: {
        select: { total: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const params = await searchParams;
  const customers = await getCustomers(params.search);

  const formatPrice = (paise: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(paise / 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">
          {customers.length === 0
            ? "Abhi koi customer nahi hai."
            : `Kul ${customers.length} customer.`}
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <form className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={params.search}
              placeholder="Naam, phone ya email se dhoondhein"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Dhoondhein
          </button>
        </form>
      </div>

      {/* Cards rather than a five-column table, so nothing needs sideways
          scrolling on a phone. */}
      {customers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-gray-500">Koi customer nahi mila.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {customers.map((customer) => {
            const totalSpent = customer.orders.reduce(
              (sum, order) => sum + order.total,
              0
            );

            return (
              <div
                key={customer.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-gray-900">{customer.name}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(totalSpent)}
                  </p>
                </div>

                <div className="mt-3 space-y-1">
                  <a
                    href={`tel:${customer.phone}`}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Phone className="h-3 w-3" />
                    {customer.phone}
                  </a>
                  {customer.email && (
                    <p className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/admin/orders?search=${encodeURIComponent(customer.phone)}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-champagne-600 hover:text-champagne-700"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {customer._count.orders} order dekhein
                  </Link>
                  <p className="text-xs text-gray-400">
                    {formatDate(customer.createdAt)} se
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
