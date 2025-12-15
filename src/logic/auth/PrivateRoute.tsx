import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthProvider";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth.status === "loading") {
    return <div className="p-6">Cargando...</div>;
  }

  if (auth.status !== "authed") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
