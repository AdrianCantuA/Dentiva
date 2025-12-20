import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../lib/api";

export default function Onboarding() {
  const nav = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
  e.preventDefault();
  setErr(null);

  if (!firstName || !lastName || !clinicName) {
    setErr("Completa todos los campos");
    return;
  }

  try {
    setBusy(true);
    console.log("[onboarding] start");

    // 1) Crear tenant
    const boot = await apiPost("/auth/bootstrap", {
      firstName,
      lastName,
      clinicName,
    });
    console.log("[onboarding] bootstrap ok:", boot);

    // 2) Obtener /auth/me
    const me = await apiGet("/auth/me");
    console.log("[onboarding] me:", me);

    const slug = me?.tenant?.slug;
    if (!slug) {
      setErr("Tenant sigue null después del bootstrap. Revisa que se cree el membership en DB.");
      return;
    }
    nav(`/login`, { replace: true });
  } catch (e: any) {
    console.error("[onboarding] error:", e);
    setErr(e?.message ?? "Error creando clínica");
  } finally {
    setBusy(false);
    console.log("[onboarding] end");
  }
}

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-semibold">Crear clínica</h1>
      <p className="mt-2 text-sm text-white/60">
        No tienes tenant asignado. Crea tu clínica para continuar.
      </p>

      {err && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {err}
        </div>
      )}

      <form onSubmit={submit} className="mt-4 space-y-3">
        <div>
          <label className="text-sm text-white/70">Nombre</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={busy}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-white/25"
            placeholder="Juan"
          />
        </div>

        <div>
          <label className="text-sm text-white/70">Apellido</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={busy}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-white/25"
            placeholder="Pérez"
          />
        </div>

        <div>
          <label className="text-sm text-white/70">Nombre de la clínica</label>
          <input
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            disabled={busy}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-white/25"
            placeholder="Clínica Dental Centro"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-70"
        >
          {busy ? "Creando…" : "Crear clínica"}
        </button>
      </form>
    </div>
  );
}
