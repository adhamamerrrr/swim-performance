import { BottomSheet,Choice,Copy,SecondaryButton } from "@/components/ui";
import { spacing } from "@/constants/theme";
import { events } from "@/data/mockData";
import { Sport } from "@/types";
import { eventName } from "@/utils/performance";
import { useState } from "react";
import { View } from "react-native";
export function EventSelector({
  value,
  onChange,
  sport,
  poolLength,
}: {
  value: string;
  onChange: (id: string) => void;
  sport?: Sport;
  poolLength?: 25 | 50;
}) {
  const [open, setOpen] = useState(false);
  const options = events.filter(
    (e) =>
      (!sport || e.sport === sport) &&
      (!poolLength || e.poolLength === poolLength),
  );
  return (
    <>
      <SecondaryButton
        title={
          eventName(events.find((e) => e.id === value) ?? events[0]!) + " ▾"
        }
        onPress={() => setOpen(true)}
      />
      <BottomSheet visible={open} onDismiss={() => setOpen(false)}>
        <Copy kind="section">Choose your event</Copy>
        {options.map((e) => (
          <SecondaryButton
            key={e.id}
            title={eventName(e) + (value === e.id ? " · Selected" : "")}
            onPress={() => {
              onChange(e.id);
              setOpen(false);
            }}
          />
        ))}
      </BottomSheet>
    </>
  );
}
export function RPESelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <View style={{ gap: spacing.sm }}>
      <Copy>Perceived effort · {value}/10</Copy>
      <Choice
        options={Array.from({ length: 10 }, (_, i) => String(i + 1))}
        value={String(value)}
        onChange={(v) => onChange(Number(v))}
      />
      <Copy kind="meta" muted>
        1 EASY · 5 MODERATE · 10 MAXIMAL
      </Copy>
    </View>
  );
}
