import { ImageResponse } from "next/og";

// Browser-tab icon: the monogram reversed out of jade.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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
          background: "#1F4D3D",
          borderRadius: 6,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
          <path
            d="M31.4 8.5 h5.2 v20.9 c0 6.4-4.6 10.6-11.3 10.6 c-5.6 0-9.7-2.9-11.1-7.6 l4.7-1.9 c1 3.1 3.3 4.8 6.4 4.8 c3.7 0 6.1-2.4 6.1-6.3 z"
            fill="#FAF8F5"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
