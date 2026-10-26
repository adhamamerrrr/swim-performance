import { PerformanceTimeline } from "@/components/cards";
import { AthleteRow } from "@/components/coach/AthleteRow";
import {
AppCard,
Copy,
EmptyState,
Screen,
SectionHeader,
} from "@/components/ui";
import { useApp } from "@/hooks/useApp";
import { athleteSignal } from "@/utils/coach";
import { router } from "expo-router";
export default function Home() {
  const { state } = useApp();
  const roster = state.swimmers.map((a) =>
    athleteSignal(a, state.performances, state.sessions),
  );
  const improving = roster.filter((a) => a.status === "On Track").length;
  const pending = state.sessions.filter(
    (s) => !state.reviews.some((r) => r.sessionId === s.id),
  );
  const recent = [...state.performances]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  return (
    <Screen>
      <Copy kind="meta" muted>
        GOOD MORNING, COACH
      </Copy>
      <Copy kind="heading">{state.profile?.name ?? "Maya Rivers"}</Copy>
      <Copy muted>See the athlete behind the time.</Copy>
      <SectionHeader title="Athletes needing attention" />
      {roster
        .filter((s) => s.status === "At Risk")
        .map((s) => (
          <AthleteRow
            key={s.id}
            athlete={s}
            onPress={() =>
              router.push({
                pathname: "/coach/swimmer/[id]",
                params: { id: s.id },
              })
            }
          />
        ))}
      <SectionHeader title="Recent performances" />
      <PerformanceTimeline
        results={recent}
        athleteNames={Object.fromEntries(
          state.swimmers.map((s) => [s.id, s.name]),
        )}
        onPress={(id) =>
          router.push({ pathname: "/swimmer/progress/[id]", params: { id } })
        }
      />
      <SectionHeader title="Workouts to review" />
      {pending.length ? (
        pending.map((session) => (
          <AppCard
            key={session.id}
            onPress={() =>
              router.push({
                pathname: "/coach/review/[id]",
                params: { id: session.id },
              })
            }
          >
            <Copy kind="section">
              {state.swimmers.find((s) => s.id === session.swimmerId)?.name}
            </Copy>
            <Copy muted>
              {state.workouts.find((w) => w.id === session.workoutId)?.title} ·
              RPE {session.rpe}/10
            </Copy>
          </AppCard>
        ))
      ) : (
        <EmptyState
          title="All caught up"
          detail="Completed sessions will appear here for review."
        />
      )}
      <SectionHeader title="Team trend" />
      <Copy kind="heading">
        {improving} of {roster.length} improving
      </Copy>
      <Copy muted>
        Based on each athlete’s last two primary-event races and latest training
        effort. These flags guide a coach conversation.
      </Copy>
      <Copy kind="meta" muted>
        DEMO COHORT · SAMPLE RACE HISTORY
      </Copy>
    </Screen>
  );
}
