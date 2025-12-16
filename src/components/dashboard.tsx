// Dashboard.tsx
import { useMemo, useState } from "react";
type Unit = "Unidad Centro" | "Unidad Valle" | "Unidad Norte";
type Treatment =
  | "Consulta"
  | "Limpieza"
  | "Extracción"
  | "Ortodoncia"
  | "Radiografía"
  | "Endodoncia";

type Appt = {
  id: string;
  start: string; // ISO
  end: string; // ISO
  patient: string;
  unit: Unit;
  treatments: Treatment[];
  status: "Confirmado" | "Pendiente" | "Reprogramar";
  doctor: string;
};

const UNITS: Unit[] = ["Unidad Centro", "Unidad Valle", "Unidad Norte"];
const TREATMENTS: Treatment[] = [
  "Consulta",
  "Limpieza",
  "Extracción",
  "Ortodoncia",
  "Radiografía",
  "Endodoncia",
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function ymd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function startOfCalendarGrid(d: Date) {
  // Lunes como inicio (0 = lunes)
  const first = startOfMonth(d);
  const day = (first.getDay() + 6) % 7; // convierte: dom=0 -> 6
  return addDays(first, -day);
}
function formatTime(iso: string) {
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function minutesDiff(a: string, b: string) {
  return (new Date(b).getTime() - new Date(a).getTime()) / 60000;
}
function classByStatus(s: Appt["status"]) {
  if (s === "Confirmado") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  if (s === "Pendiente") return "border-amber-500/40 bg-amber-500/10 text-amber-200";
  return "border-rose-500/40 bg-rose-500/10 text-rose-200";
}
function classByUnit(u: Unit) {
  if (u === "Unidad Centro") return "bg-sky-500/15 text-sky-200 border-sky-500/30";
  if (u === "Unidad Valle") return "bg-violet-500/15 text-violet-200 border-violet-500/30";
  return "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/30";
}

function makeDummyAppointments(anchor: Date): Appt[] {
  const base = new Date(anchor);
  const today = new Date(base.getFullYear(), base.getMonth(), base.getDate());

  const mk = (
    dayOffset: number,
    hh: number,
    mm: number,
    durMin: number,
    patient: string,
    unit: Unit,
    treatments: Treatment[],
    status: Appt["status"],
    doctor: string,
  ): Appt => {
    const s = new Date(today);
    s.setDate(s.getDate() + dayOffset);
    s.setHours(hh, mm, 0, 0);
    const e = new Date(s);
    e.setMinutes(e.getMinutes() + durMin);
    return {
      id: `${ymd(s)}-${hh}${mm}-${patient}`.replace(/\s/g, ""),
      start: s.toISOString(),
      end: e.toISOString(),
      patient,
      unit,
      treatments,
      status,
      doctor,
    };
  };

  return [
    // HOY
    mk(0, 9, 0, 30, "Ana López", "Unidad Centro", ["Consulta"], "Confirmado", "Dra. Ríos"),
    mk(0, 9, 30, 45, "Miguel Herrera", "Unidad Valle", ["Limpieza", "Radiografía"], "Pendiente", "Dr. Salas"),
    mk(0, 10, 30, 60, "Sofía Martínez", "Unidad Norte", ["Ortodoncia"], "Confirmado", "Dra. Vega"),
    mk(0, 12, 0, 45, "Juan Pérez", "Unidad Centro", ["Extracción"], "Reprogramar", "Dr. Salas"),
    mk(0, 13, 30, 60, "Laura Gómez", "Unidad Valle", ["Endodoncia"], "Confirmado", "Dra. Ríos"),
    mk(0, 16, 0, 30, "Carlos Sánchez", "Unidad Norte", ["Consulta"], "Pendiente", "Dra. Vega"),

    // Otros días (para que el mes se vea “vivo”)
    mk(-2, 11, 0, 30, "Paola Ruiz", "Unidad Centro", ["Consulta"], "Confirmado", "Dra. Ríos"),
    mk(-1, 15, 0, 45, "Diego Castillo", "Unidad Valle", ["Limpieza"], "Confirmado", "Dr. Salas"),
    mk(1, 9, 0, 60, "Fernanda Díaz", "Unidad Norte", ["Ortodoncia", "Radiografía"], "Pendiente", "Dra. Vega"),
    mk(2, 14, 0, 45, "Roberto Silva", "Unidad Centro", ["Extracción"], "Confirmado", "Dr. Salas"),
    mk(3, 10, 0, 30, "Valeria Torres", "Unidad Valle", ["Consulta"], "Confirmado", "Dra. Ríos"),
    mk(5, 12, 30, 60, "José Ramírez", "Unidad Norte", ["Endodoncia"], "Reprogramar", "Dra. Vega"),
    mk(7, 9, 30, 45, "Mariana Flores", "Unidad Centro", ["Limpieza"], "Pendiente", "Dra. Ríos"),
  ];
}

export default function Dashboard() {
  const [cursor, setCursor] = useState<Date>(() => new Date());
  const [selectedDay, setSelectedDay] = useState<string>(() => ymd(new Date()));
  const [unitFilter, setUnitFilter] = useState<Unit | "Todas">("Todas");
  const [search, setSearch] = useState("");

  const data = useMemo(() => makeDummyAppointments(new Date()), []);

  const monthLabel = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" });
    const s = fmt.format(cursor);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }, [cursor]);

  const gridDays = useMemo(() => {
    const start = startOfCalendarGrid(cursor);
    const end = endOfMonth(cursor);
    // 6 semanas (42 celdas) típico para grid consistente
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) days.push(addDays(start, i));
    // Si el mes termina antes, igual dejamos 42 para layout fijo
    // (No dependemos de "end" para cortar)
    void end;
    return days;
  }, [cursor]);

  const apptsByDay = useMemo(() => {
    const map = new Map<string, Appt[]>();
    for (const a of data) {
      const key = ymd(new Date(a.start));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    // ordenar por hora
    for (const [k, v] of map) {
      v.sort((x, y) => new Date(x.start).getTime() - new Date(y.start).getTime());
      map.set(k, v);
    }
    return map;
  }, [data]);

  const todaysAppts = useMemo(() => {
    const all = apptsByDay.get(selectedDay) ?? [];
    return all
      .filter((a) => (unitFilter === "Todas" ? true : a.unit === unitFilter))
      .filter((a) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          a.patient.toLowerCase().includes(q) ||
          a.doctor.toLowerCase().includes(q) ||
          a.treatments.join(" ").toLowerCase().includes(q) ||
          a.unit.toLowerCase().includes(q)
        );
      });
  }, [apptsByDay, selectedDay, unitFilter, search]);

  const selectedIsToday = selectedDay === ymd(new Date());

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-semibold">Calendario</h2>
          <span className="text-sm text-white/60">Agenda por unidad y tratamiento</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            ←
          </button>
          <button
            onClick={() => {
              const now = new Date();
              setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
              setSelectedDay(ymd(now));
            }}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Hoy
          </button>
          <button
            onClick={() => setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            →
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-medium text-white/80">Mes</div>
          <div className="mt-1 text-lg font-semibold">{monthLabel}</div>
          <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Confirmado
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Pendiente
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              Reprogramar
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-medium text-white/80">Filtrar por unidad</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["Todas", ...UNITS] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnitFilter(u)}
                className={[
                  "rounded-lg border px-3 py-2 text-sm transition",
                  unitFilter === u
                    ? "border-white/25 bg-white/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10",
                ].join(" ")}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-medium text-white/80">Buscar</div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Paciente, doctor, tratamiento, unidad..."
            className="mt-3 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none placeholder:text-white/30 focus:border-white/25"
          />
          <div className="mt-2 text-xs text-white/60">
            Ejemplos: {TREATMENTS.slice(0, 3).join(", ")}…
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        {/* Calendar Grid */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 grid grid-cols-7 gap-2 text-xs text-white/60">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
              <div key={d} className="px-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {gridDays.map((d) => {
              const key = ymd(d);
              const inMonth = d.getMonth() === cursor.getMonth();
              const isSelected = key === selectedDay;
              const isToday = key === ymd(new Date());
              const dayAppts = apptsByDay.get(key) ?? [];

              const filteredCount =
                unitFilter === "Todas" ? dayAppts.length : dayAppts.filter((a) => a.unit === unitFilter).length;

              const topUnits = Array.from(
                new Set(
                  dayAppts
                    .filter((a) => (unitFilter === "Todas" ? true : a.unit === unitFilter))
                    .map((a) => a.unit),
                ),
              ).slice(0, 2);

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDay(key)}
                  className={[
                    "group relative h-24 rounded-xl border p-2 text-left transition",
                    inMonth ? "bg-black/10" : "bg-black/20",
                    isSelected ? "border-white/25 bg-white/10" : "border-white/10 hover:border-white/20",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <div className={inMonth ? "text-sm font-medium" : "text-sm font-medium text-white/40"}>
                      {d.getDate()}
                    </div>

                    {isToday && (
                      <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
                        Hoy
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    {filteredCount > 0 ? (
                      <>
                        <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/70">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                          {filteredCount} cita{filteredCount === 1 ? "" : "s"}
                        </span>
                        <div className="flex gap-1">
                          {topUnits.map((u) => (
                            <span
                              key={u}
                              className={[
                                "inline-flex items-center rounded-md border px-2 py-1 text-[10px]",
                                classByUnit(u),
                              ].join(" ")}
                            >
                              {u.replace("Unidad ", "")}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <span className="text-[10px] text-white/35">Sin citas</span>
                    )}
                  </div>

                  {/* subtle ring for today */}
                  {isToday && !isSelected && (
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Panel */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-white/80">Citas del día</div>
              <div className="mt-1 text-lg font-semibold">
                {new Intl.DateTimeFormat("es-MX", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(selectedDay + "T00:00:00"))}
              </div>
              <div className="mt-1 text-xs text-white/60">
                {selectedIsToday ? "Vista: Hoy" : "Vista: Fecha seleccionada"} ·{" "}
                {unitFilter === "Todas" ? "Todas las unidades" : unitFilter}
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <div className="text-xs text-white/60">Resumen</div>
              <div className="mt-1 text-2xl font-semibold">{todaysAppts.length}</div>
              <div className="text-xs text-white/60">cita{todaysAppts.length === 1 ? "" : "s"}</div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {todaysAppts.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-black/10 p-4 text-sm text-white/60">
                No hay citas que coincidan con los filtros.
              </div>
            ) : (
              todaysAppts.map((a) => (
                <div
                  key={a.id}
                  className={[
                    "rounded-xl border p-4",
                    "bg-black/10 border-white/10",
                  ].join(" ")}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-base font-semibold">{a.patient}</div>
                        <span
                          className={[
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]",
                            classByStatus(a.status),
                          ].join(" ")}
                        >
                          {a.status}
                        </span>
                      </div>

                      <div className="mt-1 text-sm text-white/70">
                        {formatTime(a.start)} – {formatTime(a.end)}{" "}
                        <span className="text-white/40">
                          · {Math.round(minutesDiff(a.start, a.end))} min
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={[
                            "inline-flex items-center rounded-lg border px-2 py-1 text-[11px]",
                            classByUnit(a.unit),
                          ].join(" ")}
                        >
                          {a.unit}
                        </span>
                        <span className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                          {a.doctor}
                        </span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <div className="text-xs text-white/60">Tratamientos</div>
                      <div className="mt-2 flex flex-wrap gap-2 sm:justify-end">
                        {a.treatments.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/75"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-3 text-xs text-white/55">
            Datos dummy. Diseño pensado para estilo “Defender-like” (tarjetas, bordes suaves, contrastes).
          </div>
        </div>
      </div>
    </div>
  );
}
