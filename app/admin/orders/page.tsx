import { containsInsensitive, prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = "force-dynamic";
import { Search } from "lucide-react";
import {
  ORDER_STATUS_OPTIONS,
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
} from "@/lib/admin-labels";

async function getOrders(status?: string, search?: string) {
  const where: any = {};

  if (status && status !== "all") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { orderNumber: containsInsensitive(search) },
      { customer: { name: containsInsensitive(search) } },
      { customer: { phone: containsInsensitive(search) } },
    ];
  }

  return prisma.order.findMany({
    where,
    include: {
      customer: true,
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string };
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const params = await searchParams;
  const orders = await getOrders(params.status, params.search);

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
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const statuses = [
    { value: "all", label: "Saare orders" },
    ...ORDER_STATUS_OPTIONS.map((value) => ({
      value,
      label: orderStatusLabel(value).label,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">
          {orders.length === 0
            ? "Abhi koi order nahi hai."
            : `Kul ${orders.length} order${orders.length === 1 ? "" : "s"}.`}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <form className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={params.search}
              placeholder="Order number, naam ya phone se dhoondhein"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
            />
          </div>
          <select
            name="status"
            aria-label="Status se filter karein"
            defaultValue={params.status || "all"}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Dhoondhein
          </button>
        </form>
      </div>

      {/* One card per order. This was a table with eight columns, which on her
          phone meant sideways scrolling to reach the status and the link. */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-gray-500">
            Koi order nahi mila. Filter badal kar dekhein.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = orderStatusLabel(order.status);
            const payment = paymentStatusLabel(order.paymentStatus);

            return (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.customer.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.customer.phone}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${payment.className}`}
                  >
                    {payment.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {paymentMethodLabel(order.paymentMethod)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>{order.orderNumber}</span>
                  <span>
                    {order.items.length} cheez
                    {order.items.length === 1 ? "" : "ein"}
                  </span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
