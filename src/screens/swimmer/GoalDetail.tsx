import { GoalVisualization,PerformanceChart } from "@/components/charts";
import {
AppCard,
Copy,
EmptyState,
MetricDisplay,
Screen,
SectionHeader,
StatusBadge,
} from "@/components/ui";
import { events } from "@/data/mockData";
import { useApp } from "@/hooks/useApp";
import { dateText,eventName,timeText } from "@/utils/performance";
import { router,useLocalSearchParams } from "expo-router";
export default function GoalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();
  const goal = state.goals.find((g) => g.id === id);
  if (!goal)
    return (
      <Screen>
        <EmptyState
          title="Goal unavailable"
          detail="Choose a current goal."
          action="View goals"
          onPress={() => router.replace("/swimmer/goals")}
        />
      </Screen>
    );
  const results = state.performances.filter(
    (p) => p.eventId === goal.eventId && p.swimmerId === goal.swimmerId,
  );
  const current =
    [...results].sort((a, b) => b.date.localeCompare(a.date))[0]?.time ??
    goal.baseline;
  const pb = results.length
    ? Math.min(...results.map((p) => p.time))
    : goal.baseline;
  return (
    <Screen>
      <Copy kind="section">
        {eventName(events.find((e) => e.id === goal.eventId)!)}
      </Copy>
      <MetricDisplay label="Your target" value={timeText(goal.target)} hero />
      <StatusBadge
        status={current <= goal.target ? "Completed" : goal.status}
      />
      <Copy muted>By {dateText(goal.targetDate)}</Copy>
      <GoalVisualization
        current={current}
        pb={pb}
        target={goal.target}
        baseline={goal.baseline}
      />
      <Copy kind="section">
        {Math.max(0, current - goal.target).toFixed(2)}s to your target
      </Copy>
      <Copy muted>
        {current > goal.target
          ? (((current - goal.target) / current) * 100).toFixed(1) +
            "% improvement required"
          : "You have reached this goal."}
      </Copy>
      <SectionHeader title="Progress history" />
      <PerformanceChart results={results} goal={goal.target} pb={pb} />
      <SectionHeader title="Milestones" />
      {goal.milestones.map((m, i) => (
        <Copy key={m}>
          {i + 1}. {m}
        </Copy>
      ))}
      <SectionHeader title="Coach notes" />
      {state.notes
        .filter((n) => n.swimmerId === goal.swimmerId)
        .map((n) => (
          <AppCard
            key={n.id}
            onPress={() =>
              router.push({
                pathname: "/swimmer/insight/[id]",
                params: { id: n.id },
              })
            }
          >
            <Copy kind="section">{n.title}</Copy>
            <Copy muted>{n.recommendation}</Copy>
          </AppCard>
        ))}
    </Screen>
  );
}
