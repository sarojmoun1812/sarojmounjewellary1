import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { parseStringArray } from "@/lib/products";
import { paymentMethodLabel, paymentStatusLabel } from "@/lib/admin-labels";
import OrderStatusUpdate from "./order-status-update";

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: { product: true },
      },
    },
  });
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

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
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const shippingAddress = order.shippingAddress as any;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/orders"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Order {order.orderNumber}
          </h1>
          <p className="text-gray-600 mt-1">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Kya order kiya
            </h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => {
                // images is a JSON string in the database. Indexing it directly
                // yielded "[", so every row asked the browser for /[ and showed
                // a broken thumbnail.
                const thumbnail = parseStringArray(item.product.images).filter(
                  (url) =>
                    !url.toLowerCase().includes("peacock-jewellery") &&
                    !url.includes("images.unsplash.com")
                )[0];

                return (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Photo nahi
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Kitne: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Ek ka {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Saaman ka daam</span>
                <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery kharcha</span>
                <span className="text-gray-900">
                  {order.shipping === 0 ? "Muft" : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between font-medium text-lg border-t border-gray-100 pt-2">
                <span className="text-gray-900">Kul</span>
                <span className="text-gray-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Customer ne ye likha
              </h2>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <OrderStatusUpdate order={order} />

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Kisne order kiya
            </h2>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{order.customer.name}</p>
              <a
                href={`tel:${order.customer.phone}`}
                className="block text-sm text-gray-600 hover:text-gray-900"
              >
                {order.customer.phone}
              </a>
              {order.customer.email && (
                <p className="text-sm text-gray-600">{order.customer.email}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Kahan bhejna hai
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{shippingAddress.name}</p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.state} -{" "}
                {shippingAddress.pincode}
              </p>
              <p>Phone: {shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Paisa
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between gap-3">
                <span className="text-sm text-gray-600">Kaise</span>
                <span className="text-sm font-medium text-gray-900">
                  {paymentMethodLabel(order.paymentMethod)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-sm text-gray-600">Status</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    paymentStatusLabel(order.paymentStatus).className
                  }`}
                >
                  {paymentStatusLabel(order.paymentStatus).label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
