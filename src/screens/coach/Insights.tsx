import { CoachInsight } from "@/components/cards";
import { Copy,PrimaryButton,Screen } from "@/components/ui";
import { useApp } from "@/hooks/useApp";
import { router } from "expo-router";
export default function Insights() {
  const { state } = useApp();
  return (
    <Screen>
      <Copy kind="heading">Make the data human</Copy>
      <Copy muted>Clear observations. A useful next action.</Copy>
      <PrimaryButton
        title="Add insight"
        onPress={() => router.push("/coach/insight/new")}
      />
      {[...state.notes].reverse().map((n) => (
        <CoachInsight
          key={n.id}
          note={n}
          onPress={() =>
            router.push({
              pathname: "/swimmer/insight/[id]",
              params: { id: n.id },
            })
          }
        />
      ))}
    </Screen>
  );
}
