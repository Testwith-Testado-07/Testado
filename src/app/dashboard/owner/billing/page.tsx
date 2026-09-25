"use client";
import { DashboardLayout } from "@/components/DashboardLayout";

const NAV = [
  { href: "/dashboard/owner", icon: "📊", label: "Overview" },
  { href: "/dashboard/owner/campaigns", icon: "📋", label: "Campaigns" },
  { href: "/dashboard/owner/campaigns/new", icon: "➕", label: "New Campaign" },
  { href: "/dashboard/owner/billing", icon: "💳", label: "Billing" },
];

const transactions = [
  { id: "t1", type: "Wallet Top-up", amount: "+$500.00", status: "completed", date: "Sep 20, 2026", desc: "Manual deposit via Stripe" },
  { id: "t2", type: "Campaign Hold", amount: "-$480.00", status: "completed", date: "Sep 18, 2026", desc: "Mobile App UX Feedback budget locked" },
  { id: "t3", type: "Campaign Hold", amount: "-$500.00", status: "completed", date: "Sep 12, 2026", desc: "Pricing Page A/B Test budget locked" },
  { id: "t4", type: "Wallet Top-up", amount: "+$1,000.00", status: "completed", date: "Sep 10, 2026", desc: "Manual deposit via Stripe" },
  { id: "t5", type: "Budget Release", amount: "+$180.00", status: "completed", date: "Sep 5, 2026", desc: "Unused budget from Landing Page Copy Test" },
  { id: "t6", type: "Campaign Hold", amount: "-$300.00", status: "completed", date: "Aug 30, 2026", desc: "Landing Page Copy Test budget locked" },
];

export default function BillingPage() {
  const walletBalance = 220.00;
  const totalSpend = 2640.00;
  const heldAmount = 980.00;

  return (
    <DashboardLayout role="owner" navItems={NAV}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Billing & Wallet</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Manage your campaign funds and view transaction history.</p>
        </div>
        <button className="btn-primary">+ Add Funds</button>
      </div>

      {/* Wallet cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 36 }}>
        {[
          { label: "Available Balance", value: `$${walletBalance.toFixed(2)}`, color: "#6c63ff", icon: "💰", sub: "Ready to use" },
          { label: "In Escrow (Held)", value: `$${heldAmount.toFixed(2)}`, color: "#fbbf24", icon: "🔒", sub: "Locked in active campaigns" },
          { label: "Total Deposited", value: "$1,500.00", color: "#00d4aa", icon: "📥", sub: "All-time deposits" },
          { label: "Total Spent", value: `$${totalSpend.toFixed(2)}`, color: "#ff6b9d", icon: "📤", sub: "Approved submissions paid" },
        ].map((item) => (
          <div key={item.label} className="stat-card">
            <div style={{ fontSize: 28, marginBottom: 16 }}>{item.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: item.color, marginBottom: 4 }}>{item.value}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: item.color, fontWeight: 600 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Add funds notice */}
      <div
        style={{
          padding: "16px 20px", borderRadius: 12,
          background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.2)",
          marginBottom: 32, fontSize: 13, color: "var(--muted)", lineHeight: 1.7,
        }}
      >
        🔗 <strong style={{ color: "#a78bfa" }}>Stripe Connect</strong> — Card payments and automated billing are coming in Phase 2.
        For now, deposits are processed manually. Contact{" "}
        <a href="mailto:billing@testado.io" style={{ color: "#6c63ff" }}>billing@testado.io</a> to top up.
      </div>

      {/* Transaction history */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--card-border)" }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>Transaction Ledger</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
              {["Date", "Type", "Description", "Amount", "Status"].map((h) => (
                <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.8 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => {
              const isCredit = t.amount.startsWith("+");
              return (
                <tr
                  key={t.id}
                  style={{ borderBottom: i < transactions.length - 1 ? "1px solid var(--card-border)" : "none" }}
                >
                  <td style={{ padding: "14px 24px", fontSize: 13, color: "var(--muted)" }}>{t.date}</td>
                  <td style={{ padding: "14px 24px" }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{t.type}</span>
                  </td>
                  <td style={{ padding: "14px 24px", fontSize: 13, color: "var(--muted)" }}>{t.desc}</td>
                  <td style={{ padding: "14px 24px" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: isCredit ? "#00d4aa" : "#ff6b9d" }}>
                      {t.amount}
                    </span>
                  </td>
                  <td style={{ padding: "14px 24px" }}>
                    <span className="badge badge-approved">✓ {t.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
