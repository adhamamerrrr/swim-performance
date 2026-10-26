import { WorkoutPreview } from "@/components/cards";
import { AppCard,Copy,Screen,SectionHeader } from "@/components/ui";
import { useApp } from "@/hooks/useApp";
import { dateText } from "@/utils/performance";
import { router } from "expo-router";
export default function Workouts() {
  const { state } = useApp();
  return (
    <Screen>
      <Copy kind="heading">Your training</Copy>
      <Copy muted>Purpose in every length.</Copy>
      <SectionHeader title="Assigned sessions" />
      {state.workouts
        .filter((w) => w.swimmerId === "alex")
        .map((w) => (
          <WorkoutPreview
            key={w.id}
            workout={w}
            onPress={() =>
              router.push({
                pathname: "/swimmer/workout/[id]",
                params: { id: w.id },
              })
            }
          />
        ))}
      <SectionHeader title="Completed sessions" />
      {state.sessions
        .filter((s) => s.swimmerId === "alex")
        .map((s) => (
          <AppCard
            key={s.id}
            onPress={() =>
              router.push({
                pathname: "/swimmer/workout/complete",
                params: { sessionId: s.id },
              })
            }
          >
            <Copy kind="section">
              {state.workouts.find((w) => w.id === s.workoutId)?.title}
            </Copy>
            <Copy muted>
              {dateText(
                s.completedAt?.slice(0, 10) ?? s.startedAt.slice(0, 10),
              )}{" "}
              · RPE {s.rpe}/10
            </Copy>
          </AppCard>
        ))}
    </Screen>
  );
}
