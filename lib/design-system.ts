// lib/design-system.ts

export const C = {
  // ── Core backgrounds ─────────────────────────────
  bg: "#0B1020",
  bgSoft: "#111827",
  surface: "#12192B",
  surface2: "#182338",
  surface3: "#1E293B",

  // ── Borders ─────────────────────────────────────
  border: "#243041",
  borderSoft: "#1E293B",

  // ── Typography ──────────────────────────────────
  text: "#F8FAFC",
  textSoft: "#CBD5E1",
  textMuted: "#94A3B8",
  textDark: "#0F172A",

  // ── Brand ───────────────────────────────────────
  primary: "#6366F1",
  primaryHover: "#7C3AED",
  primarySoft: "rgba(99,102,241,0.14)",

  // ── Status ──────────────────────────────────────
  success: "#10B981",
  successSoft: "rgba(16,185,129,0.15)",

  warning: "#F59E0B",
  warningSoft: "rgba(245,158,11,0.15)",

  danger: "#EF4444",
  dangerSoft: "rgba(239,68,68,0.15)",

  info: "#38BDF8",
  infoSoft: "rgba(56,189,248,0.15)",

  // ── Medical / Rehab accents ─────────────────────
  rehabBlue: "#4F46E5",
  rehabBlueSoft: "rgba(79,70,229,0.16)",

  rehabTeal: "#06B6D4",
  rehabTealSoft: "rgba(6,182,212,0.16)",

  // ── Shadows ─────────────────────────────────────
  shadowSm: "0 1px 2px rgba(0,0,0,0.18)",
  shadowMd: "0 8px 24px rgba(0,0,0,0.28)",
  shadowLg: "0 20px 40px rgba(0,0,0,0.38)",

  // ── Overlays ────────────────────────────────────
  overlay: "rgba(2,6,23,0.72)",
}

export const S = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
}

export const R = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
}

export const FONT = {
  family:
    "'Inter', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 36,
  },

  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 800,
  },
}

export const BTN = {
  primary: {
    background: C.primary,
    color: "#fff",
    border: `1px solid ${C.primary}`,
    boxShadow: C.shadowSm,
  },

  secondary: {
    background: C.surface2,
    color: C.text,
    border: `1px solid ${C.border}`,
  },

  ghost: {
    background: "transparent",
    color: C.textSoft,
    border: `1px solid transparent`,
  },
}

export const CARD = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: R.lg,
  boxShadow: C.shadowMd,
}

export const INPUT = {
  background: C.surface2,
  border: `1px solid ${C.border}`,
  color: C.text,
  borderRadius: R.md,
  padding: "12px 14px",
}

export const TRANSITION = {
  fast: "all .15s ease",
  normal: "all .22s ease",
  slow: "all .35s ease",
}