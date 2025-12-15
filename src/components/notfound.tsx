import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
          <span className="text-2xl font-bold text-sky-600">404</span>
        </div>

        <h1 className="mb-2 text-xl font-semibold text-slate-900">
          Página no encontrada
        </h1>

        <p className="mb-6 text-sm text-slate-600">
          La ruta que intentas abrir no existe o fue movida.
        </p>

        <div className="flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white
                       shadow transition hover:bg-sky-700"
          >
            Ir al dashboard
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700
                       transition hover:bg-slate-100"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
