import { SetRow } from "@/components/cards";
import {
Copy,
EmptyState,
PrimaryButton,
Screen,
SectionHeader,
} from "@/components/ui";
import { coach,workouts } from "@/data/mockData";
import { dateText } from "@/utils/performance";
import { router,useLocalSearchParams } from "expo-router";
import React from "react";
export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = workouts.find((w) => w.id === id);
  if (!workout)
    return (
      <Screen>
        <EmptyState
          title="Workout unavailable"
          detail="Choose a session from your training list."
          action="View workouts"
          onPress={() => router.replace("/swimmer/workouts")}
        />
      </Screen>
    );
  return (
    <Screen>
      <Copy kind="heading">{workout.title}</Copy>
      <Copy muted>
        {coach.name} · {dateText(workout.date)} · {workout.duration} min
      </Copy>
      <Copy kind="section">{workout.focus}</Copy>
      {workout.sets.map((set) => (
        <React.Fragment key={set.id}>
          <SectionHeader title={set.section} />
          <SetRow set={set} />
        </React.Fragment>
      ))}
      <PrimaryButton
        title="Start Workout"
        onPress={() =>
          router.push({
            pathname: "/swimmer/workout/active",
            params: { id: workout.id },
          })
        }
      />
    </Screen>
  );
}
