import {
CoachInsight,
PerformanceTimeline,
WorkoutPreview,
} from "@/components/cards";
import { GoalVisualization } from "@/components/charts";
import {
Copy,
MetricDisplay,
PrimaryButton,
Screen,
SectionHeader,
StatusBadge,
styles,
} from "@/components/ui";
import { spacing } from "@/constants/theme";
import { useApp } from "@/hooks/useApp";
import { useAthlete } from "@/hooks/useAthlete";
import { eventName,timeText } from "@/utils/performance";
import { router } from "expo-router";
import { View } from "react-native";
export default function Home() {
  const { athlete, event, pb, current, seasonBest, goal, latest } =
    useAthlete();
  const { state } = useApp();
  const workout = state.workouts.find((w) => w.swimmerId === athlete.id)!;
  const note = state.notes.find((n) => n.swimmerId === athlete.id);
  return (
    <Screen>
      <Copy kind="meta" muted>
        GOOD MORNING
      </Copy>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Copy kind="heading">{athlete.name}</Copy>
        </View>
        <StatusBadge status={athlete.status} />
      </View>
      <Copy muted>Race preparation · Build speed with control</Copy>
      <View style={{ gap: spacing.md, paddingVertical: spacing.lg }}>
        <Copy kind="section">{eventName(event)}</Copy>
        <MetricDisplay
          label={`Season best · ${event.poolLength}m pool`}
          value={seasonBest === undefined ? "—" : timeText(seasonBest)}
          hero
        />
        <View style={styles.row}>
          <Copy muted>PB {timeText(pb)}</Copy>
          <Copy muted>
            Goal {goal ? timeText(goal.target) : "Set your target"}
          </Copy>
        </View>
      </View>
      <SectionHeader title="Today’s training" />
      <WorkoutPreview
        workout={workout}
        onPress={() =>
          router.push({
            pathname: "/swimmer/workout/[id]",
            params: { id: workout.id },
          })
        }
        completed={state.sessions.some(
          (s) =>
            s.workoutId === workout.id &&
            s.completedAt?.startsWith(new Date().toISOString().slice(0, 10)),
        )}
      />
      <PrimaryButton
        title={state.active ? "Resume Workout" : "Start Workout"}
        onPress={() =>
          router.push({
            pathname: "/swimmer/workout/active",
            params: { id: state.active?.workoutId ?? workout.id },
          })
        }
      />
      <SectionHeader title="Latest performance" />
      {latest ? (
        <PerformanceTimeline
          results={[latest]}
          onPress={(id) =>
            router.push({ pathname: "/swimmer/progress/[id]", params: { id } })
          }
        />
      ) : (
        <Copy muted>Your first performance will establish a baseline.</Copy>
      )}
      {note && (
        <>
          <SectionHeader title="Coach insight" />
          <CoachInsight
            note={note}
            onPress={() =>
              router.push({
                pathname: "/swimmer/insight/[id]",
                params: { id: note.id },
              })
            }
          />
        </>
      )}
      {goal && (
        <>
          <SectionHeader
            title="Progress toward goal"
            action="View goal"
            onPress={() =>
              router.push({
                pathname: "/swimmer/goals/[id]",
                params: { id: goal.id },
              })
            }
          />
          <GoalVisualization
            current={current}
            pb={pb}
            target={goal.target}
            baseline={goal.baseline}
          />
        </>
      )}
    </Screen>
  );
}
