"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";

const NAV = [
  { href: "/dashboard/owner", icon: "📊", label: "Overview" },
  { href: "/dashboard/owner/campaigns", icon: "📋", label: "Campaigns" },
  { href: "/dashboard/owner/campaigns/new", icon: "➕", label: "New Campaign" },
  { href: "/dashboard/owner/billing", icon: "💳", label: "Billing" },
];

const stats = [
  { label: "Active Campaigns", value: "3", change: "+1 this week", color: "#6c63ff", icon: "📋" },
  { label: "Total Submissions", value: "128", change: "+24 today", color: "#00d4aa", icon: "📨" },
  { label: "Pending Review", value: "17", change: "Needs attention", color: "#fbbf24", icon: "⏳" },
  { label: "Total Spend", value: "$2,640", change: "↑ $480 this month", color: "#ff6b9d", icon: "💸" },
];

const campaigns = [
  {
    id: "1",
    title: "Mobile App UX Feedback",
    status: "active",
    submissions: 42,
    max: 60,
    reward: "$8",
    budget: "$480",
    pending: 5,
  },
  {
    id: "2",
    title: "Pricing Page A/B Test",
    status: "active",
    submissions: 58,
    max: 100,
    reward: "$5",
    budget: "$500",
    pending: 12,
  },
  {
    id: "3",
    title: "Onboarding Flow Review",
    status: "draft",
    submissions: 0,
    max: 50,
    reward: "$10",
    budget: "$500",
    pending: 0,
  },
  {
    id: "4",
    title: "Landing Page Copy Test",
    status: "completed",
    submissions: 50,
    max: 50,
    reward: "$6",
    budget: "$300",
    pending: 0,
  },
];

export default function OwnerDashboard() {
  return (
    <DashboardLayout role="owner" navItems={NAV}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Good evening, Alex 👋</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Here&apos;s what&apos;s happening with your campaigns today.</p>
        </div>
        <Link href="/dashboard/owner/campaigns/new" className="btn-primary">
          + New Campaign
        </Link>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 36,
        }}
      >
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <span
                style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                  background: s.color + "22", color: s.color,
                }}
              >
                LIVE
              </span>
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.change}</div>
            {/* Mini progress bar */}
            <div style={{ height: 3, background: "var(--card-border)", borderRadius: 3, marginTop: 16 }}>
              <div style={{ height: 3, width: "65%", background: s.color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--card-border)" }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>Your Campaigns</h2>
          <Link
            href="/dashboard/owner/campaigns"
            style={{ fontSize: 13, color: "#6c63ff", fontWeight: 600, textDecoration: "none" }}
          >
            View all →
          </Link>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
              {["Campaign", "Status", "Progress", "Pending", "Reward", "Budget"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 24px", textAlign: "left",
                    fontSize: 11, fontWeight: 700, color: "var(--muted)",
                    textTransform: "uppercase", letterSpacing: 0.8,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr
                key={c.id}
                style={{
                  borderBottom: i < campaigns.length - 1 ? "1px solid var(--card-border)" : "none",
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "16px 24px" }}>
                  <Link
                    href={`/dashboard/owner/campaigns/${c.id}`}
                    style={{ fontWeight: 600, fontSize: 14, color: "var(--foreground)", textDecoration: "none" }}
                  >
                    {c.title}
                  </Link>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <span className={`badge badge-${c.status}`}>
                    {c.status === "active" ? "● " : c.status === "draft" ? "○ " : "✓ "}
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, height: 6, background: "var(--card-border)", borderRadius: 3, minWidth: 80 }}>
                      <div
                        style={{
                          height: 6,
                          width: `${(c.submissions / c.max) * 100}%`,
                          background: c.status === "active" ? "#6c63ff" : c.status === "completed" ? "#00d4aa" : "#3a3f5c",
                          borderRadius: 3,
                          transition: "width 0.5s",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>
                      {c.submissions}/{c.max}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  {c.pending > 0 ? (
                    <span className="badge badge-pending">{c.pending} pending</span>
                  ) : (
                    <span style={{ color: "var(--muted)", fontSize: 13 }}>—</span>
                  )}
                </td>
                <td style={{ padding: "16px 24px", fontWeight: 600, fontSize: 14, color: "#00d4aa" }}>{c.reward}</td>
                <td style={{ padding: "16px 24px", fontSize: 13, color: "var(--muted)" }}>{c.budget}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
