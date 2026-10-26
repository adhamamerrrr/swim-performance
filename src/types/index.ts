export type Role = "swimmer" | "coach";
export type Sport = "Swimming" | "Finswimming";
export type Status =
  | "Pending"
  | "Completed"
  | "On Track"
  | "At Risk"
  | "Off Track"
  | "Success"
  | "Error"
  | "Loading";
export interface Event {
  id: string;
  distance: number;
  stroke:
    | "Freestyle"
    | "Butterfly"
    | "Backstroke"
    | "Breaststroke"
    | "Medley"
    | "Finswimming"
    | "Immersion";
  poolLength: 25 | 50;
  discipline?: "Surface" | "Bi-fins" | "Immersion";
  sport: Sport;
}
export interface Swimmer {
  id: string;
  name: string;
  primaryEventId: string;
  coachId: string;
  team: string;
  frequency: number;
  status: Status;
  attention?: string;
}
export interface Coach {
  id: string;
  name: string;
  team: string;
  discipline: Sport;
}
export interface PerformanceResult {
  id: string;
  swimmerId: string;
  eventId: string;
  time: number;
  date: string;
  source: "Competition" | "Training";
  meet: string;
  splits?: {
    reaction: number;
    first25: number;
    second25: number;
    finish: number;
  };
}
export interface WorkoutSet {
  id: string;
  section: "Warm Up" | "Main Set" | "Race Pace" | "Recovery" | "Cool Down";
  reps: number;
  distance: number;
  stroke: Event["stroke"];
  target?: [number, number];
  rest: number;
  intensity: string;
}
export interface Workout {
  id: string;
  title: string;
  coachId: string;
  swimmerId: string;
  date: string;
  duration: number;
  focus: string;
  sets: WorkoutSet[];
}
export interface SetEntry {
  setId: string;
  rep: number;
  time: number | null;
  skipped: boolean;
}
export interface TrainingSession {
  id: string;
  workoutId: string;
  swimmerId: string;
  entries: SetEntry[];
  startedAt: string;
  completedAt?: string;
  workoutSnapshot?: Workout;
  rpe?: number;
  feeling?: string;
  note?: string;
}
export interface Goal {
  id: string;
  swimmerId: string;
  eventId: string;
  target: number;
  baseline: number;
  targetDate: string;
  status: Status;
  milestones: string[];
}
export interface CoachNote {
  id: string;
  swimmerId: string;
  coachId: string;
  title: string;
  observation: string;
  why: string;
  recommendation: string;
  action: string;
  date: string;
  performanceIds: string[];
}
export interface CoachReview {
  id: string;
  sessionId: string;
  coachId: string;
  feedback: string;
  observation: string;
  recommendation: string;
  followUp: string;
  date: string;
}
export interface PersonalBest {
  swimmerId: string;
  eventId: string;
  time: number;
  performanceId: string;
}
export interface PerformanceTrend {
  eventId: string;
  improvement: number;
  variation: number;
  direction: "Improving" | "Stable" | "Declining";
}
export interface Settings {
  units: "Meters" | "Yards";
  poolLength: 25 | 50;
  notifications: boolean;
  coachConnected: boolean;
}
export interface UserProfile {
  name: string;
  role: Role;
  sport: Sport;
  eventId: string;
  pb: number;
  goal: number;
  frequency: number;
  team: string;
}

export interface AppState {
  swimmers: Swimmer[];
  workouts: Workout[];
  performances: PerformanceResult[];
  profile: UserProfile | null;
  goals: Goal[];
  notes: CoachNote[];
  reviews: CoachReview[];
  sessions: TrainingSession[];
  active: TrainingSession | null;
  settings: Settings;
}
