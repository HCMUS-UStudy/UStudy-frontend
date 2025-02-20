"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  role: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [role, setRole] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      console.log("server");
    } else {
      console.log(localStorage.getItem("accessToken"));
      console.log("client");
    }
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      const role = localStorage.getItem("role");
      setIsAuthenticated(accessToken !== null ? true : false);
      setRole(role === null ? "" : role);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
