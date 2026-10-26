import {
AppCard,
Avatar,
Copy,
MetricDisplay,
Screen,
SecondaryButton,
styles,
} from "@/components/ui";
import { useApp } from "@/hooks/useApp";
import { useAthlete } from "@/hooks/useAthlete";
import { eventName,timeText } from "@/utils/performance";
import { router } from "expo-router";
import { View } from "react-native";
export default function Profile() {
  const { state, update } = useApp();
  const a = useAthlete();
  const isCoach = state.profile?.role === "coach";
  return (
    <Screen>
      <Avatar name={state.profile?.name ?? a.athlete.name} />
      <Copy kind="heading">
        {isCoach ? (state.profile?.name ?? "Maya Rivers") : a.athlete.name}
      </Copy>
      <Copy muted>
        {state.profile?.team ?? a.athlete.team} ·{" "}
        {isCoach ? "Coach" : (state.profile?.sport ?? "Swimming")}
      </Copy>
      {!isCoach && (
        <>
          <Copy kind="section">{eventName(a.event)}</Copy>
          <View style={styles.row}>
            <MetricDisplay label="Personal best" value={timeText(a.pb)} />
            <MetricDisplay
              label="Goal"
              value={a.goal ? timeText(a.goal.target) : "—"}
            />
          </View>
          <AppCard>
            <Copy kind="section">Training profile</Copy>
            <Copy muted>
              {state.profile?.frequency ?? 6} sessions each week ·{" "}
              {state.settings.poolLength}m preferred pool
            </Copy>
            <Copy muted>
              {state.settings.coachConnected
                ? "Connected to Coach Maya Rivers"
                : "Coach connection paused"}
            </Copy>
          </AppCard>
        </>
      )}
      <SecondaryButton
        title="Settings"
        onPress={() => router.push("/settings")}
      />
      <SecondaryButton
        title={isCoach ? "Explore swimmer mode" : "Explore coach mode"}
        onPress={() => {
          update((s) => ({
            ...s,
            profile: { ...s.profile!, role: isCoach ? "swimmer" : "coach" },
          }));
          router.replace(isCoach ? "/swimmer/home" : "/coach/home");
        }}
      />
      <SecondaryButton
        title="Edit profile"
        onPress={() => router.push("/onboarding")}
      />
      <Copy kind="meta" muted>
        LOCAL DEMO · DATA STAYS ON THIS DEVICE
      </Copy>
    </Screen>
  );
}
