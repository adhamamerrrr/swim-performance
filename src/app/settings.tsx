import {
AppCard,
Choice,
Copy,
Screen,
SecondaryButton,
SectionHeader,
styles,
} from "@/components/ui";
import { colors } from "@/constants/theme";
import { useApp } from "@/hooks/useApp";
import { router } from "expo-router";
import { useState } from "react";
import { Switch,View } from "react-native";
export default function Settings() {
  const { state, update } = useApp();
  const [info, setInfo] = useState("");
  return (
    <Screen>
      <Copy kind="heading">Your preferences</Copy>
      <SectionHeader title="Display units" />
      <Choice
        options={["Meters", "Yards"]}
        value={state.settings.units}
        onChange={(v) =>
          update((s) => ({
            ...s,
            settings: {
              ...s.settings,
              units: v === "Yards" ? "Yards" : "Meters",
            },
          }))
        }
      />
      <Copy muted>
        Race results retain their original event distance. Workout summaries use
        your display preference.
      </Copy>
      <SectionHeader title="Preferred pool" />
      <Choice
        options={["25m", "50m"]}
        value={`${state.settings.poolLength}m`}
        onChange={(v) =>
          update((s) => ({
            ...s,
            settings: { ...s.settings, poolLength: v === "25m" ? 25 : 50 },
          }))
        }
      />
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Copy>Notification preference</Copy>
          <Copy kind="meta" muted>
            LOCAL PREFERENCE · DELIVERY REQUIRES BACKEND
          </Copy>
        </View>
        <Switch
          accessibilityLabel="Notification preference"
          value={state.settings.notifications}
          trackColor={{ true: colors.accentPrimary }}
          onValueChange={(v) =>
            update((s) => ({
              ...s,
              settings: { ...s.settings, notifications: v },
            }))
          }
        />
      </View>
      <SectionHeader title="Appearance" />
      <Copy>Night pool · Dark appearance</Copy>
      <SectionHeader title="Coach connection" />
      <View style={styles.row}>
        <Copy>Coach Maya Rivers</Copy>
        <Switch
          accessibilityLabel="Local coach connection preference"
          value={state.settings.coachConnected}
          onValueChange={(v) =>
            update((s) => ({
              ...s,
              settings: { ...s.settings, coachConnected: v },
            }))
          }
        />
      </View>
      <SectionHeader title="Account" />
      <SecondaryButton
        title="Edit local profile"
        onPress={() => router.push("/onboarding")}
      />
      <SecondaryButton
        title="About your data"
        onPress={() =>
          setInfo(
            "Training data is stored locally on this device. Account sign-in, cloud sync, remote coach invitations, and notification delivery are not connected yet.",
          )
        }
      />
      {info && (
        <AppCard>
          <Copy>{info}</Copy>
        </AppCard>
      )}
    </Screen>
  );
}
