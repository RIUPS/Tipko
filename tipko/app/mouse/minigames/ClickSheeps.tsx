"use client";

import { url } from "inspector";
import { useState, useEffect } from "react";

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

export default function ClickSheeps() {
  const [clicked, setClicked] = useState<boolean[]>(Array(SHEEP_COUNT).fill(false));
  const [positions, setPositions] = useState<{ left: number; top: number }[]>([]);

  useEffect(() => {
    setPositions(getRandomPositions(SHEEP_COUNT, CONTAINER_WIDTH, CONTAINER_HEIGHT));
  }, []);

  const handleClick = (i: number) => {
    setClicked(prev => {
      const updated = [...prev];
      updated[i] = true;
      return updated;
    });
  };

  return (
    <div>
      <p>(Klikni vse ovčke!)</p>
      <div
        style={{
          position: "relative",
          width: `${CONTAINER_WIDTH}px`,
          height: `${CONTAINER_HEIGHT}px`,
          border: "2px solid #ccc",
          borderRadius: "1rem",
          margin: "2rem auto",
          background: "url('assets/sheep/sheep_background.png') center/cover no-repeat",
          overflow: "hidden",
        }}
      >
        {positions.map((pos, i) => (
          <button
            key={i}
            id={`sheep-button-${i}`}
            onClick={() => handleClick(i)}
            style={{
              position: "absolute",
              left: pos.left,
              top: pos.top,
              fontSize: "2rem",
              background: "none",
              backgroundImage: clicked[i] ? "url('assets/sheep/sheep_eating.png')" : "url('assets/sheep/sheep.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              border: "none",
              cursor: "pointer",
              backgroundColor: "transparent",
              color: clicked[i] ? "white" : "black",
              width: `${SHEEP_SIZE}px`,
              height: `${SHEEP_SIZE}px`,
              transition: "background 0.2s",
              userSelect: "none",
            }}
          >
          </button>
        ))}
      </div>
    </div>
  );
}