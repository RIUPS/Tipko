"use client";
import CharacterDisplay from "@/app/components/character-display";
import CharacterInput from "@/app/components/character-input";
import { CharacterState } from "@/types";
import { useState, useEffect, useRef } from "react";

const KEYBOARD_CHARS = "abcčdefghijklmnoprsštuvzž";
const KEYBOARD_NUMBERS = "1234567890";

const Page = () => {
  const [characters, setCharacters] = useState<CharacterState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(5);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateCharacters(characterCount);
  }, [characterCount, includeNumbers]);

  const generateCharacters = (length: number = characterCount) => {
    const newChars = Array.from({ length }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      char: includeNumbers
        ? KEYBOARD_CHARS.split("").join(KEYBOARD_NUMBERS)[
            Math.floor(
              Math.random() * KEYBOARD_CHARS.length + KEYBOARD_NUMBERS.length
            )
          ]
        : KEYBOARD_CHARS[Math.floor(Math.random() * KEYBOARD_CHARS.length)],
      status: "pending" as const,
    }));
    setCharacters(newChars);
    setCurrentIndex(0);
    inputRef.current?.focus();
  };

  const handleKeyPress = (key: string) => {
    if (currentIndex >= characters.length) return;

    const currentChar = characters[currentIndex];
    if (key.toLowerCase() === currentChar.char.toLowerCase()) {
      // Correct input
      setCharacters((prev) =>
        prev.map((c, i) =>
          i === currentIndex ? { ...c, status: "correct" } : c
        )
      );

      // Remove the character after animation
      setTimeout(() => {
        setCharacters((prev) => prev.filter((_, i) => i !== currentIndex));

        // Check if all characters are done
        if (currentIndex === characters.length - 1) {
          setTimeout(generateCharacters, 400);
        }
      }, 400);
    } else {
      // Wrong input
      setCharacters((prev) =>
        prev.map((c, i) => (i === currentIndex ? { ...c, status: "wrong" } : c))
      );

      // Reset status after animation
      setTimeout(() => {
        setCharacters((prev) =>
          prev.map((c, i) =>
            i === currentIndex ? { ...c, status: "pending" } : c
          )
        );
      }, 400);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-full max-w-2xl bg-white/80 border-4 border-yellow-200 rounded-3xl shadow-xl p-8 mx-auto mt-8 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-600 drop-shadow mb-4">
        Učenje tipkanja
      </h1>
      <p className="text-lg sm:text-xl text-blue-900 font-semibold mb-6">
        Klikni pravilno tipko, prikazano spodaj 👇
      </p>

      {/* Character Display */}
      <CharacterDisplay
        characters={characters}
        currentIndex={currentIndex}
        onClick={() => inputRef.current?.focus()}
      />

      {/* Character Input */}
      <CharacterInput onKeyPress={handleKeyPress} inputRef={inputRef} />

      {/* Settings and Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl px-6 py-4 shadow-inner w-full">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeNumbers"
            className="mr-2 w-5 h-5 accent-yellow-500"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
          />
          <label
            htmlFor="includeNumbers"
            className="font-semibold text-yellow-800"
          >
            Vključi številke
          </label>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="characterCount"
            className="font-semibold text-yellow-800"
          >
            Dolžina niza:
          </label>
          <input
            id="characterCount"
            type="number"
            min={1}
            max={9}
            value={characterCount}
            onChange={(e) => setCharacterCount(Number(e.target.value))}
            className="p-2 rounded-lg border-2 border-yellow-300 w-20 text-center text-yellow-700 font-bold focus:outline-none focus:border-yellow-500"
          />
        </div>

        <button
          onClick={() => generateCharacters(characterCount)}
          className="bg-yellow-300 hover:bg-yellow-400 text-yellow-900 font-bold px-6 py-2 rounded-full shadow-lg border-2 border-yellow-400 transition-transform hover:scale-105"
        >
          🔄 Novi znaki
        </button>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-300 p-4 rounded-lg mt-6 text-blue-800 font-semibold shadow">
        💡 <strong>Nasvet:</strong> Vadba dela mojstra — poskusi brez napak!
      </div>
    </main>
  );
};

export default Page;
