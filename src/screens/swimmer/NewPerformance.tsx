import { Choice,Copy,Field,PrimaryButton,Screen } from "@/components/ui";
import { EventSelector } from "@/components/workout/Selectors";
import { colors } from "@/constants/theme";
import { useApp } from "@/hooks/useApp";
import { parseTime } from "@/utils/performance";
import { router,useLocalSearchParams } from "expo-router";
import { useState } from "react";
export default function NewPerformance() {
  const params = useLocalSearchParams<{ eventId?: string }>();
  const { update } = useApp();
  const [eventId, setEvent] = useState(params.eventId ?? "free50");
  const [time, setTime] = useState("");
  const [meet, setMeet] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [source, setSource] = useState<"Competition" | "Training">(
    "Competition",
  );
  const [error, setError] = useState("");
  return (
    <Screen>
      <Copy kind="heading">Record your effort</Copy>
      <EventSelector value={eventId} onChange={setEvent} />
      <Field
        label="Time · seconds or m:ss"
        value={time}
        onChangeText={setTime}
        keyboardType="decimal-pad"
      />
      <Field label="Meet or session name" value={meet} onChangeText={setMeet} />
      <Field label="Date · YYYY-MM-DD" value={date} onChangeText={setDate} />
      <Choice
        options={["Competition", "Training"]}
        value={source}
        onChange={(v) =>
          setSource(v === "Training" ? "Training" : "Competition")
        }
      />
      {error && <Copy color={colors.danger}>{error}</Copy>}
      <PrimaryButton
        title="Save performance"
        onPress={() => {
          const n = parseTime(time);
          if (
            !n ||
            !meet.trim() ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            !Number.isFinite(Date.parse(date)) ||
            new Date(date).toISOString().slice(0, 10) !== date ||
            date > new Date().toISOString().slice(0, 10)
          ) {
            setError("Enter a valid time, name, and date no later than today.");
            return;
          }
          const id = "result-" + Date.now();
          update((s) => ({
            ...s,
            performances: [
              ...s.performances,
              {
                id,
                swimmerId: "alex",
                eventId,
                time: n,
                date,
                source,
                meet: meet.trim(),
              },
            ],
          }));
          router.replace({
            pathname: "/swimmer/progress/[id]",
            params: { id },
          });
        }}
      />
    </Screen>
  );
}
