import {
BottomSheet,
Copy,
EmptyState,
Field,
PrimaryButton,
Screen,
SecondaryButton,
StatusBadge,
styles,
} from "@/components/ui";
import { colors,spacing,typography } from "@/constants/theme";
import { useApp } from "@/hooks/useApp";
import { parseTime } from "@/utils/performance";
import { router,useLocalSearchParams } from "expo-router";
import { useEffect,useState } from "react";
import { Alert,TextInput,View } from "react-native";
export default function Active() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, update } = useApp();
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const workout =
    state.active?.workoutSnapshot ??
    state.workouts.find((w) => w.id === (state.active?.workoutId ?? id));
  const active = state.active;
  useEffect(() => {
    if (!active && workout)
      update((s) => ({
        ...s,
        active: {
          id: "session-" + Date.now(),
          workoutId: workout.id,
          workoutSnapshot: workout,
          swimmerId: workout.swimmerId,
          startedAt: new Date().toISOString(),
          entries: [],
        },
      }));
  }, [active, workout, update]);
  if (!workout)
    return (
      <Screen>
        <EmptyState
          title="Choose a workout first"
          detail="Your assigned sessions are ready."
          action="View workouts"
          onPress={() => router.replace("/swimmer/workouts")}
        />
      </Screen>
    );
  const positions = workout.sets.flatMap((set) =>
    Array.from({ length: set.reps }, (_, i) => ({ set, rep: i + 1 })),
  );
  const position = positions[active?.entries.length ?? 0];
  const entries = active?.entries ?? [];
  const save = (skip = false) => {
    if (!active || !position) return;
    const n = parseTime(time);
    if (!skip && n === null) {
      setError("Enter a positive time in seconds or m:ss, such as 27.4.");
      return;
    }
    update((s) =>
      s.active?.entries.length !== entries.length
        ? s
        : {
            ...s,
            active:
              s.active && s.active.entries.length === entries.length
                ? {
                    ...s.active,
                    entries: [
                      ...s.active.entries,
                      {
                        setId: position.set.id,
                        rep: position.rep,
                        time: skip ? null : n,
                        skipped: skip,
                      },
                    ],
                  }
                : null,
          },
    );
    setTime("");
    setError("");
  };
  return (
    <Screen>
      <Copy kind="meta" muted>
        {workout.title.toUpperCase()}
      </Copy>
      {position ? (
        <>
          <StatusBadge status="Pending" />
          <Copy kind="meta" color={colors.accentPrimary}>
            {position.set.section.toUpperCase()} · REP {position.rep} OF{" "}
            {position.set.reps}
          </Copy>
          <Copy kind="heading">
            {position.set.distance}m {position.set.stroke}
          </Copy>
          <Copy muted>
            TARGET ·{" "}
            {position.set.target
              ? `${position.set.target[0].toFixed(1)}–${position.set.target[1].toFixed(1)}s`
              : position.set.intensity}
          </Copy>
          <Copy muted>Rest after this rep · {position.set.rest}s</Copy>
          <TextInput
            accessibilityLabel="Rep time in seconds"
            keyboardType="decimal-pad"
            value={time}
            onChangeText={setTime}
            placeholder="27.4"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accentPrimary}
            style={[
              styles.input,
              typography.hero,
              { padding: spacing.lg, textAlign: "center" },
            ]}
          />
          {error && <Copy color={colors.danger}>{error}</Copy>}
          <PrimaryButton title="Save Rep" onPress={() => save()} />
          <SecondaryButton title="Skip rep" onPress={() => save(true)} />
        </>
      ) : (
        <>
          <Copy kind="heading">All reps recorded</Copy>
          <Copy muted>Finish with a quick check-in.</Copy>
          <PrimaryButton
            title="Complete Workout"
            onPress={() => router.replace("/swimmer/workout/complete")}
          />
        </>
      )}
      <SecondaryButton
        title="Edit Previous"
        disabled={!entries.length}
        onPress={() => {
          setEditIndex(entries.length - 1);
          setTime(String(entries.at(-1)?.time ?? ""));
          setEdit(true);
        }}
      />
      <Copy kind="section">Recent reps</Copy>
      {entries.slice(-5).map((e) => (
        <View key={e.setId + "-" + e.rep} style={styles.row}>
          <Copy muted>
            {workout.sets.find((s) => s.id === e.setId)?.distance}m · Rep{" "}
            {e.rep}
          </Copy>
          <Copy>{e.skipped ? "Skipped" : e.time?.toFixed(2) + "s"}</Copy>
        </View>
      ))}
      <SecondaryButton
        title="Finish session early"
        disabled={!entries.length}
        onPress={() =>
          Alert.alert(
            "Finish this session?",
            "Unrecorded reps will remain incomplete.",
            [
              { text: "Continue training", style: "cancel" },
              {
                text: "Finish",
                onPress: () => router.replace("/swimmer/workout/complete"),
              },
            ],
          )
        }
      />
      <BottomSheet
        visible={edit}
        onDismiss={() => {
          setEdit(false);
          setTime("");
        }}
      >
        <Copy kind="section">Edit recorded rep</Copy>
        <Field
          label="Rep time"
          value={time}
          onChangeText={setTime}
          keyboardType="decimal-pad"
        />
        {error && <Copy color={colors.danger}>{error}</Copy>}
        <PrimaryButton
          title="Save correction"
          onPress={() => {
            const n = parseTime(time);
            if (n === null) {
              setError("Enter a valid positive time.");
              return;
            }
            update((s) => ({
              ...s,
              active: s.active
                ? {
                    ...s.active,
                    entries: s.active.entries.map((e, i) =>
                      i === editIndex ? { ...e, time: n, skipped: false } : e,
                    ),
                  }
                : null,
            }));
            setEdit(false);
            setTime("");
            setError("");
          }}
        />
      </BottomSheet>
    </Screen>
  );
}
