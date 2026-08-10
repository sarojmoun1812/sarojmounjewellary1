"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  ORDER_STATUS_OPTIONS,
  orderStatusLabel,
  paymentStatusLabel,
} from "@/lib/admin-labels";

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
}

const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export default function OrderStatusUpdate({ order }: { order: Order }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Update nahi ho paaya");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kuch galat ho gaya");
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    status !== order.status || paymentStatus !== order.paymentStatus;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Status badlein
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="order-status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Order kahan tak pahuncha
          </label>
          <select
            id="order-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
          >
            {ORDER_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {orderStatusLabel(s).label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="payment-status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Paisa aaya ya nahi
          </label>
          <select
            id="payment-status"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
          >
            {paymentStatuses.map((s) => (
              <option key={s} value={s}>
                {paymentStatusLabel(s).label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleUpdate}
          disabled={!hasChanges || isLoading}
          className="w-full py-2.5 bg-charcoal-900 text-white rounded-lg hover:bg-charcoal-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Save ho raha hai…
            </>
          ) : hasChanges ? (
            "Save karein"
          ) : (
            "Koi badlaav nahi"
          )}
        </button>
      </div>
    </div>
  );
}
