"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary. It only renders when the root layout itself throws, so
 * it replaces <html>/<body> and cannot rely on the global stylesheet being
 * present. Everything here is inline so the recovery screen still looks like
 * the shop even when the app has fallen over completely.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf8f3",
          color: "#1c1c1c",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 300,
              margin: "0 0 1rem",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              margin: "0 auto 2rem",
              maxWidth: "28rem",
              color: "#6b6b6b",
              lineHeight: 1.6,
            }}
          >
            The website couldn&apos;t load. Please wait a moment and try again.
          </p>
          <button
            onClick={reset}
            style={{
              border: "none",
              cursor: "pointer",
              backgroundColor: "#1c1c1c",
              color: "#faf8f3",
              padding: "1rem 2.5rem",
              fontSize: "0.75rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "#9a9a9a" }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
