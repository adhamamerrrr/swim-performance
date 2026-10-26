import { Copy } from "@/components/ui";
import { animation,colors,spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React,{ createContext,useContext,useState } from "react";
import { Pressable,StyleSheet,View } from "react-native";
import Animated,{
useAnimatedStyle,
useSharedValue,
withSpring,
withTiming,
} from "react-native-reanimated";
export interface ActionAnchor {
  x: number;
  y: number;
}
const Context = createContext<{
  open: boolean;
  show: (anchor: ActionAnchor) => void;
  dismiss: () => void;
} | null>(null);
export function ActionPortalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<ActionAnchor>({ x: 0, y: 0 });
  const progress = useSharedValue(0);
  const dismiss = () => {
    setOpen(false);
    progress.value = withTiming(0, { duration: animation.duration });
  };
  const bubble = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * 48 },
      { scale: 0.8 + progress.value * 0.2 },
    ],
  }));
  return (
    <Context.Provider
      value={{
        open,
        show: (a) => {
          setAnchor(a);
          setOpen(true);
          progress.value = withSpring(1, animation.spring);
        },
        dismiss,
      }}
    >
      <View style={{ flex: 1 }}>
        {children}
        <View
          pointerEvents={open ? "box-none" : "none"}
          style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
        >
          {open && (
            <Pressable
              style={StyleSheet.absoluteFill}
              accessibilityRole="button"
              accessibilityLabel="Dismiss Settings action"
              onPress={dismiss}
            />
          )}
          <Animated.View
            style={[
              {
                position: "absolute",
                top: anchor.y - 84,
                left: anchor.x - 36,
                width: 72,
                alignItems: "center",
                gap: spacing.xs,
              },
              bubble,
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open settings"
              onPress={() => {
                dismiss();
                router.push("/settings");
              }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.surfaceElevated,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={colors.accentPrimary}
              />
            </Pressable>
            <Copy kind="meta" color={colors.accentPrimary}>
              Settings
            </Copy>
          </Animated.View>
        </View>
      </View>
    </Context.Provider>
  );
}
export function useActionPortal() {
  const c = useContext(Context);
  if (!c) throw Error("ActionPortalProvider is required");
  return c;
}
