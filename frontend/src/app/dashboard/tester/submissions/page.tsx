"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const NAV = [
  { href: "/dashboard/tester", label: "Discover" },
  { href: "/dashboard/tester/submissions", label: "My Applications" },
  { href: "/dashboard/tester/wallet", label: "Wallet" },
];

interface Application {
  id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  campaign: { title: string; reward_amount: number | string } | null;
}

const STATUS_COLORS: Record<Application["status"], string> = {
  pending: "#fbbf24",
  accepted: "#00d4aa",
  rejected: "#ff6b9d",
};

export default function TesterApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const loadApplications = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Sign in to view your applications.");

      const { data, error } = await supabase
        .from("campaign_applications")
        .select("id, status, created_at, campaign:campaigns(title, reward_amount)")
        .eq("tester_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!cancelled) setApplications((data || []) as unknown as Application[]);
    };

    loadApplications()
      .catch((error: unknown) => {
        if (!cancelled) setErrorMessage(error instanceof Error ? error.message : "Applications could not be loaded.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const pendingCount = applications.filter((application) => application.status === "pending").length;
  const acceptedCount = applications.filter((application) => application.status === "accepted").length;
  const rejectedCount = applications.filter((application) => application.status === "rejected").length;

  return (
    <DashboardLayout role="tester" navItems={NAV}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>My Applications</h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Track product tests you have applied to.</p>
      </div>

      {errorMessage && <p role="alert" style={{ color: "#ff6b9d", marginBottom: 20 }}>{errorMessage}</p>}

      {!loading && !errorMessage && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Applications", value: applications.length, color: "#6c63ff" },
            { label: "Awaiting Review", value: pendingCount, color: "#fbbf24" },
            { label: "Accepted", value: acceptedCount, color: "#00d4aa" },
            { label: "Not Accepted", value: rejectedCount, color: "#ff6b9d" },
          ].map((stat) => (
            <div key={stat.label} className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading your applications…</p>
      ) : !errorMessage && applications.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>No applications yet</h2>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Explore available product tests and apply to one that interests you.</p>
        </div>
      ) : !errorMessage ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {applications.map((application) => (
            <div
              key={application.id}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                borderLeft: `3px solid ${STATUS_COLORS[application.status]}`,
              }}
            >
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                  {application.campaign?.title || "Product test no longer available"}
                </h2>
                <p style={{ color: "var(--muted)", fontSize: 12 }}>
                  Applied {new Date(application.created_at).toLocaleDateString()}
                  {application.campaign && ` · Reward $${Number(application.campaign.reward_amount).toFixed(2)}`}
                </p>
              </div>
              <span className={`badge badge-${application.status}`}>{application.status}</span>
            </div>
          ))}
        </div>
      ) : null}
    </DashboardLayout>
  );
}
