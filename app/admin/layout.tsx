"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Gem,
  Home,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

/**
 * Shell for the admin portal.
 *
 * Written for two people running a jewellery shop, not for an operations team.
 * The things that were removed matter as much as what is here: a search box
 * that searched nothing and a notification bell with a permanent red dot that
 * was never connected to anything. A control that looks live but does nothing
 * costs a non-technical user real confidence — they assume they pressed it
 * wrong. The collapsible sidebar went too, because collapsing it by accident
 * left an unlabelled strip of icons with no obvious way back.
 */

interface Admin {
  email: string;
  name: string;
}

const NAV = [
  { href: "/admin", icon: Home, label: "Home" },
  { href: "/admin/products", icon: Package, label: "Saaman" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Order" },
  { href: "/admin/customers", icon: Users, label: "Grahak" },
  { href: "/admin/leads", icon: TrendingUp, label: "Inquiry" },
  { href: "/admin/messages", icon: MessageSquare, label: "Message" },
  { href: "/admin/newsletter", icon: Mail, label: "Email list" },
  { href: "/admin/settings", icon: Settings, label: "Setting" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.admin) setAdmin(data.admin);
      })
      .catch(() => {});
  }, []);

  // Close the drawer on navigation, so tapping a link on a phone does not leave
  // the menu covering the page they just opened.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isCurrent = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const navLinks = (
    <nav className="space-y-1 p-3">
      {NAV.map((item) => {
        const active = isCurrent(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
              active
                ? "bg-emerald-600 text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarHeader = (
    <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500">
        <Gem className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="font-semibold leading-tight text-white">Saroj Moun</p>
        <p className="text-[11px] text-slate-400">Admin panel</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-slate-900 lg:flex">
        {sidebarHeader}

        <Link
          href="/admin/products/new"
          className="mx-3 mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" />
          Naya item jodein
        </Link>

        <div className="flex-1 overflow-y-auto">{navLinks}</div>

        <div className="border-t border-white/10 p-3">
          {admin && (
            <p className="truncate px-3 pb-2 text-xs text-slate-400">
              {admin.email}
            </p>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/10"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Menu band karein"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-slate-900">
            <div className="flex items-center justify-between border-b border-white/10">
              {sidebarHeader}
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Menu band karein"
                className="mr-3 rounded-lg p-2 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Link
              href="/admin/products/new"
              className="mx-3 mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Naya item jodein
            </Link>

            <div className="flex-1 overflow-y-auto">{navLinks}</div>

            <div className="border-t border-white/10 p-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-300"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-8">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Menu kholein"
              className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* No greeting here: the sidebar already carries her name and the
                dashboard opens with "Namaste". Repeating it on every page just
                pushed the actual page heading further down. */}
            <span className="flex-1" />

            <Link
              href="/"
              target="_blank"
              className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
            >
              Website dekhein
            </Link>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
