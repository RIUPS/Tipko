"use client";

import { FaMousePointer, FaGamepad } from "react-icons/fa";
import Image from "next/image";
import Footer from "../components/footer";

export default function MouseHome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-blue-100 py-8">
      <main className="flex flex-col items-center gap-8 w-full max-w-2xl bg-white/80 rounded-3xl shadow-xl px-6 py-10 border-4 border-pink-200">
        <Image
          src="/assets/kids/kid-using-computer.png"
          alt="Otrok uporablja miško"
          width={250}
          height={180}
          className="mb-2"
          priority
        />

        <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-600 text-center drop-shadow-lg">
          <span className="text-pink-500">Miška</span> – Uči se in igraj!
        </h1>

        <p className="text-lg sm:text-xl text-blue-900 text-center font-semibold">
          Spoznaj računalniško miško in preveri svoje spretnosti v zabavnem izzivu!
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center mt-4">
          {/* Learn button */}
          <a
            href="/mouse/learn"
            className="flex-1 flex flex-col items-center justify-center bg-yellow-50 rounded-2xl p-6 shadow-lg border-2 border-yellow-300 hover:scale-105 transition"
          >
            <FaMousePointer className="text-5xl text-yellow-500 mb-3" />
            <span className="text-2xl font-bold text-yellow-700 mb-1">
              Učenje
            </span>
            <span className="text-yellow-700 text-center text-sm">
              Nauči se osnovnih gibov in klikov z miško.
            </span>
          </a>

          {/* Challenge button */}
          <a
            href="/mouse/challenge"
            className="flex-1 flex flex-col items-center justify-center bg-pink-50 rounded-2xl p-6 shadow-lg border-2 border-pink-300 hover:scale-105 transition"
          >
            <FaGamepad className="text-5xl text-pink-500 mb-3" />
            <span className="text-2xl font-bold text-pink-700 mb-1">Izziv</span>
            <span className="text-pink-700 text-center text-sm">
              Preizkusi hitrost in natančnost premikanja in klikanja!
            </span>
          </a>
        </div>

        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg mt-6 text-yellow-800 font-semibold shadow">
          💡 <strong>Nasvet:</strong> Vadba dela mojstra — vsak dan nekaj novih nalog!
        </div>

        <div className="flex gap-6 mt-8 flex-col sm:flex-row w-full justify-center">
          <a
            href="/mouse/learn"
            className="rounded-full shadow-lg border-2 border-yellow-300 transition-colors flex items-center justify-center bg-yellow-300 text-yellow-900 gap-2 hover:bg-yellow-400 font-bold text-lg h-14 px-8"
          >
            <FaMousePointer className="text-2xl" />
            Začni z učenjem
          </a>
          <a
            href="/mouse/challenge"
            className="rounded-full shadow-lg border-2 border-pink-300 transition-colors flex items-center justify-center bg-pink-300 text-pink-900 gap-2 hover:bg-pink-400 font-bold text-lg h-14 px-8"
          >
            <FaGamepad className="text-2xl" />
            Začni z izzivom
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}