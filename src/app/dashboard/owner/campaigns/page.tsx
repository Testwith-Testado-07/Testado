"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";

const NAV = [
  { href: "/dashboard/owner", icon: "📊", label: "Overview" },
  { href: "/dashboard/owner/campaigns", icon: "📋", label: "Campaigns" },
  { href: "/dashboard/owner/campaigns/new", icon: "➕", label: "New Campaign" },
  { href: "/dashboard/owner/billing", icon: "💳", label: "Billing" },
];

const campaigns = [
  { id: "1", title: "Mobile App UX Feedback", status: "active", submissions: 42, max: 60, reward: 8, budget: 480, pending: 5, created: "Sep 18, 2026" },
  { id: "2", title: "Pricing Page A/B Test", status: "active", submissions: 58, max: 100, reward: 5, budget: 500, pending: 12, created: "Sep 12, 2026" },
  { id: "3", title: "Onboarding Flow Review", status: "draft", submissions: 0, max: 50, reward: 10, budget: 500, pending: 0, created: "Sep 22, 2026" },
  { id: "4", title: "Landing Page Copy Test", status: "completed", submissions: 50, max: 50, reward: 6, budget: 300, pending: 0, created: "Aug 30, 2026" },
  { id: "5", title: "Checkout Friction Study", status: "paused", submissions: 28, max: 80, reward: 12, budget: 960, pending: 3, created: "Sep 5, 2026" },
];

const FILTER_OPTIONS = ["All", "Active", "Draft", "Paused", "Completed"];

export default function CampaignsPage() {
  return (
    <DashboardLayout role="owner" navItems={NAV}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Campaigns</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>{campaigns.length} campaigns total</p>
        </div>
        <Link href="/dashboard/owner/campaigns/new" className="btn-primary">
          + New Campaign
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {FILTER_OPTIONS.map((f, i) => (
          <button
            key={f}
            style={{
              padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
              border: `1px solid ${i === 0 ? "#6c63ff" : "var(--card-border)"}`,
              background: i === 0 ? "rgba(108,99,255,0.15)" : "transparent",
              color: i === 0 ? "#a78bfa" : "var(--muted)",
              cursor: "pointer",
            }}
          >{f}</button>
        ))}
      </div>

      {/* Campaign cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="card"
            style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 24px", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6c63ff55"; e.currentTarget.style.transform = "translateX(4px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.transform = "translateX(0)"; }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <Link
                  href={`/dashboard/owner/campaigns/${c.id}`}
                  style={{ fontWeight: 700, fontSize: 16, color: "var(--foreground)", textDecoration: "none" }}
                >
                  {c.title}
                </Link>
                <span className={`badge badge-${c.status}`}>
                  {c.status}
                </span>
                {c.pending > 0 && (
                  <span className="badge badge-pending">{c.pending} to review</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Created {c.created}</div>
            </div>

            {/* Progress */}
            <div style={{ width: 160 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>Submissions</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{c.submissions}/{c.max}</span>
              </div>
              <div style={{ height: 6, background: "var(--card-border)", borderRadius: 3 }}>
                <div
                  style={{
                    height: 6,
                    width: `${(c.submissions / c.max) * 100}%`,
                    background: c.status === "completed" ? "#00d4aa" : c.status === "active" ? "#6c63ff" : "#3a3f5c",
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div style={{ textAlign: "right", minWidth: 80 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#00d4aa" }}>${c.reward}/ea</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>${c.budget} budget</div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                href={`/dashboard/owner/campaigns/${c.id}`}
                className="btn-secondary"
                style={{ padding: "8px 16px", fontSize: 13 }}
              >
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
