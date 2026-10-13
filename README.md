# Swim Performance

[Source repository](https://github.com/adhamamerrrr/swim-performance)

A calm, dark mobile training and performance workspace for swimmers, finswimmers, and coaches. Built with Expo SDK 57, React Native, strict TypeScript, and Expo Router. This is a functional offline application with realistic demo data and durable local storage; no backend or authentication is connected.

## Run

Use Node.js 22.13+ LTS or Node.js 24.3+ (validated with Node 24.19), and npm.

```sh
npm install
npx expo start
```

Open with an Expo Go build compatible with SDK 57, or an Expo development build. Press `a` for an Android emulator, `i` for an iOS simulator on macOS, or `w` for web. Do not mix Expo SDK versions or manually upgrade React Native independently.

```sh
npx tsc --noEmit
npm test
npm run validate
npx expo install --check
npx expo export --platform all
```

The lockfile is included. `npm ci` is also supported for a reproducible installation. Expo generates its route typings under `.expo/types` when the dev server starts. `npm test` independently checks every literal navigation destination against actual route files.

## What works

- Swimmer Home: primary-event season best, PB, goal, assigned training, recent performance, coach insight and goal visualization.
- Structured training plans: warm-up, main set, race pace, recovery and cool-down, including repetitions, distance, target, rest and intensity.
- Active training: large time entry, save/skip repetitions, correct the last recorded repetition, resumable sessions and early completion.
- Post-workout: logged distance, actual elapsed duration, pace per 100m, completed sets, best rep, RPE, feeling and note. Consistency summaries compare actual recorded race-pace spreads with the preceding matching session.
- Race log: create competition/training results; browse event-specific 1M/3M/6M/1Y/all history; inspect previous result, PB/SB, goal difference and available splits.
- Swimming and finswimming events, including surface, bi-fins and immersion. Short-course and long-course records have separate event identities.
- Goals: overview, detail, milestones, history and validated new-goal creation. A current baseline is required if there is no race history.
- Coach workspace: searchable/filterable athletes, attention flags, recent performances, review queue and team trend.
- Coach athlete detail: performance, goal, recorded training, notes and insight creation.
- Coach review: target-versus-actual reps, consistency, RPE and athlete note; save/edit actionable feedback, observation, recommendation and follow-up. Swimmers can read reviews in their completed-session summary on the same device.
- Onboarding for swimmers/coaches and local profile editing; an explicit Alex Morgan demo option.
- Local units and pool preferences, notification preference, coach-connection preference and dark appearance. Display-unit changes affect workout distance summaries; original race-event distances are preserved.
- Safe-area layouts, scrollable content, keyboard handling, typed shared components, accessible labels/roles, skeletons, empty states, error feedback and persistence failure recovery.

## Profile liquid interaction

Normal tabs have icons and labels. Only Profile has the special gesture:

1. Hold Profile for 420ms; no initial drag is required.
2. An animated SVG neck stretches up from the tab bar, with a circular Settings action and label above it.
3. Keep holding, slide upward into the Settings target, then release to open Settings.
4. Release without selecting, cancel the touch, or tap elsewhere to retract the shape. Ordinary Profile taps still open Profile.

The organic SVG path, timing/spring transitions and chart/goal animations use Reanimated shared values. A root action portal makes the floating action and dismissal area touchable outside the tab bar's bounds. Screen-reader users can invoke the Profile Settings accessibility action. The Profile screen also includes a standard Settings button.

## Architecture

Tab route groups keep detail views outside bottom navigation without changing public URLs: for example `(tabs)/home.tsx` resolves to `/swimmer/home`. Route files are tiny exports; screen implementations live in `src/screens` so reusable code never becomes an accidental route.

```text
src/
  app/
    _layout.tsx, index.tsx, +not-found.tsx, settings.tsx
    onboarding/index.tsx
    swimmer/
      _layout.tsx
      (tabs)/_layout.tsx, home.tsx, workouts.tsx, progress.tsx, goals.tsx, profile.tsx
      workout/[id].tsx, active.tsx, complete.tsx
      progress/[id].tsx, new.tsx
      goals/[id].tsx, new.tsx
      insight/[id].tsx
    coach/
      _layout.tsx
      (tabs)/_layout.tsx, home.tsx, swimmers.tsx, workouts.tsx, insights.tsx, profile.tsx
      swimmer/[id].tsx
      review/[id].tsx
      workout/[id].tsx
      insight/new.tsx
  screens/
    Profile.tsx
    swimmer/             # Separate feature screens
    coach/               # Separate coaching screens
  components/
    ui/                  # Card, buttons, text, inputs, sheet, states, avatar
    cards/               # WorkoutPreview, SetRow, CoachInsight, PerformanceTimeline
    charts/              # SVG performance chart and goal visualization
    workout/Selectors.tsx
    navigation/          # TabBar, LiquidTabAction, ActionPortal
    coach/AthleteRow.tsx
  constants/theme.ts
  data/mockData.ts
  hooks/useApp.tsx, useAthlete.ts
  types/index.ts
  utils/performance.ts, coach.ts, storage.ts
scripts/
  check-domain.cjs
  check-routes.cjs
```

`src/constants/theme.ts` owns colors, typography, spacing, radii, semantic colors, motion constants and shared layout dimensions. Types distinguish events, results, training plans, set entries, goals, notes, reviews, athletes and coaches. `useApp` owns durable local state, queued persistence, hydration and saved-data validation. Completed sessions retain a workout snapshot, preserving their original targets when a plan is subsequently edited.

## Dependencies and why

| Dependency                      | Purpose                                                                |
| ------------------------------- | ---------------------------------------------------------------------- |
| Expo, React, React Native       | Native application runtime                                             |
| Expo Router, linking, constants | File-based routing, deep links and Expo integration                    |
| Reanimated + Worklets           | UI-thread motion and SVG animation                                     |
| Gesture Handler                 | Profile long-press/slide selection                                     |
| React Native SVG                | Lightweight line charts and liquid geometry; no graphics framework     |
| AsyncStorage                    | Durable local workouts, results, goals, feedback, profile and settings |
| Safe Area Context, Screens      | Native safe areas and navigation integration                           |
| Expo Vector Icons               | Accessible labeled navigation/settings icons                           |
| Expo Status Bar                 | Dark-theme system status bar                                           |
| React DOM, React Native Web     | Optional browser development target                                    |
| TypeScript, React types         | Strict static checking                                                 |

Prettier was used as temporary development tooling, not added to project dependencies.

## Validation and practical limits

TypeScript, domain tests, the route audit, and iOS/Android/web Metro exports passed. Dependency versions were aligned with Expo SDK 57’s bundled-module map; the final compatibility CLI check ran offline after its online request timed out. The tests cover time validation and rounding, skipped reps, distance and pace calculation, consistency comparisons, trend direction, athlete attention flags, fins/short-course event identity and malformed saved data. The route audit verifies all ten tabs and every explicit destination.

Metro started successfully, but React Native DevTools could not launch in this root-run environment. A physical device or emulator was not available in the build environment. Native touch behavior, the liquid gesture, keyboard behavior and visual layout still need a device pass before release. Compilation and route checks do not substitute for tapping through screens.

Recommended device pass: onboarding → all swimmer tabs → full workout with a skipped rep and correction → save/reopen → race recording → new goal → Profile hold/slide/release/cancel → settings → coach mode → all coach tabs → review and insight creation → return to swimmer and read feedback. Repeat on a small Android phone and an iPhone with a bottom safe area, including an app restart midway through a session.

## Backend work intentionally deferred

Authentication, athlete/coach authorization, cloud synchronization, remote teams/invitations, push notification delivery, a full training calendar/attendance system, coach-created workout planning, race imports and verified meet results need a backend. Settings currently store preferences; they do not deliver notifications or connect to remote coaches. The app has no AI service: summaries and attention flags are deterministic local calculations, not medical or physiological predictions.

Demo race dates are fixed to the sample 2026 season. Date-range filters use the sample 13 October 2026 reference to make that demo reproducible. Personal training data remains on the device. AsyncStorage is ordinary application storage; authentication secrets should use a secure store when authentication is introduced.
