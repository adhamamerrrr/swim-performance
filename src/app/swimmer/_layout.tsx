import { colors } from "@/constants/theme";
import { Stack } from "expo-router";
export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgPrimary },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="workout/[id]" options={{ title: "Workout" }} />
      <Stack.Screen name="workout/active" options={{ title: "In the pool" }} />
      <Stack.Screen
        name="workout/complete"
        options={{ title: "Session summary" }}
      />
      <Stack.Screen name="progress/[id]" options={{ title: "Performance" }} />
      <Stack.Screen
        name="progress/new"
        options={{ title: "Record performance" }}
      />
      <Stack.Screen name="goals/[id]" options={{ title: "Your goal" }} />
      <Stack.Screen name="goals/new" options={{ title: "New goal" }} />
      <Stack.Screen name="insight/[id]" options={{ title: "Coach insight" }} />
    </Stack>
  );
}
