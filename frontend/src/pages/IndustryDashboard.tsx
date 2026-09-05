import { useState, useEffect } from "react";
import { SkillChip, CompatibilityBadge, ActionButton, StatCard, TabBar } from "../components/ui";

const candidates = [
  { name: "Arjun Menon",      inst: "NIT Trichy",   match: 94, skills: ["React", "Node.js", "AWS"],        badge: true,  year: "3rd yr BE" },
  { name: "Priya Sharma",     inst: "IIT Madras",   match: 91, skills: ["Python", "ML", "SQL"],            badge: true,  year: "2nd yr MTech" },
  { name: "Rahul Krishnan",   inst: "BITS Pilani",  match: 87, skills: ["Java", "Spring", "DevOps"],       badge: false, year: "4th yr BE" },
  { name: "Sneha Iyer",       inst: "VIT Vellore",  match: 83, skills: ["React", "TypeScript", "Git"],     badge: true,  year: "3rd yr BE" },
  { name: "Karan Verma",      inst: "PSG Tech",     match: 78, skills: ["C++", "RTOS", "Embedded"],        badge: false, year: "4th yr BE" },
  { name: "Divya Nair",       inst: "Amrita Uni.",  match: 74, skills: ["Data Analysis", "Excel", "Python"], badge: false, year: "2nd yr MBA" },
];

const activePosts = [
  { role: "Full-Stack Developer Intern",  dept: "Engineering", applicants: 47, deadline: "14 Sep 2026", status: "Active" },
  { role: "Data Analyst – Trainee",       dept: "Analytics",   applicants: 31, deadline: "20 Sep 2026", status: "Active" },
  { role: "ML Research Collaborator",     dept: "R&D",         applicants: 18, deadline: "30 Sep 2026", status: "Draft" },
];

const skillDemand = [
  { skill: "React / Next.js",  demand: 94, supply: 62 },
  { skill: "Python / ML",      demand: 88, supply: 55 },
  { skill: "DevOps / Cloud",   demand: 82, supply: 34 },
  { skill: "System Design",    demand: 78, supply: 29 },
  { skill: "SQL / Data Eng.",  demand: 72, supply: 48 },
  { skill: "Embedded / IoT",   demand: 65, supply: 38 },
];

const tabs = [
  { id: "candidates", label: "Applicant Pool" },
  { id: "post",       label: "Post Opportunity" },
  { id: "demand",     label: "Skill Demand" },
];

const emptyForm = { role: "", dept: "", desc: "", skills: "", stipend: "", deadline: "" };

export default function IndustryDashboard() {
  const [tab, setTab]     = useState("candidates");
  const [form, setForm]   = useState(emptyForm);
  const [posted, setPosted] = useState(false);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/industry/dashboard", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
      setLoading(false);
    }
  };

  const handlePost = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/industry/post", { credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.role,
          description: form.desc,
          required_skills: form.skills
        })
      });
      if (res.ok) {
        setPosted(true);
        fetchDashboard(); // refresh data
      }
    } catch (err) {
      alert("Failed to post opportunity");
    }
  };

  const handleTabChange = (id: string) => { setTab(id); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h2 className="text-2xl text-red-600 font-bold mb-2">Error</h2>
        <p className="text-gray-600">{errorMsg}</p>
        <button onClick={fetchDashboard} className="mt-4 px-4 py-2 bg-amber-500 text-white rounded">Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-16 animate-page-in bg-transparent">
      <div className="max-w-6xl mx-auto mt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <p className="font-mono text-xs mb-1 text-[var(--color-amber)] font-[var(--font-mono)]">
              // INDUSTRY PORTAL
            </p>
            <h2 className="font-display text-3xl mb-1 text-[var(--color-text)] font-[var(--font-display)]">
              Talent Intelligence
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">Infosys BPM · Sourcing Dashboard · Sep 2026</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-mono text-[var(--color-teal-bright)] border-[var(--color-border)] bg-[var(--color-canvas-alt)]">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            LIVE
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard value="142"   label="Total Applicants"   sub="Last 30 days"             color="var(--color-teal-bright)" trend="up" />
          <StatCard value="88%"   label="Avg Match Score"    sub="Across open roles"         color="var(--color-sky)" />
          <StatCard value="3"     label="Active Postings"    sub="2 live · 1 draft"          color="var(--color-amber)" />
          <StatCard value="12.4d" label="Avg Time-to-Fill"   sub="vs. 28d industry average"  color="var(--color-violet)" trend="down" />
        </div>

        <TabBar tabs={tabs} active={tab} onChange={handleTabChange} accentColor="var(--color-amber)" />

        {/* ── Candidates ── */}
        {tab === "candidates" && (
          <div className="animate-tab-in">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs text-[var(--color-text-dim)]">
                Ranked by compatibility · Full-Stack Developer Intern
              </p>
              <select className="text-xs px-3 py-1.5 rounded-2xl border outline-none bg-white/90 border-[var(--color-border)] text-[var(--color-text-muted)]">
                <option>Full-Stack Developer Intern</option>
                <option>Data Analyst – Trainee</option>
              </select>
            </div>

            <div className="space-y-2 mb-8">
              {candidates.map((c, i) => (
                <div key={c.name}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 hover:bg-black/5 cursor-pointer animate-tab-in bg-white/90 border-[var(--color-border)]"
                  style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="font-mono text-xs w-6 text-right flex-shrink-0 text-[var(--color-text-dim)]">
                    #{i + 1}
                  </div>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 bg-[var(--color-surface-raised)] text-[var(--color-teal-bright)]">
                    {c.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-[var(--color-text)]">{c.name}</span>
                      {c.badge && <SkillChip label="✓ Verified" variant="match" />}
                    </div>
                    <p className="text-xs mt-0.5 text-[var(--color-text-muted)]">{c.inst} · {c.year}</p>
                  </div>
                  <div className="hidden md:flex gap-1.5 flex-wrap justify-end" style={{ maxWidth: 180 }}>
                    {c.skills.map(s => <SkillChip key={s} label={s} />)}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <CompatibilityBadge score={c.match} size="md" />
                    <ActionButton variant="ghost" size="sm">Shortlist</ActionButton>
                  </div>
                </div>
              ))}
            </div>

            <p className="font-mono text-xs mb-3 text-[var(--color-text-dim)]">// active_postings[]</p>
            <div className="space-y-2">
              {activePosts.map((p) => (
                <div key={p.role} className="flex items-center gap-4 px-5 py-3 rounded-2xl border bg-[var(--color-canvas-alt)] border-[var(--color-surface-raised)]">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-[var(--color-text)]">{p.role}</span>
                    <span className="text-xs ml-3 text-[var(--color-text-dim)]">{p.dept}</span>
                  </div>
                  <span className="font-mono text-xs text-[var(--color-text-muted)]">{p.applicants} applicants</span>
                  <span className="font-mono text-xs text-[var(--color-text-dim)]">Closes {p.deadline}</span>
                  <SkillChip label={p.status} variant={p.status === "Active" ? "match" : "default"} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Post form ── */}
        {tab === "post" && (
          <div className="max-w-2xl animate-tab-in">
            {posted ? (
              <div className="text-center py-16 animate-scale-in">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-[var(--color-teal-wash)] border-2 border-[var(--color-teal-bright)]">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14l7 7 12-14" stroke="var(--color-teal-bright)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl mb-2 text-[var(--color-text)] font-[var(--font-display)]">Opportunity Posted!</h3>
                <p className="text-sm mb-6 text-[var(--color-text-muted)]">
                  Our AI engine is matching candidates now. First results within 24 hours.
                </p>
                <ActionButton variant="secondary" onClick={() => { setPosted(false); setTab("candidates"); }}>
                  View Applicants →
                </ActionButton>
              </div>
            ) : (
              <>
                <p className="font-mono text-xs mb-6 text-[var(--color-text-dim)] font-[var(--font-mono)]">// post_opportunity.form</p>
                <div className="space-y-4">
                  {[
                    { key: "role",     label: "Role Title",                           placeholder: "e.g. Full-Stack Developer Intern" },
                    { key: "dept",     label: "Department",                            placeholder: "e.g. Engineering" },
                    { key: "skills",   label: "Required Skills (comma-separated)",     placeholder: "React, Node.js, MongoDB" },
                    { key: "stipend",  label: "Stipend / Compensation",                placeholder: "₹18,000/month" },
                    { key: "deadline", label: "Application Deadline",                  placeholder: "30 Sep 2026" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block font-mono text-xs mb-1.5 text-[var(--color-text-muted)] font-[var(--font-mono)]">{label}</label>
                      <input
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-all duration-150 bg-white/90 border-[var(--color-border)] text-[var(--color-text)] font-[var(--font-sans)]"
                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "var(--color-teal-bright)"; }}
                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "var(--color-border)"; }}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block font-mono text-xs mb-1.5 text-[var(--color-text-muted)] font-[var(--font-mono)]">Role Description</label>
                    <textarea rows={4}
                      value={form.desc}
                      onChange={e => setForm({ ...form, desc: e.target.value })}
                      placeholder="Describe the role, responsibilities, and preferred profile…"
                      className="w-full px-4 py-2.5 rounded-2xl border text-sm outline-none resize-none transition-all duration-150 bg-white/90 border-[var(--color-border)] text-[var(--color-text)]"
                      onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--color-teal-bright)"; }}
                      onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--color-border)"; }}
                    />
                  </div>
                  <ActionButton size="md" style={{ width: "100%", justifyContent: "center" }} onClick={handlePost}>
                    Post & Start Matching →
                  </ActionButton>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Skill demand ── */}
        {tab === "demand" && (
          <div className="animate-tab-in">
            <p className="font-mono text-xs mb-6 text-[var(--color-text-dim)] font-[var(--font-mono)]">
              // skill_demand_vs_supply — Tamil Nadu engineering cluster · Sep 2026
            </p>
            <div className="space-y-3">
              {skillDemand.map((d, i) => {
                const gap = d.demand - d.supply;
                return (
                  <div key={d.skill} className="p-4 rounded-2xl border animate-tab-in bg-white/90 border-[var(--color-border)]"
                    style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-sm font-medium text-[var(--color-text)]">{d.skill}</span>
                      <div className="flex items-center gap-3">
                        <SkillChip label={`Demand ${d.demand}%`} variant="amber" />
                        <SkillChip label={`Supply ${d.supply}%`} variant="match" />
                        <SkillChip label={`Gap ${gap}%`} variant={gap > 40 ? "gap" : "default"} />
                      </div>
                    </div>
                    <div className="relative h-2 rounded-full overflow-hidden bg-transparent">
                      <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-[var(--color-amber)] opacity-25"
                        style={{ width: `${d.demand}%` }} />
                      <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 bg-[var(--color-teal-bright)]"
                        style={{ width: `${d.supply}%`, transitionDelay: "100ms" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
