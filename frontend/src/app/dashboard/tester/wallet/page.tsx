"use client";
import { DashboardLayout } from "@/components/DashboardLayout";

const NAV = [
  { href: "/dashboard/tester", label: "Discover" },
  { href: "/dashboard/tester/submissions", label: "My Applications" },
  { href: "/dashboard/tester/wallet", label: "Wallet" },
];

export default function TesterWallet() {
  return (
    <DashboardLayout role="tester" navItems={NAV}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Wallet</h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Payouts and earnings will appear here when payment processing is available.</p>
      </div>

      <div className="card" style={{ maxWidth: 680, padding: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Payouts are not enabled yet</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
          Testado has not connected a payment provider, so there is no withdrawable balance or transaction history to show.
          We will display payment details here once payouts are implemented.
        </p>
      </div>
    </DashboardLayout>
  );
}
