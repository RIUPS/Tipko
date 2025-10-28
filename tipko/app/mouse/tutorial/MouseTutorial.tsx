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

  if (step >= steps.length) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          background: "linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%)",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          margin: "40px auto",
          maxWidth: 420,
        }}
      >
        <h2 style={{ color: "#2563eb", marginBottom: 12 }}>Čestitamo!</h2>
        <p style={{ color: "#374151", fontSize: 18 }}>
          Uspešno ste opravili vse osnovne akcije z miško.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={boxRef}
      tabIndex={0}
      style={{
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
      }}
      onClick={handleMouse}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouse}
      onWheel={handleWheel}
    >
      <video
        ref={videoRef}
        src="assets/mouse/mouse_tutorial.mp4"
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
        {steps[step].instruction}
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
    </div>
  );
};

export default MouseTutorial;