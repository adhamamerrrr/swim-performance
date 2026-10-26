import { PerformanceResult,Swimmer,TrainingSession } from "@/types";
export function athleteSignal(
  athlete: Swimmer,
  results: PerformanceResult[],
  sessions: TrainingSession[],
): Swimmer {
  const sorted = results
    .filter(
      (p) => p.swimmerId === athlete.id && p.eventId === athlete.primaryEventId,
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const training = sessions
    .filter((s) => s.swimmerId === athlete.id)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  if ((training[0]?.rpe ?? 0) >= 9)
    return {
      ...athlete,
      status: "At Risk",
      attention: "Latest training effort elevated · RPE 9/10 or higher",
    };
  if (sorted.length < 2)
    return {
      ...athlete,
      status: "Pending",
      attention: "More performances needed to establish a trend",
    };
  const delta = sorted[1]!.time - sorted[0]!.time;
  return {
    ...athlete,
    status: delta > 0.05 ? "On Track" : delta < -0.3 ? "At Risk" : "Pending",
    attention:
      delta > 0.05
        ? "Latest race performance improving"
        : delta < -0.3
          ? "Latest race slower; review recovery and race execution"
          : "Performance stable; review the next training focus",
  };
}
