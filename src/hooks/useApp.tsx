import {
goals as seedGoals,
notes as seedNotes,
performances as seedPerformances,
sessions as seedSessions,
swimmers as seedSwimmers,
workouts as seedWorkouts,
} from "@/data/mockData";
import { AppState } from "@/types";
import { isAppState } from "@/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React,{
createContext,
useContext,
useEffect,
useRef,
useState,
} from "react";
type State = AppState;
const initial: State = {
  swimmers: seedSwimmers,
  workouts: seedWorkouts,
  performances: seedPerformances,
  profile: null,
  goals: seedGoals,
  notes: seedNotes,
  reviews: [],
  sessions: seedSessions.map((s) => ({
    ...s,
    workoutSnapshot: seedWorkouts.find((w) => w.id === s.workoutId),
  })),
  active: null,
  settings: {
    units: "Meters",
    poolLength: 50,
    notifications: false,
    coachConnected: true,
  },
};
const Context = createContext<{
  state: State;
  update: (fn: (s: State) => State) => void;
  loading: boolean;
  error: string | null;
  retry: () => void;
} | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ready = useRef(false);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let live = true;
    AsyncStorage.getItem("swim-performance-v1")
      .then((raw) => {
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (isAppState(parsed)) setState(parsed);
          else throw Error("Unrecognized saved data");
        }
      })
      .catch(() => {
        if (live)
          setError(
            "Saved data could not be loaded. The demo is available, but changes will not be saved until you retry.",
          );
      })
      .finally(() => {
        if (live) {
          ready.current = true;
          setLoading(false);
        }
      });
    return () => {
      live = false;
    };
  }, []);
  const persist = (next: State) => {
    queue.current = queue.current
      .catch(() => undefined)
      .then(() =>
        AsyncStorage.setItem("swim-performance-v1", JSON.stringify(next)),
      )
      .catch(() =>
        setError(
          "Changes could not be saved on this device. Retry saving before closing the app.",
        ),
      );
  };
  useEffect(() => {
    if (ready.current && !loading && !error) persist(state);
  }, [state, loading, error]);
  return (
    <Context.Provider
      value={{
        state,
        update: setState,
        loading,
        error,
        retry: () => {
          setError(null);
          persist(state);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw Error("AppProvider is required");
  return value;
}
