import { ImageResponse } from "next/og";

export const alt = "ReplyForge — Agence SEO spécialisée hôtellerie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(at 20% 20%, rgba(196,151,58,0.22) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(196,151,58,0.12) 0px, transparent 50%), #080C14",
          color: "#F2EFEA",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#C4973A",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: 48, height: 1, background: "#C4973A" }} />
          <div>REPLYFORGE</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            Plus de réservations directes. Moins de Booking.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#8B9AAE",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Agence SEO spécialisée hôtellerie. Nous reconstruisons votre canal direct.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#8B9AAE",
            fontSize: 20,
            fontFamily: "monospace",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <div>replyforge.fr</div>
          <div style={{ color: "#C4973A" }}>Audit offert</div>
        </div>
      </div>
    ),
    size,
  );
}
