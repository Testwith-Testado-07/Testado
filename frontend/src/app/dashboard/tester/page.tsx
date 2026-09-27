"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";

const NAV = [
  { href: "/dashboard/tester", icon: "🔍", label: "Discover" },
  { href: "/dashboard/tester/submissions", icon: "📨", label: "My Submissions" },
  { href: "/dashboard/tester/wallet", icon: "💰", label: "Wallet" },
];

const campaigns = [
  {
    id: "c1",
    title: "Mobile App UX Feedback",
    company: "Acme Inc.",
    reward: 8,
    estimatedTime: "15–20 min",
    testers: 42,
    maxTesters: 60,
    tags: ["iOS", "UX", "Fintech"],
    description: "Test our new mobile banking app and share your honest thoughts on usability, design, and any friction points you encounter.",
    deadline: "Oct 5, 2026",
    match: 98,
  },
  {
    id: "c2",
    title: "E-commerce Checkout Flow",
    company: "ShopWave",
    reward: 6,
    estimatedTime: "10–15 min",
    testers: 33,
    maxTesters: 100,
    tags: ["Desktop", "E-commerce"],
    description: "Walk through our checkout process on desktop and identify any friction points or confusing steps. Written feedback required.",
    deadline: "Oct 12, 2026",
    match: 91,
  },
  {
    id: "c3",
    title: "SaaS Onboarding Review",
    company: "Flowdesk",
    reward: 12,
    estimatedTime: "25–35 min",
    testers: 10,
    maxTesters: 40,
    tags: ["SaaS", "Productivity", "Desktop"],
    description: "Sign up for our SaaS tool and complete the onboarding. Tell us where you got confused and what could be improved.",
    deadline: "Oct 8, 2026",
    match: 87,
  },
  {
    id: "c4",
    title: "AI Writing Assistant Beta",
    company: "WordMind",
    reward: 15,
    estimatedTime: "30–40 min",
    testers: 5,
    maxTesters: 30,
    tags: ["AI Tools", "Desktop", "Mac"],
    description: "Try our AI writing assistant for a real writing task and rate its suggestions, accuracy, and overall usefulness.",
    deadline: "Oct 3, 2026",
    match: 82,
  },
];

export default function TesterDiscover() {
  return (
    <DashboardLayout role="tester" navItems={NAV}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Discover Campaigns 🔍</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Showing {campaigns.length} campaigns matched to your profile.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select
            style={{
              background: "var(--card)", border: "1px solid var(--card-border)",
              borderRadius: 10, padding: "10px 16px", color: "var(--foreground)",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            <option>Sort: Best Match</option>
            <option>Sort: Highest Reward</option>
            <option>Sort: Newest First</option>
            <option>Sort: Fewest Testers</option>
          </select>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Available Now", value: campaigns.length, icon: "📋", color: "#6c63ff" },
          { label: "Potential Earnings", value: `$${campaigns.reduce((a, c) => a + c.reward, 0)}`, icon: "💸", color: "#00d4aa" },
          { label: "Your Match Rate", value: "94%", icon: "🎯", color: "#ff6b9d" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 22, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign cards grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="card"
            style={{ display: "flex", flexDirection: "column", gap: 0, overflow: "hidden", padding: 0, transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6c63ff55"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(108,99,255,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {/* Card header */}
            <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 4 }}>{c.company}</div>
                <h3 style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3, marginBottom: 0 }}>{c.title}</h3>
              </div>
              <div
                style={{
                  background: "rgba(0,212,170,0.12)", border: "1px solid rgba(0,212,170,0.25)",
                  borderRadius: 10, padding: "8px 14px", textAlign: "center", flexShrink: 0, marginLeft: 12,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 20, color: "#00d4aa" }}>${c.reward}</div>
                <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600 }}>REWARD</div>
              </div>
            </div>

            {/* Match score */}
            <div style={{ padding: "12px 20px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 4, background: "var(--card-border)", borderRadius: 3 }}>
                  <div style={{ height: 4, width: `${c.match}%`, background: c.match > 90 ? "#00d4aa" : "#6c63ff", borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.match > 90 ? "#00d4aa" : "#a78bfa" }}>
                  {c.match}% match
                </span>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "14px 20px", flex: 1 }}>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 14 }}>
                {c.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {c.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                      background: "rgba(108,99,255,0.1)", color: "#a78bfa",
                      border: "1px solid rgba(108,99,255,0.2)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--muted)" }}>
                <span>⏱ {c.estimatedTime}</span>
                <span>👥 {c.testers}/{c.maxTesters} testers</span>
                <span>📅 Due {c.deadline}</span>
              </div>
            </div>

            {/* Action */}
            <div style={{ padding: "0 20px 20px" }}>
              <Link
                href={`/dashboard/tester/campaigns/${c.id}`}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}
              >
                View & Apply →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
