"use client";
import { DashboardLayout } from "@/components/DashboardLayout";

const NAV = [
  { href: "/dashboard/owner", label: "Overview" },
  { href: "/dashboard/owner/campaigns", label: "Campaigns" },
  { href: "/dashboard/owner/campaigns/new", label: "New Campaign" },
  { href: "/dashboard/owner/billing", label: "Billing" },
];

export default function BillingPage() {
  return (
    <DashboardLayout role="owner" navItems={NAV}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Billing</h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Payments and campaign funding are not connected yet.</p>
      </div>

      <div className="card" style={{ maxWidth: 680, padding: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Payment processing is not enabled</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
          No payment provider or transaction ledger is connected. Campaign reward amounts are planning estimates only;
          they are not deposits, escrow balances, or completed payments.
        </p>
      </div>
    </DashboardLayout>
  );
}
