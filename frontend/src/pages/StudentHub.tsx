import { useState, useEffect, useRef } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { SkillChip, CompatibilityBadge, ActionButton, StatCard } from "../components/ui";

const questions = [
  {
    q: "Rate your proficiency in React / frontend frameworks.",
    options: ["Beginner", "Intermediate", "Advanced", "Expert"],
    skill: "React/JS",
  },
  {
    q: "How comfortable are you with SQL and database design?",
    options: ["Never used", "Basic queries", "Complex joins & optimisation", "DBA level"],
    skill: "Databases",
  },
  {
    q: "Have you worked with REST APIs or GraphQL?",
    options: ["No", "Consumed APIs", "Built APIs", "Designed API architecture"],
    skill: "APIs",
  },
  {
    q: "Your experience with version control and CI/CD pipelines?",
    options: ["None", "Basic commits", "Branches & pull requests", "Full CI/CD pipelines"],
    skill: "DevOps",
  },
  {
    q: "Machine Learning & Data Science exposure?",
    options: ["None", "Coursework only", "Personal projects", "Production deployments"],
    skill: "ML/AI",
  },
];

const radarData = [
  { skill: "React/JS",      student: 62, industry: 85 },
  { skill: "Databases",     student: 45, industry: 78 },
  { skill: "APIs",          student: 70, industry: 80 },
  { skill: "DevOps",        student: 30, industry: 65 },
  { skill: "ML/AI",         student: 40, industry: 72 },
  { skill: "System Design", student: 28, industry: 70 },
  { skill: "Communication", student: 75, industry: 82 },
  { skill: "Cloud",         student: 35, industry: 68 },
];

const matches = [
  { role: "Full-Stack Developer Intern",  company: "Infosys BPM",  match: 88, skills: ["React", "Node.js", "MongoDB"],     type: "Internship", stipend: "₹18,000/mo" },
  { role: "Data Analyst Trainee",         company: "TCS iON",      match: 81, skills: ["SQL", "Python", "Tableau"],         type: "Internship", stipend: "₹15,000/mo" },
  { role: "ML Research Assistant",        company: "IIT Madras",   match: 74, skills: ["Python", "TensorFlow", "Research"], type: "Research",   stipend: "₹12,000/mo" },
  { role: "IoT Embedded Systems Intern",  company: "ISRO VSSC",    match: 68, skills: ["C++", "RTOS", "Hardware"],          type: "Govt.",      stipend: "₹10,000/mo" },
];

const typeColor: Record<string, string> = {
  Internship: "var(--color-teal-bright)",
  Research:   "var(--color-violet)",
  "Govt.":    "var(--color-amber)",
};

/* Animated progress bar that fills on mount */
function AnimatedBar({ pct, color }: { pct: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div className="h-1.5 rounded-full overflow-hidden bg-white/90">
      <div className="h-full rounded-full"
        style={{ width: `${width}%`, background: color, transition: "width 600ms cubic-bezier(0.22,1,0.36,1)" }} />
    </div>
  );
}

/* ── Empty / onboarding state ────────────────── */
function OnboardingState({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen pt-20 px-6 flex items-center justify-center animate-page-in bg-transparent">
      <div className="max-w-lg w-full text-center">
        {/* Idle radar illustration */}
        <div className="relative mx-auto mb-8" style={{ width: 200, height: 200 }}>
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
            {[80, 60, 40, 20].map((r) => (
              <polygon key={r} points={octagonPoints(100, 100, r)}
                fill="none" stroke="var(--color-border)" strokeWidth="1" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
              return (
                <line key={i} x1={100} y1={100}
                  x2={100 + Math.cos(angle) * 80}
                  y2={100 + Math.sin(angle) * 80}
                  stroke="var(--color-border)" strokeWidth="0.8" />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-xs mb-1 text-[var(--color-text-dim)] font-[var(--font-mono)]">AWAITING</div>
              <div className="font-mono text-xs text-[var(--color-text-muted)] font-[var(--font-mono)]">ASSESSMENT</div>
            </div>
          </div>
        </div>

        <p className="font-mono text-xs mb-3 text-[var(--color-teal-bright)] font-[var(--font-mono)]">// student.profile — unassessed</p>
        <h2 className="font-display text-3xl mb-3 text-[var(--color-text)] font-[var(--font-display)]">
          Unlock Your Skill Profile
        </h2>
        <p className="text-sm leading-relaxed mb-8 mx-auto max-w-sm text-[var(--color-text-muted)]">
          Complete your <strong className="text-[var(--color-text)] font-semibold">3-minute assessment</strong> to unlock
          AI-matched internships, your Skill-Gap Radar, and personalised learning paths — free, forever.
        </p>

        {/* What you unlock */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: "◎", label: "Skill-Gap Radar", color: "var(--color-teal-bright)" },
            { icon: "⟡", label: "Matched Internships", color: "var(--color-sky)" },
            { icon: "✦", label: "Verified Badge", color: "var(--color-violet)" },
          ].map((f) => (
            <div key={f.label} className="p-3 rounded-2xl border text-center bg-white/90 border-[var(--color-border)]">
              <div className="text-lg mb-1" style={{ color: f.color }}>{f.icon}</div>
              <div className="text-xs text-[var(--color-text-muted)]">{f.label}</div>
            </div>
          ))}
        </div>

        <ActionButton size="lg" onClick={onStart} style={{ width: "100%", justifyContent: "center" }}>
          Start 3-Minute Assessment →
        </ActionButton>
        <p className="text-xs mt-3 text-[var(--color-text-dim)]">
          5 adaptive questions · no login required · results in seconds
        </p>
      </div>
    </div>
  );
}

function octagonPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
  }).join(" ");
}

/* ── Quiz ─────────────────────────────────────── */
function QuizState({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [entering, setEntering] = useState(false);

  const pct = ((step) / questions.length) * 100;

  const advance = () => {
    if (selected === null) return;
    if (step + 1 < questions.length) {
      setEntering(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setSelected(null);
        setEntering(false);
      }, 160);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen pt-20 px-6 flex items-start justify-center animate-page-in bg-transparent">
      <div className="w-full max-w-xl mt-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-1.5">
            <p className="font-mono text-xs text-[var(--color-teal-bright)] font-[var(--font-mono)]">// skill_assessment.quiz</p>
            <span className="font-mono text-xs text-[var(--color-text-dim)] font-[var(--font-mono)]">{step + 1} / {questions.length}</span>
          </div>
          <div className="h-0.5 rounded-full overflow-hidden bg-white/90">
            <div className="h-full rounded-full transition-all duration-500 ease-out bg-[var(--color-teal-bright)]"
              style={{ width: `${pct + (1 / questions.length) * 100}%` }} />
          </div>
          <div className="mt-2 text-xs text-[var(--color-text-dim)]">
            Benchmarking: <span className="text-[var(--color-text-muted)]">{questions[step].skill}</span>
          </div>
        </div>

        <div key={step}
          className={`rounded-2xl border p-6 transition-all duration-200 bg-white/90 border-[var(--color-border)] ${entering ? "opacity-0 translate-y-2" : "opacity-100"}`}>
          <h3 className="text-base font-medium mb-6 leading-snug text-[var(--color-text)]">
            {questions[step].q}
          </h3>
          <div className="space-y-2.5">
            {questions[step].options.map((opt, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className="w-full text-left px-4 py-3 rounded-2xl border text-sm transition-all duration-150 group"
                style={{
                  background:   selected === i ? "var(--color-teal-wash)" : "var(--color-surface-raised)",
                  borderColor:  selected === i ? "var(--color-teal-bright)" : "var(--color-border)",
                  color:        selected === i ? "var(--color-teal-bright)" : "var(--color-text-muted)",
                  transform:    selected === i ? "translateX(3px)" : "none",
                }}>
                <span className="font-mono text-xs mr-3 font-[var(--font-mono)]" style={{ color: selected === i ? "var(--color-teal-bright)" : "var(--color-text-dim)" }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
                {selected === i && (
                  <span className="float-right text-[var(--color-teal-bright)]">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            {step > 0 ? (
              <ActionButton variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}>
                ← Back
              </ActionButton>
            ) : <div />}
            <ActionButton size="md" disabled={selected === null} onClick={advance}>
              {step + 1 === questions.length ? "See My Results →" : "Next →"}
            </ActionButton>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {questions.map((q, i) => (
            <SkillChip key={i} label={q.skill} variant={i < step ? "match" : i === step ? "sky" : "default"} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Results ──────────────────────────────────── */
function ResultState({ onRetake, onApply, dashboardData }: { onRetake: () => void; onApply: (id: number, role: string) => void; dashboardData: any }) {
  // Map backend skills to radar format. We'll simulate industry requirement as 80 for demo purposes,
  // or 100 if we just want to show the student's score. Let's use 85 as a target.
  const radarData = (dashboardData?.skills || []).map((s: any) => ({
    skill: s.name,
    student: s.proficiency,
    industry: 85
  }));

  // Map backend ranked_opportunities to matches
  const matches = (dashboardData?.ranked_opportunities || []).map((m: any) => ({
    id: m.opportunity.id,
    role: m.opportunity.title,
    company: "Opportunity", // Can map to actual company if provided
    match: Math.round(m.match.score),
    skills: m.match.required_matched || [],
    type: m.opportunity.type,
    stipend: m.opportunity.stipend || "Unpaid"
  }));

  const gapSorted = [...radarData].sort((a, b) => (b.industry - b.student) - (a.industry - a.student));
  // Find highest match score for overall match, or default to 0
  const overallMatch = matches.length > 0 ? Math.max(...matches.map((m: any) => m.match)) : 0;

  return (
    <div className="min-h-screen pt-20 px-6 pb-16 animate-page-in bg-transparent">
      <div className="max-w-5xl mx-auto mt-8">
        {/* Header row */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="font-mono text-xs mb-1 text-[var(--color-teal-bright)] font-[var(--font-mono)]">// assessment_complete — {dashboardData?.user?.email}</p>
            <h2 className="font-display text-3xl mb-1 text-[var(--color-text)] font-[var(--font-display)]">Skill-Gap Radar</h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Overall top match:{" "}
              <span className="font-mono font-semibold text-[var(--color-teal-bright)] font-[var(--font-mono)]">{overallMatch}%</span>
            </p>
          </div>
          <ActionButton variant="ghost" size="sm" onClick={onRetake}>Retake Quiz</ActionButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard value="74%" label="Overall Match" sub="Full-Stack benchmark" color="#4ECCA3" trend="up" />
          <StatCard value="3" label="Critical Gaps" sub="vs. industry demand" color="#FB7185" />
          <StatCard value="4" label="Strong Skills" sub="Above threshold" color="#38BDF8" />
          <StatCard value="88%" label="Top Match Role" sub="Full-Stack Intern · Infosys" color="#F59E0B" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
          {/* Radar chart */}
          <div className="lg:col-span-3 rounded-2xl border p-5 animate-scale-in bg-white/90 border-[var(--color-border)]">
            <p className="font-mono text-xs mb-1 text-[var(--color-text-dim)] font-[var(--font-mono)]">// skill_radar — student vs. industry demand</p>
            <p className="text-xs mb-4 text-[var(--color-text-dim)]">
              <span className="text-[var(--color-teal-bright)]">━</span> Your profile &nbsp;
              <span className="text-[var(--color-amber)]">╌</span> Industry benchmark
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "var(--color-text-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Your Skills"
                  dataKey="student"
                  stroke="var(--color-teal-bright)"
                  fill="var(--color-teal-bright)"
                  fillOpacity={0.18}
                  strokeWidth={2}
                  dot={{ fill: "var(--color-teal-bright)", r: 3, strokeWidth: 0 }}
                />
                <Radar
                  name="Industry Demand"
                  dataKey="industry"
                  stroke="var(--color-amber)"
                  fill="var(--color-amber)"
                  fillOpacity={0.06}
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)", border: "1px solid var(--color-border)",
                    borderRadius: 6, fontSize: 12, fontFamily: "var(--font-mono)",
                  }}
                  labelStyle={{ color: "var(--color-teal-bright)" }}
                  itemStyle={{ color: "var(--color-text)" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Gap breakdown */}
          <div className="lg:col-span-2 space-y-2.5">
            <p className="font-mono text-xs mb-3 text-[var(--color-text-dim)] font-[var(--font-mono)]">// gap_analysis[] — sorted by delta</p>
            {gapSorted.map((d) => {
              const gap = d.industry - d.student;
              const isCritical = gap > 30;
              const isGap = gap > 15;
              return (
                <div key={d.skill} className="px-4 py-3 rounded-2xl border transition-all"
                  style={{ background: "var(--color-surface)", borderColor: isCritical ? "var(--color-teal-muted)" : "var(--color-border)" }}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[var(--color-text)]">{d.skill}</span>
                      {isCritical && <SkillChip label="Gap Identified" variant="gap" />}
                    </div>
                    <SkillChip label={`${d.student}%`} variant={isGap ? "default" : "match"} />
                  </div>
                  {/* Demand bar (ghost) */}
                  <AnimatedBar pct={d.industry} color="var(--color-surface-raised)" />
                  {/* Student bar */}
                  <div className="mt-1">
                    <AnimatedBar pct={d.student} color={isCritical ? "var(--color-teal-bright)" : "var(--color-teal-muted)"} />
                  </div>
                  {isGap && (
                    <p className="text-xs mt-1.5 text-[var(--color-text-dim)]">
                      Need +{gap} pts · industry at {d.industry}%
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Matched opportunities */}
        <div>
          <p className="font-mono text-xs mb-1 text-[var(--color-teal-bright)] font-[var(--font-mono)]">// ai_matched_opportunities[]</p>
          <h3 className="font-display text-xl mb-5 text-[var(--color-text)] font-[var(--font-display)]">
            Ranked by Compatibility
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m, idx) => (
              <div key={m.role}
                className="p-5 rounded-2xl border transition-all duration-200 hover:border-gray-400 animate-tab-in bg-white/90 border-[var(--color-border)]"
                style={{
                  animationDelay: `${idx * 60}ms`,
                }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <span className="inline-block font-mono text-xs px-1.5 py-0.5 rounded mb-2 bg-[var(--color-surface-raised)]"
                      style={{ color: typeColor[m.type] }}>
                      {m.type}
                    </span>
                    <h4 className="text-sm font-semibold leading-snug mb-0.5 text-[var(--color-text)]">{m.role}</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">{m.company}</p>
                  </div>
                  <CompatibilityBadge score={m.match} size="md" />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.skills.map(s => <SkillChip key={s} label={s} />)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[var(--color-teal-bright)] font-[var(--font-mono)]">
                    {m.stipend}
                  </span>
                  <ActionButton size="sm" onClick={() => onApply(m.id, m.role)}>
                    Apply Now →
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Success ──────────────────────────────────── */
function SuccessState({ role, onBack }: { role: string; onBack: () => void }) {
  return (
    <div className="min-h-screen pt-20 px-6 flex items-center justify-center animate-scale-in bg-transparent">
      <div className="text-center max-w-md w-full">
        <div className="relative mx-auto mb-6" style={{ width: 72, height: 72 }}>
          <div className="w-full h-full rounded-full animate-pulse-glow"
            style={{ background: "var(--color-teal-wash)", border: "2px solid var(--color-teal-bright)", position: "absolute" }} />
          <div className="w-full h-full rounded-full flex items-center justify-center relative">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M6 15l7 7 12-14" stroke="var(--color-teal-bright)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h2 className="font-display text-2xl mb-2 text-[var(--color-text)] font-[var(--font-display)]">Application Submitted!</h2>
        <p className="text-sm mb-1 text-[var(--color-text-muted)]">You applied for</p>
        <p className="font-mono text-sm px-4 py-2 rounded inline-block mb-6 text-[var(--color-teal-bright)] bg-[var(--color-teal-wash)] border border-[var(--color-teal-muted)] font-[var(--font-mono)]">
          {role}
        </p>
        <p className="text-xs leading-relaxed mb-8 max-w-xs mx-auto text-[var(--color-text-dim)]">
          Your verified skill profile has been shared with the recruiter.
          Expected response within <strong className="text-[var(--color-text-muted)] font-semibold">3–5 working days</strong>.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <ActionButton variant="secondary" onClick={onBack}>← View Matches</ActionButton>
          <ActionButton variant="ghost">Download Profile</ActionButton>
        </div>
      </div>
    </div>
  );
}

/* ── Root ─────────────────────────────────────── */
type Phase = "loading" | "error" | "onboarding" | "quiz" | "result" | "success";

export default function StudentHub() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [appliedRole, setAppliedRole] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/student/dashboard", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const data = await res.json();
      setDashboardData(data);
      // If student already has a score/assessment completed, we could jump to result.
      // For now, always show onboarding first to encourage taking the quiz.
      setPhase("onboarding");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
      setPhase("error");
    }
  };

  const submitQuiz = async () => {
    setPhase("loading");
    try {
      const res = await fetch("http://localhost:8000/api/assessments/1/submit", { credentials: "include", method: "POST" });
      if (!res.ok) throw new Error("Failed to submit assessment");
      await fetchDashboard();
      setPhase("result");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Submit error");
      setPhase("error");
    }
  };

  const handleApply = async (internshipId: number, roleName: string) => {
    try {
      await fetch(`http://localhost:8000/api/student/apply/${internshipId}`, { credentials: "include", method: "POST" });
      setAppliedRole(roleName);
      setPhase("success");
    } catch (err) {
      alert("Failed to apply");
    }
  };

  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h2 className="text-2xl text-red-600 font-bold mb-2">Error</h2>
        <p className="text-gray-600">{errorMsg}</p>
        <button onClick={fetchDashboard} className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded">Retry</button>
      </div>
    );
  }

  if (phase === "onboarding") return <OnboardingState onStart={() => setPhase("quiz")} />;
  if (phase === "quiz")       return <QuizState onComplete={submitQuiz} />;
  if (phase === "result") {
    // Inject dynamic data into ResultState if we were fully rewriting it,
    // but for now we pass the original UI layout and handle the apply action
    return (
      <ResultState
        onRetake={() => setPhase("onboarding")}
        onApply={(id, role) => handleApply(id, role)}
        dashboardData={dashboardData}
      />
    );
  }
  return <SuccessState role={appliedRole!} onBack={() => setPhase("result")} />;
}
