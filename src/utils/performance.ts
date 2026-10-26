import { Event,PerformanceResult,SetEntry,Workout } from "@/types";
export const eventName = (e: Event) =>
  `${e.distance}m ${e.stroke}${e.discipline && e.discipline !== "Surface" ? " · " + e.discipline : ""}${e.poolLength === 25 ? " · 25m pool" : ""}`;
export const timeText = (n: number) => {
  if (!Number.isFinite(n)) return "—";
  const rounded = Math.round(n * 100) / 100;
  return rounded >= 60
    ? `${Math.floor(rounded / 60)}:${(rounded % 60).toFixed(2).padStart(5, "0")}`
    : rounded.toFixed(2);
};
export const dateText = (date: string) =>
  new Date(date + "T12:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
export const parseTime = (s: string): number | null => {
  const parts = s.trim().split(":");
  if (parts.length > 2 || parts.some((p) => !/^\d+(\.\d+)?$/.test(p)))
    return null;
  if (
    parts.length === 2 &&
    (!/^\d+$/.test(parts[0] ?? "") || Number(parts[1]) >= 60)
  )
    return null;
  const n =
    parts.length === 2
      ? Number(parts[0]) * 60 + Number(parts[1])
      : Number(parts[0]);
  return Number.isFinite(n) && n > 0 && n < 3600 ? n : null;
};
export function trend(results: PerformanceResult[]) {
  const sorted = [...results].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.length > 1
    ? (sorted[0]?.time ?? 0) - (sorted.at(-1)?.time ?? 0)
    : 0;
}
export function sessionStats(workout: Workout, entries: SetEntry[]) {
  const logged = entries.filter(
    (e): e is SetEntry & { time: number } => e.time !== null && !e.skipped,
  );
  const distance = logged.reduce(
    (n, e) => n + (workout.sets.find((s) => s.id === e.setId)?.distance ?? 0),
    0,
  );
  const seconds = logged.reduce((n, e) => n + e.time, 0);
  const times = logged.map((e) => e.time);
  return {
    distance,
    pace: distance ? (seconds / distance) * 100 : 0,
    best: times.length ? Math.min(...times) : 0,
    completedSets: workout.sets.filter(
      (s) => logged.filter((e) => e.setId === s.id).length === s.reps,
    ).length,
  };
}
export function consistencySummary(
  workout: Workout,
  entries: SetEntry[],
  previous?: SetEntry[],
) {
  const set = workout.sets.find((s) => s.section === "Race Pace");
  const times = entries
    .filter((e) => e.setId === set?.id && e.time !== null)
    .map((e) => e.time as number);
  if (times.length < 2)
    return "Session recorded. Log at least two race-pace repetitions to compare consistency.";
  const variation = Math.max(...times) - Math.min(...times);
  const prior = (previous ?? [])
    .filter((e) => e.setId === set?.id && e.time !== null && !e.skipped)
    .map((e) => e.time as number);
  const comparison =
    prior.length > 1
      ? ` Compared with ${(Math.max(...prior) - Math.min(...prior)).toFixed(1)}s in your previous session.`
      : " This establishes a consistency baseline.";
  return `Race-pace variation was ${variation.toFixed(1)}s across ${times.length} reps.${comparison} ${variation <= 0.5 ? "You held a controlled rhythm." : "Focus on holding your opening rhythm through the final rep."}`;
}
