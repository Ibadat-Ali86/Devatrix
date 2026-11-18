import { ImageResponse } from "next/og";

export const alt = "Devatrix Technologies — AI Software House, Custom SaaS & Engineering Internships";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #040f21 0%, #061833 52%, #0f346b 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top Accent Bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "10px",
            background: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%)",
          }}
        />

        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "#f59e0b",
                color: "#061833",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "34px",
                fontWeight: 900,
              }}
            >
              D
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "34px", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
                Devatrix
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.32em",
                  color: "#fbbf24",
                  marginTop: "6px",
                }}
              >
                TECHNOLOGIES
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "10px 22px",
              borderRadius: "9999px",
              border: "1px solid rgba(245, 158, 11, 0.45)",
              background: "rgba(245, 158, 11, 0.14)",
              color: "#fcd34d",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            www.devatrix.site
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "980px" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: "62px", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.03em" }}>
            <span>Software Solutions That</span>
            <span style={{ display: "flex", gap: "16px" }}>
              <span>Create</span>
              <span style={{ color: "#f59e0b" }}>Real Value.</span>
            </span>
          </div>
          <div style={{ display: "flex", fontSize: "24px", color: "#cbd5e1", lineHeight: 1.45, fontWeight: 500 }}>
            AI-native software house delivering Custom SaaS, Applied AI &amp; Autonomous Agents,
            Full-Stack Web, Mobile Apps, Cloud DevOps &amp; 6-Week Virtual Internships.
          </div>
        </div>

        {/* Bottom Capability Pills */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "14px" }}>
            {["Custom SaaS & Web", "AI & Agent Systems", "React Native & Flutter", "6-Week Internships"].map((pill) => (
              <div
                key={pill}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#f8fafc",
                }}
              >
                {pill}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "16px", color: "#94a3b8", fontWeight: 600 }}>
            Lahore, PK • Global Remote
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
