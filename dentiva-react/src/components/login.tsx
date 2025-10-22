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
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-4 text-center">Dentiva</h1>

        <label className="block mb-2 text-sm">Correo</label>
        <input
          className="w-full mb-4 rounded-lg border px-3 py-2 focus:outline-none focus:ring"
          type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="doctor@clinica.mx"
        />

        <label className="block mb-2 text-sm">Contraseña</label>
        <input
          className="w-full mb-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring"
          type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="demo123"
        />

        {err && <p className="text-red-600 text-sm mt-2">{err}</p>}

        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-black text-white py-2 hover:opacity-90"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
