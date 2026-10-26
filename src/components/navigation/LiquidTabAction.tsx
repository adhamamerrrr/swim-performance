import { animation,colors,layout,spacing } from "@/constants/theme";
import React,{ useEffect,useRef } from "react";
import { Pressable,View } from "react-native";
import { Gesture,GestureDetector } from "react-native-gesture-handler";
import Animated,{
runOnJS,
useAnimatedProps,
useAnimatedStyle,
useSharedValue,
withSpring,
withTiming,
} from "react-native-reanimated";
import Svg,{ Path } from "react-native-svg";
import { ActionAnchor } from "./ActionPortal";
const AnimatedPath = Animated.createAnimatedComponent(Path);
interface Props {
  children: React.ReactNode;
  onSettings: () => void;
  onOpenChange: (open: boolean, anchor?: ActionAnchor) => void;
  open: boolean;
  onTap: () => void;
  selected?: boolean;
}
export function LiquidTabAction({
  children,
  onSettings,
  onOpenChange,
  open,
  onTap,
  selected,
}: Props) {
  const container = useRef<View>(null);
  const progress = useSharedValue(0);
  const activated = useRef(false);
  const selectedAction = useSharedValue(false);
  useEffect(() => {
    progress.value = open
      ? withSpring(1, animation.spring)
      : withTiming(0, { duration: animation.duration });
  }, [open, progress]);
  const begin = () => {
    activated.current = true;
    container.current?.measureInWindow((x, y, width) =>
      onOpenChange(true, { x: x + width / 2, y }),
    );
  };
  const end = (chooseSettings: boolean) => {
    onOpenChange(false);
    if (chooseSettings) onSettings();
    setTimeout(() => {
      activated.current = false;
    }, 80);
  };
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const gesture = Gesture.LongPress()
    .minDuration(animation.longPress)
    .maxDistance(160)
    .onBegin((e) => {
      originX.value = e.absoluteX;
      originY.value = e.absoluteY;
      selectedAction.value = false;
    })
    .onStart(() => {
      runOnJS(begin)();
    })
    .onTouchesMove((e) => {
      const touch = e.allTouches[0];
      if (touch) {
        const dy = touch.absoluteY - originY.value;
        selectedAction.value =
          dy < -55 &&
          dy > -140 &&
          Math.abs(touch.absoluteX - originX.value) < 48;
      }
    })
    .onEnd((_e, success) => {
      if (success) runOnJS(end)(selectedAction.value);
    })
    .onFinalize((_e, success) => {
      if (!success) runOnJS(end)(false);
    });

  const blob = useAnimatedProps(() => {
    const top = 132 - 94 * progress.value;
    return {
      d: `M 0 148 L 120 148 L 120 134 C 92 134 83 131 80 ${top + 26} C 80 ${top - 2} 40 ${top - 2} 40 ${top + 26} C 37 131 28 134 0 134 Z`,
    };
  });
  const shapeStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.max(0, progress.value * 4)),
  }));
  return (
    <View
      ref={container}
      collapsable={false}
      style={{ flex: 1, overflow: "visible" }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          shapeStyle,
          {
            position: "absolute",
            bottom: 0,
            left: "50%",
            marginLeft: -60,
            width: 120,
            height: 148,
          },
        ]}
      >
        <Svg width={120} height={148}>
          <AnimatedPath animatedProps={blob} fill={colors.surfaceElevated} />
        </Svg>
      </Animated.View>
      <GestureDetector gesture={gesture}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected }}
          accessibilityLabel="Profile. Hold and slide up to Settings."
          accessibilityActions={[
            { name: "activate", label: "Open Profile" },
            { name: "longpress", label: "Open Settings" },
          ]}
          onAccessibilityAction={(e) =>
            e.nativeEvent.actionName === "longpress" ? onSettings() : onTap()
          }
          onPress={() => {
            if (!activated.current) onTap();
          }}
          style={{
            height: layout.tabHeight,
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.xs,
          }}
        >
          {children}
        </Pressable>
      </GestureDetector>
    </View>
  );
}
