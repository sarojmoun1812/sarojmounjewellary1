"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

/**
 * Shared shell for the policy and information pages (privacy, terms, shipping,
 * returns).
 *
 * All four had copy-pasted the same wrapper in the old powder-blue palette,
 * which was the last place on the public site that did not look like the rest
 * of it. Keeping the shell here means the next change lands on every page.
 */
export function PolicyLayout({
  kicker,
  icon: Icon,
  title,
  updated,
  children,
}: {
  kicker: string;
  icon: LucideIcon;
  title: string;
  /** Shown under the title, e.g. "December 24, 2025". */
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ivory-50 py-20">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center gap-2 border border-champagne-200 bg-white px-6 py-3">
              <Icon className="h-4 w-4 text-champagne-600" strokeWidth={1.5} />
              <span className="section-kicker text-champagne-700">{kicker}</span>
            </div>
            <h1 className="font-heading text-4xl font-light text-charcoal-900 md:text-5xl">
              {title}
            </h1>
            {updated && (
              <p className="mt-4 text-sm text-charcoal-500">
                Last updated: {updated}
              </p>
            )}
          </div>

          <div className="space-y-10 border border-ivory-200 bg-white p-8 md:p-12">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * A titled block of policy copy. Styling the paragraphs and lists from here
 * keeps the page files down to their actual wording.
 */
export function PolicySection({
  title,
  divider,
  children,
}: {
  title: string;
  /** Set on a closing block, e.g. the contact details. */
  divider?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={divider ? "border-t border-ivory-200 pt-8" : undefined}>
      <h2 className="mb-4 font-heading text-2xl font-light text-charcoal-900">
        {title}
      </h2>
      <div className="space-y-3 leading-relaxed text-charcoal-600 [&_a]:text-champagne-700 [&_a]:underline [&_li]:mb-1 [&_strong]:font-medium [&_strong]:text-charcoal-800 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
