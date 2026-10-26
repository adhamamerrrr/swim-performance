import { SetRow } from "@/components/cards";
import {
Copy,
EmptyState,
Screen,
SecondaryButton,
SectionHeader,
} from "@/components/ui";
import { useApp } from "@/hooks/useApp";
import { router,useLocalSearchParams } from "expo-router";
export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();
  const w = state.workouts.find((w) => w.id === id);
  if (!w)
    return (
      <Screen>
        <EmptyState
          title="Workout unavailable"
          detail="Choose an assigned workout."
          action="Workouts"
          onPress={() => router.replace("/coach/workouts")}
        />
      </Screen>
    );
  return (
    <Screen>
      <Copy kind="heading">{w.title}</Copy>
      <Copy muted>
        {state.swimmers.find((s) => s.id === w.swimmerId)?.name} · {w.duration}{" "}
        min
      </Copy>
      <Copy kind="section">{w.focus}</Copy>
      {w.sets.map((s) => (
        <SetRow key={s.id} set={s} />
      ))}
      <SectionHeader title="Completed sessions" />
      {state.sessions
        .filter((s) => s.workoutId === id)
        .map((s) => (
          <SecondaryButton
            key={s.id}
            title={`Review ${s.completedAt?.slice(0, 10)}`}
            onPress={() =>
              router.push({
                pathname: "/coach/review/[id]",
                params: { id: s.id },
              })
            }
          />
        ))}
    </Screen>
  );
}
