/* Shared design-system primitives */

/* ── Skill Tag / Chip ─────────────────────────── */
interface ChipProps {
  label: string;
  variant?: "default" | "gap" | "match" | "sky" | "violet" | "amber";
  size?: "sm" | "md";
}

const chipStyles: Record<string, { bg: string; color: string; border?: string }> = {
  default: { bg: "var(--color-surface-high)", color: "var(--color-text-muted)" },
  gap:     { bg: "rgba(244, 63, 94, 0.08)",  color: "var(--color-rose)",   border: "rgba(244, 63, 94, 0.18)" },
  match:   { bg: "rgba(45, 212, 191, 0.1)",  color: "var(--color-teal-bright)", border: "rgba(45,212,191,0.2)" },
  sky:     { bg: "rgba(14, 165, 233, 0.08)", color: "var(--color-sky)",    border: "rgba(14,165,233,0.18)" },
  violet:  { bg: "rgba(139, 92, 246, 0.08)", color: "var(--color-violet)", border: "rgba(139,92,246,0.18)" },
  amber:   { bg: "rgba(245, 158, 11, 0.08)", color: "var(--color-amber)",  border: "rgba(245,158,11,0.18)" },
};

export function SkillChip({ label, variant = "default", size = "sm" }: ChipProps) {
  const s = chipStyles[variant];
  return (
    <span
      className={`inline-flex items-center rounded-md font-mono font-medium ${size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"}`}
      style={{
        background: s.bg,
        color: s.color,
        border: s.border ? `1px solid ${s.border}` : "none",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </span>
  );
}

/* ── Compatibility Badge ──────────────────────── */
interface BadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

function matchColor(score: number) {
  if (score >= 88) return "var(--color-teal-bright)";
  if (score >= 75) return "var(--color-amber)";
  return "var(--color-text-muted)";
}

export function CompatibilityBadge({ score, size = "md" }: BadgeProps) {
  const color = matchColor(score);
  const dim = size === "lg" ? 52 : size === "md" ? 42 : 32;
  const r = dim / 2 - 4;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const fontSize = size === "lg" ? 13 : size === "md" ? 11 : 9;
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="var(--color-surface-high)" strokeWidth="3" />
        <circle
          cx={dim / 2} cy={dim / 2} r={r}
          fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute font-mono font-semibold" style={{ color, fontSize, fontFamily: "var(--font-mono)" }}>
        {score}
      </span>
    </div>
  );
}

/* ── Action Buttons ───────────────────────────── */
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const btnBase = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed";

const btnVariants: Record<string, React.CSSProperties> = {
  primary:   { background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" },
  secondary: { background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid var(--color-border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
  ghost:     { background: "var(--color-primary-wash)", color: "var(--color-primary)", border: "1px solid rgba(99,102,241,0.2)" },
  danger:    { background: "rgba(244, 63, 94, 0.08)", color: "var(--color-rose)", border: "1px solid rgba(244,63,94,0.2)" },
};
const btnSizes: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function ActionButton({ variant = "primary", size = "md", children, style, ...rest }: BtnProps) {
  return (
    <button
      className={`${btnBase} ${btnSizes[size]}`}
      style={{ ...btnVariants[variant], ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ── Stat Card ────────────────────────────────── */
interface StatCardProps {
  value: string;
  label: string;
  sub?: string;
  color?: string;
  trend?: "up" | "down" | "flat";
}

export function StatCard({ value, label, sub, color = "var(--color-primary)", trend }: StatCardProps) {
  return (
    <div
      className="p-4 rounded-2xl relative overflow-hidden"
      style={{
        background: "var(--color-surface)",
        border: "1px solid rgba(99,102,241,0.08)",
        boxShadow: "0 2px 16px rgba(99,102,241,0.06)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="flex items-start justify-between mb-1">
        <div className="font-mono text-2xl font-bold" style={{ color, fontFamily: "var(--font-mono)" }}>
          {value}
        </div>
        {trend && (
          <span
            className="text-xs font-semibold mt-1 px-1.5 py-0.5 rounded-md"
            style={{
              color: trend === "up" ? "var(--color-teal-bright)" : trend === "down" ? "var(--color-rose)" : "var(--color-text-dim)",
              background: trend === "up" ? "rgba(45,212,191,0.1)" : trend === "down" ? "rgba(244,63,94,0.1)" : "var(--color-surface-high)",
            }}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "–"}
          </span>
        )}
      </div>
      <div className="text-xs font-semibold text-[var(--color-text)]">{label}</div>
      {sub && <div className="text-xs mt-0.5 text-[var(--color-text-dim)]">{sub}</div>}
    </div>
  );
}

/* ── Section header ───────────────────────────── */
interface SectionHeaderProps {
  prefix: string;
  title: string;
  accentColor?: string;
  sub?: string;
}

export function SectionHeader({ prefix, title, accentColor = "var(--color-primary)", sub }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <p className="font-mono text-xs mb-2 font-semibold" style={{ color: accentColor, fontFamily: "var(--font-mono)" }}>
        {prefix}
      </p>
      <h2 className="font-display text-3xl leading-tight text-[var(--color-text)] font-bold">
        {title}
      </h2>
      {sub && <p className="text-sm mt-2 text-[var(--color-text-muted)]">{sub}</p>}
    </div>
  );
}

/* ── Tab bar ──────────────────────────────────── */
interface TabBarProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  accentColor?: string;
}

export function TabBar({ tabs, active, onChange, accentColor = "var(--color-primary)" }: TabBarProps) {
  return (
    <div
      className="inline-flex gap-1 mb-6 p-1 rounded-xl"
      style={{ background: "var(--color-surface-high)" }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200"
          style={{
            color: active === t.id ? accentColor : "var(--color-text-dim)",
            background: active === t.id ? "var(--color-surface)" : "transparent",
            boxShadow: active === t.id ? "0 2px 8px rgba(99,102,241,0.1)" : "none",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
