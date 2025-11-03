"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const SHEEP_COUNT = 10;
const SHEEP_SIZE = 48;

type Sheep = {
  id: number;
  left: number;
  top: number;
  inPen: boolean;
};

const PEN = {
  left: 350,
  top: 80,
  width: 200,
  height: 200,
};

function getRandomPosition() {
  return {
    left: Math.random() * 220 + 40,
    top: Math.random() * 220 + 40,
  };
}

export default function DragSheeps() {
  const router = useRouter();
  const [sheepList, setSheepList] = useState<Sheep[]>(
    Array.from({ length: SHEEP_COUNT }, (_, i) => ({
      id: i,
      ...getRandomPosition(),
      inPen: false,
    }))
  );
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [fingerprint, setFingerprint] = useState<string>("");

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Ustavi timer, ko so vse ovčke v ogradi
  useEffect(() => {
    if (sheepList.every(s => s.inPen)) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [sheepList]);

  // --- Fingerprint logic ---
  useEffect(() => {
    let fp = localStorage.getItem("fingerprint");
    if (!fp) {
      fp = Math.random().toString(36).substring(2) + Date.now();
      localStorage.setItem("fingerprint", fp);
    }
    setFingerprint(fp);
  }, []);
  // --- End fingerprint logic ---

  // Save result to universal challenge API when all sheep are in pen
  useEffect(() => {
    if (sheepList.every(s => s.inPen) && fingerprint) {
      const payload = {
        fingerprint,
        type: "mouse",
        dragAccuracy: 100, // Example, you can calculate real accuracy if needed
        mouseTime: time,
        points: Math.max(0, 100 - time), // Example scoring
        timestamp: new Date().toISOString(),
      };
      fetch("http://localhost:5000/api/universal-challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  }, [sheepList, fingerprint, time]);

  // Začetek vlečenja
  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    if (sheepList.find(s => s.id === id)?.inPen) return;
    setDraggedId(id);
    const sheep = sheepList.find(s => s.id === id);
    if (!sheep) return;
    offset.current = {
      x: e.clientX - sheep.left,
      y: e.clientY - sheep.top,
    };

    window.removeEventListener("mousemove", handleMouseMove as any);
    window.removeEventListener("mouseup", handleMouseUp as any);
    window.addEventListener("mousemove", handleMouseMove as any);
    window.addEventListener("mouseup", handleMouseUp as any);
  };

  // Premikanje ovčke
  const handleMouseMove = (e: MouseEvent) => {
    if (draggedId === null) return;
    setSheepList(list =>
      list.map(s =>
        s.id === draggedId
          ? {
              ...s,
              left: Math.max(0, Math.min(e.clientX - offset.current.x, 600 - SHEEP_SIZE)),
              top: Math.max(0, Math.min(e.clientY - offset.current.y, 350 - SHEEP_SIZE)),
            }
          : s
      )
    );
  };

  // Spust miške
  const handleMouseUp = () => {
    if (draggedId === null) return;
    setSheepList(list =>
      list.map(s => {
        if (s.id !== draggedId) return s;
        const sheepCenter = {
          x: s.left + SHEEP_SIZE / 2,
          y: s.top + SHEEP_SIZE / 2,
        };
        if (
          sheepCenter.x > PEN.left &&
          sheepCenter.x < PEN.left + PEN.width &&
          sheepCenter.y > PEN.top &&
          sheepCenter.y < PEN.top + PEN.height
        ) {
          return {
            ...s,
            inPen: true,
            left: PEN.left + 20 + Math.random() * (PEN.width - 60),
            top: PEN.top + 20 + Math.random() * (PEN.height - 60),
          };
        }
        return s;
      })
    );
    setDraggedId(null);
    window.removeEventListener("mousemove", handleMouseMove as any);
    window.removeEventListener("mouseup", handleMouseUp as any);
  };

  const inPenCount = sheepList.filter(s => s.inPen).length;
  const allInPen = inPenCount === SHEEP_COUNT;

  return (
    <div
      style={{
        position: "relative",
        width: 600,
        height: 350,
        margin: "40px auto",
        background: "linear-gradient(135deg, #fdf6e3 0%, #e0e7ff 100%)",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <h2 style={{ textAlign: "center", marginTop: 12, color: "#2563eb" }}>
        Povleci vse ovčke v ogrado!
      </h2>
      <div style={{ textAlign: "center", fontSize: 18, margin: "8px 0 0 0", color: "#374151" }}>
        🐑 V ogradi: {inPenCount} / {SHEEP_COUNT} &nbsp; | &nbsp; ⏱️ Čas: {time}s
      </div>
      {/* Ograda */}
      <div
        style={{
          position: "absolute",
          left: PEN.left,
          top: PEN.top,
          width: PEN.width,
          height: PEN.height,
          background: "#e0ffe0",
          border: "3px dashed #22c55e",
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          color: "#22c55e",
          zIndex: 1,
        }}
      >
        🏡 Ograda
      </div>
      {/* Ovčke */}
      {sheepList.map(sheep => (
        <div
          key={sheep.id}
          onMouseDown={e => handleMouseDown(e, sheep.id)}
          style={{
            position: "absolute",
            left: sheep.left,
            top: sheep.top,
            width: SHEEP_SIZE,
            height: SHEEP_SIZE,
            cursor: sheep.inPen ? "default" : draggedId === sheep.id ? "grabbing" : "grab",
            opacity: sheep.inPen ? 0.7 : 1,
            transition: draggedId === sheep.id ? "none" : "left 0.3s, top 0.3s, opacity 0.2s",
            zIndex: draggedId === sheep.id ? 100 : 2,
            pointerEvents: sheep.inPen ? "none" : "auto",
            userSelect: "none",
            background: "none",
          }}
        >
          <img
            src="/assets/sheep/sheep.png"
            alt="Ovčka"
            draggable={false}
            style={{
              width: SHEEP_SIZE,
              height: SHEEP_SIZE,
              pointerEvents: "none",
              userSelect: "none",
              opacity: sheep.inPen ? 0.7 : 1,
            }}
          />
        </div>
      ))}
      {/* Čestitka */}
      {allInPen && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: "rgba(30,30,60,0.55)",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <h2 style={{ color: "#fff", fontSize: 32, marginBottom: 16 }}>Bravo!</h2>
          <div style={{ color: "#e0e7ff", fontSize: 20, marginBottom: 32 }}>
            Vse ovčke so v ogradi v {time} sekundah!
          </div>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "16px 40px",
              fontSize: 22,
              fontWeight: 700,
              background: "linear-gradient(90deg, #60a5fa, #f472b6)",
              color: "#fff",
              border: "none",
              borderRadius: 32,
              boxShadow: "0 2px 12px rgba(30,30,60,0.15)",
              cursor: "pointer",
              transition: "background 0.2s",
              letterSpacing: 1,
              display: "inline-block",
            }}
          >
            Nazaj na začetek
          </button>
        </div>
      )}
    </div>
  );
}