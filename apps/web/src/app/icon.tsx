import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#E8A900",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 800,
          color: "#2A2410",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Z
      </div>
    ),
    { width: 32, height: 32 },
  );
}
