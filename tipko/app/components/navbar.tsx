import React from "react";
import { FaMouse, FaKeyboard, FaHome } from "react-icons/fa";

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200 shadow-lg py-3 px-6 rounded-b-3xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <a href="/">
            <FaHome className="text-blue-500 text-2xl" />
        </a>
        <span className="font-bold text-xl text-blue-700 drop-shadow-sm select-none">
          Tipko &amp; Miška
        </span>
      </div>
      <ul className="flex gap-6 items-center">
        <li>
          <a
            href="/mouse"
            className="flex items-center gap-2 text-pink-600 font-semibold hover:bg-pink-100 px-4 py-2 rounded-xl transition"
          >
            <FaMouse className="text-lg" />
            Miška
          </a>
        </li>
        <li>
          <a
            href="/keyboard/learn"
            className="flex items-center gap-2 text-yellow-600 font-semibold hover:bg-yellow-100 px-4 py-2 rounded-xl transition"
          >
            <FaKeyboard className="text-lg" />
            Tipkovnica
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;