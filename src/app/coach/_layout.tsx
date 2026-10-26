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
      <Stack.Screen name="swimmer/[id]" options={{ title: "Athlete" }} />
      <Stack.Screen name="review/[id]" options={{ title: "Workout review" }} />
      <Stack.Screen name="insight/new" options={{ title: "New insight" }} />
      <Stack.Screen name="workout/[id]" options={{ title: "Training plan" }} />
    </Stack>
  );
}
