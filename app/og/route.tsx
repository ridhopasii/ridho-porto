import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Portfolio OG Image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const domain = process.env.DOMAIN || "";
  const siteName = process.env.SITE_NAME || "Portfolio";

  // Fetch profile data
  let fullName = siteName;
  let title = "Fullstack Developer";
  let avatarUrl = domain ? `${domain}/profile.webp` : null;

  try {
    if (domain) {
      const res = await fetch(`${domain}/api/profile`, { cache: "no-store" });
      if (res.ok) {
        const profile = await res.json();
        fullName = profile.fullName || siteName;
        title = profile.title || title;
        avatarUrl = profile.avatarUrl?.startsWith("http")
          ? profile.avatarUrl
          : `${domain}${profile.avatarUrl}`;
      }
    }
  } catch {
    // Use defaults if fetch fails
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(124, 58, 237, 0.15)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.1)",
            filter: "blur(60px)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "60px 80px",
            gap: 60,
            width: "100%",
          }}
        >
          {/* Avatar */}
          {avatarUrl && (
            <div
              style={{
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: "4px solid rgba(255,255,255,0.2)",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={avatarUrl}
                alt={fullName}
                width={180}
                height={180}
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(124, 58, 237, 0.2)",
                border: "1px solid rgba(124, 58, 237, 0.4)",
                borderRadius: 100,
                padding: "6px 16px",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10b981",
                }}
              />
              <span style={{ color: "#a78bfa", fontSize: 14, fontWeight: 600 }}>
                Open to Work
              </span>
            </div>

            <h1
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: "white",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {fullName}
            </h1>

            <p
              style={{
                fontSize: 24,
                color: "rgba(255,255,255,0.6)",
                margin: 0,
                fontWeight: 400,
              }}
            >
              {title}
            </p>

            {/* Domain tag */}
            {domain && (
              <p
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.4)",
                  margin: 0,
                  marginTop: 8,
                }}
              >
                {domain.replace("https://", "")}
              </p>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
