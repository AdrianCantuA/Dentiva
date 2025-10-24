import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../logic/auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !pwd) return setErr("Completa ambos campos");
    if (login(email, pwd)) nav("/dashboard");
    else setErr("Credenciales inválidas (password: demo123)");
  }

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Fondo clínico: azules + patrón suave */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[length:300%_300%] animate-[bgShift_24s_ease-in-out_infinite]"
        style={{
          backgroundImage:
            "linear-gradient(120deg,#e0f2fe 0%,#dbeafe 35%,#bfdbfe 70%,#e0f2fe 100%)",
        }}
      />
      {/* Patrón de puntos muy sutil sobre el degradado */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0",
        }}
      />
      {/* Ondas */}
      <svg className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 -z-10 h-[32rem] w-[140%] text-sky-100/70"
           viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
        <path fill="currentColor" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,224C840,235,960,213,1080,197.3C1200,181,1320,171,1380,165.3L1440,160L1440,0L0,0Z"/>
      </svg>
      {/* Marcas de agua dentales */}
      <Tooth className="pointer-events-none absolute -right-10 -top-6 -z-10 h-56 w-56 text-sky-200/40 hidden sm:block" />
      <Mirror className="pointer-events-none absolute left-6 bottom-6 -z-10 h-28 w-28 text-sky-200/50 hidden sm:block" />

      <div className="mx-auto grid min-h-dvh max-w-6xl grid-cols-1 px-4 md:grid-cols-2 md:gap-10 md:px-8">
        {/* Panel gráfico */}
        <aside className="relative hidden items-center md:flex">
          <div className="relative w-full rounded-3xl bg-white/70 p-8 shadow-2xl backdrop-blur">
            <div className="mb-6 flex items-center gap-3">
              <Tooth className="h-9 w-9 text-sky-600" />
              <p className="text-2xl font-semibold text-slate-800">Dentiva</p>
            </div>

            <ul className="space-y-4 text-slate-700">
              <li className="flex items-start gap-3">
                <Badge /> Agenda y recordatorios de citas
              </li>
              <li className="flex items-start gap-3">
                <Badge /> Historias clínicas seguras
              </li>
              <li className="flex items-start gap-3">
                <Badge /> Facturación y seguimiento
              </li>
            </ul>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-4 shadow">
                <p className="text-sm text-slate-500">Próxima cita</p>
                <p className="mt-1 font-medium text-slate-800">12:30 · Limpieza</p>
              </div>
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-4 shadow">
                <p className="text-sm text-slate-500">Paciente</p>
                <p className="mt-1 font-medium text-slate-800">María P.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Formulario */}
        <main className="flex items-center py-12 md:py-0">
          <form
            onSubmit={submit}
            className="mx-auto w-full max-w-md rounded-3xl border border-sky-100 bg-white/85 p-8 shadow-xl backdrop-blur
                       transition-[transform,box-shadow] duration-500 ease-out hover:shadow-2xl"
          >
            <div className="mb-6 flex items-center gap-3 md:hidden">
              <Tooth className="h-8 w-8 text-sky-600" />
              <h1 className="text-xl font-semibold text-slate-800">Dentiva</h1>
            </div>

            <h2 className="mb-2 text-2xl font-semibold text-slate-900">Inicia sesión</h2>
            <p className="mb-6 text-sm text-slate-600">
              Accede a tu panel para gestionar pacientes y citas.
            </p>

            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Correo
            </label>
            <div className="relative mb-4">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <MailIcon className="h-5 w-5" />
              </span>
              <input
                id="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-slate-900 placeholder-slate-400
                           outline-none ring-sky-200 transition focus:border-sky-300 focus:ring-4"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@clinica.mx"
                autoComplete="username"
                inputMode="email"
              />
            </div>

            <label htmlFor="pwd" className="mb-2 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <LockIcon className="h-5 w-5" />
              </span>
              <input
                id="pwd"
                className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-slate-900 placeholder-slate-400
                           outline-none ring-sky-200 transition focus:border-sky-300 focus:ring-4"
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="demo123"
                autoComplete="current-password"
              />
            </div>

            {err && <p className="mt-3 text-sm text-rose-600">{err}</p>}

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-3 font-medium text-white
                         shadow-lg transition hover:brightness-110 active:scale-[.99]"
            >
              Iniciar sesión
            </button>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
              <a className="underline underline-offset-4 hover:text-slate-800">
                ¿Olvidaste tu contraseña?
              </a>
              <a className="rounded-lg bg-sky-50 px-3 py-1 text-sky-700 ring-1 ring-sky-200 hover:bg-sky-100">
                Crear cuenta
              </a>
            </div>

            <p className="mt-6 text-center text-[11px] text-slate-500">
              Al continuar aceptas los Términos y el Aviso de privacidad.
            </p>
          </form>
        </main>
      </div>

      <style>{`
        @keyframes bgShift {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
    </div>
  );
}

/* ==== Iconos ==== */
function Badge() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-sky-500" aria-hidden>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}
function Tooth({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M7 21c.8-2.4 1.2-5.3 1.8-6.2.5-.8 1.6-.8 2.2 0 .6.9 1 3.8 1.8 6.2.4 1.2 2.1 1.2 2.5 0 1.1-3.1 2.7-9.1 3.5-12.9.9-4.3-1.8-6.6-5.2-6.1-1.5.2-2.8.9-3.6 1.9-.8-1-2.1-1.7-3.6-1.9C2 1.4-.7 3.7.2 8c.8 3.8 2.4 9.8 3.5 12.9.4 1.2 2.1 1.2 2.5 0Z"
        stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
function MailIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}
function LockIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="5" y="11" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M9 11V8a3 3 0 1 1 6 0v3" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}
function Mirror({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="3"/>
      <rect x="34" y="34" width="20" height="8" rx="4" stroke="currentColor" strokeWidth="3"/>
      <path d="M48 38 L60 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}
