import { FaMouse, FaKeyboard, FaShieldAlt } from "react-icons/fa";
import Image from "next/image";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-pink-50 to-yellow-100 py-8">
      <main className="flex flex-col items-center gap-8 w-full max-w-2xl bg-white/80 rounded-3xl shadow-xl px-6 py-10 border-4 border-yellow-200">
        <Image
          src="/assets/kids/kid-using-computer.png"
          alt="Otroci uporabljajo računalnik"
          width={250}
          height={180}
          className="mb-2"
          priority
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-500 text-center drop-shadow-lg">
          Dobrodošel na{" "}
          <span className="text-blue-600">Tipko &amp; Miška!</span>
        </h1>
        <p className="text-lg sm:text-xl text-blue-900 text-center font-semibold">
          Postani računalniški mojster! Nauči se uporabljati{" "}
          <span className="text-pink-600">miško</span>,{" "}
          <span className="text-yellow-600">tipkovnico</span> in poskrbi za
          svojo <span className="text-green-600">varnost na spletu</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <a
            href="/mouse"
            className="flex-1 flex flex-col items-center bg-blue-50 rounded-2xl p-4 shadow hover:scale-105 transition"
          >
            <FaMouse className="text-4xl text-blue-400 mb-2" />
            <span className="font-bold text-blue-700 mb-1">Miška</span>
            <span className="text-blue-700 text-sm text-center">
              Nauči se klikati, premikati in uporabljati kolešček.
            </span>
          </a>
          <a
            href="/keyboard"
            className="flex-1 flex flex-col items-center bg-yellow-50 rounded-2xl p-4 shadow hover:scale-105 transition"
          >
            <FaKeyboard className="text-4xl text-yellow-400 mb-2" />
            <span className="font-bold text-yellow-700 mb-1">Tipkovnica</span>
            <span className="text-yellow-700 text-sm text-center">
              Spoznaj črke, številke in posebne tipke.
            </span>
          </a>
          <a
            href="/security"
            className="flex-1 flex flex-col items-center bg-green-50 rounded-2xl p-4 shadow hover:scale-105 transition"
          >
            <FaShieldAlt className="text-4xl text-green-400 mb-2" />
            <span className="font-bold text-green-700 mb-1">Varnost</span>
            <span className="text-green-700 text-sm text-center">
              Izveš, kako varno uporabljaš računalnik in internet.
            </span>
          </a>
        </div>
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg mt-2 text-yellow-800 font-semibold shadow">
          <FaShieldAlt className="inline mr-2 text-yellow-500" />
          <strong>Nasvet:</strong> Nikoli ne deli svojih osebnih podatkov (ime,
          naslov, geslo) z neznanci na spletu!
        </div>
        <div className="flex gap-6 mt-6 flex-col sm:flex-row w-full justify-center">
          <a
            className="rounded-full shadow-lg border-2 border-blue-300 transition-colors flex items-center justify-center bg-blue-400 text-white gap-2 hover:bg-blue-500 font-bold text-lg h-14 px-8"
            href="/mouse"
          >
            <FaMouse className="text-2xl" />
            Začni z miško
          </a>
          <a
            className="rounded-full shadow-lg border-2 border-yellow-300 transition-colors flex items-center justify-center bg-yellow-300 text-yellow-900 gap-2 hover:bg-yellow-400 font-bold text-lg h-14 px-8"
            href="/keyboard"
          >
            <FaKeyboard className="text-2xl" />
            Začni s tipkovnico
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
