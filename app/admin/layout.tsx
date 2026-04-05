"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Sparkles,
  Mail,
  TrendingUp,
  Search,
  Gem,
  Crown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", gradient: "from-violet-500 to-purple-500" },
  { href: "/admin/products", icon: Package, label: "Products", gradient: "from-blue-500 to-cyan-500" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders", gradient: "from-amber-500 to-orange-500" },
  { href: "/admin/customers", icon: Users, label: "Customers", gradient: "from-emerald-500 to-green-500" },
  { href: "/admin/leads", icon: TrendingUp, label: "CRM / Leads", gradient: "from-pink-500 to-rose-500" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages", gradient: "from-sky-500 to-blue-500" },
  { href: "/admin/newsletter", icon: Mail, label: "Newsletter", gradient: "from-teal-500 to-emerald-500" },
  { href: "/admin/settings", icon: Settings, label: "Settings", gradient: "from-gray-500 to-slate-500" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.admin) setAdmin(data.admin);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Sidebar - Desktop */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-500 hidden lg:flex flex-col ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
      >
        {/* Sidebar Background with glass effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=30')] bg-cover bg-center opacity-[0.03]" />

        {/* Logo */}
        <div className="relative h-20 flex items-center justify-between px-5 border-b border-white/10">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-wide">Saroj Moun</h1>
                  <p className="text-[10px] text-amber-400/80 tracking-[0.2em] uppercase">Admin Panel</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/15 text-white shadow-lg"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`p-2 rounded-lg transition-all ${
                  isActive
                    ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                    : "bg-white/5 group-hover:bg-white/10"
                }`}>
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium text-sm whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        {admin && (
          <div className="relative p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{admin.name}</p>
                  <p className="text-xs text-white/40 truncate">{admin.role}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 z-50 h-screen w-72 bg-gradient-to-b from-slate-900 to-slate-800 lg:hidden"
            >
              <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">Saroj Moun</h1>
                    <p className="text-[10px] text-amber-400/80 tracking-[0.2em] uppercase">Admin</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="p-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        isActive ? "bg-white/15 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? `bg-gradient-to-br ${item.gradient}` : "bg-white/5"}`}>
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-500 ${sidebarOpen ? "lg:ml-72" : "lg:ml-20"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              {/* Search Bar */}
              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 w-80">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, orders, leads..."
                  className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Store Link */}
              <Link
                href="/"
                target="_blank"
                className="hidden sm:flex items-center gap-2 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium hover:bg-emerald-100 transition-colors"
              >
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Live Store
              </Link>

              {/* Notifications */}
              <button className="p-2 rounded-xl hover:bg-gray-100 relative transition-colors">
                <Bell className="h-5 w-5 text-gray-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {admin?.name.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-800 leading-tight">{admin?.name || "Admin"}</p>
                    <p className="text-[10px] text-gray-400">{admin?.role || ""}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-rose-50 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{admin?.name}</p>
                        <p className="text-xs text-gray-500">{admin?.email}</p>
                      </div>
                      <Link
                        href="/admin/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="h-4 w-4 text-gray-400" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
