import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

interface LoginProps {
  onAuth: (user: AuthUser) => void;
  onNavigate: (page: string) => void;
}

type AuthUser = {
  id: number;
  role: Role;
  name: string;
  email: string;
};

type AuthResponse = {
  success: boolean;
  user: AuthUser;
};

type Role = "student" | "industry" | "academician" | "institution";

const accountTypes: Array<{ role: Role; label: string; helper: string }> = [
  { role: "student", label: "Student", helper: "Skills and internship matches" },
  { role: "industry", label: "Industry", helper: "Hiring and opportunity posts" },
  { role: "academician", label: "Academician", helper: "FDPs and research links" },
  { role: "institution", label: "Institution", helper: "Analytics and oversight" },
];

export default function Login({ onAuth, onNavigate }: LoginProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<Role>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("alice@student.com");
  const [password, setPassword] = useState("password");
  const [skills, setSkills] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    apiRequest<{ ok: boolean }>("/api/health")
      .then(() => {
        if (!ignore) setBackendStatus("online");
      })
      .catch(() => {
        if (!ignore) setBackendStatus("offline");
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await apiRequest<AuthResponse>(mode === "login" ? "/api/login" : "/api/signup", {
        method: "POST",
        body:
          mode === "login"
            ? { email, password }
            : {
                name,
                email,
                password,
                role,
                skills: role === "student" ? skills : "",
                company_name: role === "industry" ? companyName : "",
              },
      });

      onAuth(data.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect to backend";
      setError(
        backendStatus === "offline"
          ? "Backend is not running. Start it with npm run dev or npm run dev:full."
          : message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-canvas)" }}>
      <div className="w-full max-w-xl rounded-lg border border-[var(--color-border)] bg-white p-6 shadow-xl">
        <div className="grid grid-cols-2 rounded-md bg-slate-100 p-1">
          {(["login", "signup"] as const).map((nextMode) => (
            <button
              key={nextMode}
              type="button"
              onClick={() => {
                setMode(nextMode);
                setError("");
              }}
              className={`rounded px-3 py-2 text-sm font-bold capitalize transition ${
                mode === nextMode ? "bg-white text-[var(--color-primary)] shadow-sm" : "text-[var(--color-text-muted)]"
              }`}
            >
              {nextMode === "login" ? "Login" : "Sign up"}
            </button>
          ))}
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold text-[var(--color-text)]">
          {mode === "login" ? "Login to SkillBridge" : "Create your SkillBridge account"}
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
          {mode === "login"
            ? "Use a demo account or your registered account."
            : "Choose the account type that matches your role."}
        </p>
        <div
          className={`mt-4 rounded-md px-3 py-2 text-center text-xs font-semibold ${
            backendStatus === "online"
              ? "bg-emerald-50 text-emerald-700"
              : backendStatus === "offline"
                ? "bg-amber-50 text-amber-700"
                : "bg-slate-50 text-slate-600"
          }`}
        >
          {backendStatus === "online"
            ? "Backend connected"
            : backendStatus === "offline"
              ? "Backend offline"
              : "Checking backend..."}
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <div>
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">Account type</span>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {accountTypes.map((type) => (
                    <button
                      key={type.role}
                      type="button"
                      onClick={() => setRole(type.role)}
                      className={`rounded-md border px-3 py-2 text-left transition ${
                        role === type.role
                          ? "border-[var(--color-primary)] bg-indigo-50"
                          : "border-[var(--color-border)] bg-white"
                      }`}
                    >
                      <span className="block text-sm font-bold text-[var(--color-text)]">{type.label}</span>
                      <span className="block text-xs text-[var(--color-text-muted)]">{type.helper}</span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                  {role === "institution" ? "Institution name" : role === "industry" ? "Contact name" : "Full name"}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </label>
            </>
          )}

          <label className="block">
            <span className="text-sm font-semibold text-[var(--color-text-muted)]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[var(--color-text-muted)]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100"
              required
            />
          </label>

          {mode === "signup" && role === "student" && (
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text-muted)]">Skills</span>
              <input
                type="text"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="python, react, sql"
                className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100"
              />
            </label>
          )}

          {mode === "signup" && role === "industry" && (
            <label className="block">
              <span className="text-sm font-semibold text-[var(--color-text-muted)]">Company name</span>
              <input
                type="text"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100"
                required
              />
            </label>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : `Create ${role} account`}
          </button>
        </form>

        {mode === "login" && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              ["Student", "alice@student.com"],
              ["Industry", "hr@techcorp.com"],
              ["Academic", "alan@university.edu"],
              ["Institute", "admin@gti.edu"],
            ].map(([label, demoEmail]) => (
              <button
                key={demoEmail}
                type="button"
                onClick={() => {
                  setEmail(demoEmail);
                  setPassword("password");
                  setError("");
                }}
                className="rounded-md border border-[var(--color-border)] px-2 py-2 text-xs font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => onNavigate("landing")}
          className="mt-4 w-full text-center text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
