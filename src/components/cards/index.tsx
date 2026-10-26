import { AppCard,Copy,StatusBadge,styles } from "@/components/ui";
import { colors,spacing } from "@/constants/theme";
import { CoachNote,PerformanceResult,Workout,WorkoutSet } from "@/types";
import { dateText,timeText } from "@/utils/performance";
import { View } from "react-native";
export function WorkoutPreview({
  workout,
  onPress,
  completed = false,
}: {
  workout: Workout;
  onPress: () => void;
  completed?: boolean;
}) {
  return (
    <AppCard onPress={onPress} label={`View ${workout.title}`}>
      <Copy kind="section">{workout.title}</Copy>
      <Copy muted>{workout.focus}</Copy>
      <View style={styles.row}>
        <Copy muted>
          {workout.duration} min · {workout.sets.length} sets
        </Copy>
        <StatusBadge status={completed ? "Completed" : "Pending"} />
      </View>
    </AppCard>
  );
}
export function SetRow({ set }: { set: WorkoutSet }) {
  return (
    <View
      style={{
        gap: spacing.sm,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Copy kind="section">
        {set.reps} × {set.distance}m {set.stroke}
      </Copy>
      <Copy muted>
        {set.target
          ? `Target ${set.target[0].toFixed(1)}–${set.target[1].toFixed(1)}s · `
          : ""}
        {set.rest}s rest
      </Copy>
      <Copy kind="meta" muted>
        {set.intensity}
      </Copy>
    </View>
  );
}
export function CoachInsight({
  note,
  onPress,
}: {
  note: CoachNote;
  onPress: () => void;
}) {
  return (
    <AppCard onPress={onPress} label={`Read insight: ${note.title}`}>
      <Copy kind="meta" muted>
        COACH MAYA · {dateText(note.date)}
      </Copy>
      <Copy kind="section">{note.title}</Copy>
      <Copy muted>{note.observation}</Copy>
      <Copy>Read insight →</Copy>
    </AppCard>
  );
}
export function PerformanceTimeline({
  results,
  onPress,
  athleteNames,
}: {
  athleteNames?: Record<string, string>;
  results: PerformanceResult[];
  onPress: (id: string) => void;
}) {
  return (
    <View style={{ gap: spacing.md }}>
      {[...results]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((p) => (
          <AppCard
            key={p.id}
            onPress={() => onPress(p.id)}
            label={`View ${p.meet} result ${timeText(p.time)}`}
          >
            <View style={styles.row}>
              <View style={styles.stack}>
                <Copy>{athleteNames?.[p.swimmerId] ?? p.meet}</Copy>
                <Copy kind="meta" muted>
                  {athleteNames ? `${p.meet} · ` : ""}
                  {dateText(p.date)} · {p.source}
                </Copy>
              </View>
              <Copy kind="section">{timeText(p.time)}</Copy>
            </View>
          </AppCard>
        ))}
    </View>
  );
}
