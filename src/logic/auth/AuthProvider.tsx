import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "firebase/auth";
import {
  login as firebaseLogin,
  logout as firebaseLogout,
  onAuthChange,
} from "./firebaseAuth";

/* =======================
   Types
======================= */

type AuthState = {
  status: "loading" | "authed" | "guest";
  user: User | null;
};

type AuthContextValue = {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

/* =======================
   Context
======================= */

const AuthContext = createContext<AuthContextValue | null>(null);

/* =======================
   Provider
======================= */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    status: "loading",
    user: null,
  });

  // Escuchar cambios reales de Firebase
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setAuth({ status: "authed", user });
      } else {
        setAuth({ status: "guest", user: null });
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,

      login: async (email: string, password: string) => {
        await firebaseLogin(email, password);
        // El estado se actualiza automáticamente por onAuthChange
      },

      logout: async () => {
        await firebaseLogout();
      },
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* =======================
   Hook
======================= */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
