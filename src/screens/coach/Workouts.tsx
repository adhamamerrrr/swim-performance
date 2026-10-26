import { WorkoutPreview } from "@/components/cards";
import {
AppCard,
Copy,
Screen,
SectionHeader,
StatusBadge,
} from "@/components/ui";
import { useApp } from "@/hooks/useApp";
import { router } from "expo-router";
export default function Workouts() {
  const { state } = useApp();
  return (
    <Screen>
      <Copy kind="heading">Training with purpose</Copy>
      <SectionHeader title="Completed · review queue" />
      {state.sessions.map((session) => (
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
            {state.workouts.find((w) => w.id === session.workoutId)?.title}
          </Copy>
          <StatusBadge
            status={
              state.reviews.some((r) => r.sessionId === session.id)
                ? "Completed"
                : "Pending"
            }
          />
        </AppCard>
      ))}
      <SectionHeader title="Assigned workouts" />
      {state.workouts.map((w) => (
        <WorkoutPreview
          key={w.id}
          workout={w}
          onPress={() =>
            router.push({
              pathname: "/coach/workout/[id]",
              params: { id: w.id },
            })
          }
        />
      ))}
    </Screen>
  );
}
