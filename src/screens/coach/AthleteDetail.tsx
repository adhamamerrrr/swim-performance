import { PerformanceTimeline } from "@/components/cards";
import { GoalVisualization } from "@/components/charts";
import {
AppCard,
Copy,
EmptyState,
MetricDisplay,
PrimaryButton,
Screen,
SectionHeader,
StatusBadge,
styles,
} from "@/components/ui";
import { events } from "@/data/mockData";
import { useApp } from "@/hooks/useApp";
import { athleteSignal } from "@/utils/coach";
import { eventName,timeText } from "@/utils/performance";
import { router,useLocalSearchParams } from "expo-router";
import { View } from "react-native";
export default function Athlete() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();
  const source = state.swimmers.find((s) => s.id === id);
  const athlete = source
    ? athleteSignal(source, state.performances, state.sessions)
    : undefined;
  if (!athlete)
    return (
      <Screen>
        <EmptyState
          title="Athlete unavailable"
          detail="Choose a swimmer from your team."
          action="View swimmers"
          onPress={() => router.replace("/coach/swimmers")}
        />
      </Screen>
    );
  const results = state.performances.filter(
    (p) => p.swimmerId === id && p.eventId === athlete.primaryEventId,
  );
  const latest = [...results].sort((a, b) => b.date.localeCompare(a.date))[0];
  const pb = results.length ? Math.min(...results.map((p) => p.time)) : 0;
  const goal = state.goals.find(
    (g) => g.swimmerId === id && g.eventId === athlete.primaryEventId,
  );
  const sessions = state.sessions.filter((s) => s.swimmerId === id);
  return (
    <Screen>
      <Copy kind="heading">{athlete.name}</Copy>
      <Copy muted>
        {eventName(events.find((e) => e.id === athlete.primaryEventId)!)}
      </Copy>
      <StatusBadge status={athlete.status} />
      <View style={styles.row}>
        <MetricDisplay label="PB" value={timeText(pb)} />
        <MetricDisplay
          label="Season best"
          value={timeText(
            Math.min(
              ...results
                .filter((r) => r.date.startsWith("2026"))
                .map((r) => r.time),
            ),
          )}
        />
      </View>
      {goal && (
        <>
          <SectionHeader title="Current goal" />
          <GoalVisualization
            current={latest?.time ?? pb}
            pb={pb}
            target={goal.target}
            baseline={goal.baseline}
          />
        </>
      )}
      <SectionHeader title="Recent performances" />
      <PerformanceTimeline
        results={results.slice(-3)}
        onPress={(id) =>
          router.push({ pathname: "/swimmer/progress/[id]", params: { id } })
        }
      />
      <SectionHeader title="Training consistency" />
      <Copy>
        {sessions.length} recorded sessions in the demo history ·{" "}
        {athlete.frequency} planned per week
      </Copy>
      <Copy muted>
        Latest effort · RPE {sessions.at(-1)?.rpe ?? "not recorded"}/10.
        Attendance requires a full training calendar to calculate reliably.
      </Copy>
      <SectionHeader title="Recent workouts" />
      {sessions.map((s) => (
        <AppCard
          key={s.id}
          onPress={() =>
            router.push({
              pathname: "/coach/review/[id]",
              params: { id: s.id },
            })
          }
        >
          <Copy>{state.workouts.find((w) => w.id === s.workoutId)?.title}</Copy>
          <Copy muted>{s.note}</Copy>
        </AppCard>
      ))}
      <SectionHeader title="Coach notes" />
      {state.notes
        .filter((n) => n.swimmerId === id)
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
      <PrimaryButton
        title="Add Insight"
        onPress={() =>
          router.push({
            pathname: "/coach/insight/new",
            params: { swimmerId: id },
          })
        }
      />
    </Screen>
  );
}
