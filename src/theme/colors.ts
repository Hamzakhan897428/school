/**
 * Centralized theme colors matching global.css variables.
 * Use for props that require raw color strings (such as icon color props).
 */
export const THEME = {
  primary: "#4645F6",
  primarySoft: "#EEF2FF",
  app: "#F8F9FA",
  card: "#FFFFFF",
  input: "#EBF2FE",
  success: "#059669",
  successBg: "#ECFDF5",
  danger: "#E11D48",
  dangerBg: "#FFF1F2",
  warning: "#D97706",
  warningBg: "#FFFBEB",
  main: "#111827",
  muted: "#6B7280",
  light: "#9CA3AF",
  border: "#F3F4F6",
} as const;

export default THEME;

