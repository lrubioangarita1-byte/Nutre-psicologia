import { ImageResponse } from "next/og";

export const alt = "LucernaPsi, por Laura Rubio · Psicología del Bienestar — Evaluación psicológica online con informe en 12–24 h";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#FCEFDC", color: "#5B5120", fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 96, height: 96, borderRadius: 48, border: "3px solid #5B5120", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontStyle: "italic" }}>L</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 48, fontWeight: 700 }}>LucernaPsi</div>
            <div style={{ fontSize: 22, letterSpacing: 3, color: "#6B6135" }}>POR LAURA RUBIO · PSICOLOGÍA DEL BIENESTAR</div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, marginTop: 60, lineHeight: 1.1 }}>
          Claridad sobre ti&nbsp;<span style={{ color: "#EF6328", fontStyle: "italic" }}>en un informe.</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 28, color: "#6B6135" }}>
          Evaluación psicológica online · Informe en 12–24 h · TP 196983
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 18, background: "#DEACA9", display: "flex" }} />
      </div>
    ),
    size,
  );
}
