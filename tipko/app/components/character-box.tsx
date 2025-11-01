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
    switch (status) {
      case "correct":
        return "bg-green-100 text-green-700 border border-green-300";
      case "wrong":
        return "bg-pink-100 text-pink-700 border border-pink-300";
      default:
        return "bg-white text-gray-700 border border-gray-200";
    }
  };

  const getAnimation = () => {
    if (status === "correct") return "animate-pulse";
    if (status === "wrong") return "animate-bounce";
    return "";
  };

  return (
    <div
      className={`${getBackgroundColor()} w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl font-bold transition-all duration-300 shadow-md ${
        isActive ? "ring-4 ring-yellow-400 scale-110 bg-yellow-100" : "ring-0"
      } ${getAnimation()}`}
    >
      {character}
    </div>
  );
};

export default CharacterBox;
