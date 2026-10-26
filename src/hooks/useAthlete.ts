import { events,swimmers } from "@/data/mockData";
import { athleteSignal } from "@/utils/coach";
import { useApp } from "./useApp";
export function useAthlete() {
  const { state } = useApp();
  const source = state.swimmers.find((s) => s.id === "alex") ?? swimmers[0]!;
  const athlete = athleteSignal(source, state.performances, state.sessions);
  const event =
    events.find((e) => e.id === athlete.primaryEventId) ?? events[0]!;
  const results = state.performances.filter(
    (p) => p.swimmerId === athlete.id && p.eventId === event.id,
  );
  const latest = [...results].sort((a, b) => b.date.localeCompare(a.date))[0];
  const pb = results.length
    ? Math.min(...results.map((p) => p.time))
    : (state.profile?.pb ?? 0);
  const current = latest?.time ?? pb;
  const goal = state.goals.find(
    (g) => g.swimmerId === athlete.id && g.eventId === event.id,
  );
  const season = results.filter(
    (r) => r.date.slice(0, 4) === new Date().getFullYear().toString(),
  );
  const seasonBest = season.length
    ? Math.min(...season.map((r) => r.time))
    : undefined;
  return { athlete, event, results, latest, pb, current, seasonBest, goal };
}
