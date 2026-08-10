"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Gem, Loader2 } from "lucide-react";

/**
 * Admin sign-in.
 *
 * The credentials live in the database, hashed — never in this file. Committing
 * them would publish the password to a public repository, and this login is all
 * that stands between the open internet and every customer's name, phone number
 * and address.
 *
 * The setup form only appears when no admin exists at all, which is a
 * once-per-database situation. Day to day, they see two fields.
 */
/**
 * Only same-origin paths are followed after login.
 *
 * The redirect parameter was used as given, so /admin/login?redirect=https://
 * evil.com would hand someone a working login form and then drop them on an
 * attacker's page still believing they were inside the admin panel — the
 * classic setup for capturing the password on the next screen.
 */
function safeRedirect(value: string | null): string {
  if (!value) return "/admin";
  // "//host" is protocol-relative and leaves the site despite starting with "/".
  if (!value.startsWith("/") || value.startsWith("//")) return "/admin";
  return value;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [needsSetup, setNeedsSetup] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [setupToken, setSetupToken] = useState("");

  useEffect(() => {
    fetch("/api/admin/init")
      .then((res) => res.json())
      .then((data) => setNeedsSetup(Boolean(data.needsSetup)))
      .catch(() => {});
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (needsSetup) {
        const res = await fetch("/api/admin/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, setupToken }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Account nahi ban paaya.");
      }

      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.error || "Email ya password galat hai. Dobara koshish karein."
        );
      }

      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kuch galat ho gaya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600">
            <Gem className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Saroj Moun Jewellery
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {needsSetup
              ? "Pehli baar account banayein"
              : "Apna email aur password daalein"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {needsSetup && (
            <>
              <div>
                <label
                  htmlFor="admin-name"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Aapka naam
                </label>
                <input
                  id="admin-name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label
                  htmlFor="admin-setup-token"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Setup code
                </label>
                <input
                  id="admin-setup-token"
                  type="password"
                  required
                  value={setupToken}
                  onChange={(event) => setSetupToken(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Jisne website banayi hai unse poochhein.
                </p>
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="aapka@gmail.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                minLength={needsSetup ? 12 : 1}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((shown) => !shown)}
                aria-label={showPassword ? "Password chhupayein" : "Password dikhayein"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              Aankh ke nishaan par dabakar password dekh sakte hain.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Ho raha hai...
              </>
            ) : needsSetup ? (
              "Account banayein"
            ) : (
              "Andar jayein"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
