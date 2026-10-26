import { AthleteRow } from "@/components/coach/AthleteRow";
import { Choice,Copy,EmptyState,Field,Screen } from "@/components/ui";
import { useApp } from "@/hooks/useApp";
import { athleteSignal } from "@/utils/coach";
import { router } from "expo-router";
import { useState } from "react";
export default function Swimmers() {
  const { state } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const list = state.swimmers
    .map((a) => athleteSignal(a, state.performances, state.sessions))
    .filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) &&
        (filter === "All" || s.status === filter),
    );
  return (
    <Screen>
      <Copy kind="heading">Your swimmers</Copy>
      <Field
        label="Find an athlete"
        value={query}
        onChangeText={setQuery}
        placeholder="Name"
      />
      <Choice
        options={["All", "On Track", "At Risk"]}
        value={filter}
        onChange={setFilter}
      />
      {list.map((s) => (
        <AthleteRow
          key={s.id}
          athlete={s}
          onPress={() =>
            router.push({
              pathname: "/coach/swimmer/[id]",
              params: { id: s.id },
            })
          }
        />
      ))}
      {!list.length && (
        <EmptyState
          title="No matching athletes"
          detail="Try another name or status filter."
        />
      )}
    </Screen>
  );
}
