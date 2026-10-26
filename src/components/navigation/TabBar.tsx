import React from "react";
import { Pressable,View } from "react-native";

import { Copy } from "@/components/ui";
import { colors,layout,spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router,Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionAnchor,useActionPortal } from "./ActionPortal";
import { LiquidTabAction } from "./LiquidTabAction";
type BottomTabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>
>[0];
const icons: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
  home: "home-outline",
  workouts: "water-outline",
  progress: "trending-up-outline",
  goals: "flag-outline",
  profile: "person-outline",
  swimmers: "people-outline",
  insights: "chatbubble-outline",
};
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { open, show, dismiss } = useActionPortal();
  const insets = useSafeAreaInsets();
  const setOpen = (value: boolean, anchor?: ActionAnchor) => {
    if (value && anchor) show(anchor);
    else dismiss();
  };
  return (
    <View
      style={{
        backgroundColor: colors.bgSecondary,
        paddingBottom: insets.bottom,
        overflow: "visible",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {state.routes.map((route) => {
          const focused = state.routes[state.index]?.key === route.key;
          const label = String(
            descriptors[route.key]?.options.title ?? route.name,
          );
          const onPress = () => {
            dismiss();
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented)
              navigation.navigate(route.name, route.params);
          };
          const content = (
            <>
              <Ionicons
                name={icons[route.name] ?? "ellipse-outline"}
                size={22}
                color={focused ? colors.accentPrimary : colors.textSecondary}
              />
              <Copy
                kind="meta"
                color={focused ? colors.accentPrimary : colors.textSecondary}
              >
                {label}
              </Copy>
            </>
          );
          return route.name === "profile" ? (
            <LiquidTabAction
              key={route.key}
              selected={focused}
              open={open}
              onOpenChange={setOpen}
              onTap={onPress}
              onSettings={() => router.push("/settings")}
            >
              {content}
            </LiquidTabAction>
          ) : (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              onPress={onPress}
              style={{
                flex: 1,
                height: layout.tabHeight,
                alignItems: "center",
                justifyContent: "center",
                gap: spacing.xs,
              }}
            >
              {content}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
