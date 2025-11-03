"use client";

import { useAuth } from "@/context/AuthContext";
import { ChartDataPoint, ErrorType, QuoteLengthType } from "@/types";
import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { User } from "@/types";

const QUOTES: Record<QuoteLengthType, string[]> = {
  short: [
    "Vaja dela mojstra.",
    "Čas beži kot puščica.",
    "Znanje je moč.",
    "Delo krepi človeka.",
    "Po dežju posije sonce.",
  ],
  medium: [
    "Uspeh ni končen in neuspeh ni usoden; šteje pogum, da nadaljuješ.",
    "Vsaka težava skriva priložnost, da postaneš močnejši in modrejši.",
    "Sanje se ne uresničijo same od sebe, uresničijo se, ko vztrajaš.",
    "Največje zmage se rodijo iz največjih preizkušenj.",
  ],
  long: [
    "Ni pomembno, kolikokrat padeš, ampak kolikrat vstaneš. Življenje ni vedno lahko, a vsak padec te nauči nekaj novega o sebi in svetu okoli tebe.",
    "Pravi pogum ni odsotnost strahu, temveč odločitev, da kljub strahu nadaljuješ naprej. Ko slediš srcu, te pot vedno pripelje tja, kjer moraš biti.",
    "Sreča ni cilj, ampak način življenja. Najdeš jo v drobnih trenutkih, v toplih nasmehih in v hvaležnosti za to, kar že imaš.",
  ],
};

export default function Page() {
  const { user } = useAuth();

  // --- Fingerprint logic ---
  const [fingerprint, setFingerprint] = useState<string>("");

  useEffect(() => {
    let fp = localStorage.getItem("fingerprint");
    if (!fp) {
      fp = Math.random().toString(36).substring(2) + Date.now();
      localStorage.setItem("fingerprint", fp);
    }
    setFingerprint(fp);
  }, []);
  // --- End fingerprint logic ---

  const [quoteLength, setQuoteLength] = useState<QuoteLengthType>("medium");
  const [stopOnError, setStopOnError] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errors, setErrors] = useState<ErrorType[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadNewQuote();
  }, []);

  const loadNewQuote = () => {
    const quotes = QUOTES[quoteLength];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setErrors([]);
    setIsComplete(false);
    setChartData([]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleQuoteLengthChange = (length: QuoteLengthType) => {
    setQuoteLength(length);
    const quotes = QUOTES[length];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setErrors([]);
    setIsComplete(false);
    setChartData([]);
  };

  const calculateStats = () => {
    if (!startTime || !endTime) return null;
    const timeInSeconds = (endTime - startTime) / 1000;
    const timeInMinutes = timeInSeconds / 60;
    const words = currentQuote.split(" ").length;
    const characters = currentQuote.length;

    const wpm = Math.round(words / timeInMinutes);
    const cpm = Math.round(characters / timeInMinutes);
    const accuracy = Math.round(
      ((characters - errors.length) / characters) * 100
    );

    return { wpm, cpm, accuracy, timeInSeconds: timeInSeconds.toFixed(2) };
  };

  const calculatePoints = (wpm: number, accuracy: number, time: number) => {
    // A simple balanced scoring formula — you can adjust weights as desired
    const base = wpm * (accuracy / 100);
    const timeBonus = Math.max(0, 100 - time / 2);
    return Math.round(base + timeBonus);
  };

  const updateChartData = (currentInput: string) => {
    if (!startTime) return;
    const currentTime = Date.now();
    const timeInSeconds = (currentTime - startTime) / 1000;
    const timeInMinutes = timeInSeconds / 60;
    const wordsTyped = currentInput.trim().split(" ").filter(Boolean).length;
    const wpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;
    const currentErrors = errors.length;
    const accuracy =
      currentInput.length > 0
        ? Math.round(
            ((currentInput.length - currentErrors) / currentInput.length) * 100
          )
        : 100;

    setChartData((prev) => [
      ...prev,
      { time: Math.round(timeInSeconds), wpm, accuracy },
    ]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (!startTime && input.length === 1 && input[0] === currentQuote[0]) {
      setStartTime(Date.now());
    }

    if (stopOnError && input.length > 0) {
      const lastChar = input[input.length - 1];
      const expectedChar = currentQuote[input.length - 1];
      if (lastChar !== expectedChar) return;
    }

    if (input.length > userInput.length) {
      const i = input.length - 1;
      if (input[i] !== currentQuote[i]) {
        setErrors((prev) => [
          ...prev,
          { index: i, expected: currentQuote[i], typed: input[i] },
        ]);
      }
    }

    setUserInput(input);

    if (
      startTime &&
      Math.floor((Date.now() - startTime) / 1000) > chartData.length
    )
      updateChartData(input);

    if (input.length === currentQuote.length && input === currentQuote) {
      const end = Date.now();
      setEndTime(end);
      setIsComplete(true);
      updateChartData(input);
    }
  };

  // Save results when typing test completes
  useEffect(() => {
    const saveResults = async () => {
      if (!isComplete) return;
      const stats = calculateStats();
      if (!stats) return;

      if (!fingerprint) {
        console.log("No fingerprint — skipping save");
        return;
      }

      const { wpm, cpm, accuracy, timeInSeconds } = stats;
      const points = calculatePoints(wpm, accuracy, parseFloat(timeInSeconds));

      // Universal challenge payload
      const payload = {
        fingerprint,
        type: "keyboard",
        wpm,
        cpm,
        accuracy,
        time: parseFloat(timeInSeconds),
        points,
        errors: errors.length,
        quoteLength,
        timestamp: new Date().toISOString(),
      };

      try {
        setIsSaving(true);
        // Universal challenge endpoint
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (user && user.jwt) {
          headers["Authorization"] = `Bearer ${user.jwt}`;
        }

        const res = await fetch("http://localhost:5000/api/universal-challenges", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to save challenge");

        const data = await res.json();

        alert(data.message);
      } catch (err) {
        console.error("Error saving challenge:", err);
      } finally {
        setIsSaving(false);
      }
    };

    saveResults();
  }, [isComplete]);

  const getCharClass = (index: number) => {
    if (index >= userInput.length) return "text-gray-400";
    if (userInput[index] === currentQuote[index]) return "text-green-600";
    return "text-pink-600 bg-pink-100";
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white/80 border-4 border-yellow-200 rounded-3xl shadow-xl p-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-yellow-600 drop-shadow">
          Hitrost Tipkanja
        </h1>

        {!isComplete && (
          <>
            {/* Settings */}
            <div className="mb-6 flex flex-wrap gap-4 justify-center items-center bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 shadow-inner">
              <div className="flex items-center gap-2">
                <label className="text-blue-800 font-semibold">
                  Dolžina besedila:
                </label>
                <select
                  value={quoteLength}
                  onChange={(e) =>
                    handleQuoteLengthChange(e.target.value as QuoteLengthType)
                  }
                  className="bg-white border-2 border-yellow-300 rounded-lg px-3 py-1 focus:outline-none focus:border-yellow-500 font-semibold text-yellow-800"
                >
                  <option value="short">Kratko</option>
                  <option value="medium">Srednje</option>
                  <option value="long">Dolgo</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stopOnError"
                  checked={stopOnError}
                  onChange={(e) => setStopOnError(e.target.checked)}
                  className="w-5 h-5 accent-pink-400"
                />
                <label
                  htmlFor="stopOnError"
                  className="text-pink-600 font-semibold"
                >
                  Ustavi ob napaki
                </label>
              </div>
            </div>

            {/* Quote Display */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 mb-6 min-h-[200px] flex items-center shadow-inner">
              <p className="text-2xl leading-relaxed font-mono text-blue-900 text-center">
                {currentQuote.split("").map((char, index) => (
                  <span key={index} className={getCharClass(index)}>
                    {char}
                  </span>
                ))}
              </p>
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="w-full bg-white border-2 border-yellow-300 rounded-xl p-4 text-xl font-mono text-blue-900 focus:outline-none focus:border-yellow-500 shadow"
              placeholder="Začni tipkati..."
              disabled={isComplete}
              autoFocus
            />

            {/* Timer */}
            {startTime && !endTime && (
              <div className="text-center mt-4 text-yellow-700 font-semibold">
                ⏱ Čas: {((Date.now() - startTime) / 1000).toFixed(1)} s
              </div>
            )}
          </>
        )}

        {/* Results */}
        {isComplete && stats && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-8 shadow-inner">
              <h2 className="text-3xl font-bold text-center mb-6 text-yellow-600">
                Rezultati
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.wpm}
                  </div>
                  <div className="text-sm text-green-700 font-semibold">
                    WPM
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.cpm}
                  </div>
                  <div className="text-sm text-blue-700 font-semibold">CPM</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {stats.accuracy}%
                  </div>
                  <div className="text-sm text-yellow-700 font-semibold">
                    Natančnost
                  </div>
                </div>
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-pink-600">
                    {errors.length}
                  </div>
                  <div className="text-sm text-pink-700 font-semibold">
                    Napake
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {calculatePoints(
                      stats.wpm,
                      stats.accuracy,
                      parseFloat(stats.timeInSeconds)
                    )}
                  </div>
                  <div className="text-sm text-purple-700 font-semibold">
                    Točke
                  </div>
                </div>
              </div>
              {/* Chart */}
              <div className="bg-white border border-yellow-200 rounded-2xl p-4 mb-6">
                <h3 className="text-xl font-bold mb-4 text-center text-yellow-700">
                  Napredek skozi čas
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#facc15"
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="time"
                      stroke="#78350f"
                      label={{
                        value: "Čas (s)",
                        position: "insideBottom",
                        offset: -5,
                        fill: "#78350f",
                      }}
                    />
                    <YAxis stroke="#78350f" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff8dc",
                        border: "1px solid #facc15",
                        borderRadius: "0.5rem",
                      }}
                      labelStyle={{ color: "#78350f" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="wpm"
                      stroke="#22c55e"
                      name="WPM"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#f59e0b"
                      name="Natančnost %"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {isSaving && (
                <p className="text-center text-sm text-yellow-600 font-semibold animate-pulse">
                  💾 Shranjevanje rezultatov...
                </p>
              )}
              <button
                onClick={loadNewQuote}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-105 mt-6"
              >
                🔄 Nov citat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
