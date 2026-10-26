import {
Choice,
Copy,
Field,
PrimaryButton,
Screen,
SecondaryButton,
} from "@/components/ui";
import { EventSelector } from "@/components/workout/Selectors";
import { colors } from "@/constants/theme";
import { events } from "@/data/mockData";
import { useApp } from "@/hooks/useApp";
import { Role,Sport } from "@/types";
import { parseTime } from "@/utils/performance";
import { router } from "expo-router";
import { useState } from "react";
export default function Onboarding() {
  const { state, update } = useApp();
  const [name, setName] = useState(state.profile?.name ?? "");
  const [role, setRole] = useState<Role>(state.profile?.role ?? "swimmer");
  const [sport, setSport] = useState<Sport>(state.profile?.sport ?? "Swimming");
  const [eventId, setEvent] = useState(state.profile?.eventId ?? "free50");
  const [pb, setPb] = useState(state.profile?.pb.toString() ?? "");
  const [goal, setGoal] = useState(state.profile?.goal.toString() ?? "");
  const [pool, setPool] = useState(String(state.settings.poolLength));
  const [frequency, setFrequency] = useState(
    String(state.profile?.frequency ?? 6),
  );
  const [team, setTeam] = useState(state.profile?.team ?? "");
  const [error, setError] = useState("");
  const save = (demo = false) => {
    const best = demo ? 22.41 : parseTime(pb);
    const target = demo ? 21.95 : parseTime(goal);
    if (
      !demo &&
      (!name.trim() ||
        !team.trim() ||
        (role === "swimmer" && (!best || !target || target >= best)))
    ) {
      setError(
        "Enter your name and club. Swimmers need a valid PB and a faster goal time.",
      );
      return;
    }
    const eid = demo ? "free50" : eventId;
    const profile = {
      name: demo ? "Alex Morgan" : name.trim(),
      role,
      sport: demo ? ("Swimming" as const) : sport,
      eventId: eid,
      pb: best ?? 0,
      goal: target ?? 0,
      frequency: Number(frequency),
      team: demo ? "North Shore Aquatics" : team.trim(),
    };
    update((s) => {
      const performanceId = "onboarding-pb";
      const performances =
        role === "swimmer" && !demo && !state.profile
          ? [
              ...s.performances.filter((p) => p.swimmerId !== "alex"),
              {
                id: performanceId,
                swimmerId: "alex",
                eventId: eid,
                time: best!,
                date: new Date().toISOString().slice(0, 10),
                source: "Competition" as const,
                meet: "Your recorded personal best",
              },
            ]
          : s.performances;
      const updatedGoals =
        role === "swimmer" && !demo && !state.profile
          ? [
              ...s.goals.filter((g) => g.swimmerId !== "alex"),
              {
                id: "personal-goal-" + eid,
                swimmerId: "alex",
                eventId: eid,
                target: target!,
                baseline: best!,
                targetDate: "2027-06-01",
                status: "Pending" as const,
                milestones: [
                  "Record your next race effort",
                  "Review progress with your coach",
                ],
              },
            ]
          : s.goals;
      const assigned = s.workouts.map((w) =>
        w.swimmerId === "alex"
          ? {
              ...w,
              title:
                sport === "Finswimming"
                  ? "Fins technique & pace"
                  : "Speed, held with control",
              focus:
                sport === "Finswimming"
                  ? "Streamline, rhythm & race consistency"
                  : "Race-pace consistency & closing speed",
              sets: w.sets.map((set) => ({
                ...set,
                stroke:
                  set.section === "Race Pace"
                    ? events.find((e) => e.id === eid)!.stroke
                    : sport === "Finswimming"
                      ? ("Finswimming" as const)
                      : set.stroke,
                target:
                  set.section === "Race Pace"
                    ? ([
                        Number(
                          (
                            best! *
                            (set.distance /
                              events.find((e) => e.id === eid)!.distance) *
                            1.2
                          ).toFixed(1),
                        ),
                        Number(
                          (
                            best! *
                            (set.distance /
                              events.find((e) => e.id === eid)!.distance) *
                            1.25
                          ).toFixed(1),
                        ),
                      ] as [number, number])
                    : undefined,
              })),
            }
          : w,
      );
      return {
        ...s,
        profile,
        swimmers:
          role === "swimmer" && !demo
            ? s.swimmers.map((a) =>
                a.id === "alex"
                  ? {
                      ...a,
                      name: profile.name,
                      team: profile.team,
                      primaryEventId: eid,
                      frequency: profile.frequency,
                      status: "Pending" as const,
                      attention: undefined,
                    }
                  : a,
              )
            : s.swimmers,
        workouts: role === "swimmer" && !demo ? assigned : s.workouts,
        sessions:
          role === "swimmer" && !demo && !state.profile
            ? s.sessions.filter((x) => x.swimmerId !== "alex")
            : s.sessions,
        notes:
          role === "swimmer" && !demo && !state.profile
            ? s.notes.filter((x) => x.swimmerId !== "alex")
            : s.notes,
        active: null,
        performances:
          role === "swimmer" && !demo && state.profile
            ? [
                ...s.performances.filter((p) => p.id !== performanceId),
                {
                  id: performanceId,
                  swimmerId: "alex",
                  eventId: eid,
                  time: best!,
                  date: new Date().toISOString().slice(0, 10),
                  source: "Competition" as const,
                  meet: "Your recorded personal best",
                },
              ]
            : performances,
        goals:
          role === "swimmer" && !demo && state.profile
            ? s.goals.map((g) =>
                g.swimmerId === "alex" && g.eventId === eid
                  ? { ...g, target: target! }
                  : g,
              )
            : updatedGoals,
        settings: { ...s.settings, poolLength: pool === "25" ? 25 : 50 },
      };
    });
    router.replace(role === "coach" ? "/coach/home" : "/swimmer/home");
  };
  return (
    <Screen>
      <Copy kind="meta" color={colors.accentPrimary}>
        SWIM PERFORMANCE
      </Copy>
      <Copy kind="hero">Every fraction counts.</Copy>
      <Copy muted>
        Your training, race efforts, and next finish line. All in one focused
        place.
      </Copy>
      <Field
        label="Your name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <Choice
        options={["Swimmer", "Coach"]}
        value={role === "swimmer" ? "Swimmer" : "Coach"}
        onChange={(v) => setRole(v === "Coach" ? "coach" : "swimmer")}
      />
      <Field label="Team / club" value={team} onChangeText={setTeam} />
      <Copy>{role === "coach" ? "Coaching discipline" : "Primary sport"}</Copy>
      <Choice
        options={["Swimming", "Finswimming"]}
        value={sport}
        onChange={(v) => {
          const sp = v === "Finswimming" ? "Finswimming" : "Swimming";
          setSport(sp);
          setEvent(
            events.find((e) => e.sport === sp && e.poolLength === Number(pool))!
              .id,
          );
        }}
      />
      {role === "swimmer" && (
        <>
          <EventSelector
            value={eventId}
            onChange={setEvent}
            sport={sport}
            poolLength={pool === "25" ? 25 : 50}
          />
          <Field
            label="Personal best · seconds"
            value={pb}
            onChangeText={setPb}
            keyboardType="decimal-pad"
          />
          <Field
            label="Goal · seconds"
            value={goal}
            onChangeText={setGoal}
            keyboardType="decimal-pad"
          />
          <Copy>Preferred pool</Copy>
          <Choice
            options={["25", "50"]}
            value={pool}
            onChange={(v) => {
              setPool(v);
              setEvent(eventId.replace("-sc", "") + (v === "25" ? "-sc" : ""));
            }}
          />
          <Copy>Sessions per week</Copy>
          <Choice
            options={["2", "3", "4", "5", "6", "7"]}
            value={frequency}
            onChange={setFrequency}
          />
        </>
      )}
      {error && <Copy color={colors.danger}>{error}</Copy>}
      <PrimaryButton
        title={state.profile ? "Save profile" : "Build my training space"}
        onPress={() => save()}
      />
      {!state.profile && (
        <SecondaryButton
          title="Explore with Alex’s demo data"
          onPress={() => save(true)}
        />
      )}
      <Copy kind="meta" muted>
        NO ACCOUNT REQUIRED · SAVED ON THIS DEVICE
      </Copy>
    </Screen>
  );
}
