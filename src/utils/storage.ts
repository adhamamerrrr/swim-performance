import { events } from "@/data/mockData";
import { AppState } from "@/types";
type Obj = Record<string, unknown>;
const object = (v: unknown): v is Obj =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const string = (v: unknown): v is string => typeof v === "string";
const num = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);
const texts = (o: Obj, keys: string[]) => keys.every((k) => string(o[k]));
const status = (v: unknown) =>
  [
    "Pending",
    "Completed",
    "On Track",
    "At Risk",
    "Off Track",
    "Success",
    "Error",
    "Loading",
  ].includes(String(v));
const list = (v: unknown, test: (o: Obj) => boolean) =>
  Array.isArray(v) && v.every((o) => object(o) && test(o));
const event = (v: unknown) => events.some((e) => e.id === v);
const entry = (o: Obj) =>
  string(o.setId) &&
  num(o.rep) &&
  Number.isInteger(o.rep) &&
  o.rep > 0 &&
  (o.time === null || (num(o.time) && o.time > 0)) &&
  typeof o.skipped === "boolean";
const validWorkout = (o: Obj) =>
  texts(o, ["id", "title", "coachId", "swimmerId", "date", "focus"]) &&
  num(o.duration) &&
  list(
    o.sets,
    (s) =>
      texts(s, ["id", "section", "stroke", "intensity"]) &&
      num(s.reps) &&
      s.reps > 0 &&
      num(s.distance) &&
      s.distance > 0 &&
      num(s.rest) &&
      (s.target === undefined ||
        (Array.isArray(s.target) &&
          s.target.length === 2 &&
          s.target.every(num))),
  );
const session = (o: Obj) =>
  texts(o, ["id", "workoutId", "swimmerId", "startedAt"]) &&
  (o.workoutSnapshot === undefined ||
    (object(o.workoutSnapshot) && validWorkout(o.workoutSnapshot))) &&
  list(o.entries, entry) &&
  (o.completedAt === undefined || string(o.completedAt)) &&
  (o.rpe === undefined || (num(o.rpe) && o.rpe >= 1 && o.rpe <= 10)) &&
  (o.note === undefined || string(o.note)) &&
  (o.feeling === undefined || string(o.feeling));
export function isAppState(v: unknown): v is AppState {
  if (!object(v) || !object(v.settings)) return false;
  const settings = v.settings;
  if (
    !["Meters", "Yards"].includes(String(settings.units)) ||
    ![25, 50].includes(Number(settings.poolLength)) ||
    typeof settings.notifications !== "boolean" ||
    typeof settings.coachConnected !== "boolean"
  )
    return false;
  if (v.profile !== null) {
    if (!object(v.profile)) return false;
    const a = v.profile;
    if (
      !texts(a, ["name", "team"]) ||
      !["swimmer", "coach"].includes(String(a.role)) ||
      !["Swimming", "Finswimming"].includes(String(a.sport)) ||
      !event(a.eventId) ||
      !num(a.pb) ||
      !num(a.goal) ||
      !num(a.frequency)
    )
      return false;
  }
  if (
    !list(
      v.swimmers,
      (o) =>
        texts(o, ["id", "name", "coachId", "team"]) &&
        event(o.primaryEventId) &&
        num(o.frequency) &&
        status(o.status),
    )
  )
    return false;
  if (
    !list(
      v.workouts,
      (o) =>
        texts(o, ["id", "title", "coachId", "swimmerId", "date", "focus"]) &&
        num(o.duration) &&
        list(
          o.sets,
          (s) =>
            texts(s, ["id", "section", "stroke", "intensity"]) &&
            num(s.reps) &&
            s.reps > 0 &&
            num(s.distance) &&
            s.distance > 0 &&
            num(s.rest) &&
            (s.target === undefined ||
              (Array.isArray(s.target) &&
                s.target.length === 2 &&
                s.target.every(num))),
        ),
    )
  )
    return false;
  if (
    !list(
      v.performances,
      (o) =>
        texts(o, ["id", "swimmerId", "date", "meet"]) &&
        event(o.eventId) &&
        num(o.time) &&
        o.time > 0 &&
        ["Competition", "Training"].includes(String(o.source)) &&
        (o.splits === undefined ||
          (object(o.splits) &&
            ["reaction", "first25", "second25", "finish"].every((k) =>
              num((o.splits as Obj)[k]),
            ))),
    )
  )
    return false;
  if (
    !list(
      v.goals,
      (o) =>
        texts(o, ["id", "swimmerId", "targetDate"]) &&
        event(o.eventId) &&
        num(o.target) &&
        num(o.baseline) &&
        status(o.status) &&
        Array.isArray(o.milestones) &&
        o.milestones.every(string),
    )
  )
    return false;
  if (
    !list(
      v.notes,
      (o) =>
        texts(o, [
          "id",
          "swimmerId",
          "coachId",
          "title",
          "observation",
          "why",
          "recommendation",
          "action",
          "date",
        ]) &&
        Array.isArray(o.performanceIds) &&
        o.performanceIds.every(string),
    )
  )
    return false;
  if (
    !list(v.reviews, (o) =>
      texts(o, [
        "id",
        "sessionId",
        "coachId",
        "feedback",
        "observation",
        "recommendation",
        "followUp",
        "date",
      ]),
    )
  )
    return false;
  return (
    list(v.sessions, session) &&
    (v.active === null || (object(v.active) && session(v.active)))
  );
}
