"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const NAV = [
  { href: "/dashboard/owner", icon: "📊", label: "Overview" },
  { href: "/dashboard/owner/campaigns", icon: "📋", label: "Campaigns" },
  { href: "/dashboard/owner/campaigns/new", icon: "➕", label: "New Campaign" },
  { href: "/dashboard/owner/billing", icon: "💳", label: "Billing" },
];

interface OwnerCampaign {
  id: string;
  title: string;
  status: string;
  reward_amount: number | string;
  max_testers: number;
  created_at: string;
}

interface CampaignApplication {
  id: string;
  campaign_id: string;
  tester_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  tester_name: string;
}

const FILTER_OPTIONS = ["All", "Active", "Draft", "Paused", "Completed"];

export default function CampaignsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [allCampaigns, setAllCampaigns] = useState<OwnerCampaign[]>([]);
  const [applications, setApplications] = useState<CampaignApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [updatingApplication, setUpdatingApplication] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const loadCampaigns = async () => {
      const { data: campaignRows, error: campaignError } = await supabase
        .from("campaigns")
        .select("id, title, status, reward_amount, max_testers, created_at")
        .order("created_at", { ascending: false });
      if (campaignError) throw campaignError;

      const campaigns = (campaignRows || []) as OwnerCampaign[];
      if (!cancelled) setAllCampaigns(campaigns);
      if (campaigns.length === 0) return;

      const { data: applicationRows, error: applicationError } = await supabase
        .from("campaign_applications")
        .select("id, campaign_id, tester_id, status, created_at")
        .in("campaign_id", campaigns.map((campaign) => campaign.id))
        .order("created_at", { ascending: false });
      if (applicationError) throw applicationError;

      const rows = applicationRows || [];
      const testerIds = [...new Set(rows.map((application) => application.tester_id))];
      const { data: profiles, error: profileError } = testerIds.length > 0
        ? await supabase.from("profiles").select("id, full_name").in("id", testerIds)
        : { data: [], error: null };
      if (profileError) throw profileError;

      const namesById = new Map((profiles || []).map((profile) => [profile.id, profile.full_name]));
      if (!cancelled) {
        setApplications(rows.map((application) => ({
          ...application,
          status: application.status as CampaignApplication["status"],
          tester_name: namesById.get(application.tester_id) || "Tester",
        })));
      }
    };

    loadCampaigns()
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "Campaigns could not be loaded.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const reviewApplication = async (applicationId: string, status: "accepted" | "rejected") => {
    setUpdatingApplication(applicationId);
    setActionError("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("campaign_applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", applicationId)
        .select("id, status")
        .single();
      if (error) throw error;
      setApplications((current) => current.map((application) =>
        application.id === applicationId
          ? { ...application, status: data.status as CampaignApplication["status"] }
          : application
      ));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "The application could not be updated.");
    } finally {
      setUpdatingApplication("");
    }
  };

  const campaigns = activeFilter === "All"
    ? allCampaigns
    : allCampaigns.filter((campaign) => campaign.status === activeFilter.toLowerCase());

  return (
    <DashboardLayout role="owner" navItems={NAV}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Campaigns</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>{allCampaigns.length} campaigns total</p>
        </div>
        <Link href="/dashboard/owner/campaigns/new" className="btn-primary">
          + New Campaign
        </Link>
      </div>

      {loadError && <p role="alert" style={{ color: "#ff6b9d", marginBottom: 20 }}>{loadError}</p>}
      {actionError && <p role="alert" style={{ color: "#ff6b9d", marginBottom: 20 }}>{actionError}</p>}

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {FILTER_OPTIONS.map((f) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "7px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                border: `1px solid ${isActive ? "#6c63ff" : "var(--card-border)"}`,
                background: isActive ? "rgba(108,99,255,0.15)" : "transparent",
                color: isActive ? "#a78bfa" : "var(--muted)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Campaign cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading campaigns…</p>
        ) : loadError && allCampaigns.length === 0 ? null : campaigns.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--muted)" }}>
            No {activeFilter.toLowerCase()} campaigns found.
          </div>
        ) : campaigns.map((campaign) => {
          const campaignApplications = applications.filter((application) => application.campaign_id === campaign.id);
          const pendingCount = campaignApplications.filter((application) => application.status === "pending").length;
          const applicantCount = campaignApplications.filter((application) =>
            application.status === "pending" || application.status === "accepted"
          ).length;
          const reward = Number(campaign.reward_amount);

          return (
            <div
              key={campaign.id}
              className="card"
              style={{ padding: "20px 24px", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6c63ff55"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--card-border)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <h2 style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>{campaign.title}</h2>
                    <span className={`badge badge-${campaign.status}`}>{campaign.status}</span>
                    {pendingCount > 0 && <span className="badge badge-pending">{pendingCount} to review</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    Published {new Date(campaign.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ width: 180, flexShrink: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>Testers</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{applicantCount}/{campaign.max_testers}</span>
                  </div>
                  <div style={{ height: 6, background: "var(--card-border)", borderRadius: 3 }}>
                    <div
                      style={{
                        height: 6,
                        width: `${Math.min((applicantCount / campaign.max_testers) * 100, 100)}%`,
                        background: "#6c63ff",
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: "right", minWidth: 100, flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#00d4aa" }}>${reward.toFixed(2)}/ea</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Up to ${(reward * campaign.max_testers).toFixed(2)}</div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--card-border)", marginTop: 18, paddingTop: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Tester applications</h3>
                {loadError ? (
                  <p role="alert" style={{ color: "#ff6b9d", fontSize: 13 }}>Applications could not be loaded. Refresh the page to try again.</p>
                ) : campaignApplications.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: 13 }}>No testers have applied yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {campaignApplications.map((application) => (
                      <div
                        key={application.id}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}
                      >
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{application.tester_name}</span>
                          <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: 10 }}>
                            Applied {new Date(application.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {application.status === "pending" ? (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              type="button"
                              className="btn-secondary"
                              disabled={updatingApplication === application.id}
                              onClick={() => reviewApplication(application.id, "rejected")}
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              className="btn-primary"
                              disabled={updatingApplication === application.id}
                              onClick={() => reviewApplication(application.id, "accepted")}
                            >
                              {updatingApplication === application.id ? "Saving…" : "Accept"}
                            </button>
                          </div>
                        ) : (
                          <span className={`badge badge-${application.status}`}>{application.status}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
