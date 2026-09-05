import { useEffect, useRef, useState } from "react";
import { SkillChip, ActionButton, StatCard } from "../components/ui";

interface Props {
  onNavigate: (page: string) => void;
}

/* ── Node graph data ─────────────────────────── */
const nodes = [
  { id: "hub", x: 50, y: 50, r: 16, label: "HUB", color: "#6366F1", type: "hub" },
  { id: "s1", x: 18, y: 18, r: 9,  label: "UG",  color: "#0EA5E9", type: "student" },
  { id: "s2", x: 28, y: 72, r: 9,  label: "PG",  color: "#0EA5E9", type: "student" },
  { id: "s3", x: 10, y: 46, r: 7,  label: "PhD", color: "#0EA5E9", type: "student" },
  { id: "i1", x: 82, y: 16, r: 9,  label: "TCS",     color: "#F59E0B", type: "industry" },
  { id: "i2", x: 88, y: 50, r: 9,  label: "Infosys", color: "#F59E0B", type: "industry" },
  { id: "i3", x: 76, y: 80, r: 7,  label: "ISRO",    color: "#F59E0B", type: "industry" },
  { id: "a1", x: 50, y: 10, r: 8,  label: "IIT", color: "#8B5CF6", type: "academy" },
  { id: "a2", x: 50, y: 88, r: 8,  label: "NIT", color: "#8B5CF6", type: "academy" },
  { id: "a3", x: 24, y: 36, r: 6,  label: "FDP", color: "#8B5CF6", type: "academy" },
];

const edges = [
  ["hub","s1"],["hub","s2"],["hub","s3"],
  ["hub","i1"],["hub","i2"],["hub","i3"],
  ["hub","a1"],["hub","a2"],["hub","a3"],
  ["s1","a1"],["i1","a1"],
  ["s2","a2"],["i3","a2"],
  ["s3","a3"],["a3","hub"],
];

function NodeGraph() {
  const [t, setT] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const loop = () => {
      setT((Date.now() - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ maxWidth: 420 }}>
      {edges.map(([aId, bId], i) => {
        const a = nodes.find(n => n.id === aId)!;
        const b = nodes.find(n => n.id === bId)!;
        const phase = (i * 0.9 + t * 0.35) % (Math.PI * 2);
        const op = 0.08 + 0.2 * Math.abs(Math.sin(phase));
        return (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={a.color} strokeWidth="0.5" opacity={op} strokeDasharray="2.5 2" />
        );
      })}
      {nodes.map((n, i) => {
        const phase = (i * 1.4 + t * 0.55) % (Math.PI * 2);
        const dy = n.type === "hub" ? 0 : Math.sin(phase) * 1.2;
        const scale = n.type === "hub" ? 1 + 0.04 * Math.sin(t * 0.8) : 1;
        return (
          <g key={n.id} transform={`translate(${n.x},${n.y + dy}) scale(${scale})`}>
            <circle r={n.r + 5} fill={n.color} opacity={0.04 + 0.04 * Math.abs(Math.sin(phase))} />
            <circle r={n.r + 2} fill={n.color} opacity={0.07} />
            <circle r={n.r} fill="white" stroke={n.color} strokeWidth="0.7" opacity={0.95} />
            <circle r={n.r - 3} fill={n.color} opacity={0.1} />
            <circle r={2.2} fill={n.color} opacity={0.9} />
            {n.type === "hub" && (
              <text textAnchor="middle" dy="0.35em" fontSize="3" fill={n.color}
                fontFamily="JetBrains Mono" letterSpacing="0.5">
                {n.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Portal card ─────────────────────────────── */
interface PortalProps {
  icon: string;
  title: string;
  titleHi: string;
  color: string;
  desc: string;
  tag: string;
  delay: number;
  onClick: () => void;
}

function PortalCard({ icon, title, titleHi, color, desc, tag, delay, onClick }: PortalProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-left p-6 rounded-2xl transition-all duration-300 animate-tab-in"
      style={{
        background: hovered ? "white" : "white",
        border: `1px solid ${hovered ? color + "40" : "rgba(99,102,241,0.08)"}`,
        animationDelay: `${delay}ms`,
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 16px 40px ${color}18` : "0 2px 12px rgba(99,102,241,0.06)",
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
        style={{ background: color + "12" }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <h3 className="font-display text-lg font-bold mb-0.5" style={{ color: "var(--color-text)" }}>
        {title}
      </h3>
      <p className="font-mono text-xs mb-3 font-medium" style={{ color }}>{titleHi}</p>
      <p className="text-xs leading-relaxed mb-4 text-[var(--color-text-muted)]">{desc}</p>
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs"
          style={{ background: color + "10", color }}>
          {tag}
        </div>
        <span className="text-xs font-semibold transition-all duration-200" style={{ color, opacity: hovered ? 1 : 0 }}>
          Enter →
        </span>
      </div>
    </button>
  );
}

/* ── Main ─────────────────────────────────────── */
const portals: Array<Omit<PortalProps, "delay" | "onClick">> = [
  {
    icon: "◈", title: "Student Hub", titleHi: "छात्र केंद्र", color: "#0EA5E9",
    desc: "Take the 3-minute assessment, reveal your Skill-Gap Radar, and get matched to internships by AI.",
    tag: "Quiz → Radar → Match",
  },
  {
    icon: "◆", title: "Industry Portal", titleHi: "उद्योग द्वार", color: "#F59E0B",
    desc: "Post opportunities, rank skill-matched candidates, and measure real-time talent readiness.",
    tag: "Post → Rank → Hire",
  },
  {
    icon: "◉", title: "Academician Zone", titleHi: "शिक्षा क्षेत्र", color: "#8B5CF6",
    desc: "Host FDPs, co-author research, request mentors, and bridge the curriculum-to-industry gap.",
    tag: "FDP → Research → Mentor",
  },
];

const pageIds = ["student", "industry", "academician"];

const stats = [
  { value: "1.2L+", label: "Students Assessed", sub: "Active profiles",   color: "#6366F1" as const },
  { value: "94",    label: "Industry Partners", sub: "Across 12 sectors", color: "#0EA5E9" as const },
  { value: "88%",   label: "Avg Match Score",   sub: "Student ↔ role fit", color: "#F59E0B" as const },
  { value: "340",   label: "FDPs Hosted",       sub: "Last academic year", color: "#8B5CF6" as const },
];

export default function Landing({ onNavigate }: Props) {
  return (
    <div className="min-h-screen animate-page-in" style={{ background: "var(--color-canvas)" }}>

      {/* ── Hero ── */}
      <section className="pt-20 pb-16 px-6 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-[-1]">
          <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #6366F1, transparent 70%)" }} />
          <div className="absolute top-40 right-[-100px] w-96 h-96 rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }} />
          <div className="absolute bottom-0 left-[30%] w-72 h-72 rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #0EA5E9, transparent 70%)" }} />
          {/* Dot pattern overlay */}
          <div className="absolute inset-0 dot-pattern" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 font-mono text-xs"
              style={{
                borderColor: "rgba(99,102,241,0.25)",
                color: "var(--color-primary)",
                background: "var(--color-primary-wash)",
              }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Triple-Helix Skill Intelligence · v2.0
            </div>

            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl leading-[1.1] font-bold mb-5"
              style={{ color: "var(--color-text)" }}>
              Closing the Gap Between{" "}
              <span className="gradient-text">Learning</span>
              {" & "}
              <span className="gradient-text-amber">Opportunity</span>
            </h1>

            <p className="text-sm lg:text-base leading-relaxed mb-8 max-w-md text-[var(--color-text-muted)]">
              AI-powered skill assessment that maps student competencies against live industry demand,
              identifies gaps in real time, and surfaces ranked matches — for students, industry, and academia.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <ActionButton size="lg" onClick={() => onNavigate("student")}>
                Start Free Assessment →
              </ActionButton>
              <ActionButton variant="secondary" size="lg" onClick={() => onNavigate("analytics")}>
                View Analytics
              </ActionButton>
            </div>

            {/* Skill chip cloud */}
            <div className="flex flex-wrap gap-2">
              {["React", "Python", "ML/AI", "DevOps", "System Design", "IoT"].map((s, i) => (
                <SkillChip key={s} label={s} variant={i % 2 === 0 ? "match" : "default"} size="md" />
              ))}
              <SkillChip label="Gap Identified" variant="gap" size="md" />
            </div>
          </div>

          {/* Node graph */}
          <div className="flex items-center justify-center h-72 lg:h-[420px] animate-float">
            <NodeGraph />
          </div>
        </div>

        {/* Stat bar */}
        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={s.label} className="animate-tab-in" style={{ animationDelay: `${i * 80}ms` }}>
              <StatCard value={s.value} label={s.label} sub={s.sub} color={s.color} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Portals ── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="font-mono text-xs mb-2 font-semibold text-[var(--color-primary)]">
              // ENTRY PORTALS
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[var(--color-text)]">
              Choose Your Role
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {portals.map((p, i) => (
              <PortalCard key={p.title} {...p} delay={i * 80} onClick={() => onNavigate(pageIds[i])} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Golden Path ── */}
      <section className="px-6 py-20" style={{ background: "var(--color-canvas-alt)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="font-mono text-xs mb-2 font-semibold text-[var(--color-primary)]">
              // GOLDEN PATH
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-2 text-[var(--color-text)]">
              From Assessment to Employment
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              The entire flow — from blank profile to confirmed internship — in under 72 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { step: "01", title: "Landing Page",       desc: "Choose your portal — Student, Industry, or Academician.",       color: "#6366F1" },
              { step: "02", title: "Assessment Quiz",    desc: "5 adaptive questions benchmark 8 skill domains in real time.",   color: "#0EA5E9" },
              { step: "03", title: "Radar Chart",        desc: "AI overlays your profile against live industry demand curves.",  color: "#8B5CF6" },
              { step: "04", title: "Matched Internship", desc: "Ranked opportunities sorted by compatibility score.",            color: "#F59E0B" },
              { step: "05", title: "Application",        desc: "One-click apply with your verified skill profile attached.",     color: "#10B981" },
            ].map((w, i) => (
              <div key={i} className="relative animate-tab-in" style={{ animationDelay: `${i * 70}ms` }}>
                {i < 4 && (
                  <div className="hidden lg:block absolute top-4 right-0 w-5 h-px"
                    style={{ background: "var(--color-border)" }} />
                )}
                <div
                  className="w-9 h-9 rounded-2xl flex items-center justify-center mb-4 font-mono text-xs font-bold"
                  style={{ background: w.color + "15", color: w.color, border: `1px solid ${w.color}25` }}
                >
                  {w.step}
                </div>
                <h4 className="text-sm font-bold mb-1.5 text-[var(--color-text)]">{w.title}</h4>
                <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">{w.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <ActionButton size="lg" onClick={() => onNavigate("student")}>
              Start the Golden Path →
            </ActionButton>
          </div>
        </div>
      </section>
    </div>
  );
}
