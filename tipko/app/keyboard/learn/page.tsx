"use client";
import { useState, useEffect, useRef } from "react";

const KEYBOARD_CHARS = "abcčdefghijklmnoprsštuvzž";
const KEYBOARD_NUMBERS = "1234567890";

interface CharacterState {
  id: string;
  char: string;
  status: "pending" | "correct" | "wrong";
}

const Page = () => {
  const [characters, setCharacters] = useState<CharacterState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(5);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateCharacters(characterCount);
  }, [characterCount, includeNumbers]);

  const generateCharacters = (length: number = 5) => {
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
    <main className="flex flex-col items-center justify-center h-full p-8 bg-gray-700 m-4 rounded-xl max-w-[80%] mx-auto">
      <h1 className="text-3xl font-bold my-4">Učenje tipkanja</h1>
      <p>Kliknite pravilno tipko prikazano spodaj</p>
      <CharacterDisplay
        characters={characters}
        currentIndex={currentIndex}
        onClick={() => inputRef.current?.focus()}
      />
      <CharacterInput onKeyPress={handleKeyPress} inputRef={inputRef} />
      <div className="flex">
        <div className="flex items-center mt-4 mx-4">
          <input
            type="checkbox"
            id="includeNumbers"
            className="mr-2"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
          />
          <label htmlFor="includeNumbers">Vključi številke</label>
        </div>
        <input
          type="number"
          min={1}
          max={12}
          value={characterCount}
          onChange={(e) => setCharacterCount(Number(e.target.value))}
          className="mt-4 p-2 rounded border border-gray-300 mr-4 w-20"
          placeholder="Dolžina niza"
        />
        <button
          onClick={() => generateCharacters(characterCount)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Novi znaki
        </button>
      </div>
    </main>
  );
};

const CharacterDisplay = ({
  characters,
  currentIndex,
  onClick,
}: {
  characters: CharacterState[];
  currentIndex: number;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex flex-row justify-center gap-4 bg-gray-600 p-4 rounded m-4 min-h-20"
      onClick={onClick}
    >
      {characters.map((item, index) => (
        <CharacterBox
          key={item.id}
          character={item.char}
          status={item.status}
          isActive={index === currentIndex}
        />
      ))}
    </div>
  );
};

const CharacterBox = ({
  character,
  status,
  isActive,
}: {
  character: string;
  status: "pending" | "correct" | "wrong";
  isActive: boolean;
}) => {
  const getBackgroundColor = () => {
    if (status === "correct") return "bg-green-500";
    if (status === "wrong") return "bg-red-500";
    return "bg-gray-700";
  };

  const getAnimation = () => {
    if (status === "correct") return "animate-pulse";
    if (status === "wrong") return "animate-bounce";
    return "";
  };

  return (
    <div
      className={`${getBackgroundColor()} w-12 h-12 rounded flex items-center justify-center text-2xl transition-all duration-300 ${getAnimation()} ${
        isActive ? "ring-2 ring-blue-400" : ""
      }`}
    >
      {character}
    </div>
  );
};

const CharacterInput = ({
  onKeyPress,
  inputRef,
}: {
  onKeyPress: (key: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length > value.length) {
      const newChar = newValue[newValue.length - 1];
      onKeyPress(newChar);
    }
    setValue(newValue);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      className="opacity-0 w-0 h-0"
      value={value}
      onChange={handleChange}
      placeholder="Type the characters..."
      autoFocus
    />
  );
};

export default Page;
