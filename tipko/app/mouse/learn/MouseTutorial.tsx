"use client";

import React, { useState, useRef, useEffect } from "react";

type Step = {
  instruction: string;
  check: (e: React.MouseEvent | React.WheelEvent) => boolean;
  videoStart: number;
  videoEnd: number;
};

const steps: Step[] = [
  {
    instruction: "Klikni z desnim gumbom miške (desni klik).",
    check: (e) => "button" in e && e.button === 2,
    videoStart: 3,
    videoEnd: 6,
  },
  {
    instruction: "Klikni z levim gumbom miške (levi klik).",
    check: (e) => "button" in e && e.button === 0,
    videoStart: 0,
    videoEnd: 3,
  },
  {
    instruction: "Zavrtite kolešček miške navzgor (scroll up).",
    check: (e) => "deltaY" in e && e.deltaY < 0,
    videoStart: 9,
    videoEnd: 11,
  },
  {
    instruction: "Zavrtite kolešček miške navzdol (scroll down).",
    check: (e) => "deltaY" in e && e.deltaY > 0,
    videoStart: 12,
    videoEnd: 15,
  },
  {
    instruction: "Klikni s srednjim gumbom miške (middle mouse click).",
    check: (e) => "button" in e && e.button === 1,
    videoStart: 6,
    videoEnd: 8,
  },
];

const MouseTutorial: React.FC = () => {
  const [step, setStep] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    if (steps[step].check(e)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (steps[step].check(e)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMouse(e);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!steps[step]) return;

    video.currentTime = steps[step].videoStart;
    video.play();

    const onTimeUpdate = () => {
      if (video.currentTime >= steps[step].videoEnd) {
        video.currentTime = steps[step].videoStart;
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [step]);

  const tutorialCompleted = step >= steps.length;

  return (
    <div
      ref={boxRef}
      tabIndex={0}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #2563eb",
        borderRadius: 16,
        padding: 48,
        margin: "40px auto",
        textAlign: "center",
        userSelect: "none",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%)",
        fontSize: 22,
        outline: "none",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        maxWidth: 420,
        transition: "box-shadow 0.2s",
        overflow: "hidden",
      }}
      onClick={handleMouse}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouse}
      onWheel={handleWheel}
    >
      <video
        ref={videoRef}
        src="/assets/mouse/mouse_tutorial.mp4"
        width={220}
        muted
        loop={false}
        style={{
          marginBottom: 32,
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(37,99,235,0.10)",
          background: "#fff",
        }}
      />
      <div
        style={{
          fontWeight: 600,
          color: "#2563eb",
          marginBottom: 18,
          fontSize: 24,
        }}
      >
        {steps[step]?.instruction}
      </div>
      <div
        style={{
          marginTop: 18,
          color: "#64748b",
          fontSize: 16,
          background: "#f1f5f9",
          borderRadius: 8,
          padding: "10px 0",
        }}
      >
        (Kliknite ali zavrtite miško znotraj tega okvirja)
      </div>

      {tutorialCompleted && (
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
          <h2 style={{ color: "#fff", marginBottom: 16, fontSize: 28, textShadow: "0 2px 8px #0004" }}>
            Čestitamo!
          </h2>
          <p style={{ color: "#e0e7ff", fontSize: 18, marginBottom: 32, textShadow: "0 2px 8px #0003" }}>
            Uspešno ste opravili vse osnovne akcije z miško.
          </p>
          <a
            href="/mouse/challenge"
            style={{
              padding: "18px 44px",
              fontSize: 22,
              fontWeight: 700,
              background: "linear-gradient(90deg, #f472b6, #60a5fa)",
              color: "#fff",
              border: "none",
              borderRadius: 32,
              boxShadow: "0 2px 12px rgba(30,30,60,0.15)",
              textDecoration: "none",
              cursor: "pointer",
              transition: "background 0.2s",
              letterSpacing: 1,
            }}
          >
            Pojdi na izziv
          </a>
        </div>
      )}
    </div>
  );
};

export default MouseTutorial;