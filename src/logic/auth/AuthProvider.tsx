import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthState = {
  status: "loading" | "authed" | "guest";
  token: string | null;
};

type AuthContextValue = {
  auth: AuthState;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "dentiva_token";

function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ status: "loading", token: null });

  useEffect(() => {
    const token = readToken();
    if (token) setAuth({ status: "authed", token });
    else setAuth({ status: "guest", token: null });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,

      login: (email: string, password: string) => {
        // DEMO: password fija
        if (!email || password !== "demo123") return false;

        const token = `demo-token-${btoa(email)}`;
        localStorage.setItem(TOKEN_KEY, token);
        setAuth({ status: "authed", token });
        return true;
      },

      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        setAuth({ status: "guest", token: null });
      },
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
