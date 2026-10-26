import { PerformanceTimeline } from "@/components/cards";
import { PerformanceChart } from "@/components/charts";
import {
Choice,
Copy,
EmptyState,
MetricDisplay,
Screen,
SecondaryButton,
SectionHeader,
} from "@/components/ui";
import { EventSelector } from "@/components/workout/Selectors";
import { router } from "expo-router";
import { useState } from "react";

import { useApp } from "@/hooks/useApp";
import { useAthlete } from "@/hooks/useAthlete";
import { timeText,trend } from "@/utils/performance";
export default function Progress() {
  const a = useAthlete();
  const { state } = useApp();
  const [eventId, setEvent] = useState(a.event.id);
  const [range, setRange] = useState("6M");
  const all = state.performances.filter(
    (p) => p.swimmerId === "alex" && p.eventId === eventId,
  );
  const months: Record<string, number> = {
    "1M": 1,
    "3M": 3,
    "6M": 6,
    "1Y": 12,
    ALL: 120,
  };
  const cutoff = new Date("2026-10-13T12:00:00");
  cutoff.setMonth(cutoff.getMonth() - (months[range] ?? 6));
  const shown = all.filter((p) => new Date(p.date) >= cutoff);
  const pb = all.length ? Math.min(...all.map((p) => p.time)) : undefined;
  const goal = state.goals.find(
    (g) => g.eventId === eventId && g.swimmerId === "alex",
  );
  const sb = all.filter((p) => p.date.startsWith("2026")).map((p) => p.time);
  return (
    <Screen>
      <Copy kind="heading">Find your rhythm</Copy>
      <EventSelector value={eventId} onChange={setEvent} />
      {all.length ? (
        <MetricDisplay
          label="Season best"
          value={timeText(sb.length ? Math.min(...sb) : pb!)}
          hero
        />
      ) : (
        <EmptyState
          title="A clean starting line"
          detail="Record a performance for this event to begin your trend."
        />
      )}
      <SecondaryButton
        title="Record a performance"
        onPress={() =>
          router.push({
            pathname: "/swimmer/progress/new",
            params: { eventId },
          })
        }
      />
      <Choice
        options={["1M", "3M", "6M", "1Y", "ALL"]}
        value={range}
        onChange={setRange}
      />
      <PerformanceChart results={shown} goal={goal?.target} pb={pb} />
      <Copy kind="section">
        {shown.length > 1
          ? `${Math.abs(trend(shown)).toFixed(2)}s ${trend(shown) >= 0 ? "improvement" : "slower"} in this range`
          : "More race efforts will reveal your trend."}
      </Copy>
      <SectionHeader title="Performance timeline" />
      <PerformanceTimeline
        results={shown}
        onPress={(id) =>
          router.push({ pathname: "/swimmer/progress/[id]", params: { id } })
        }
      />
    </Screen>
  );
}
