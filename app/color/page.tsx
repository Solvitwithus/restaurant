"use client"
import React from "react";

type Color = { hex: string; label?: string };

type Palette = { name: string; colors: Color[] };

const palettes: Palette[] = [
  {
    name: "Deep Green + Gold + Cream (Luxury Hotel Vibe)",
    colors: [
      { hex: "#1E3932", label: "Deep Green" },
      { hex: "#D4AF37", label: "Gold Accent" },
      { hex: "#F7F5EE", label: "Warm Cream" },
      { hex: "#FFFFFF", label: "White (Cards)" },
      { hex: "#0D0D0D", label: "Text" },
    ],
  },
  {
    name: "Navy Blue + Sand Beige + White (Classic Hospitality)",
    colors: [
      { hex: "#1C2A3A", label: "Navy Blue" },
      { hex: "#E8D8C3", label: "Sand Beige" },
      { hex: "#FFFFFF", label: "White" },
      { hex: "#F2F5F7", label: "Light Gray Background" },
      { hex: "#0A0A0A", label: "Text" },
    ],
  },
  {
    name: "Teal + Soft Gray + White (Modern & Clean)",
    colors: [
      { hex: "#006D77", label: "Teal" },
      { hex: "#83C5BE", label: "Light Teal" },
      { hex: "#EDF6F9", label: "Off-white" },
      { hex: "#FFFFFF", label: "White (Cards)" },
      { hex: "#2D2D2D", label: "Text" },
    ],
  },
  {
    name: "Dark Mode – Matte Black + Neon Accent",
    colors: [
      { hex: "#121212", label: "Deep Black" },
      { hex: "#1F1F1F", label: "Card Background" },
      { hex: "#00D4A8", label: "Neon Mint Accent" },
      { hex: "#3BA9FF", label: "Soft Blue Accent" },
      { hex: "#FAFAFA", label: "Text" },
    ],
  },
  {
    name: "Brown + Cream + Gold (Warm Restaurant Feel)",
    colors: [
      { hex: "#4B2E26", label: "Rich Brown" },
      { hex: "#E9D7C1", label: "Warm Cream" },
      { hex: "#F6EFE7", label: "Light Background" },
      { hex: "#D4A373", label: "Gold-ish Accent" },
    ],
  },
];

export default function ColorCircles(): JSX.Element {
  return (
    <div className="wrapper">
      <h1>Hotel POS Color Palettes</h1>

      {palettes.map((p) => (
        <section key={p.name} className="palette">
          <h2>{p.name}</h2>

          <div className="row">
            {p.colors.map((c) => (
              <div className="colorItem" key={c.hex}>
                <div
                  className="circle"
                  style={{
                    background: c.hex,
                    boxShadow:
                      c.hex.toLowerCase() === "#ffffff"
                        ? "inset 0 0 0 1px rgba(0,0,0,0.12)"
                        : undefined,
                  }}
                  title={`${c.label || ""} — ${c.hex}`}
                />
                <div className="label">
                  <div className="name">{c.label}</div>
                  <div className="hex">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <style jsx>{`
        .wrapper {
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto,
            "Helvetica Neue", Arial;
          padding: 24px;
          max-width: 900px;
          margin: 0 auto;
          color: #111;
        }

        h1 {
          margin: 0 0 18px 0;
          font-size: 22px;
        }

        .palette {
          margin-bottom: 20px;
          padding: 14px;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
        }

        .palette h2 {
          margin: 0 0 12px 0;
          font-size: 15px;
          color: #333;
        }

        .row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .colorItem {
          width: 110px;
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.06);
          flex: 0 0 40px;
        }

        .label {
          display: flex;
          flex-direction: column;
          font-size: 12px;
          line-height: 1;
        }

        .name {
          color: #444;
          margin-bottom: 4px;
        }

        .hex {
          color: #666;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono",
            "Courier New", monospace;
        }

        @media (max-width: 640px) {
          .colorItem {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
