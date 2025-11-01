import { CharacterState } from "@/types";
import CharacterBox from "./character-box";

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
      className="flex flex-row justify-center flex-wrap gap-4 bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl shadow-inner m-4 min-h-24 cursor-pointer transition-transform hover:scale-[1.01]"
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

export default CharacterDisplay;
