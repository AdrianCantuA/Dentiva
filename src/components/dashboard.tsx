import { useParams } from "react-router-dom";

export default function Dashboard() {
  const { slug } = useParams();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="mt-2 text-sm text-white/60">
        Tenant (slug en URL): <span className="font-mono text-black">{slug}</span>
      </div>
    </div>
  );
}
