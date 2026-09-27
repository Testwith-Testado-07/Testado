"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

const NAV = [
  { href: "/dashboard/tester", icon: "🔍", label: "Discover" },
  { href: "/dashboard/tester/submissions", icon: "📨", label: "My Submissions" },
  { href: "/dashboard/tester/wallet", icon: "💰", label: "Wallet" },
];

const transactions = [
  { id: "t1", type: "reward_earned", desc: "Mobile App UX Feedback — approved", amount: 8, date: "Sep 21, 2026" },
  { id: "t2", type: "reward_earned", desc: "Landing Page Copy Test — approved", amount: 6, date: "Sep 16, 2026" },
  { id: "t3", type: "reward_earned", desc: "Fintech Dashboard Feedback — approved", amount: 10, date: "Sep 8, 2026" },
  { id: "t4", type: "reward_earned", desc: "Food App UX Review — approved", amount: 7, date: "Aug 29, 2026" },
  { id: "t5", type: "withdrawal", desc: "Bank withdrawal — PayPal", amount: -20, date: "Sep 1, 2026" },
];

export default function TesterWallet() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawSubmitted, setWithdrawSubmitted] = useState(false);

  const balance = 11.00;
  const totalEarned = 31.00;
  const totalWithdrawn = 20.00;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSubmitted(true);
    setShowWithdraw(false);
    setWithdrawAmount("");
  };

  return (
    <DashboardLayout role="tester" navItems={NAV}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>My Wallet 💰</h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Your earnings from approved test submissions.</p>
      </div>

      {/* Balance hero card */}
      <div
        style={{
          borderRadius: 20, padding: 36, marginBottom: 28,
          background: "linear-gradient(135deg, rgba(108,99,255,0.2) 0%, rgba(0,212,170,0.15) 100%)",
          border: "1px solid rgba(108,99,255,0.3)",
          position: "relative", overflow: "hidden",
        }}
      >
        <div className="orb" style={{ width: 200, height: 200, background: "rgba(108,99,255,0.2)", top: -50, right: -50 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
            Available Balance
          </div>
          <div style={{ fontSize: 64, fontWeight: 900, color: "#00d4aa", marginBottom: 8 }}>
            ${balance.toFixed(2)}
          </div>
          <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 28 }}>
            ${totalEarned.toFixed(2)} earned all time · ${totalWithdrawn.toFixed(2)} withdrawn
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="btn-teal"
              onClick={() => setShowWithdraw(true)}
              style={{ fontSize: 14, padding: "11px 24px" }}
            >
              Withdraw Funds
            </button>
            <div
              style={{
                padding: "11px 18px", borderRadius: 10, fontSize: 13,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--muted)",
              }}
            >
              💡 Stripe payouts coming in Phase 2
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Earned", value: `$${totalEarned}`, icon: "📈", color: "#00d4aa" },
          { label: "Withdrawn", value: `$${totalWithdrawn}`, icon: "🏦", color: "#6c63ff" },
          { label: "Approvals", value: "4", icon: "✅", color: "#fbbf24" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Withdraw modal */}
      {showWithdraw && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.7)", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowWithdraw(false); }}
        >
          <div className="card" style={{ width: "100%", maxWidth: 420, padding: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Withdraw Funds</h2>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24, lineHeight: 1.6 }}>
              Enter the amount you&apos;d like to withdraw. Minimum withdrawal is $5.
            </p>
            <form onSubmit={handleWithdraw} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="label">Amount (USD)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>$</span>
                  <input
                    className="input"
                    type="number"
                    placeholder="0.00"
                    min="5"
                    max={balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    style={{ paddingLeft: 28 }}
                    required
                  />
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                  Available: ${balance.toFixed(2)}
                </div>
              </div>
              <div
                style={{
                  padding: "12px 16px", borderRadius: 10,
                  background: "rgba(255,107,157,0.08)", border: "1px solid rgba(255,107,157,0.2)",
                  fontSize: 12, color: "var(--muted)",
                }}
              >
                ⚠️ Stripe Connect payouts are coming in Phase 2. Your withdrawal request will be processed manually within 2–3 business days.
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowWithdraw(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-teal" style={{ flex: 1, justifyContent: "center" }}>
                  Request Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdrawal success toast */}
      {withdrawSubmitted && (
        <div
          style={{
            position: "fixed", bottom: 32, right: 32, zIndex: 300,
            background: "rgba(0,212,170,0.15)", border: "1px solid rgba(0,212,170,0.4)",
            borderRadius: 12, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12,
          }}
        >
          <span>✅</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#00d4aa" }}>Withdrawal requested!</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>You&apos;ll be notified when it&apos;s processed.</div>
          </div>
          <button
            onClick={() => setWithdrawSubmitted(false)}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 16 }}
          >✕</button>
        </div>
      )}

      {/* Transaction history */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--card-border)" }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>Transaction History</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {transactions.map((t, i) => (
            <div
              key={t.id}
              style={{
                display: "flex", alignItems: "center", gap: 16, padding: "16px 24px",
                borderBottom: i < transactions.length - 1 ? "1px solid var(--card-border)" : "none",
              }}
            >
              <div
                style={{
                  width: 40, height: 40, borderRadius: 12, display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
                  background: t.amount > 0 ? "rgba(0,212,170,0.12)" : "rgba(108,99,255,0.12)",
                }}
              >
                {t.amount > 0 ? "💸" : "🏦"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{t.desc}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.date}</div>
              </div>
              <div
                style={{
                  fontWeight: 800, fontSize: 16,
                  color: t.amount > 0 ? "#00d4aa" : "#ff6b9d",
                }}
              >
                {t.amount > 0 ? `+$${t.amount}` : `-$${Math.abs(t.amount)}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
