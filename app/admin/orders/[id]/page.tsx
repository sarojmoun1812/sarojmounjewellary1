import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { parseStringArray } from "@/lib/products";
import {
  paymentClaimedLabel,
  paymentMethodLabel,
  paymentStatusLabel,
} from "@/lib/admin-labels";
import { buildWhatsAppInvoiceUrl, getWhatsAppNumber } from "@/lib/whatsapp";
import { getUpiDetails } from "@/lib/upi";
import OrderStatusUpdate from "./order-status-update";
import OrderInvoiceButtons from "./order-invoice-buttons";

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

function parseShippingAddress(raw: string) {
  try {
    return JSON.parse(raw) as {
      name?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      landmark?: string;
    };
  } catch {
    return {} as {
      name?: string;
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      landmark?: string;
    };
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const [order, shopWhatsApp, upi] = await Promise.all([
    getOrder(id),
    getWhatsAppNumber(),
    getUpiDetails(),
  ]);

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

  const shippingAddress = parseShippingAddress(order.shippingAddress);

  const invoiceInput = {
    orderNumber: order.orderNumber,
    customerName: order.customer.name,
    customerPhone: order.customer.phone,
    lines: order.items.map((item) => ({
      name: item.product.name,
      silverWeight: item.product.silverWeight,
      quantity: item.quantity,
      lineTotal: item.price * item.quantity,
    })),
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    taxRate: order.taxRate,
    total: order.total,
    upiId: upi.upiId,
    shippingAddress,
    notes: order.notes,
  };

  const customerInvoiceUrl = buildWhatsAppInvoiceUrl(
    order.customer.phone,
    invoiceInput
  );
  const adminInvoiceUrl = buildWhatsAppInvoiceUrl(shopWhatsApp, {
    ...invoiceInput,
    forAdmin: true,
  });

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
                        {item.product.silverWeight
                          ? ` · ${item.product.silverWeight}g`
                          : ""}
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

            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Saaman ka daam</span>
                <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST ({order.taxRate}%)</span>
                  <span className="text-gray-900">{formatPrice(order.tax)}</span>
                </div>
              )}
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
          <OrderStatusUpdate order={order} />

          {order.paymentStatus === "PAID" && (
            <OrderInvoiceButtons
              customerInvoiceUrl={customerInvoiceUrl}
              adminInvoiceUrl={adminInvoiceUrl}
            />
          )}

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
              <div className="flex flex-wrap gap-2 pt-3">
                <a
                  href={`https://wa.me/${(() => {
                    let digits = order.customer.phone.replace(/\D/g, "");
                    if (digits.startsWith("0")) digits = digits.slice(1);
                    if (digits.length === 10) digits = `91${digits}`;
                    return digits;
                  })()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  WhatsApp kholo
                </a>
                <a
                  href={`tel:${order.customer.phone}`}
                  className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Call karein
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Kahan bhejna hai
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">
                {shippingAddress.name || order.customer.name}
              </p>
              {shippingAddress.address ? (
                <>
                  <p>{shippingAddress.address}</p>
                  <p>
                    {[shippingAddress.city, shippingAddress.state]
                      .filter(Boolean)
                      .join(", ")}
                    {shippingAddress.pincode
                      ? ` - ${shippingAddress.pincode}`
                      : ""}
                  </p>
                </>
              ) : (
                <p className="text-amber-700">Address abhi nahi diya</p>
              )}
              <p>Phone: {shippingAddress.phone || order.customer.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Paisa</h2>
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
                    order.paymentClaimedAt && order.paymentStatus === "PENDING"
                      ? paymentClaimedLabel().className
                      : paymentStatusLabel(order.paymentStatus).className
                  }`}
                >
                  {order.paymentClaimedAt && order.paymentStatus === "PENDING"
                    ? paymentClaimedLabel().label
                    : paymentStatusLabel(order.paymentStatus).label}
                </span>
              </div>
              {order.paymentClaimedAt && (
                <p className="pt-1 text-xs text-orange-700">
                  Customer ne {formatDate(order.paymentClaimedAt)} ko “Maine pay
                  kar diya” dabaya. Bank / UPI app check karke PAID mark karein.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
