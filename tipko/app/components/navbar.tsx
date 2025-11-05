"use client";
import React from "react";
import { FaMouse, FaKeyboard, FaHome, FaShieldAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const Navbar: React.FC = () => {
  const { user, isRegistered, logout } = useAuth();

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
            href="/keyboard"
            className="flex items-center gap-2 text-yellow-600 font-semibold hover:bg-yellow-100 px-4 py-2 rounded-xl transition"
          >
            <FaKeyboard className="text-lg" />
            Tipkovnica
          </a>
        </li>
        <li>
          <a
            href="/digital-safety"
            className="flex items-center gap-2 text-green-600  font-semibold hover:bg-blue-100 px-4 py-2 rounded-xl transition"
          >
            <FaShieldAlt className="text-lg" />
            Spletna varnost
          </a>
        </li>
        {isRegistered && user && (
          <>
            <li>
              <a
                href="/stats"
                className="flex items-center gap-2 text-blue-600 font-semibold hover:bg-green-100 px-4 py-2 rounded-xl transition"
              >
                <FaShieldAlt className="text-lg" />
                Statistika
              </a>
            </li>
            <li>
              <button
                onClick={() => logout(user.fingerprint)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl transition"
              >
                Odjava
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
