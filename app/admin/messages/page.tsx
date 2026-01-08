import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = "force-dynamic";
import { Mail, Eye, CheckCircle, Clock } from "lucide-react";

async function getMessages(filter?: string) {
  const where: any = {};

  if (filter === "unread") {
    where.isRead = false;
  } else if (filter === "read") {
    where.isRead = true;
  }

  return prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const params = await searchParams;
  const messages = await getMessages(params.filter);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">
          Contact form submissions ({messages.length} messages)
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Link
          href="/admin/messages"
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !params.filter
              ? "bg-powder-100 text-powder-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/messages?filter=unread"
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            params.filter === "unread"
              ? "bg-powder-100 text-powder-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Unread
        </Link>
        <Link
          href="/admin/messages?filter=read"
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            params.filter === "read"
              ? "bg-powder-100 text-powder-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Read
        </Link>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No messages found.
            </div>
          ) : (
            messages.map((message) => (
              <Link
                key={message.id}
                href={`/admin/messages/${message.id}`}
                className={`block p-4 hover:bg-gray-50 transition-colors ${
                  !message.isRead ? "bg-powder-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!message.isRead && (
                        <span className="w-2 h-2 bg-powder-600 rounded-full" />
                      )}
                      <p className="font-medium text-gray-900 truncate">
                        {message.subject}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span>{message.name}</span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {message.email}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </p>
                    {message.isRead ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                        <CheckCircle className="h-3 w-3" />
                        Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 mt-1">
                        <Clock className="h-3 w-3" />
                        New
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
