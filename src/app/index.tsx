import { useApp } from "@/hooks/useApp";
import { Redirect } from "expo-router";
export default function Index() {
  const { state } = useApp();
  return (
    <Redirect
      href={
        !state.profile
          ? "/onboarding"
          : state.profile.role === "coach"
            ? "/coach/home"
            : "/swimmer/home"
      }
    />
  );
}
