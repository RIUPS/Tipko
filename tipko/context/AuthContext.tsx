"use client";

import { AuthContextType, User } from "@/types";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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
        credentials: "include", // Important for cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.id,
          fingerprint: data.fingerprint,
          jwt: data.jwt,
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

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.id,
          fingerprint: data.fingerprint,
          jwt: data.jwt,
        });
        setIsRegistered(true);
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setIsRegistered(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user has a valid session
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            id: data.id,
            fingerprint: data.fingerprint,
            jwt: data.jwt,
          });
          setIsRegistered(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
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
