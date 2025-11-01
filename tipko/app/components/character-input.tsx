import { useState } from "react";

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

export default CharacterInput;
