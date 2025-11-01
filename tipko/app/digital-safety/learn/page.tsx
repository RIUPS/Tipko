"use client";

import { useState } from "react";

const lessons = [
  {
    title: "1. Močno geslo",
    content: (
      <>
        <b>Uporabi dolgo in zapleteno geslo!</b><br />
        Geslo naj ima črke, številke in posebne znake.<br />
        <span className="text-blue-700">Primer:</span> <span className="bg-blue-100 px-2 rounded">Muca123!</span><br />
        <b>Ne povej gesla nikomur, razen staršem ali učitelju.</b>
      </>
    ),
  },
  {
    title: "2. Ne deli osebnih podatkov",
    content: (
      <>
        <b>Ne piši svojega pravega imena, naslova, šole ali telefonske številke na spletu.</b><br />
        <span className="text-blue-700">Primer:</span> Namesto <i>“Sem Ana Novak iz OŠ Sonček”</i> napiši le <i>“Sem Ana”</i> ali uporabi vzdevek.
      </>
    ),
  },
  {
    title: "3. Prepoznaj lažne spletne strani",
    content: (
      <>
        <b>Pazi na spletne strani, ki izgledajo čudno ali imajo veliko reklam.</b><br />
        <span className="text-blue-700">Primer:</span> Prava stran ima naslov <i>https://www.nasa-sola.si</i>, lažna pa lahko izgleda kot <i>http://nasa-sola.xyz</i>.<br />
        Če nisi prepričan, vprašaj odraslega!
      </>
    ),
  },
  {
    title: "4. Pazi na spletne prevare",
    content: (
      <>
        <b>Če ti nekdo obljublja nagrado ali denar, bodi previden!</b><br />
        <span className="text-blue-700">Primer:</span> “Zadel si nov telefon! Klikni tukaj!”<br />
        <b>Ne klikaj na sumljive povezave.</b>
      </>
    ),
  },
  {
    title: "5. Vedno vprašaj pred prenosom",
    content: (
      <>
        <b>Preden preneseš igro ali aplikacijo, vprašaj starše ali učitelja.</b><br />
        <span className="text-blue-700">Primer:</span> “Mami, ali lahko prenesem to igro?”<br />
        Nekatere datoteke lahko vsebujejo viruse!
      </>
    ),
  },
  {
    title: "6. Bodi prijazen na spletu",
    content: (
      <>
        <b>Piši prijazna sporočila in pomagaj drugim.</b><br />
        <span className="text-blue-700">Primer:</span> “Super ti gre!” ali “Če potrebuješ pomoč, mi povej.”<br />
        <b>Nikoli ne piši žaljivk ali grdih besed.</b>
      </>
    ),
  },
  {
    title: "7. Povej odraslemu",
    content: (
      <>
        <b>Če vidiš kaj čudnega, strašljivega ali žaljivega, takoj povej odraslemu.</b><br />
        <span className="text-blue-700">Primer:</span> “Očka, nekdo mi je pisal čudno sporočilo.”<br />
        Odrasli ti bodo pomagali!
      </>
    ),
  },
  {
    title: "8. Ne srečuj se z neznanci",
    content: (
      <>
        <b>Nikoli se ne dogovori za srečanje z nekom, ki ga poznaš samo prek interneta.</b><br />
        <span className="text-blue-700">Primer:</span> Če te nekdo povabi na sladoled, vedno vprašaj starše!
      </>
    ),
  },
  {
    title: "9. Posodabljaj naprave",
    content: (
      <>
        <b>Redno posodabljaj računalnik, tablico ali telefon.</b><br />
        <span className="text-blue-700">Primer:</span> “Ati, računalnik želi posodobitev. Lahko kliknem?”<br />
        Posodobitve pomagajo, da je naprava varna.
      </>
    ),
  },
  {
    title: "10. Odjavi se, ko končaš",
    content: (
      <>
        <b>Ko končaš z uporabo spletne strani ali aplikacije, se odjavi.</b><br />
        <span className="text-blue-700">Primer:</span> Po koncu igre klikni “Odjava” ali “Logout”.<br />
        Še posebej na šolskih ali javnih računalnikih!
      </>
    ),
  },
  {
    title: "11. Ne verjemi vsemu na spletu",
    content: (
      <>
        <b>Na spletu ni vse res.</b><br />
        <span className="text-blue-700">Primer:</span> Če prebereš, da “psi lahko letijo”, vprašaj odraslega ali preveri v knjigi.<br />
        Vedno preveri informacije!
      </>
    ),
  },
  {
    title: "12. Varuj svoje slike",
    content: (
      <>
        <b>Ne deli svojih fotografij ali videov z neznanci.</b><br />
        <span className="text-blue-700">Primer:</span> Preden pošlješ sliko, vprašaj starše: “Ali lahko to pošljem?”<br />
        Svoje slike deli le z družino in prijatelji, ki jih poznaš.
      </>
    ),
  },
  {
    title: "13. Uporabljaj varne spletne strani",
    content: (
      <>
        <b>Uporabljaj strani, ki jih priporoča šola ali starši.</b><br />
        <span className="text-blue-700">Primer:</span> Naslov naj se začne s <span className="bg-blue-100 px-2 rounded">https://</span>.<br />
        To pomeni, da je stran bolj varna.
      </>
    ),
  },
  {
    title: "14. Ne odgovarjaj na neznana sporočila",
    content: (
      <>
        <b>Če dobiš sporočilo od neznanca, nanj ne odgovarjaj.</b><br />
        <span className="text-blue-700">Primer:</span> “Živjo, kdo si?” – takega sporočila ne odpiraj in ga pokaži odraslemu.
      </>
    ),
  },
  {
    title: "15. Uporabljaj vzdevke",
    content: (
      <>
        <b>Na spletu uporabljaj vzdevek, ne svojega pravega imena.</b><br />
        <span className="text-blue-700">Primer:</span> Namesto “MihaKovač” uporabi “SuperMiha” ali “ZabavniLevček”.
      </>
    ),
  },
  {
    title: "16. Ne deli gesel s prijatelji",
    content: (
      <>
        <b>Geslo je samo tvoje!</b><br />
        <span className="text-blue-700">Primer:</span> Tudi če te prijatelj prosi za geslo do igre, mu ga ne povej.
      </>
    ),
  },
  {
    title: "17. Ne igraj se predolgo",
    content: (
      <>
        <b>Pomembno je, da imaš čas tudi za igro zunaj in druženje v živo.</b><br />
        <span className="text-blue-700">Primer:</span> Po eni uri računalnika pojdi na zrak ali se igraj s prijatelji.
      </>
    ),
  },
  {
    title: "18. Ne klikaj na vse reklame",
    content: (
      <>
        <b>Veliko reklam te želi prepričati, da nekaj kupiš ali preneseš.</b><br />
        <span className="text-blue-700">Primer:</span> “Klikni tukaj in dobiš nagrado!” – take reklame ignoriraj.
      </>
    ),
  },
  {
    title: "19. Uporabljaj varnostne nastavitve",
    content: (
      <>
        <b>Vprašaj odrasle, naj ti pomagajo nastaviti varnostne nastavitve na računalniku ali telefonu.</b><br />
        <span className="text-blue-700">Primer:</span> Skupaj nastavita otroški način ali omejitve za aplikacije.
      </>
    ),
  },
  {
    title: "20. Vedno vprašaj, če nisi prepričan",
    content: (
      <>
        <b>Če ne veš, kaj narediti na spletu, vedno vprašaj odraslega.</b><br />
        <span className="text-blue-700">Primer:</span> “Mami, ali je ta stran varna?”<br />
        Bolje vprašati kot narediti napako!
      </>
    ),
  },
];

export default function DigitalSafetyLearnPage() {
  const [current, setCurrent] = useState(0);

  function nextLesson() {
    if (current < lessons.length - 1) setCurrent(current + 1);
  }

  function prevLesson() {
    if (current > 0) setCurrent(current - 1);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-pink-50 to-yellow-100 py-8">
      <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-xl px-6 py-10 border-4 border-blue-200 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Lekcije o spletni varnosti
        </h1>
        <div className="w-full flex flex-col items-center">
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-xl shadow p-6 w-full mb-4 min-h-[180px] flex flex-col justify-center text-lg">
            <h2 className="text-xl font-bold text-blue-800 mb-2">{lessons[current].title}</h2>
            <div className="text-blue-900">{lessons[current].content}</div>
          </div>
          <div className="flex gap-4 mt-2">
            <button
              onClick={prevLesson}
              disabled={current === 0}
              className={`px-6 py-2 rounded-full font-bold shadow transition ${
                current === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-300 text-blue-900 hover:bg-blue-400"
              }`}
            >
              Nazaj
            </button>
            <button
              onClick={nextLesson}
              disabled={current === lessons.length - 1}
              className={`px-6 py-2 rounded-full font-bold shadow transition ${
                current === lessons.length - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-pink-300 text-pink-900 hover:bg-pink-400"
              }`}
            >
              Naprej
            </button>
          </div>
          <div className="mt-4 text-blue-700 font-semibold">
            Lekcija {current + 1} od {lessons.length}
          </div>
        </div>
        <div className="mt-8 text-center">
          <a
            href="/digital-safety/challenge"
            className="inline-block bg-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-pink-600 transition"
          >
            Preizkusi znanje v kvizu!
          </a>
        </div>
      </div>
    </main>
  );
}