import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PocketPinch — Know before you buy.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0E0F12",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#9A9BA3",
            fontSize: 28,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 99, background: "#16A34A" }} />
          iOS · Coming soon
        </div>

        <div
          style={{
            marginTop: 32,
            color: "#F5F5F7",
            fontSize: 110,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
          }}
        >
          Know before
          <br />
          you buy.
        </div>

        <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#16A34A",
              color: "#fff",
              fontSize: 40,
              fontWeight: 800,
              width: 110,
              height: 110,
              borderRadius: 24,
            }}
          >
            82
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#16A34A", fontSize: 38, fontWeight: 700 }}>Go for it</div>
            <div style={{ color: "#9A9BA3", fontSize: 30 }}>PocketPinch · by Entafo Studios</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
