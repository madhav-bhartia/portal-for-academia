import { useState, useEffect } from "react";
import { SkillChip, ActionButton, TabBar } from "../components/ui";

const fdps = [
  { title: "FDP on Embedded IoT & Edge Computing",          host: "NIT Trichy",  dates: "12–16 Oct 2026", seats: 40, filled: 28, mode: "Hybrid",  domain: "Electronics" },
  { title: "Workshop: Large Language Models for Academia",  host: "IIT Madras",  dates: "3–5 Nov 2026",   seats: 60, filled: 52, mode: "Online",   domain: "AI/ML" },
  { title: "Industry Internship Mentorship Programme",      host: "Amrita Uni.", dates: "Oct–Dec 2026",   seats: 25, filled: 9,  mode: "Offline",  domain: "General" },
  { title: "FDP: Autonomous Robotics & ROS2",               host: "PSG Tech",    dates: "20–24 Oct 2026", seats: 35, filled: 35, mode: "Offline",  domain: "Robotics" },
  { title: "Research Methodology & Grant Writing",          host: "Anna Uni.",   dates: "8–10 Nov 2026",  seats: 80, filled: 44, mode: "Hybrid",   domain: "Research" },
];

const research = [
  {
    title: "Autonomous Waste Segregation System using Computer Vision",
    pi: "Dr. Kavitha Subramanian", collab: "ISRO VSSC",
    slots: 3, filled: 2, deadline: "15 Oct 2026",
    tags: ["Computer Vision", "Python", "Robotics"],
  },
  {
    title: "NLP-based Dialect Preservation for Tamil Corpus",
    pi: "Dr. Ramesh Iyer", collab: "IIT Madras",
    slots: 2, filled: 1, deadline: "22 Oct 2026",
    tags: ["NLP", "Linguistics", "Python"],
  },
  {
    title: "Smart Grid Load Forecasting with LSTM Networks",
    pi: "Dr. Anitha Raj", collab: "TNEB",
    slots: 4, filled: 4, deadline: "Closed",
    tags: ["LSTM", "Time-Series", "MATLAB"],
  },
];

const mentors = [
  { name: "Dr. Pradeep Kumar",    dept: "CSE",  inst: "IIT Madras",  expertise: ["AI/ML", "Computer Vision"], slots: 2, students: 3 },
  { name: "Prof. Latha Venkatesh",dept: "ECE",  inst: "NIT Trichy",  expertise: ["IoT", "Embedded Systems"],  slots: 1, students: 4 },
  { name: "Dr. Suresh Babu",      dept: "MBA",  inst: "Amrita Uni.", expertise: ["Entrepreneurship", "Strategy"], slots: 3, students: 2 },
];

const modeColor: Record<string, string> = {
  Hybrid: "#38BDF8", Online: "#4ECCA3", Offline: "#8B5CF6",
};

const tabs = [
  { id: "fdp",      label: "FDP Listings" },
  { id: "research", label: "Research Projects" },
  { id: "mentor",   label: "Mentorship" },
];

export default function AcademicianPortal() {
  const [tab, setTab] = useState("fdp");
  const [registered, setRegistered] = useState<string | null>(null);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/academician/dashboard", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch academician dashboard");
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
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h2 className="text-2xl text-red-600 font-bold mb-2">Error</h2>
        <p className="text-gray-600">{errorMsg}</p>
        <button onClick={fetchDashboard} className="mt-4 px-4 py-2 bg-violet-500 text-white rounded">Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-16 animate-page-in bg-transparent">
      <div className="max-w-6xl mx-auto mt-6">
        <div className="mb-8">
          <p className="font-mono text-xs mb-1 text-[var(--color-violet)] font-[var(--font-mono)]">
            // ACADEMICIAN PORTAL
          </p>
          <h2 className="font-display text-3xl mb-1 text-[var(--color-text)] font-[var(--font-display)]">
            Faculty & Research Network
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Discover FDPs, collaborate on funded research, and mentor the next cohort.
          </p>
        </div>

        <TabBar tabs={tabs} active={tab} onChange={setTab} accentColor="var(--color-violet)" />

        {/* ── FDP ── */}
        {tab === "fdp" && (
          <div className="animate-tab-in">
            {registered ? (
              <div className="text-center py-16 max-w-md mx-auto animate-scale-in">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-[var(--color-violet-wash)] border-2 border-[var(--color-violet)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke="var(--color-violet)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-display text-xl mb-2 text-[var(--color-text)] font-[var(--font-display)]">Registration Confirmed!</h3>
                <p className="text-sm mb-1 text-[var(--color-text-muted)]">You have registered for</p>
                <p className="font-mono text-xs px-4 py-2 rounded inline-block mb-6 bg-[var(--color-violet-wash)] text-[var(--color-violet)] border border-[var(--color-violet)]/20">
                  {registered}
                </p>
                <p className="text-xs mb-6 text-[var(--color-text-dim)]">
                  Joining instructions will be sent to your institutional email within 24 hours.
                </p>
                <ActionButton variant="ghost" onClick={() => setRegistered(null)}>← Back to FDPs</ActionButton>
              </div>
            ) : (
              <>
                <p className="font-mono text-xs mb-4 text-[var(--color-text-dim)] font-[var(--font-mono)]">
                  {fdps.length} programmes · Oct–Nov 2026
                </p>
                <div className="rounded-2xl border overflow-x-auto border-[var(--color-border)]">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead>
                      <tr className="bg-[var(--color-canvas-alt)] border-b border-[var(--color-border)]">
                        {["Programme", "Host", "Dates", "Mode", "Seats", "Domain", ""].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-mono text-xs text-[var(--color-text-dim)]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {fdps.map((f, i) => {
                        const pct = Math.round((f.filled / f.seats) * 100);
                        const full = f.filled >= f.seats;
                        return (
                          <tr key={i} className="border-t transition-all duration-150 hover:bg-black/5 border-[var(--color-border)]">
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium text-[var(--color-text)]">{f.title}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-[var(--color-text-muted)] whitespace-nowrap">{f.host}</td>
                            <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)] whitespace-nowrap">{f.dates}</td>
                            <td className="px-4 py-3">
                              <SkillChip
                                label={f.mode}
                                variant={f.mode === "Online" ? "match" : f.mode === "Hybrid" ? "sky" : "violet"}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-14 h-1.5 rounded-full overflow-hidden bg-transparent">
                                  <div className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${pct}%`, background: full ? "#E11D48" : "var(--color-teal-bright)" }} />
                                </div>
                                <span className="font-mono text-xs" style={{ color: full ? "#E11D48" : "var(--color-text-muted)" }}>
                                  {f.filled}/{f.seats}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <SkillChip label={f.domain} />
                            </td>
                            <td className="px-4 py-3">
                              <ActionButton
                                variant={full ? "ghost" : "secondary"}
                                size="sm"
                                disabled={full}
                                onClick={() => setRegistered(f.title)}
                                style={full ? { opacity: 0.3, cursor: "not-allowed" } : { borderColor: "var(--color-violet)", color: "var(--color-violet)" }}>
                                {full ? "Full" : "Register"}
                              </ActionButton>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Research ── */}
        {tab === "research" && (
          <div className="space-y-4 animate-tab-in">
            <p className="font-mono text-xs text-[var(--color-text-dim)] font-[var(--font-mono)]">
              // funded_research_projects[] — open for collaboration
            </p>
            {research.map((r, i) => {
              const full = r.filled >= r.slots || r.deadline === "Closed";
              return (
                <div key={r.title} className="p-5 rounded-2xl border transition-all duration-200 animate-tab-in bg-white/90 border-[var(--color-border)] hover:bg-black/5 cursor-pointer"
                  style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-start gap-4 justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold mb-1 text-[var(--color-text)]">{r.title}</h4>
                      <p className="text-xs mb-0.5 text-[var(--color-text-muted)]">PI: {r.pi}</p>
                      <p className="text-xs mb-3 text-[var(--color-text-dim)]">
                        In collaboration with <span className="text-[var(--color-text-muted)]">{r.collab}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {r.tags.map(t => <SkillChip key={t} label={t} variant="violet" />)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-2">
                      <div className="font-mono text-xs text-[var(--color-text-dim)]">
                        {r.filled}/{r.slots} slots filled
                      </div>
                      <div className="font-mono text-xs" style={{ color: full ? "#E11D48" : "var(--color-teal-bright)" }}>
                        {full ? "Closed" : `Closes ${r.deadline}`}
                      </div>
                      <ActionButton
                        variant={full ? "ghost" : "primary"}
                        size="sm"
                        disabled={full}
                        style={full ? { opacity: 0.3 } : {}}>
                        {full ? "Closed" : "Express Interest"}
                      </ActionButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Mentor ── */}
        {tab === "mentor" && (
          <div className="animate-tab-in">
            <p className="font-mono text-xs mb-4 text-[var(--color-text-dim)] font-[var(--font-mono)]">
              // available_mentors[] — request a one-on-one session
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mentors.map((m, i) => (
                <div key={m.name}
                  className="p-5 rounded-2xl border transition-all duration-200 hover:border-[var(--color-violet)] hover:shadow-sm cursor-pointer animate-tab-in bg-white/90 border-[var(--color-border)]"
                  style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold mb-4 bg-[var(--color-violet-wash)] text-[var(--color-violet)]">
                    {m.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--color-text)]">{m.name}</h4>
                  <p className="text-xs mt-0.5 mb-3 text-[var(--color-text-muted)]">{m.dept} · {m.inst}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {m.expertise.map(e => <SkillChip key={e} label={e} variant="violet" />)}
                  </div>
                  <div className="flex justify-between text-xs font-mono mb-4 text-[var(--color-text-dim)]">
                    <span>{m.students} active mentees</span>
                    <span style={{ color: m.slots > 0 ? "var(--color-teal-bright)" : "#E11D48" }}>
                      {m.slots} slot{m.slots !== 1 ? "s" : ""} open
                    </span>
                  </div>
                  <ActionButton
                    variant="secondary"
                    size="sm"
                    disabled={m.slots === 0}
                    style={{ width: "100%", justifyContent: "center", borderColor: "var(--color-violet)", color: "var(--color-violet)" }}>
                    Request Mentorship
                  </ActionButton>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
