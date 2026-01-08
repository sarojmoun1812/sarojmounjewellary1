import { prisma } from "@/lib/db";
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
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
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
          View your customer base ({customers.length} customers)
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <form className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={params.search}
              placeholder="Search by name, phone, or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Orders
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Total Spent
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const totalSpent = customer.orders.reduce(
                    (sum, order) => sum + order.total,
                    0
                  );

                  return (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {customer.name}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </p>
                          {customer.email && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/orders?search=${customer.phone}`}
                          className="inline-flex items-center gap-1 text-sm text-powder-600 hover:text-powder-700"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          {customer._count.orders} orders
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {formatPrice(totalSpent)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">
                          {formatDate(customer.createdAt)}
                        </p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
