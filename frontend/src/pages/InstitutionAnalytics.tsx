import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, Cell,
} from "recharts";
import { StatCard, SkillChip, TabBar } from "../components/ui";

const placementFunnel = [
  { stage: "Enrolled",      count: 1240 },
  { stage: "Assessed",      count: 1087 },
  { stage: "Profile Built", count: 934 },
  { stage: "Applied",       count: 712 },
  { stage: "Shortlisted",   count: 389 },
  { stage: "Offered",       count: 291 },
  { stage: "Placed",        count: 268 },
];

const heatmapSkills = [
  { skill: "React / Next.js",   cse: 8, ece: 2, mech: 1, civil: 0 },
  { skill: "Python / ML",       cse: 9, ece: 6, mech: 3, civil: 1 },
  { skill: "Embedded / IoT",    cse: 4, ece: 9, mech: 5, civil: 1 },
  { skill: "CAD / Simulation",  cse: 1, ece: 2, mech: 10, civil: 7 },
  { skill: "SQL / Data Eng.",   cse: 7, ece: 3, mech: 2, civil: 2 },
  { skill: "DevOps / Cloud",    cse: 6, ece: 3, mech: 1, civil: 0 },
  { skill: "Communication",     cse: 6, ece: 7, mech: 6, civil: 8 },
  { skill: "System Design",     cse: 5, ece: 4, mech: 4, civil: 3 },
];

const trend = [
  { month: "Apr", placed: 18 },
  { month: "May", placed: 34 },
  { month: "Jun", placed: 62 },
  { month: "Jul", placed: 89 },
  { month: "Aug", placed: 121 },
  { month: "Sep", placed: 268 },
];

const batchStats = [
  { batch: "CSE 2026", students: 120, assessed: 114, placed: 98,  avgMatch: 84 },
  { batch: "ECE 2026", students: 90,  assessed: 82,  placed: 67,  avgMatch: 79 },
  { batch: "Mech 2026",students: 80,  assessed: 68,  placed: 49,  avgMatch: 71 },
  { batch: "Civil 2026",students: 60,  assessed: 48,  placed: 32,  avgMatch: 65 },
  { batch: "MBA 2026",  students: 75,  assessed: 70,  placed: 63,  avgMatch: 88 },
];

const deptColors = ["#4ECCA3", "#38BDF8", "#F59E0B", "#8B5CF6", "#FB7185"];
const depts      = ["cse", "ece", "mech", "civil"];
const deptLabels = ["CSE", "ECE", "Mech", "Civil"];
const deptHues   = ["#4ECCA3", "#38BDF8", "#F59E0B", "#8B5CF6"];

function heatColor(v: number) {
  if (v >= 9) return { bg: "var(--color-teal-bright)", fg: "var(--color-canvas)" };
  if (v >= 7) return { bg: "var(--color-teal-wash)", fg: "var(--color-teal-bright)" };
  if (v >= 5) return { bg: "var(--color-surface-raised)", fg: "var(--color-teal-bright)" };
  if (v >= 3) return { bg: "var(--color-surface)", fg: "var(--color-text-muted)" };
  if (v >= 1) return { bg: "var(--color-canvas-alt)", fg: "var(--color-text-dim)" };
  return { bg: "transparent", fg: "var(--color-border)" };
}

const TTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-2xl border text-xs font-mono bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-text)]">
      <div className="mb-0.5 text-[var(--color-teal-bright)]">{label}</div>
      <div>{payload[0]?.name}: <strong>{payload[0]?.value}</strong></div>
    </div>
  );
};

const tabs = [
  { id: "overview",  label: "Overview" },
  { id: "heatmap",   label: "Skill Heatmap" },
  { id: "batches",   label: "Batch Stats" },
];

export default function InstitutionAnalytics() {
  const [tab, setTab] = useState("overview");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/institution/dashboard", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch institution dashboard");
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h2 className="text-2xl text-red-600 font-bold mb-2">Error</h2>
        <p className="text-gray-600">{errorMsg}</p>
        <button onClick={fetchDashboard} className="mt-4 px-4 py-2 bg-sky-500 text-white rounded">Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-16 animate-page-in bg-transparent">
      <div className="max-w-6xl mx-auto mt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="font-mono text-xs mb-1 text-[var(--color-sky)] font-[var(--font-mono)]">
              // INSTITUTION ANALYTICS
            </p>
            <h2 className="font-display text-3xl mb-1 text-[var(--color-text)] font-[var(--font-display)]">
              Placement Intelligence
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              PSG College of Technology · Batch 2026 · Live data
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border font-mono text-xs text-[var(--color-text-dim)] border-[var(--color-border)] bg-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal-bright)]" />
            Updated 2 min ago
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {[
            { value: "1,240", label: "Students Enrolled",   sub: "Batch 2026",             color: "var(--color-teal-bright)", trend: undefined },
            { value: "91%",   label: "Assessment Rate",     sub: "1,087 completed",        color: "var(--color-sky)", trend: "up"      },
            { value: "268",   label: "Placed",              sub: "As of Sep 2026",         color: "var(--color-amber)", trend: "up"      },
            { value: "₹6.2L", label: "Avg CTC",            sub: "Annual package",         color: "var(--color-violet)", trend: "up"      },
            { value: "78%",   label: "Placement Rate",      sub: "vs. 68% last year",     color: "#E11D48", trend: "up"      },
          ].map((k, i) => (
            <div key={k.label} className="animate-tab-in" style={{ animationDelay: `${i * 50}ms` }}>
              <StatCard value={k.value} label={k.label} sub={k.sub} color={k.color} trend={k.trend as any} />
            </div>
          ))}
        </div>

        <TabBar tabs={tabs} active={tab} onChange={setTab} accentColor="var(--color-sky)" />

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="animate-tab-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Funnel */}
              <div className="rounded-2xl border p-5 bg-white/90 border-[var(--color-border)]">
                <p className="font-mono text-xs mb-5 text-[var(--color-text-dim)]">// placement_funnel[]</p>
                <div className="space-y-3">
                  {placementFunnel.map((s, i) => {
                    const pct = Math.round((s.count / placementFunnel[0].count) * 100);
                    const alpha = 0.2 + (i / placementFunnel.length) * 0.8;
                    return (
                      <div key={s.stage}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-[var(--color-text-muted)]">{s.stage}</span>
                          <span className="font-mono text-xs font-semibold text-[var(--color-text)]">
                            {s.count.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden bg-transparent">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: `color-mix(in srgb, var(--color-teal-bright) ${Math.round(alpha * 100)}%, transparent)` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trend chart */}
              <div className="lg:col-span-2 rounded-2xl border p-5 bg-white/90 border-[var(--color-border)]">
                <p className="font-mono text-xs mb-5 text-[var(--color-text-dim)]">
                  // placement_trend — cumulative Apr–Sep 2026
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="var(--color-teal-bright)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--color-teal-bright)" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 5" />
                    <XAxis dataKey="month" tick={{ fill: "var(--color-text-dim)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--color-text-dim)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<TTip />} />
                    <Area
                      type="monotone" dataKey="placed" name="Placed"
                      stroke="var(--color-teal-bright)" strokeWidth={2} fill="url(#areaGrad)"
                      dot={{ fill: "var(--color-teal-bright)", r: 4, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dept bar */}
            <div className="mt-6 rounded-2xl border p-5 bg-white/90 border-[var(--color-border)]">
              <p className="font-mono text-xs mb-5 text-[var(--color-text-dim)]">
                // placements_by_department — Batch 2026
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={batchStats} barCategoryGap="32%">
                  <XAxis dataKey="batch" tick={{ fill: "var(--color-text-dim)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--color-text-dim)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TTip />} />
                  <Bar dataKey="placed" name="Placed" radius={[3, 3, 0, 0]}>
                    {batchStats.map((_, i) => (
                      <Cell key={i} fill={deptColors[i] ?? "var(--color-teal-bright)"} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Skill Heatmap ── */}
        {tab === "heatmap" && (
          <div className="animate-tab-in">
            <div className="flex items-center justify-between mb-6">
              <p className="font-mono text-xs text-[var(--color-text-dim)]">
                // skill_shortage_heatmap — proficiency index 0–10 by department
              </p>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-[var(--color-canvas-alt)]">■ <span className="text-[var(--color-text-dim)]">0</span></span>
                <span className="text-[var(--color-surface)]">■ <span className="text-[var(--color-text-muted)]">2</span></span>
                <span className="text-[var(--color-surface-raised)]">■ <span className="text-[var(--color-text)]">5</span></span>
                <span className="text-[var(--color-teal-wash)]">■ <span className="text-[var(--color-text)]">7</span></span>
                <span className="text-[var(--color-teal-bright)]">■ <span className="text-[var(--color-text)]">9</span></span>
              </div>
            </div>
            <div className="rounded-2xl border overflow-x-auto border-[var(--color-border)]">
              <table className="w-full min-w-[640px] text-xs">
                <thead>
                  <tr className="bg-[var(--color-canvas-alt)] border-b border-[var(--color-border)]">
                    <th className="text-left px-5 py-3 font-mono text-[var(--color-text-dim)]" style={{ minWidth: 180 }}>Skill Domain</th>
                    {deptLabels.map((d, i) => (
                      <th key={d} className="py-3 text-center font-mono" style={{ color: deptHues[i] }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapSkills.map((row, ri) => (
                    <tr key={row.skill} className="border-t animate-tab-in border-[var(--color-border)]"
                      style={{ animationDelay: `${ri * 40}ms` }}>
                      <td className="px-5 py-2.5 text-xs text-[var(--color-text-muted)]">{row.skill}</td>
                      {depts.map((d) => {
                        const v = row[d as keyof typeof row] as number;
                        const { bg, fg } = heatColor(v);
                        return (
                          <td key={d} className="py-2 text-center">
                            <div className="inline-flex items-center justify-center w-10 h-8 rounded font-mono font-semibold transition-all duration-300 text-xs"
                              style={{ background: bg, color: fg }}>
                              {v}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Batches ── */}
        {tab === "batches" && (
          <div className="animate-tab-in">
            <p className="font-mono text-xs mb-5 text-[var(--color-text-dim)]">
              // batch_performance_summary[] — Batch 2026
            </p>
            <div className="rounded-2xl border overflow-x-auto border-[var(--color-border)]">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="bg-[var(--color-canvas-alt)] border-b border-[var(--color-border)]">
                    {["Batch", "Students", "Assessed", "Placed", "Placement %", "Avg Match"].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-mono text-xs text-[var(--color-text-dim)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {batchStats.map((b, i) => {
                    const placePct = Math.round((b.placed / b.students) * 100);
                    const pColor = placePct >= 80 ? "var(--color-teal-bright)" : placePct >= 65 ? "var(--color-amber)" : "#E11D48";
                    return (
                      <tr key={b.batch}
                        className="border-t hover:bg-black/5 transition-all duration-150 animate-tab-in border-[var(--color-border)]"
                        style={{ animationDelay: `${i * 50}ms` }}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: deptColors[i] }} />
                            <span className="font-medium text-[var(--color-text)]">{b.batch}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-[var(--color-text-muted)]">{b.students}</td>
                        <td className="px-5 py-3 font-mono text-xs text-[var(--color-text-muted)]">{b.assessed}</td>
                        <td className="px-5 py-3 font-mono text-xs font-semibold text-[var(--color-teal-bright)]">{b.placed}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full overflow-hidden bg-transparent">
                              <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${placePct}%`, background: pColor }} />
                            </div>
                            <span className="font-mono text-xs font-semibold" style={{ color: pColor }}>{placePct}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <SkillChip
                            label={`${b.avgMatch}%`}
                            variant={b.avgMatch >= 80 ? "match" : "amber"}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
