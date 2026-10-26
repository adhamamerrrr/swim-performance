import { Copy,Field,PrimaryButton,Screen } from "@/components/ui";
import { EventSelector } from "@/components/workout/Selectors";
import { colors } from "@/constants/theme";
import { useApp } from "@/hooks/useApp";
import { useAthlete } from "@/hooks/useAthlete";
import { parseTime } from "@/utils/performance";
import { router } from "expo-router";
import { useState } from "react";
export default function NewGoal() {
  const { state, update } = useApp();
  const a = useAthlete();
  const [eventId, setEvent] = useState(a.event.id);
  const [baselineTime, setBaselineTime] = useState("");
  const hasBaseline = state.performances.some(
    (p) => p.swimmerId === "alex" && p.eventId === eventId,
  );
  const [target, setTarget] = useState("");
  const [date, setDate] = useState("2027-06-01");
  const [error, setError] = useState("");
  return (
    <Screen>
      <Copy kind="heading">Choose your finish line</Copy>
      <EventSelector value={eventId} onChange={setEvent} />
      <>
        {!hasBaseline && (
          <Field
            label="Current baseline time · seconds"
            value={baselineTime}
            onChangeText={setBaselineTime}
            keyboardType="decimal-pad"
          />
        )}
      </>
      <Field
        label="Target time (seconds or m:ss)"
        value={target}
        onChangeText={setTarget}
        keyboardType="decimal-pad"
      />
      <Field
        label="Target date · YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />
      {error && <Copy color={colors.danger}>{error}</Copy>}
      <PrimaryButton
        title="Create goal"
        onPress={() => {
          const n = parseTime(target);
          if (
            !n ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            !Number.isFinite(Date.parse(date)) ||
            new Date(date).toISOString().slice(0, 10) !== date ||
            date <= new Date().toISOString().slice(0, 10)
          ) {
            setError("Enter a valid time and a future target date.");
            return;
          }
          if (
            state.goals.some(
              (g) => g.swimmerId === "alex" && g.eventId === eventId,
            )
          ) {
            setError(
              "You already have a goal for this event. Choose another event.",
            );
            return;
          }
          const results = state.performances.filter(
            (p) => p.swimmerId === "alex" && p.eventId === eventId,
          );
          const baseline =
            [...results].sort((a, b) => b.date.localeCompare(a.date))[0]
              ?.time ?? parseTime(baselineTime);
          if (baseline === null) {
            setError("Enter your current baseline time for this event.");
            return;
          }
          if (n >= baseline) {
            setError("Choose a target faster than your current baseline.");
            return;
          }
          const id = "goal-" + Date.now();
          update((s) => ({
            ...s,
            goals: [
              ...s.goals,
              {
                id,
                swimmerId: "alex",
                eventId,
                target: n,
                baseline,
                targetDate: date,
                status: "Pending",
                milestones: [
                  "Record a baseline effort",
                  "Review progress with your coach",
                  "Race at your target meet",
                ],
              },
            ],
          }));
          router.replace({ pathname: "/swimmer/goals/[id]", params: { id } });
        }}
      />
    </Screen>
  );
}
