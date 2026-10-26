import {
Choice,
Copy,
EmptyState,
Field,
MetricDisplay,
PrimaryButton,
Screen,
SecondaryButton,
StatusBadge,
styles,
} from "@/components/ui";
import { RPESelector } from "@/components/workout/Selectors";
import { useApp } from "@/hooks/useApp";
import {
consistencySummary,
sessionStats,
timeText,
} from "@/utils/performance";
import { router,useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
export default function Complete() {
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const { state, update } = useApp();
  const session = sessionId
    ? state.sessions.find((s) => s.id === sessionId)
    : state.active;
  const workout =
    session?.workoutSnapshot ??
    state.workouts.find((w) => w.id === session?.workoutId);
  const [rpe, setRpe] = useState(7);
  const [feeling, setFeeling] = useState("Strong");
  const [note, setNote] = useState("");
  if (!session || !workout)
    return (
      <Screen>
        <EmptyState
          title="No session to complete"
          detail="Start a workout to record your training."
          action="View workouts"
          onPress={() => router.replace("/swimmer/workouts")}
        />
      </Screen>
    );
  const stats = sessionStats(workout, session.entries);
  const duration = Math.max(
    1,
    Math.round(
      (new Date(session.completedAt ?? Date.now()).getTime() -
        new Date(session.startedAt).getTime()) /
        60000,
    ),
  );
  const saved = !!session.completedAt;
  return (
    <Screen>
      <StatusBadge status={saved ? "Completed" : "Pending"} />
      <Copy kind="heading">
        {saved ? "Workout Complete" : "Your work, recorded"}
      </Copy>
      <Copy muted>{workout.title}</Copy>
      <MetricDisplay
        label="Total distance"
        value={
          state.settings.units === "Yards"
            ? `${Math.round(stats.distance * 1.09361)}yd`
            : `${stats.distance}m`
        }
        hero
      />
      <View style={styles.row}>
        <MetricDisplay label="Duration" value={`${duration} min`} />
        <MetricDisplay label="Average / 100m" value={timeText(stats.pace)} />
      </View>
      <View style={styles.row}>
        <MetricDisplay
          label="Completed sets"
          value={`${stats.completedSets}/${workout.sets.length}`}
        />
        <MetricDisplay
          label="Best rep"
          value={stats.best ? timeText(stats.best) : "—"}
        />
      </View>
      <Copy kind="section">
        {consistencySummary(
          workout,
          session.entries,
          [...state.sessions]
            .filter(
              (s) =>
                s.workoutId === workout.id &&
                s.id !== session.id &&
                s.startedAt < session.startedAt,
            )
            .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0]?.entries,
        )}
      </Copy>
      {state.reviews
        .filter((r) => r.sessionId === session.id)
        .map((r) => (
          <View key={r.id} style={styles.stack}>
            <Copy kind="section">Coach feedback</Copy>
            <Copy>{r.feedback}</Copy>
            <Copy muted>{r.observation}</Copy>
            <Copy>{r.recommendation}</Copy>
            <Copy muted>Next action · {r.followUp}</Copy>
          </View>
        ))}
      {saved ? (
        <>
          <Copy muted>
            RPE {session.rpe}/10 · {session.feeling}
          </Copy>
          {session.note && <Copy>{session.note}</Copy>}
          <SecondaryButton
            title="Back to workouts"
            onPress={() => router.replace("/swimmer/workouts")}
          />
        </>
      ) : (
        <>
          <RPESelector value={rpe} onChange={setRpe} />
          <Copy>How did it feel?</Copy>
          <Choice
            options={["Strong", "Steady", "Heavy"]}
            value={feeling}
            onChange={setFeeling}
          />
          <Field
            label="Optional training note"
            value={note}
            onChangeText={setNote}
            multiline
          />
          <PrimaryButton
            title="Save session"
            onPress={() => {
              const completed = {
                ...session,
                completedAt: new Date().toISOString(),
                rpe,
                feeling,
                note,
              };
              update((s) => ({
                ...s,
                sessions: [...s.sessions, completed],
                active: null,
              }));
              router.replace({
                pathname: "/swimmer/workout/complete",
                params: { sessionId: session.id },
              });
            }}
          />
        </>
      )}
    </Screen>
  );
}
