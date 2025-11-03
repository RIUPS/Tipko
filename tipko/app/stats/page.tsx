"use client";

import { useEffect, useState } from "react";

const CHALLENGE_TYPES = [
  { type: "keyboard", label: "Tipkanje", color: "from-yellow-200 to-yellow-50", border: "border-yellow-300", icon: "⌨️" },
  { type: "mouse", label: "Miška", color: "from-blue-200 to-blue-50", border: "border-blue-300", icon: "🖱️" },
  { type: "digital-safety", label: "Spletna varnost", color: "from-pink-200 to-pink-50", border: "border-pink-300", icon: "🛡️" },
];

export default function StatsPage() {
  const [fingerprint, setFingerprint] = useState<string>("");
  const [bestResults, setBestResults] = useState<Record<string, any>>({});
  const [loadingStats, setLoadingStats] = useState(true);

  // Fingerprint logic (same as digital safety challenge)
  useEffect(() => {
    let fp = localStorage.getItem("fingerprint");
    if (!fp) {
      fp = Math.random().toString(36).substring(2) + Date.now();
      localStorage.setItem("fingerprint", fp);
    }
    setFingerprint(fp);
  }, []);

  useEffect(() => {
    async function fetchBestResults() {
      if (!fingerprint) return;
      setLoadingStats(true);
      const results: Record<string, any> = {};
      for (const { type } of CHALLENGE_TYPES) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/universal-challenges?fingerprint=${fingerprint}&type=${type}`
          );
          const data = await res.json();
          if (data.challenges && data.challenges.length > 0) {
            results[type] = data.challenges[0];
          }
        } catch {
          // Ignore errors for now
        }
      }
      setBestResults(results);
      setLoadingStats(false);
    }
    if (fingerprint) fetchBestResults();
  }, [fingerprint]);

  if (loadingStats || !fingerprint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-blue-100">
        <div className="text-2xl font-bold text-yellow-700 animate-pulse">Nalagam statistiko...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-yellow-600 drop-shadow">
          Tvoja najboljša statistika
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CHALLENGE_TYPES.map(({ type, label, color, border, icon }) => {
            const result = bestResults[type];
            return (
              <div
                key={type}
                className={`rounded-3xl shadow-xl border-4 ${border} bg-gradient-to-br ${color} p-7 flex flex-col items-center`}
              >
                <div className="text-5xl mb-2">{icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 drop-shadow">{label}</h3>
                {result ? (
                  <ul className="space-y-2 text-lg text-gray-700 font-medium w-full">
                    {type === "keyboard" && (
                      <>
                        <li>
                          <span className="font-semibold text-yellow-700">WPM:</span> {result.wpm ?? "-"}
                        </li>
                        <li>
                          <span className="font-semibold text-yellow-700">CPM:</span> {result.cpm ?? "-"}
                        </li>
                        <li>
                          <span className="font-semibold text-yellow-700">Natančnost:</span> {result.accuracy ?? "-"}%
                        </li>
                        <li>
                          <span className="font-semibold text-yellow-700">Napake:</span> {result.errors ?? "-"}
                        </li>
                        <li>
                          <span className="font-semibold text-yellow-700">Dolžina citata:</span> {result.quoteLength ?? "-"}
                        </li>
                        <li>
                          <span className="font-semibold text-yellow-700">Čas:</span> {result.time ?? "-"} s
                        </li>
                        <li>
                          <span className="font-semibold text-yellow-700">Točke:</span> {result.points ?? "-"}
                        </li>
                        <li>
                          <span className="font-semibold text-yellow-700">Datum:</span> {new Date(result.timestamp).toLocaleString()}
                        </li>
                      </>
                    )}
                    {type === "mouse" && (
                      <>
                        <li>
                          <span className="font-semibold text-blue-700">Klikov:</span> {result.clicks ?? "-"}
                        </li>
                        <li>
                          <span className="font-semibold text-blue-700">Natančnost povleke:</span> {result.dragAccuracy ?? "-"}
                        </li>
                        <li>
                          <span className="font-semibold text-blue-700">Čas z miško:</span> {result.mouseTime ?? "-"} s
                        </li>
                        <li>
                          <span className="font-semibold text-blue-700">Točke:</span> {result.points ?? "-"}
                        </li>
                        <li>
                          <span className="font-semibold text-blue-700">Datum:</span> {new Date(result.timestamp).toLocaleString()}
                        </li>
                      </>
                    )}
                    {type === "digital-safety" && (
                      <>
                        <li>
                          <span className="font-semibold text-pink-700">Rezultat:</span> {result.score ?? "-"}
                        </li>
                        <li>
                          <span className="font-semibold text-pink-700">Pravilnih odgovorov:</span>{" "}
                          {result.correctAnswers ?? result.score ?? "-"}
                        </li>
                        <li>
                          <span className="font-semibold text-pink-700">Vseh vprašanj:</span> {result.totalQuestions ?? "-"}
                        </li>
                        <li>
                          <span className="font-semibold text-pink-700">Točke:</span> {result.points ?? "-"}
                        </li>
                        <li>
                          <span className="font-semibold text-pink-700">Datum:</span> {new Date(result.timestamp).toLocaleString()}
                        </li>
                      </>
                    )}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-center mt-6 font-semibold">Ni še rezultata.</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
