import { ImageResponse } from "next/og";

// Imagem de compartilhamento (WhatsApp, Facebook, LinkedIn, X e preview do
// Google). Gerada em build — sem fonte externa, para não depender de rede.
export const alt = "FesFlow — Sistema de gestão para empresas de festa e eventos";
export const size = { width: 1200, height: 630 };
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
          justifyContent: "center",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0b1b33 0%, #4f46e5 55%, #06b6b4 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 700 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "#06b6b4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
            }}
          >
            🎈
          </div>
          FesFlow
        </div>

        <div style={{ display: "flex", fontSize: 66, fontWeight: 800, lineHeight: 1.1, marginTop: 40, maxWidth: 940 }}>
          Organize sua empresa de festas e nunca perca uma data.
        </div>

        <div style={{ display: "flex", fontSize: 30, marginTop: 28, opacity: 0.9, maxWidth: 900 }}>
          Agenda anti-overbooking, orçamentos, contratos e financeiro para locadoras de festa.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: 0.75,
          }}
        >
          Do pedido à devolução, tudo flui
        </div>
      </div>
    ),
    size,
  );
}
