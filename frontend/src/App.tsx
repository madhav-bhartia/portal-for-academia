import { useState } from "react";
import Nav from "./components/Nav";
import Landing from "./pages/Landing";
import StudentHub from "./pages/StudentHub";
import IndustryDashboard from "./pages/IndustryDashboard";
import AcademicianPortal from "./pages/AcademicianPortal";
import InstitutionAnalytics from "./pages/InstitutionAnalytics";
import Login from "./pages/Login";
import { apiRequest } from "./lib/api";

type Page = "landing" | "student" | "industry" | "academician" | "analytics" | "login";

type AuthUser = {
  id: number;
  role: string;
  name: string;
  email: string;
};

function PageTransition({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div key={id} className="animate-page-in h-full">
      {children}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [user, setUser] = useState<AuthUser | null>(null);

  const navigate = (p: string) => {
    if (["landing", "login"].includes(p)) {
      setPage(p as Page);
      return;
    }
    if (!user) {
      setPage("login");
      return;
    }
    if (p === "student" && user.role !== "student") return;
    if (p === "industry" && user.role !== "industry") return;
    if (p === "academician" && user.role !== "academician") return;
    if (p === "analytics" && user.role !== "institution") return;
    setPage(p as Page);
  };

  const handleAuth = (nextUser: AuthUser) => {
    setUser(nextUser);
    if (nextUser.role === "student") navigate("student");
    else if (nextUser.role === "industry") navigate("industry");
    else if (nextUser.role === "academician") navigate("academician");
    else if (nextUser.role === "institution") navigate("analytics");
    else navigate("landing");
  };

  const handleLogout = async () => {
    await apiRequest("/api/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
    navigate("landing");
  };

  return (
    <div className="size-full flex flex-col overflow-hidden text-[var(--color-text)]"
      style={{ background: "#F9FAFB" }}>
      {page !== "login" && <Nav current={page} onNavigate={navigate} user={user} onLogout={handleLogout} />}
      <main className="flex-1 overflow-y-auto">
        <PageTransition id={page}>
          {page === "landing"      && <Landing onNavigate={navigate} />}
          {page === "login"        && <Login onAuth={handleAuth} onNavigate={navigate} />}
          {page === "student"      && <StudentHub />}
          {page === "industry"     && <IndustryDashboard />}
          {page === "academician"  && <AcademicianPortal />}
          {page === "analytics"    && <InstitutionAnalytics />}
        </PageTransition>
      </main>
    </div>
  );
}
