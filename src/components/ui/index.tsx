import {
animation,
colors as c,
layout,
radius,
spacing as s,
typography,
} from "@/constants/theme";
import { Status } from "@/types";
import React from "react";
import {
ActivityIndicator,
KeyboardAvoidingView,
Modal,
Platform,
Pressable,
ScrollView,
StyleSheet,
Text,
TextInput,
TextInputProps,
View,
} from "react-native";
import Animated,{
FadeInDown,
useAnimatedStyle,
useSharedValue,
withSpring,
withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: c.bgPrimary },
  content: {
    padding: layout.page,
    gap: s.lg,
    paddingBottom: s.xxl,
    maxWidth: layout.maxWidth,
    width: "100%",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: s.md,
  },
  stack: { gap: s.sm },
  input: {
    backgroundColor: c.bgSecondary,
    color: c.textPrimary,
    borderRadius: radius.md,
    padding: s.md,
    minHeight: layout.touch,
    fontSize: 16,
    borderWidth: 1,
    borderColor: c.border,
  },
  card: {
    backgroundColor: c.bgSecondary,
    borderRadius: radius.lg,
    padding: s.lg,
    gap: s.md,
  },
  divider: { height: 1, backgroundColor: c.border },
  button: {
    minHeight: layout.touch,
    paddingHorizontal: s.lg,
    paddingVertical: s.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
export function Copy({
  children,
  kind = "body",
  muted = false,
  color,
}: {
  children: React.ReactNode;
  kind?: keyof typeof typography;
  muted?: boolean;
  color?: string;
}) {
  return (
    <Text
      style={[
        typography[kind],
        { color: color ?? (muted ? c.textSecondary : c.textPrimary) },
      ]}
    >
      {children}
    </Text>
  );
}
export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.page} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <Animated.View
            entering={FadeInDown.duration(animation.duration)}
            style={{ gap: s.lg }}
          >
            {children}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function AppCard({
  children,
  onPress,
  label,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  label?: string;
}) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View style={animated}>
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={onPress}
          onPressIn={() => (scale.value = withSpring(0.98, animation.spring))}
          onPressOut={() => (scale.value = withSpring(1, animation.spring))}
          style={styles.card}
        >
          {children}
        </Pressable>
      ) : (
        <View style={styles.card}>{children}</View>
      )}
    </Animated.View>
  );
}
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}
export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      accessibilityLabel={title}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: c.accentPrimary,
          opacity: disabled || loading ? 0.5 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={c.bgPrimary} />
      ) : (
        <Text style={{ color: c.bgPrimary, fontWeight: "600", fontSize: 15 }}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
export function SecondaryButton({
  title,
  onPress,
  disabled,
  loading,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: c.surfaceSubtle, opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <Copy>{loading ? "Working…" : title}</Copy>
    </Pressable>
  );
}
export function SectionHeader({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.row}>
      <Copy kind="meta" muted>
        {title.toUpperCase()}
      </Copy>
      {action && onPress && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={{ minHeight: layout.touch, justifyContent: "center" }}
        >
          <Copy color={c.accentPrimary}>{action}</Copy>
        </Pressable>
      )}
    </View>
  );
}
export function StatusBadge({ status }: { status: Status }) {
  const color =
    status === "At Risk" || status === "Pending"
      ? c.warning
      : status === "Off Track" || status === "Error"
        ? c.danger
        : status === "Loading"
          ? c.textSecondary
          : c.accentSecondary;
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: s.sm,
        paddingVertical: s.xs,
        borderRadius: radius.sm,
        backgroundColor: c.surfaceElevated,
      }}
    >
      <Copy kind="meta" color={color}>
        {status.toUpperCase()}
      </Copy>
    </View>
  );
}
export function MetricDisplay({
  label,
  value,
  hero = false,
  detail,
}: {
  label: string;
  value: string;
  hero?: boolean;
  detail?: string;
}) {
  return (
    <View style={styles.stack}>
      <Copy kind="meta" muted>
        {label.toUpperCase()}
      </Copy>
      <Copy kind={hero ? "hero" : "heading"}>{value}</Copy>
      {detail && <Copy muted>{detail}</Copy>}
    </View>
  );
}
export function EmptyState({
  title,
  detail,
  action,
  onPress,
}: {
  title: string;
  detail: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <AppCard>
      <Copy kind="section">{title}</Copy>
      <Copy muted>{detail}</Copy>
      {action && onPress && <PrimaryButton title={action} onPress={onPress} />}
    </AppCard>
  );
}
export function Skeleton() {
  const opacity = useSharedValue(0.4);
  React.useEffect(() => {
    opacity.value = withTiming(0.8, { duration: 800 });
  }, [opacity]);
  const a = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      accessibilityLabel="Loading content"
      style={[
        {
          height: 80,
          backgroundColor: c.surfaceSubtle,
          borderRadius: radius.md,
        },
        a,
      ]}
    />
  );
}
export function Avatar({ name }: { name: string }) {
  return (
    <View
      accessibilityLabel={name}
      style={{
        width: layout.touch,
        height: layout.touch,
        borderRadius: radius.pill,
        backgroundColor: c.surfaceSubtle,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Copy color={c.accentPrimary}>
        {name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")}
      </Copy>
    </View>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.stack}>
      <Copy kind="meta" muted>
        {label.toUpperCase()}
      </Copy>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={c.textMuted}
        selectionColor={c.accentPrimary}
        style={styles.input}
        {...props}
      />
    </View>
  );
}
export function Choice({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: s.sm }}>
      {options.map((o) => (
        <Pressable
          key={o}
          accessibilityRole="button"
          accessibilityState={{ selected: value === o }}
          onPress={() => onChange(o)}
          style={[
            styles.button,
            {
              paddingHorizontal: s.md,
              backgroundColor: value === o ? c.surfaceSubtle : c.bgSecondary,
              borderWidth: 1,
              borderColor: value === o ? c.accentPrimary : c.border,
            },
          ]}
        >
          <Copy color={value === o ? c.accentPrimary : c.textSecondary}>
            {o}
          </Copy>
        </Pressable>
      ))}
    </View>
  );
}
export function BottomSheet({
  visible,
  onDismiss,
  children,
}: {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: c.overlay,
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          accessibilityLabel="Dismiss sheet"
          accessibilityRole="button"
          onPress={onDismiss}
          style={{ flex: 1 }}
        />
        <SafeAreaView
          edges={["bottom"]}
          style={{
            maxHeight: "85%",
            backgroundColor: c.surfaceElevated,
            borderTopLeftRadius: radius.lg,
            borderTopRightRadius: radius.lg,
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: s.lg, gap: s.md }}
            >
              {children}
              <SecondaryButton title="Close" onPress={onDismiss} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
