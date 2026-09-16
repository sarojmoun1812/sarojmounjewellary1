"use client";

import { MessageCircle } from "lucide-react";

export default function OrderInvoiceButtons({
  customerInvoiceUrl,
  adminInvoiceUrl,
}: {
  customerInvoiceUrl: string;
  adminInvoiceUrl: string;
}) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        WhatsApp invoice
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Paisa mil gaya — ab invoice message bhejein (ek tap se WhatsApp khulega).
      </p>
      <div className="space-y-2">
        <a
          href={customerInvoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <MessageCircle className="h-4 w-4" />
          Customer ko invoice bhejo
        </a>
        <a
          href={adminInvoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2.5 text-sm font-medium text-emerald-800 hover:bg-emerald-50"
        >
          <MessageCircle className="h-4 w-4" />
          Admin / shop copy
        </a>
      </div>
    </div>
  );
}
