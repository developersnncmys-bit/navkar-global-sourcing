import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Required with `output: "export"` — tells Next to generate this icon
// once at build time as a static PNG instead of treating it as a
// dynamic route. Without this, `next build` fails with:
//   "export const dynamic = "force-static" not configured on route /icon"
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1726",
          color: "#ffffff",
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          fontFamily:
            "Helvetica, Arial, sans-serif",
        }}
      >
        N
      </div>
    ),
    { ...size },
  );
}
