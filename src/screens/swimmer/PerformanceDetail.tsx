import {
Copy,
EmptyState,
MetricDisplay,
Screen,
SectionHeader,
StatusBadge,
styles,
} from "@/components/ui";
import { colors } from "@/constants/theme";
import { events } from "@/data/mockData";
import { useApp } from "@/hooks/useApp";
import { dateText,eventName,timeText } from "@/utils/performance";
import { router,useLocalSearchParams } from "expo-router";
import { View } from "react-native";
export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();
  const result = state.performances.find((p) => p.id === id);
  if (!result)
    return (
      <Screen>
        <EmptyState
          title="Result unavailable"
          detail="Choose a result from your timeline."
          action="View progress"
          onPress={() => router.replace("/swimmer/progress")}
        />
      </Screen>
    );
  const list = state.performances.filter(
    (p) => p.swimmerId === result.swimmerId && p.eventId === result.eventId,
  );
  const previous = [...list]
    .filter((p) => p.date < result.date)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const pb = Math.min(...list.map((p) => p.time));
  const season = list.filter(
    (p) => p.date.slice(0, 4) === result.date.slice(0, 4),
  );
  const sb = Math.min(...season.map((p) => p.time));
  const goal = state.goals.find(
    (g) => g.eventId === result.eventId && g.swimmerId === result.swimmerId,
  );
  return (
    <Screen>
      <Copy kind="section">
        {eventName(events.find((e) => e.id === result.eventId)!)}
      </Copy>
      <MetricDisplay label={result.meet} value={timeText(result.time)} hero />
      <Copy muted>
        {dateText(result.date)} · {result.source} ·{" "}
        {events.find((e) => e.id === result.eventId)?.poolLength}m pool
      </Copy>
      {result.time === pb ? <StatusBadge status="Success" /> : null}
      <Copy color={colors.accentSecondary}>
        {result.time === pb
          ? "PERSONAL BEST"
          : result.time === sb
            ? "SEASON BEST"
            : "Recorded performance"}
      </Copy>
      <SectionHeader title="In context" />
      {previous ? (
        <>
          <Copy>Previous · {timeText(previous.time)}</Copy>
          <Copy kind="section">
            {Math.abs(previous.time - result.time).toFixed(2)}s{" "}
            {result.time <= previous.time ? "faster" : "slower"}
          </Copy>
        </>
      ) : (
        <Copy muted>Your baseline performance.</Copy>
      )}
      {goal && (
        <Copy muted>
          {Math.max(0, result.time - goal.target).toFixed(2)}s from goal{" "}
          {timeText(goal.target)}
        </Copy>
      )}
      {result.splits && (
        <>
          <SectionHeader title="Race splits" />
          {Object.entries(result.splits).map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Copy muted>
                {label === "first25"
                  ? "First 25m"
                  : label === "second25"
                    ? "Second 25m"
                    : label === "reaction"
                      ? "Reaction"
                      : "Finish estimate"}
              </Copy>
              <Copy>{value.toFixed(2)}s</Copy>
            </View>
          ))}
          <Copy kind="meta" muted>
            REACTION INCLUDED IN FIRST 25M · FINISH IS AN ESTIMATE
          </Copy>
        </>
      )}
    </Screen>
  );
}
