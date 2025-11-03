"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import RegistrationModal from "./registration-modal";

interface FingerprintHandlerProps {
  generateFingerprint: () => Promise<string>;
}

const FingerprintHandler: React.FC<FingerprintHandlerProps> = ({
  generateFingerprint,
}) => {
  const { user, isLoading, isRegistered, login } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [fingerprint, setFingerprint] = useState<string>("");

  useEffect(() => {
    const initFingerprint = async () => {
      if (isLoading) return;

      // Generate fingerprint (await since it's async)
      const fp = await generateFingerprint();
      setFingerprint(fp);

      // If user is already logged in, no need to check
      if (user && isRegistered) return;

      // Check if user dismissed registration before
      const dismissedRegistration = localStorage.getItem(
        "dismissedRegistration"
      );
      if (dismissedRegistration === "true") return;

      try {
        // Check if fingerprint exists in database
        const response = await fetch("/api/auth/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fingerprint: fp }),
          credentials: "include",
        });

        const data = await response.json();

        if (data.exists) {
          // User exists, auto-login
          await login(fp);
        } else {
          // User doesn't exist, show registration modal
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error checking fingerprint:", error);
      }
    };

    initFingerprint();
  }, [isLoading, user, isRegistered]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("dismissedRegistration", "true");
    setShowModal(false);
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <>
      {showModal && (
        <RegistrationModal
          fingerprint={fingerprint}
          onClose={handleCloseModal}
          onDismiss={handleDismiss}
        />
      )}
    </>
  );
};

export default FingerprintHandler;
