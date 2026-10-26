import { PerformanceTimeline } from "@/components/cards";
import {
Copy,
EmptyState,
PrimaryButton,
Screen,
SectionHeader,
} from "@/components/ui";
import { colors } from "@/constants/theme";
import { useApp } from "@/hooks/useApp";
import { dateText } from "@/utils/performance";
import { router,useLocalSearchParams } from "expo-router";
export default function Insight() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();
  const note = state.notes.find((n) => n.id === id);
  if (!note)
    return (
      <Screen>
        <EmptyState
          title="Insight unavailable"
          detail="Your coach’s latest notes are on your home screen."
          action="Home"
          onPress={() => router.replace("/swimmer/home")}
        />
      </Screen>
    );
  return (
    <Screen>
      <Copy kind="meta" muted>
        COACH MAYA RIVERS · {dateText(note.date)}
      </Copy>
      <Copy kind="heading">{note.title}</Copy>
      <SectionHeader title="What changed" />
      <Copy>{note.observation}</Copy>
      <SectionHeader title="Why it matters" />
      <Copy muted>{note.why}</Copy>
      <SectionHeader title="Supporting performances" />
      <PerformanceTimeline
        results={state.performances.filter((p) =>
          note.performanceIds.includes(p.id),
        )}
        onPress={(id) =>
          router.push({ pathname: "/swimmer/progress/[id]", params: { id } })
        }
      />
      <SectionHeader title="Coach recommendation" />
      <Copy>{note.recommendation}</Copy>
      <SectionHeader title="Your next action" />
      <Copy color={colors.accentPrimary}>{note.action}</Copy>
      <PrimaryButton
        title="View training"
        onPress={() => router.push("/swimmer/workouts")}
      />
    </Screen>
  );
}
