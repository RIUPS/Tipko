"use client";

import { useState, useEffect } from "react";

const questions = [
  {
    question: "Kaj je dober primer močnega gesla?",
    options: ["123456", "ime123", "Muca123!", "geslo"],
    answer: 2,
  },
  {
    question: "Kaj NIKOLI ne deliš na spletu?",
    options: [
      "Najljubšo barvo",
      "Ime šole in naslov",
      "Najljubšo žival",
      "Najljubšo risanko",
    ],
    answer: 1,
  },
  {
    question: "Kaj narediš, če dobiš čudno sporočilo od neznanca?",
    options: [
      "Odgovoriš in se predstaviš",
      "Pokažeš odraslemu",
      "Pošlješ svojo sliko",
      "Ignoriraš in pozabiš",
    ],
    answer: 1,
  },
  {
    question: "Kako prepoznaš varno spletno stran?",
    options: [
      "Ima veliko reklam",
      "Začne se z http://",
      "Začne se z https://",
      "Ima pisane slike",
    ],
    answer: 2,
  },
  {
    question: "Kaj narediš, preden preneseš novo igro?",
    options: [
      "Takoj preneseš",
      "Vprašaš odraslega",
      "Klikneš na vse reklame",
      "Preneseš iz neznane strani",
    ],
    answer: 1,
  },
  {
    question: "Kaj pomeni biti prijazen na spletu?",
    options: [
      "Pišeš grde besede",
      "Pomagaš in pohvališ druge",
      "Se norčuješ iz drugih",
      "Ignoriraš vse",
    ],
    answer: 1,
  },
  {
    question: "Kaj narediš, ko končaš z uporabo računalnika v šoli?",
    options: [
      "Pustiš vse odprto",
      "Odjaviš se iz računa",
      "Pobrišeš vse datoteke",
      "Ugasneš monitor",
    ],
    answer: 1,
  },
  {
    question: "Kaj narediš, če nisi prepričan, ali je nekaj na spletu res?",
    options: [
      "Verjameš vsemu",
      "Vprašaš odraslega",
      "Deliš naprej",
      "Ignoriraš",
    ],
    answer: 1,
  },
  {
    question: "Kdo ti lahko pomaga nastaviti varnostne nastavitve?",
    options: [
      "Prijatelj iz igre",
      "Neznanec na spletu",
      "Odrasla oseba (starši, učitelj)",
      "Nihče",
    ],
    answer: 2,
  },
  {
    question: "Kaj je najbolj varen vzdevek za uporabo na spletu?",
    options: [
      "Tvoje pravo ime in priimek",
      "SuperLevček",
      "Tvoj naslov",
      "Tvoja telefonska številka",
    ],
    answer: 1,
  },
];

export default function DigitalSafetyQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [saved, setSaved] = useState<null | "success" | "error" | "not-improved">(null);
  const [user, setUser] = useState<string>("");
  const [previousScore, setPreviousScore] = useState<number | null>(null);

  // Pridobi ali ustvari fingerprint in prejšnji rezultat
  useEffect(() => {
    let fingerprint = localStorage.getItem("fingerprint");
    if (!fingerprint) {
      fingerprint = Math.random().toString(36).substring(2) + Date.now();
      localStorage.setItem("fingerprint", fingerprint);
    }
    setUser(fingerprint);

    // Pridobi prejšnji rezultat iz baze
    fetch(`http://localhost:5000/api/web-safety/results?user=${fingerprint}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPreviousScore(data[0].score);
        }
      })
      .catch(() => {});
  }, []);

  // Shrani ali posodobi rezultat samo če je boljši
  async function saveResult() {
    try {
      // Pridobi prejšnji rezultat še enkrat za vsak slučaj (če je vmes kdo rešil še enkrat)
      const resPrev = await fetch(
        `http://localhost:5000/api/web-safety/results?user=${user}`
      );
      const prevData = await resPrev.json();
      const prevScore = Array.isArray(prevData) && prevData.length > 0 ? prevData[0].score : null;

      if (prevScore === null || score > prevScore) {
        // Če ni prejšnjega ali je rezultat boljši, pošlji PATCH (ali POST če prvič)
        const method = prevScore === null ? "POST" : "PATCH";
        const url =
          prevScore === null
            ? "http://localhost:5000/api/web-safety/results"
            : `http://localhost:5000/api/web-safety/results/${user}`;
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user,
            score,
            totalQuestions: questions.length,
            date: new Date(),
          }),
        });
        if (res.ok) setSaved("success");
        else setSaved("error");
      } else {
        setSaved("not-improved");
      }
    } catch {
      setSaved("error");
    }
  }

  function handleAnswer(idx: number) {
    setSelected(idx);
    setTimeout(() => {
      if (idx === questions[current].answer) {
        setScore((prev) => prev + 1);
      }
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent((prev) => prev + 1);
      } else {
        setShowResult(true);
        saveResult();
      }
    }, 800);
  }

  function handleRestart() {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setSaved(null);
  }

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-8 text-center">
        Kviz iz spletne varnsoti
      </h1>
      {previousScore !== null && !showResult && (
        <div className="mb-6 text-blue-800 font-semibold text-center">
          Tvoj najboljši rezultat do sedaj: {previousScore} / {questions.length}
        </div>
      )}
      {!showResult ? (
        <div className="bg-white/95 rounded-3xl shadow-xl px-6 py-10 border-4 border-blue-200 flex flex-col items-center">
          <div className="text-lg font-bold text-blue-900 mb-6 text-center">
            {questions[current].question}
          </div>
          <div className="grid grid-cols-1 gap-4 w-full">
            {questions[current].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selected !== null}
                className={`w-full py-4 rounded-xl font-semibold border-2 transition text-lg
                  ${
                    selected === null
                      ? "bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200"
                      : idx === questions[current].answer
                      ? "bg-green-200 border-green-500 text-green-900"
                      : selected === idx
                      ? "bg-red-200 border-red-500 text-red-900"
                      : "bg-blue-100 border-blue-300 text-blue-900"
                  }
                `}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-6 text-blue-700 font-semibold">
            Vprašanje {current + 1} od {questions.length}
          </div>
        </div>
      ) : (
        <div className="bg-white/95 rounded-3xl shadow-xl px-6 py-10 border-4 border-blue-200 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Tvoj rezultat: {score} / {questions.length}
          </h2>
          <p className="mb-6 text-blue-900 text-lg">
            {score === questions.length
              ? "Odlično! Pravi spletni varnostni mojster!"
              : score >= 7
              ? "Super! Zelo dobro poznaš spletno varnost."
              : score >= 4
              ? "Dobro! Še malo vaje in boš pravi mojster."
              : "Poskusi še enkrat in se nauči še več o varnosti na spletu!"}
          </p>
          {saved === "success" && (
            <div className="mb-4 text-green-700 font-semibold">
              Rezultat je bil uspešno shranjen!
            </div>
          )}
          {saved === "not-improved" && (
            <div className="mb-4 text-yellow-700 font-semibold">
              Rezultat ni bil shranjen, ker ni boljši od tvojega najboljšega!
            </div>
          )}
          {saved === "error" && (
            <div className="mb-4 text-red-700 font-semibold">
              Napaka pri shranjevanju rezultata.
            </div>
          )}
          <button
            onClick={handleRestart}
            className="bg-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-pink-600 transition"
          >
            Reši še enkrat
          </button>
          <button>
            <a
              href="/digital-safety/learn"
              className="mt-4 inline-block bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition"
            >
              Nauči se več o spletni varnosti
            </a>
          </button>
          <button>
            <a
              href="/"
              className="mt-4 inline-block bg-blue-300 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-400 transition"
            >
              Nazaj domov
            </a>
          </button>
        </div>
      )}
    </main>
  );
}
