import { GoalVisualization } from "@/components/charts";
import {
AppCard,
Copy,
EmptyState,
PrimaryButton,
Screen,
StatusBadge,
} from "@/components/ui";
import { events } from "@/data/mockData";
import { useApp } from "@/hooks/useApp";
import { dateText,eventName } from "@/utils/performance";
import { router } from "expo-router";
export default function Goals() {
  const { state } = useApp();
  const goals = state.goals.filter((g) => g.swimmerId === "alex");
  return (
    <Screen>
      <Copy kind="heading">A clear target</Copy>
      <Copy muted>Small improvements. Meaningful performances.</Copy>
      {goals.map((g) => {
        const r = state.performances.filter(
          (p) => p.swimmerId === "alex" && p.eventId === g.eventId,
        );
        const current =
          [...r].sort((a, b) => b.date.localeCompare(a.date))[0]?.time ??
          g.baseline;
        const pb = r.length ? Math.min(...r.map((p) => p.time)) : g.baseline;
        return (
          <AppCard
            key={g.id}
            onPress={() =>
              router.push({
                pathname: "/swimmer/goals/[id]",
                params: { id: g.id },
              })
            }
          >
            <Copy kind="section">
              {eventName(events.find((e) => e.id === g.eventId)!)}
            </Copy>
            <StatusBadge
              status={current <= g.target ? "Completed" : g.status}
            />
            <GoalVisualization
              current={current}
              pb={pb}
              target={g.target}
              baseline={g.baseline}
            />
            <Copy muted>Target · {dateText(g.targetDate)}</Copy>
          </AppCard>
        );
      })}
      {!goals.length && (
        <EmptyState
          title="Choose your next finish line"
          detail="Set a time target for an event you care about."
        />
      )}
      <PrimaryButton
        title="Create a goal"
        onPress={() => router.push("/swimmer/goals/new")}
      />
    </Screen>
  );
}
