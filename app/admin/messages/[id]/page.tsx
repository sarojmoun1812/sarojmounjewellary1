import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, CheckCircle } from "lucide-react";
import MarkAsRead from "./mark-as-read";

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getMessage(id: string) {
  return prisma.contactMessage.findUnique({
    where: { id },
  });
}

export default async function MessageDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const message = await getMessage(id);

  if (!message) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/messages"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{message.subject}</h1>
          <p className="text-gray-600 mt-1">{formatDate(message.createdAt)}</p>
        </div>
        {!message.isRead && <MarkAsRead id={message.id} />}
        {message.isRead && (
          <span className="inline-flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle className="h-4 w-4" />
            Read
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Contact Info */}
        <div className="flex flex-wrap gap-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="font-medium text-gray-900">{message.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <a
              href={`mailto:${message.email}`}
              className="font-medium text-powder-600 hover:text-powder-700 flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              {message.email}
            </a>
          </div>
          {message.phone && (
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <a
                href={`tel:${message.phone}`}
                className="font-medium text-powder-600 hover:text-powder-700 flex items-center gap-1"
              >
                <Phone className="h-4 w-4" />
                {message.phone}
              </a>
            </div>
          )}
        </div>

        {/* Message */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Message</p>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${message.email}?subject=Re: ${message.subject}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-powder-600 text-white rounded-lg hover:bg-powder-700 transition-colors font-medium"
            >
              <Mail className="h-4 w-4" />
              Reply via Email
            </a>
            {message.phone && (
              <a
                href={`https://wa.me/91${message.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Phone className="h-4 w-4" />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
