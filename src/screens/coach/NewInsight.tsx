import { Choice,Copy,Field,PrimaryButton,Screen } from "@/components/ui";
import { colors } from "@/constants/theme";
import { useApp } from "@/hooks/useApp";
import { router,useLocalSearchParams } from "expo-router";
import { useState } from "react";
export default function NewInsight() {
  const params = useLocalSearchParams<{ swimmerId?: string }>();
  const { state, update } = useApp();
  const [athleteId, setAthlete] = useState(params.swimmerId ?? "alex");
  const [title, setTitle] = useState("");
  const [observation, setObservation] = useState("");
  const [why, setWhy] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [action, setAction] = useState("");
  const [error, setError] = useState("");
  return (
    <Screen>
      <Copy kind="heading">A useful next step</Copy>
      <Choice
        options={state.swimmers.map((s) => s.name)}
        value={state.swimmers.find((s) => s.id === athleteId)?.name ?? ""}
        onChange={(name) =>
          setAthlete(state.swimmers.find((s) => s.name === name)!.id)
        }
      />
      <Field label="Insight title" value={title} onChangeText={setTitle} />
      <Field
        label="What changed"
        value={observation}
        onChangeText={setObservation}
        multiline
      />
      <Field
        label="Why it matters"
        value={why}
        onChangeText={setWhy}
        multiline
      />
      <Field
        label="Recommendation"
        value={recommendation}
        onChangeText={setRecommendation}
        multiline
      />
      <Field
        label="Suggested action"
        value={action}
        onChangeText={setAction}
        multiline
      />
      {error && <Copy color={colors.danger}>{error}</Copy>}
      <PrimaryButton
        title="Save insight"
        onPress={() => {
          if (
            [title, observation, why, recommendation, action].some(
              (v) => !v.trim(),
            )
          ) {
            setError(
              "Complete each section so your swimmer knows what to do next.",
            );
            return;
          }
          const id = "insight-" + Date.now();
          update((s) => ({
            ...s,
            notes: [
              ...s.notes,
              {
                id,
                swimmerId: athleteId,
                coachId: "coach1",
                title: title.trim(),
                observation: observation.trim(),
                why: why.trim(),
                recommendation: recommendation.trim(),
                action: action.trim(),
                date: new Date().toISOString().slice(0, 10),
                performanceIds: state.performances
                  .filter((p) => p.swimmerId === athleteId)
                  .slice(-3)
                  .map((p) => p.id),
              },
            ],
          }));
          router.replace({ pathname: "/swimmer/insight/[id]", params: { id } });
        }}
      />
    </Screen>
  );
}
