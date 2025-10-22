import { logout } from "../logic/auth";
export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <button onClick={()=>{logout(); location.href="/";}}
          className="rounded-lg border px-3 py-1 hover:bg-gray-50">Salir</button>
      </div>
      <p className="mt-4">Bienvenido.</p>
    </div>
  );
}
