"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FaShieldAlt } from "react-icons/fa";

interface RegistrationModalProps {
  fingerprint: string;
  onClose: () => void;
  onDismiss: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  fingerprint,
  onClose,
  onDismiss,
}) => {
  const { register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await register(fingerprint);
      onClose();
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDontAskAgain = () => {
    onDismiss();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-blue-100 via-pink-50 to-yellow-100 rounded-3xl shadow-2xl border-4 border-yellow-200 p-8 max-w-md w-full mx-4 flex flex-col items-center text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-pink-500 mb-4 drop-shadow">
          Dobrodošel!
        </h2>
        <p className="text-blue-900 text-lg font-semibold mb-6">
          Želiš ustvariti račun, da shraniš svoj napredek?
          <br />
          <span className="text-yellow-600">
            Z registracijo se tvoj napredek in statistika shranita.
          </span>
        </p>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={handleRegister}
            disabled={isRegistering}
            className="w-full flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 disabled:bg-blue-300 text-white font-bold py-3 px-4 rounded-2xl shadow transition-transform hover:scale-105"
          >
            {isRegistering
              ? "Registriram..."
              : "🔒 Registriraj se in shrani podatke"}
          </button>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-yellow-900 font-bold py-3 px-4 rounded-2xl shadow transition-transform hover:scale-105"
          >
            🚀 Nadaljuj brez registracije
          </button>

          <button
            onClick={handleDontAskAgain}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-1 transition"
          >
            Ne sprašuj me več
          </button>
        </div>

        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-3 rounded-lg mt-6 text-yellow-800 font-semibold shadow-sm text-sm flex items-center gap-2">
          <FaShieldAlt className="text-yellow-500" />
          <span>
            Opomba: Brez registracije tvoj napredek ne bo shranjen trajno.
            <div className="text-xs mt-1 font-normal text-yellow-900">
              Z registracijo ne shranjujemo nobenih osebnih podatkov.
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
