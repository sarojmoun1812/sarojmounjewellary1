import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = "force-dynamic";
import { Mail, CheckCircle, Clock } from "lucide-react";

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
        <h1 className="text-2xl font-bold text-gray-900">Sandesh</h1>
        <p className="text-gray-600 mt-1">
          {messages.length === 0
            ? "Abhi koi sandesh nahi aaya."
            : `Website ke contact form se ${messages.length} sandesh.`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { href: "/admin/messages", label: "Saare", active: !params.filter },
          {
            href: "/admin/messages?filter=unread",
            label: "Naye",
            active: params.filter === "unread",
          },
          {
            href: "/admin/messages?filter=read",
            label: "Padh liye",
            active: params.filter === "read",
          },
        ].map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tab.active
                ? "bg-champagne-100 text-champagne-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              Koi sandesh nahi mila.
            </div>
          ) : (
            messages.map((message) => (
              <Link
                key={message.id}
                href={`/admin/messages/${message.id}`}
                className={`block p-4 hover:bg-gray-50 transition-colors ${
                  !message.isRead ? "bg-champagne-50" : ""
                }`}
              >
                {/* Stacks on a phone instead of squeezing the date into a
                    right-hand column beside the message preview. */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!message.isRead && (
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-champagne-600" />
                      )}
                      <p className="font-medium text-gray-900 truncate">
                        {message.subject}
                      </p>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                      <span>{message.name}</span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {message.email}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {message.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:text-right">
                    {message.isRead ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        Padh liya
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                        <Clock className="h-3 w-3" />
                        Naya
                      </span>
                    )}
                    <p className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </p>
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
