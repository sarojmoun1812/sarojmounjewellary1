"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the failure to the browser console and any server log drain so a
    // real problem (a Neon outage, a bad query) is not silently swallowed.
    console.error("[route error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory-50 px-6 py-24">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-champagne-100">
          <AlertTriangle
            className="h-8 w-8 text-champagne-600"
            strokeWidth={1.5}
          />
        </div>

        <h1 className="font-heading text-3xl font-light text-charcoal-900 md:text-4xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-md text-charcoal-500">
          This page couldn&apos;t load. Please wait a moment and try again — if
          it still doesn&apos;t work, message us on WhatsApp.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-charcoal-900 px-10 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ivory-50 transition-colors can-hover:hover:bg-charcoal-800"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-charcoal-900 px-10 py-4 text-sm font-medium uppercase tracking-[0.18em] text-charcoal-900 transition-colors can-hover:hover:bg-charcoal-900 can-hover:hover:text-ivory-50"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-10 text-xs text-charcoal-400">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
