const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const cache = new Map();
function load(relative) {
  const filename = path.resolve(__dirname, "..", relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const mod = { exports: {} };
  cache.set(filename, mod);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  new Function("require", "module", "exports", source)(
    (name) =>
      name.startsWith("@/")
        ? load("src/" + name.slice(2) + ".ts")
        : require(name),
    mod,
    mod.exports,
  );
  return mod.exports;
}
const { parseTime, timeText, sessionStats, consistencySummary, trend } = load(
  "src/utils/performance.ts",
);
const { athleteSignal } = load("src/utils/coach.ts");
const { isAppState } = load("src/utils/storage.ts");
const data = load("src/data/mockData.ts");
assert.equal(parseTime("27.4"), 27.4);
assert.equal(parseTime("1:02.41"), 62.41);
for (const input of [
  "",
  "0",
  "-1",
  "NaN",
  "1:60",
  "1.5:20",
  "1:20:3",
  "abc",
  "3600",
])
  assert.equal(parseTime(input), null, input);
assert.equal(timeText(59.999), "1:00.00");
assert.equal(timeText(62.41), "1:02.41");
assert.equal(timeText(Infinity), "—");
const workout = data.workouts[0];
const entries = [
  { setId: "race", rep: 1, time: 27.3, skipped: false },
  { setId: "race", rep: 2, time: 27.8, skipped: false },
  { setId: "race", rep: 3, time: null, skipped: true },
];
const stats = sessionStats(workout, entries);
assert.equal(stats.distance, 100);
assert.equal(stats.completedSets, 0);
assert.equal(stats.best, 27.3);
assert.equal(stats.pace, 55.1);
assert.match(consistencySummary(workout, entries), /0.5s/);
assert.match(consistencySummary(workout, entries), /baseline/);
assert.match(
  consistencySummary(workout, entries, [
    { setId: "race", rep: 1, time: 27, skipped: false },
    { setId: "race", rep: 2, time: 27.8, skipped: false },
  ]),
  /0.8s in your previous/,
);
const alex = data.performances.filter(
  (p) =>
    p.swimmerId === "alex" &&
    p.eventId === "free50" &&
    p.date.startsWith("2026"),
);
assert.ok(Math.abs(trend(alex) - 0.42) < 1e-8);
assert.equal(
  athleteSignal(data.swimmers[1], data.performances, data.sessions).status,
  "At Risk",
);
assert.equal(
  athleteSignal(data.swimmers[2], data.performances, data.sessions).status,
  "On Track",
);
assert.equal(data.events.filter((e) => e.poolLength === 25).length, 8);
assert.equal(
  data.events.find((e) => e.id === "immersion50").sport,
  "Finswimming",
);
const state = {
  ...data,
  profile: null,
  reviews: [],
  active: null,
  settings: {
    units: "Meters",
    poolLength: 50,
    notifications: false,
    coachConnected: true,
  },
};
assert.equal(isAppState(state), true);
assert.equal(isAppState({ ...state, goals: null }), false);
assert.equal(
  isAppState({
    ...state,
    sessions: [
      {
        ...data.sessions[0],
        entries: [{ setId: "race", rep: 1, time: "bad", skipped: false }],
      },
    ],
  }),
  false,
);
assert.equal(
  isAppState({ ...state, settings: { ...state.settings, units: "Unknown" } }),
  false,
);
assert.equal(isAppState({ ...state, profile: { name: "Alex" } }), false);
console.log(
  "PASS: time validation, rounding, skipped reps, distance/pace, consistency comparisons, trends, coach signals, short-course/fins events, and saved-state validation.",
);
