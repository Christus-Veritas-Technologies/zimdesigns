import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#E8A900",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 108,
          fontWeight: 800,
          color: "#2A2410",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Z
      </div>
    ),
    { width: 180, height: 180 },
  );
}
