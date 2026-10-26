import {
Copy,
EmptyState,
Field,
PrimaryButton,
Screen,
SectionHeader,
StatusBadge,
styles,
} from "@/components/ui";
import { colors } from "@/constants/theme";
import { useApp } from "@/hooks/useApp";
import { consistencySummary } from "@/utils/performance";
import { router,useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
export default function Review() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, update } = useApp();
  const session = state.sessions.find((s) => s.id === id);
  const workout =
    session?.workoutSnapshot ??
    state.workouts.find((w) => w.id === session?.workoutId);
  const existing = state.reviews.find((r) => r.sessionId === id);
  const [feedback, setFeedback] = useState(existing?.feedback ?? "");
  const [observation, setObservation] = useState(existing?.observation ?? "");
  const [recommendation, setRecommendation] = useState(
    existing?.recommendation ?? "",
  );
  const [followUp, setFollowUp] = useState(existing?.followUp ?? "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  if (!session || !workout)
    return (
      <Screen>
        <EmptyState
          title="Review unavailable"
          detail="Choose a completed workout."
          action="Review workouts"
          onPress={() => router.replace("/coach/workouts")}
        />
      </Screen>
    );
  return (
    <Screen>
      <Copy kind="heading">
        {state.swimmers.find((s) => s.id === session.swimmerId)?.name}
      </Copy>
      <Copy kind="section">{workout.title}</Copy>
      <StatusBadge status={existing ? "Completed" : "Pending"} />
      <Copy muted>
        RPE {session.rpe}/10 · {session.feeling}
      </Copy>
      <Copy>{session.note || "No athlete note recorded."}</Copy>
      <SectionHeader title="Target & actual" />
      {workout.sets.map((set) => {
        const entries = session.entries.filter(
          (e) => e.setId === set.id && !e.skipped && e.time !== null,
        );
        const times = entries.map((e) => e.time as number);
        const mean = times.length
          ? times.reduce((a, b) => a + b, 0) / times.length
          : 0;
        return (
          <View key={set.id} style={styles.stack}>
            <Copy>
              {set.reps} × {set.distance}m {set.stroke}
            </Copy>
            <Copy muted>
              Target {set.target ? set.target.join("–") + "s" : set.intensity} ·
              Actual{" "}
              {times.length ? mean.toFixed(2) + "s average" : "Not logged"} ·{" "}
              {entries.length}/{set.reps} reps
            </Copy>
          </View>
        );
      })}
      <SectionHeader title="Consistency" />
      <Copy>
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
      <Field
        label="Feedback"
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />
      <Field
        label="Performance observation"
        value={observation}
        onChangeText={setObservation}
        multiline
      />
      <Field
        label="Recommendation"
        value={recommendation}
        onChangeText={setRecommendation}
        multiline
      />
      <Field
        label="Follow-up action"
        value={followUp}
        onChangeText={setFollowUp}
        multiline
      />
      {error && <Copy color={colors.danger}>{error}</Copy>}
      {saved && (
        <Copy color={colors.accentSecondary}>
          Review saved. It is available to the athlete on this device.
        </Copy>
      )}
      <PrimaryButton
        title={existing ? "Update review" : "Save review"}
        onPress={() => {
          if (
            [feedback, observation, recommendation, followUp].some(
              (v) => !v.trim(),
            )
          ) {
            setError(
              "Complete all four fields to make this feedback actionable.",
            );
            return;
          }
          const review = {
            id: existing?.id ?? "review-" + Date.now(),
            sessionId: id,
            coachId: "coach1",
            feedback: feedback.trim(),
            observation: observation.trim(),
            recommendation: recommendation.trim(),
            followUp: followUp.trim(),
            date: new Date().toISOString().slice(0, 10),
          };
          update((s) => ({
            ...s,
            reviews: [...s.reviews.filter((r) => r.sessionId !== id), review],
          }));
          setError("");
          setSaved(true);
        }}
      />
    </Screen>
  );
}
