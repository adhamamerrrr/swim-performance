import { TextStyle } from "react-native";
export const colors = {
  bgPrimary: "#070A0F",
  bgSecondary: "#101419",
  surfaceElevated: "#171C22",
  surfaceSubtle: "#20262D",
  textPrimary: "#F7F8FA",
  textSecondary: "#A5ADB8",
  textMuted: "#69737F",
  accentPrimary: "#74B9FF",
  accentSecondary: "#65D2B0",
  warning: "#E7B968",
  danger: "#D77F83",
  border: "#28313B",
  overlay: "#070A0FCC",
};
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius = { sm: 8, md: 16, lg: 24, pill: 100 };
export const typography: Record<
  "hero" | "heading" | "section" | "body" | "meta",
  TextStyle
> = {
  hero: { fontSize: 48, fontWeight: "600", fontVariant: ["tabular-nums"] },
  heading: { fontSize: 32, fontWeight: "600" },
  section: { fontSize: 20, fontWeight: "500" },
  body: { fontSize: 15, fontWeight: "400", lineHeight: 23 },
  meta: { fontSize: 11, fontWeight: "500", letterSpacing: 0.5 },
};
export const animation = {
  duration: 240,
  longPress: 420,
  chartDuration: 650,
  spring: { damping: 15, stiffness: 150, mass: 0.8 },
};
export const layout = { touch: 48, page: 24, tabHeight: 68, maxWidth: 680 };
export const shadows = {
  elevated: {
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
};
export const semantic = {
  success: colors.accentSecondary,
  pending: colors.warning,
  error: colors.danger,
};
