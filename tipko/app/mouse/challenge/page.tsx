"use client";

import { useState } from "react";
import ClickSheeps from "./ClickSheeps";
import DragSheeps from "./DragSheeps";

export default function MouseMinigamesPage() {
  const [phase, setPhase] = useState<"click" | "drag">("click");

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fdf6e3 0%, #e0e7ff 100%)", paddingTop: 40 }}>
      <h1 style={{ textAlign: "center", color: "#f472b6", fontSize: 36, fontWeight: 800, marginBottom: 24 }}>
        Mini igre z miško
      </h1>
      {phase === "click" ? (
        <ClickSheeps onFinish={() => setPhase("drag")} />
      ) : (
        <DragSheeps />
      )}
    </div>
  );
}