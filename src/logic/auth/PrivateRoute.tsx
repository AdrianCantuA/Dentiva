import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { apiGet } from "../../lib/api";

type MeResponse = {
  tenant: { id: string; name: string; slug: string } | null;
  role: "OWNER" | "ADMIN" | "DOCTOR" | "ASSISTANT" | null;
};

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  const location = useLocation();

  const [meState, setMeState] = useState<{
    loading: boolean;
    error: string | null;
    me: MeResponse | null;
  }>({ loading: false, error: null, me: null });

  // ✅ Hook SIEMPRE se define; adentro decides si corre o no
  useEffect(() => {
    let cancelled = false;

    // Solo corre cuando ya estás authed
    if (auth.status !== "authed") {
      // Resetea estado cuando no hay sesión
      setMeState({ loading: false, error: null, me: null });
      return;
    }

    setMeState((s) => ({ ...s, loading: true, error: null }));

    (async () => {
      try {
        const me = await apiGet("/auth/me");
        if (cancelled) return;
        setMeState({ loading: false, error: null, me });
      } catch (e: any) {
        if (cancelled) return;
        setMeState({
          loading: false,
          error: e?.message ?? "Error validando sesión en backend",
          me: null,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [auth.status]);

  // ====== RETURNS (después de hooks) ======

  // 1) Primero: proteger por Firebase
  if (auth.status === "loading") {
    return <div className="p-6">Cargando…</div>;
  }

  if (auth.status !== "authed") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2) Segundo: validar tenant/rol con backend
  if (meState.loading) {
    return <div className="p-6">Validando tenant…</div>;
  }

  if (meState.error) {
    return <div className="p-6 text-red-400">Error: {meState.error}</div>;
  }

  const hasTenant = !!meState.me?.tenant;

  // Si NO tiene tenant, solo permitimos entrar a /onboarding
  /*if (!hasTenant && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
*/
  // Si SÍ tiene tenant y está en /onboarding, lo mandamos al dashboard del tenant
  if (hasTenant && location.pathname === "/onboarding") {
    return <Navigate to={`/${meState.me!.tenant!.slug}/dashboard`} replace />;
  }
  

  return <>{children}</>;
}
