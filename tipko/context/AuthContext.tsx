"use client";

import { AuthContextType, User } from "@/types";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  const login = async (fingerprint: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint }),
        credentials: "include",
      });

      if (response.ok) {
        const { data } = await response.json();

        setUser({
          id: data.user._id,
          fingerprint: data.user.fingerprint,
          jwt: data.token,
        });

        setIsRegistered(true);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (fingerprint: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Registration failed");

      // 🔑 whether logged in or newly registered
      setUser({
        id: data._id,
        fingerprint: data.fingerprint,
        jwt: data.jwt,
      });
      setIsRegistered(true);
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  };

  const logout = async (fingerprint: string) => {
    console.log("logout auth context");
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ fingerprint }),
      });
      setUser(null);
      setIsRegistered(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isRegistered,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
