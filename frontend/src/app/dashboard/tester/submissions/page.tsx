"use client";
import { DashboardLayout } from "@/components/DashboardLayout";

const NAV = [
  { href: "/dashboard/tester", icon: "🔍", label: "Discover" },
  { href: "/dashboard/tester/submissions", icon: "📨", label: "My Submissions" },
  { href: "/dashboard/tester/wallet", icon: "💰", label: "Wallet" },
];

const submissions = [
  { id: "s1", campaign: "Mobile App UX Feedback", company: "Acme Inc.", reward: 8, status: "approved", submittedAt: "Sep 20, 2026", reviewedAt: "Sep 21, 2026", notes: null },
  { id: "s2", campaign: "Landing Page Copy Test", company: "Launchpad Co.", reward: 6, status: "approved", submittedAt: "Sep 15, 2026", reviewedAt: "Sep 16, 2026", notes: "Great detailed feedback, thank you!" },
  { id: "s3", campaign: "Pricing Page A/B Test", company: "ShopWave", reward: 5, status: "pending", submittedAt: "Sep 23, 2026", reviewedAt: null, notes: null },
  { id: "s4", campaign: "E-commerce Checkout Flow", company: "CartPro", reward: 7, status: "pending", submittedAt: "Sep 24, 2026", reviewedAt: null, notes: null },
  { id: "s5", campaign: "Newsletter UX Test", company: "MailForge", reward: 4, status: "rejected", submittedAt: "Sep 10, 2026", reviewedAt: "Sep 11, 2026", notes: "Feedback was too brief and didn't answer all questions." },
];

export default function TesterSubmissions() {
  const approved = submissions.filter((s) => s.status === "approved");
  const pending = submissions.filter((s) => s.status === "pending");
  const rejected = submissions.filter((s) => s.status === "rejected");
  const earned = approved.reduce((a, s) => a + s.reward, 0);

  return (
    <DashboardLayout role="tester" navItems={NAV}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>My Submissions</h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Track the status of all your submitted feedback.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Submitted", value: submissions.length, color: "#6c63ff", icon: "📨" },
          { label: "Approved", value: approved.length, color: "#00d4aa", icon: "✅" },
          { label: "Pending Review", value: pending.length, color: "#fbbf24", icon: "⏳" },
          { label: "Rejected", value: rejected.length, color: "#ff6b9d", icon: "❌" },
          { label: "Total Earned", value: `$${earned}`, color: "#00d4aa", icon: "💸" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Submissions list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {submissions.map((s) => (
          <div
            key={s.id}
            className="card"
            style={{
              display: "flex", alignItems: "flex-start", gap: 20,
              borderLeft: `3px solid ${s.status === "approved" ? "#00d4aa" : s.status === "pending" ? "#fbbf24" : "#ff6b9d"}`,
            }}
          >
            {/* Status icon */}
            <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>
              {s.status === "approved" ? "✅" : s.status === "pending" ? "⏳" : "❌"}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{s.campaign}</span>
                <span className={`badge badge-${s.status}`}>{s.status}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: s.notes ? 10 : 0 }}>
                {s.company} · Submitted {s.submittedAt}
                {s.reviewedAt && ` · Reviewed ${s.reviewedAt}`}
              </div>
              {s.notes && (
                <div
                  style={{
                    padding: "10px 14px", borderRadius: 8, fontSize: 13, lineHeight: 1.6,
                    background: s.status === "rejected" ? "rgba(255,107,157,0.08)" : "rgba(0,212,170,0.08)",
                    color: "var(--muted)",
                    border: `1px solid ${s.status === "rejected" ? "rgba(255,107,157,0.2)" : "rgba(0,212,170,0.2)"}`,
                  }}
                >
                  <strong style={{ color: s.status === "rejected" ? "#ff6b9d" : "#00d4aa" }}>
                    {s.status === "rejected" ? "Rejection reason: " : "Owner note: "}
                  </strong>
                  {s.notes}
                </div>
              )}
            </div>

            {/* Reward */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontWeight: 800, fontSize: 18,
                  color: s.status === "approved" ? "#00d4aa" : "var(--muted)",
                }}
              >
                {s.status === "approved" ? `+$${s.reward}` : `$${s.reward}`}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                {s.status === "approved" ? "Credited" : s.status === "pending" ? "On hold" : "Not paid"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
