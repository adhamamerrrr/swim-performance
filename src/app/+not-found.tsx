import { EmptyState,Screen } from "@/components/ui";
import { router } from "expo-router";
export default function NotFound() {
  return (
    <Screen>
      <EmptyState
        title="This lane is closed"
        detail="Return to your training space."
        action="Go home"
        onPress={() => router.replace("/")}
      />
    </Screen>
  );
}
