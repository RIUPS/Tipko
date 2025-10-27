"use client";

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

type QuoteLengthType = "short" | "medium" | "long";

interface ErrorType {
  index: number;
  expected: string;
  typed: string;
}

interface ChartDataPoint {
  time: number;
  wpm: number;
  accuracy: number;
}

const QUOTES: Record<QuoteLengthType, string[]> = {
  short: [
    "The quick brown fox jumps over the lazy dog.",
    "Time flies like an arrow.",
    "Practice makes perfect.",
    "Actions speak louder than words.",
    "Knowledge is power.",
  ],
  medium: [
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking.",
    "In the middle of difficulty lies opportunity. Every challenge is a chance to grow stronger.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams and work towards them.",
  ],
  long: [
    "It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better. The credit belongs to the man who is actually in the arena, whose face is marred by dust and sweat and blood.",
    "Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference. The choices we make define who we become and shape our destiny in ways we cannot always predict.",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. Life is a series of challenges and triumphs, and our character is defined by how we respond to adversity.",
  ],
};

export default function Page() {
  const [quoteLength, setQuoteLength] = useState<QuoteLengthType>("medium");
  const [stopOnError, setStopOnError] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errors, setErrors] = useState<ErrorType[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
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

  const updateChartData = (currentInput: string) => {
    if (!startTime) return;

    const currentTime = Date.now();
    const timeInSeconds = (currentTime - startTime) / 1000;
    const timeInMinutes = timeInSeconds / 60;

    const wordsTyped = currentInput
      .trim()
      .split(" ")
      .filter((w: string) => w).length;
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
      {
        time: Math.round(timeInSeconds),
        wpm: wpm,
        accuracy: accuracy,
      },
    ]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Start timer on first correct keystroke
    if (!startTime && input.length === 1 && input[0] === currentQuote[0]) {
      setStartTime(Date.now());
    }

    // If timer hasn't started yet (first char was wrong), don't process
    if (!startTime && input.length > 0) {
      if (stopOnError) {
        return; // Don't allow any input until first correct char
      }
    }

    // Stop on error mode - prevent typing if current character is wrong
    if (stopOnError && input.length > 0) {
      const lastChar = input[input.length - 1];
      const expectedChar = currentQuote[input.length - 1];

      if (lastChar !== expectedChar) {
        return; // Don't update input
      }
    }

    // Track errors
    if (input.length > userInput.length) {
      const newCharIndex = input.length - 1;
      if (input[newCharIndex] !== currentQuote[newCharIndex]) {
        setErrors((prev) => [
          ...prev,
          {
            index: newCharIndex,
            expected: currentQuote[newCharIndex],
            typed: input[newCharIndex],
          },
        ]);
      }
    }

    setUserInput(input);

    // Update chart data every second
    if (
      startTime &&
      Math.floor((Date.now() - startTime) / 1000) > chartData.length
    ) {
      updateChartData(input);
    }

    // Check if complete
    if (input.length === currentQuote.length && input === currentQuote) {
      setEndTime(Date.now());
      setIsComplete(true);
      updateChartData(input);
    }
  };

  const getCharClass = (index: number) => {
    if (index >= userInput.length) return "text-gray-400";
    if (userInput[index] === currentQuote[index]) return "text-green-500";
    return "text-red-500 bg-red-100";
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-yellow-400">
          Typing Speed Test
        </h1>

        {!isComplete && (
          <>
            {/* Settings */}
            <div className="mb-6 flex flex-wrap gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Quote Length:</label>
                <select
                  value={quoteLength}
                  onChange={(e) =>
                    handleQuoteLengthChange(e.target.value as QuoteLengthType)
                  }
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm focus:outline-none focus:border-yellow-400"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stopOnError"
                  checked={stopOnError}
                  onChange={(e) => setStopOnError(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="stopOnError" className="text-sm text-gray-300">
                  Stop on error
                </label>
              </div>
            </div>

            {/* Quote Display */}
            <div className="bg-gray-800 rounded-lg p-8 mb-6 min-h-[200px] flex items-center">
              <p className="text-2xl leading-relaxed font-mono">
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
              className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-4 text-xl font-mono focus:outline-none focus:border-yellow-400"
              placeholder="Start typing..."
              disabled={isComplete}
              autoFocus
            />

            {/* Timer */}
            {startTime && !endTime && (
              <div className="text-center mt-4 text-gray-400">
                Time: {((Date.now() - startTime) / 1000).toFixed(1)}s
              </div>
            )}
          </>
        )}

        {/* Results */}
        {isComplete && stats && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
                Results
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700 rounded p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {stats.wpm}
                  </div>
                  <div className="text-sm text-gray-300">WPM</div>
                </div>
                <div className="bg-gray-700 rounded p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {stats.cpm}
                  </div>
                  <div className="text-sm text-gray-300">CPM</div>
                </div>
                <div className="bg-gray-700 rounded p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {stats.accuracy}%
                  </div>
                  <div className="text-sm text-gray-300">Accuracy</div>
                </div>
                <div className="bg-gray-700 rounded p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {errors.length}
                  </div>
                  <div className="text-sm text-gray-300">Errors</div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-gray-700 rounded p-4 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Progress Over Time
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="time"
                      stroke="#9CA3AF"
                      label={{
                        value: "Time (seconds)",
                        position: "insideBottom",
                        offset: -5,
                        fill: "#9CA3AF",
                      }}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "0.5rem",
                      }}
                      labelStyle={{ color: "#F3F4F6" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="wpm"
                      stroke="#10B981"
                      name="WPM"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#F59E0B"
                      name="Accuracy %"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Error Details */}
              {errors.length > 0 && (
                <div className="bg-gray-700 rounded p-4 mb-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Errors Made: {errors.length}
                  </h3>
                  <div className="max-h-32 overflow-y-auto text-sm space-y-1">
                    {errors.map((error, idx) => (
                      <div key={idx} className="text-gray-300">
                        Position {error.index + 1}: Expected '
                        <span className="text-green-400">{error.expected}</span>
                        ' but typed '
                        <span className="text-red-400">{error.typed}</span>'
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={loadNewQuote}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                New Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
