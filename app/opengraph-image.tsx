import { ImageResponse } from "next/og";

/**
 * Share image for WhatsApp, Instagram and search previews.
 *
 * Generated rather than shipped as a file because the previous setup pointed at
 * peacock-jewellery.jpeg while declaring it 1200x630 — that image is portrait,
 * so every shared link was cropped to a slice of it. Rendering at the real
 * dimensions removes the mismatch.
 */

export const runtime = "edge";
export const alt = "Saroj Moun Jewellery — handcrafted 925 sterling silver";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 70% 20%, #2a2b34 0%, #111216 55%, #0b0c0f 100%)",
          color: "#FFFEF9",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 104,
            height: 104,
            borderRadius: 26,
            border: "2px solid #C4A764",
            color: "#C4A764",
            fontSize: 46,
            letterSpacing: 2,
          }}
        >
          SM
        </div>

        <div
          style={{
            marginTop: 44,
            fontSize: 68,
            fontWeight: 400,
            letterSpacing: -1,
          }}
        >
          Saroj Moun Jewellery
        </div>

        <div
          style={{
            marginTop: 22,
            fontSize: 30,
            color: "#C4A764",
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Handcrafted 925 Silver
        </div>

        <div
          style={{
            marginTop: 34,
            fontSize: 24,
            color: "rgba(255, 254, 249, 0.6)",
          }}
        >
          Jind, Haryana · Priced on the live silver rate
        </div>
      </div>
    ),
    size
  );
}
