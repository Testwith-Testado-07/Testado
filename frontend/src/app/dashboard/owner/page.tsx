"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const NAV = [
  { href: "/dashboard/owner", label: "Overview" },
  { href: "/dashboard/owner/campaigns", label: "Campaigns" },
  { href: "/dashboard/owner/campaigns/new", label: "New Campaign" },
  { href: "/dashboard/owner/billing", label: "Billing" },
];

interface OwnerDashboardCampaign {
  id: string;
  title: string;
  status: string;
  reward_amount: number | string;
  max_testers: number;
  application_count: number;
  pending_count: number;
}

export default function OwnerDashboard() {
  const [firstName, setFirstName] = useState("there");
  const [campaigns, setCampaigns] = useState<OwnerDashboardCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const loadDashboard = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Sign in to view your owner dashboard.");

      const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";
      if (!cancelled) setFirstName(fullName.split(" ")[0]);

      const { data: campaignRows, error: campaignError } = await supabase
        .from("campaigns")
        .select("id, title, status, reward_amount, max_testers")
        .order("created_at", { ascending: false });
      if (campaignError) throw campaignError;

      const rows = campaignRows || [];
      if (rows.length === 0) {
        if (!cancelled) setCampaigns([]);
        return;
      }

      const { data: applicationRows, error: applicationError } = await supabase
        .from("campaign_applications")
        .select("campaign_id, status")
        .in("campaign_id", rows.map((campaign) => campaign.id));
      if (applicationError) throw applicationError;

      const applicationCounts = new Map<string, { total: number; pending: number }>();
      for (const application of applicationRows || []) {
        const counts = applicationCounts.get(application.campaign_id) || { total: 0, pending: 0 };
        if (application.status !== "rejected") counts.total += 1;
        if (application.status === "pending") counts.pending += 1;
        applicationCounts.set(application.campaign_id, counts);
      }

      if (!cancelled) {
        setCampaigns(rows.map((campaign) => {
          const counts = applicationCounts.get(campaign.id) || { total: 0, pending: 0 };
          return { ...campaign, application_count: counts.total, pending_count: counts.pending } as OwnerDashboardCampaign;
        }));
      }
    };

    loadDashboard()
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "Dashboard data could not be loaded.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const stats = [
    {
      label: "Active Campaigns",
      value: campaigns.filter((campaign) => campaign.status === "active").length,
      change: `${campaigns.length} total campaigns`,
      color: "#6c63ff",
    },
    {
      label: "Tester Applications",
      value: campaigns.reduce((total, campaign) => total + campaign.application_count, 0),
      change: "Across your campaigns",
      color: "#00d4aa",
    },
    {
      label: "Pending Review",
      value: campaigns.reduce((total, campaign) => total + campaign.pending_count, 0),
      change: "Applications awaiting a decision",
      color: "#fbbf24",
    },
    {
      label: "Potential Reward Budget",
      value: `$${campaigns.reduce((total, campaign) => total + Number(campaign.reward_amount) * campaign.max_testers, 0).toFixed(2)}`,
      change: "Based on campaign tester limits",
      color: "#ff6b9d",
    },
  ];

  return (
    <DashboardLayout role="owner" navItems={NAV}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{greeting}, {firstName}</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Here&apos;s what&apos;s happening with your campaigns today.</p>
        </div>
        <Link href="/dashboard/owner/campaigns/new" className="btn-primary">
          + New Campaign
        </Link>
      </div>

      {loadError && <p role="alert" style={{ color: "#ff6b9d", marginBottom: 20 }}>{loadError}</p>}
      {loading && <p style={{ color: "var(--muted)" }}>Loading your campaigns…</p>}

      {campaigns.length > 0 && (
        <>
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
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: s.color + "22",
                      color: s.color,
                    }}
                  >
                    LIVE
                  </span>
                </div>
                <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.change}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                borderBottom: "1px solid var(--card-border)",
              }}
            >
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
                  {[
                    "Campaign",
                    "Status",
                    "Applicants",
                    "Pending",
                    "Reward",
                    "Potential Budget",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 24px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--muted)",
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
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
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "16px 24px" }}>
                      <Link
                        href="/dashboard/owner/campaigns"
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
                              width: `${Math.min((c.application_count / c.max_testers) * 100, 100)}%`,
                              background: c.status === "active" ? "#6c63ff" : c.status === "completed" ? "#00d4aa" : "#3a3f5c",
                              borderRadius: 3,
                              transition: "width 0.5s",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>
                          {c.application_count}/{c.max_testers}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      {c.pending_count > 0 ? (
                        <span className="badge badge-pending">{c.pending_count} pending</span>
                      ) : (
                        <span style={{ color: "var(--muted)", fontSize: 13 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "16px 24px", fontWeight: 600, fontSize: 14, color: "#00d4aa" }}>${Number(c.reward_amount).toFixed(2)}</td>
                    <td style={{ padding: "16px 24px", fontSize: 13, color: "var(--muted)" }}>${(Number(c.reward_amount) * c.max_testers).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
