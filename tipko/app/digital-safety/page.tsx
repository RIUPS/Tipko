"use client";

import { FaBook, FaQuestionCircle } from "react-icons/fa";
import Image from "next/image";

export default function DigitalSafetyHome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-pink-50 to-yellow-100 py-8">
      <main className="flex flex-col items-center gap-8 w-full max-w-2xl bg-white/80 rounded-3xl shadow-xl px-6 py-10 border-4 border-blue-200">
        <Image
          src="/assets/kids/kid-using-computer.png"
          alt="Otrok varno uporablja računalnik"
          width={250}
          height={180}
          className="mb-2"
          priority
        />

        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600 text-center drop-shadow-lg">
          <span className="text-pink-500">Spletna varnost</span> – Uči se in igraj!
        </h1>

        <p className="text-lg sm:text-xl text-blue-900 text-center font-semibold">
          Spoznaj, kako biti varen na spletu in preveri svoje znanje v zabavnem kvizu!
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center mt-4">
          {/* Gumb za učenje */}
          <a
            href="/digital-safety/learn"
            className="flex-1 flex flex-col items-center justify-center bg-blue-50 rounded-2xl p-6 shadow-lg border-2 border-blue-300 hover:scale-105 transition"
          >
            <FaBook className="text-5xl text-blue-500 mb-3" />
            <span className="text-2xl font-bold text-blue-700 mb-1">
              Učenje
            </span>
            <span className="text-blue-700 text-center text-sm">
              Preberi nasvete in priporočila za varno uporabo računalnika in interneta.
            </span>
          </a>

          {/* Gumb za kviz */}
          <a
            href="/digital-safety/challenge"
            className="flex-1 flex flex-col items-center justify-center bg-pink-50 rounded-2xl p-6 shadow-lg border-2 border-pink-300 hover:scale-105 transition"
          >
            <FaQuestionCircle className="text-5xl text-pink-500 mb-3" />
            <span className="text-2xl font-bold text-pink-700 mb-1">Kviz</span>
            <span className="text-pink-700 text-center text-sm">
              Preizkusi svoje znanje o spletni varnosti v zabavnem kvizu!
            </span>
          </a>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-400 p-4 rounded-lg mt-6 text-blue-800 font-semibold shadow">
          💡 <strong>Nasvet:</strong> Če nisi prepričan na spletu, vedno vprašaj odraslo osebo!
        </div>
      </main>
    </div>
  );
}