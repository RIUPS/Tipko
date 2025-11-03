"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const SHEEP_COUNT = 10;
const CONTAINER_WIDTH = 600;
const CONTAINER_HEIGHT = 400;
const SHEEP_SIZE = 48;

function isOverlapping(a: { left: number; top: number }, b: { left: number; top: number }) {
  return (
    Math.abs(a.left - b.left) < SHEEP_SIZE &&
    Math.abs(a.top - b.top) < SHEEP_SIZE
  );
}

function getRandomPositions(count: number, width: number, height: number) {
  const positions: { left: number; top: number }[] = [];
  let attempts = 0;
  while (positions.length < count && attempts < 1000) {
    const pos = {
      left: Math.random() * (width - SHEEP_SIZE),
      top: (height / 2) + Math.random() * (height / 2 - SHEEP_SIZE),
    };
    if (!positions.some(existing => isOverlapping(existing, pos))) {
      positions.push(pos);
    }
    attempts++;
  }
  return positions;
}

export default function ClickSheeps({ onFinish }: { onFinish?: () => void }) {
  const router = useRouter();
  const [clicked, setClicked] = useState<boolean[]>(Array(SHEEP_COUNT).fill(false));
  const [positions, setPositions] = useState<{ left: number; top: number }[]>([]);
  const [found, setFound] = useState(0);
  const [time, setTime] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [fingerprint, setFingerprint] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Začetek igre
  useEffect(() => {
    setPositions(getRandomPositions(SHEEP_COUNT, CONTAINER_WIDTH, CONTAINER_HEIGHT));
    setClicked(Array(SHEEP_COUNT).fill(false));
    setFound(0);
    setTime(0);
    setFinished(false);
    setStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Ko najdeš vse ovčke
  useEffect(() => {
    if (found === SHEEP_COUNT && !finished) {
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      // NE kličemo več onFinish tukaj!
    }
  }, [found, finished]);

  // Timer teče samo če je started
  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

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

  // Save result to universal challenge API when finished
  useEffect(() => {
    if (finished && fingerprint) {
      const payload = {
        fingerprint,
        type: "mouse",
        clicks: SHEEP_COUNT,
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
  }, [finished, fingerprint, time]);

  const handleClick = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setClicked(prev => {
      if (prev[i]) return prev;
      const updated = [...prev];
      updated[i] = true;
      setFound(f => f + 0.5);
      return updated;
    });
    if (!started) setStarted(true);
  };

  const handleRestart = () => {
    setPositions(getRandomPositions(SHEEP_COUNT, CONTAINER_WIDTH, CONTAINER_HEIGHT));
    setClicked(Array(SHEEP_COUNT).fill(false));
    setFound(0);
    setTime(0);
    setFinished(false);
    setStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Najdi vse ovčke!</h2>
      <div style={{ marginBottom: 12, fontSize: 18, color: "#374151" }}>
        🐑 Najdenih: {found} / {SHEEP_COUNT} &nbsp; | &nbsp; ⏱️ Čas: {time}s
      </div>
      <div
        style={{
          position: "relative",
          width: `${CONTAINER_WIDTH}px`,
          height: `${CONTAINER_HEIGHT}px`,
          border: "2px solid #ccc",
          borderRadius: "1rem",
          margin: "2rem auto",
          background: "url('/assets/sheep/sheep_background.png') center/cover no-repeat",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        {positions.map((pos, i) => (
          <button
            key={i}
            id={`sheep-button-${i}`}
            onClick={e => handleClick(i, e)}
            disabled={clicked[i] || finished}
            style={{
              position: "absolute",
              left: pos.left,
              top: pos.top,
              fontSize: "2rem",
              background: "none",
              backgroundImage: clicked[i]
                ? "url('/assets/sheep/sheep_eating.png')"
                : "url('/assets/sheep/sheep.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              border: "none",
              cursor: clicked[i] || finished ? "default" : "pointer",
              backgroundColor: "transparent",
              color: clicked[i] ? "white" : "green",
              width: `${SHEEP_SIZE}px`,
              height: `${SHEEP_SIZE}px`,
              transition: "transform 0.15s, filter 0.2s",
              transform: clicked[i] ? "scale(1.1) rotate(-8deg)" : "scale(1)",
              userSelect: "none",
              outline: "none",
            }}
            tabIndex={clicked[i] ? -1 : 0}
            aria-label={clicked[i] ? "Najdena ovčka" : "Klikni ovčko"}
          />
        ))}
        {finished && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              background: "rgba(255,255,255,0.92)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "1rem",
              zIndex: 10,
            }}
          >
            <h2 style={{ color: "#22c55e", fontSize: 32, marginBottom: 12 }}>Bravo!</h2>
            <div style={{ fontSize: 20, marginBottom: 18 }}>
              Vse ovčke si našel v {time} sekundah!
            </div>
            <button
              onClick={handleRestart}
              style={{
                padding: "14px 36px",
                fontSize: 20,
                fontWeight: 700,
                background: "#f472b6",
                color: "#fff",
                border: "none",
                borderRadius: 32,
                boxShadow: "0 2px 12px rgba(244,114,182,0.15)",
                cursor: "pointer",
                marginTop: 8,
                transition: "background 0.2s",
              }}
            >
              Igraj znova
            </button>
            <button
              onClick={onFinish}
              style={{
                marginTop: 24,
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
              Nadaljuj na izziv z vlečenjem
            </button>
          </div>
        )}
      </div>
      <div style={{ color: "#64748b", fontSize: 15 }}>
        (Klikni vse ovčke, da jih najdeš. Ko jih najdeš vse, lahko igraš znova!)
      </div>
    </div>
  );
}