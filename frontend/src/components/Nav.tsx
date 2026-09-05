import { useState } from "react";

interface NavProps {
  current: string;
  user: {
    name: string;
    role: string;
    email: string;
  } | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const allPages = [
  { id: "landing",     label: "Home",         hi: "होम" },
  { id: "student",     label: "Student Hub",   hi: "छात्र केंद्र" },
  { id: "industry",    label: "Industry",      hi: "उद्योग" },
  { id: "academician", label: "Academician",   hi: "शिक्षाविद" },
  { id: "analytics",   label: "Analytics",     hi: "विश्लेषण" },
];

const roleHome: Record<string, string> = {
  student: "student",
  industry: "industry",
  academician: "academician",
  institution: "analytics",
};

export default function Nav({ current, user, onLogout, onNavigate }: NavProps) {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [open, setOpen] = useState(false);
  const pages = user
    ? allPages.filter((page) => page.id === "landing" || page.id === roleHome[user.role])
    : allPages.filter((page) => page.id === "landing");
  const initials = user?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        boxShadow: "0 2px 20px rgba(99,102,241,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-6 flex-shrink-0 cursor-pointer" onClick={() => onNavigate("landing")}>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2.8" fill="white" opacity="0.95" />
            <circle cx="2.5" cy="3.5" r="1.6" fill="white" opacity="0.6" />
            <circle cx="13.5" cy="3.5" r="1.6" fill="white" opacity="0.6" />
            <circle cx="2.5" cy="12.5" r="1.6" fill="white" opacity="0.6" />
            <circle cx="13.5" cy="12.5" r="1.6" fill="white" opacity="0.6" />
            <line x1="8" y1="8" x2="2.5" y2="3.5" stroke="white" strokeWidth="0.9" opacity="0.4" />
            <line x1="8" y1="8" x2="13.5" y2="3.5" stroke="white" strokeWidth="0.9" opacity="0.4" />
            <line x1="8" y1="8" x2="2.5" y2="12.5" stroke="white" strokeWidth="0.9" opacity="0.4" />
            <line x1="8" y1="8" x2="13.5" y2="12.5" stroke="white" strokeWidth="0.9" opacity="0.4" />
          </svg>
        </div>
        <div>
          <span className="font-display text-sm font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
            SkillBridge
          </span>
          <span
            className="font-mono text-xs ml-1.5 px-1 py-0.5 rounded"
            style={{ background: "var(--color-primary-wash)", color: "var(--color-primary)" }}
          >
            v2.0
          </span>
        </div>
      </div>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-1 flex-1">
        {pages.map((p) => {
          const isActive = current === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onNavigate(p.id)}
              className="relative px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                background: isActive ? "var(--color-primary-wash)" : "transparent",
              }}
            >
              {lang === "en" ? p.label : p.hi}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-violet))" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2.5">
        {/* Lang toggle */}
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-150"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-muted)",
            background: "var(--color-surface-raised)",
          }}
        >
          <span style={{ color: lang === "en" ? "var(--color-primary)" : undefined, fontWeight: lang === "en" ? 600 : 400 }}>EN</span>
          <span style={{ color: "var(--color-border)" }}>|</span>
          <span style={{ color: lang === "hi" ? "var(--color-primary)" : undefined, fontWeight: lang === "hi" ? 600 : 400 }}>हि</span>
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate(roleHome[user.role] || "landing")}
              className="hidden sm:flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-left"
              title={user.email}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
              >
                {initials}
              </span>
              <span className="min-w-0">
                <span className="block max-w-28 truncate text-xs font-bold text-[var(--color-text)]">{user.name}</span>
                <span className="block text-[10px] font-semibold capitalize text-[var(--color-text-muted)]">{user.role}</span>
              </span>
            </button>
            <button
              onClick={onLogout}
              className="rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-bold text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate("login")}
            className="rounded-md px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-95"
            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden ml-2 p-1.5 rounded-lg transition-colors"
        onClick={() => setOpen(!open)}
        style={{ color: "var(--color-text-muted)" }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect y="4" width="20" height="1.5" rx="1" />
          <rect y="9.25" width="20" height="1.5" rx="1" />
          <rect y="14.5" width="20" height="1.5" rx="1" />
        </svg>
      </button>

      {/* Mobile menu */}
      {open && (
        <div
          className="absolute top-[calc(100%+4px)] right-4 w-52 rounded-2xl overflow-hidden animate-scale-in"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(99,102,241,0.15)",
            boxShadow: "0 16px 40px rgba(99,102,241,0.12)",
          }}
        >
          <div className="p-2">
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => { onNavigate(p.id); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  color: current === p.id ? "var(--color-primary)" : "var(--color-text-muted)",
                  background: current === p.id ? "var(--color-primary-wash)" : "transparent",
                }}
              >
                {lang === "en" ? p.label : p.hi}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
