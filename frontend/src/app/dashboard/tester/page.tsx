"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const NAV = [
  { href: "/dashboard/tester", icon: "🔍", label: "Discover" },
  { href: "/dashboard/tester/submissions", icon: "📨", label: "My Applications" },
  { href: "/dashboard/tester/wallet", icon: "💰", label: "Wallet" },
];

interface ProductCampaign {
  id: string;
  title: string;
  description: string;
  product_url: string;
  reward_amount: number | string;
  max_testers: number;
  target_countries: string[];
  target_ages: string[];
  created_at: string;
}

interface CampaignApplication {
  campaign_id: string;
  status: "pending" | "accepted" | "rejected";
}

export default function TesterDiscover() {
  const [firstName, setFirstName] = useState("");
  const [testerId, setTesterId] = useState("");
  const [campaigns, setCampaigns] = useState<ProductCampaign[]>([]);
  const [applications, setApplications] = useState<CampaignApplication[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const loadCampaigns = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Sign in to discover product tests.");

      if (!cancelled) {
        setTesterId(user.id);
        const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
        setFirstName(fullName.split(" ")[0]);
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("age_range")
        .eq("id", user.id)
        .maybeSingle();
      if (profileError) throw profileError;

      const { data, error } = await supabase
        .from("campaigns")
        .select("id, title, description, product_url, reward_amount, max_testers, target_countries, target_ages, created_at")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const availableCampaigns = ((data || []) as ProductCampaign[]).filter((campaign) => {
        const ageMatches = campaign.target_ages.length === 0
          || (!!profile?.age_range && campaign.target_ages.includes(profile.age_range));
        return ageMatches;
      });
      if (!cancelled) setCampaigns(availableCampaigns);

      const { data: applicationRows, error: applicationError } = await supabase
        .from("campaign_applications")
        .select("campaign_id, status")
        .eq("tester_id", user.id);
      if (applicationError) throw applicationError;
      if (!cancelled) setApplications((applicationRows || []) as CampaignApplication[]);
    };

    loadCampaigns()
      .catch((error: unknown) => {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Product tests could not be loaded.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const applyToCampaign = async (campaignId: string) => {
    if (!testerId) {
      setErrorMessage("Sign in to apply for a product test.");
      return;
    }

    setApplyingTo(campaignId);
    setErrorMessage("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("campaign_applications")
        .insert({ campaign_id: campaignId, tester_id: testerId })
        .select("campaign_id, status")
        .single();
      if (error) throw error;
      setApplications((current) => [...current, data as CampaignApplication]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Your application could not be sent.");
    } finally {
      setApplyingTo("");
    }
  };

  const sortedCampaigns = [...campaigns].sort((left, right) => {
    if (sortBy === "reward") return Number(right.reward_amount) - Number(left.reward_amount);
    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });
  return (
    <DashboardLayout role="tester" navItems={NAV}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
            Discover Product Tests 🔍{firstName ? `, ${firstName}` : ""}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            {loading
              ? "Loading available product tests…"
              : errorMessage
                ? "Product tests could not be loaded."
                : `${campaigns.length} active product ${campaigns.length === 1 ? "test" : "tests"} available.`}
          </p>
        </div>
        <div>
          <select
            id="campaign-sort"
            name="sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            style={{
              background: "var(--card)", border: "1px solid var(--card-border)",
              borderRadius: 10, padding: "10px 16px", color: "var(--foreground)",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="reward">Sort: Highest Reward</option>
          </select>
        </div>
      </div>

      {errorMessage && (
        <p role="alert" style={{ color: "#ff6b9d", marginBottom: 20 }}>{errorMessage}</p>
      )}

      {!loading && !errorMessage && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Available Now", value: campaigns.length, icon: "📋", color: "#6c63ff" },
            { label: "Applications Sent", value: applications.length, icon: "📨", color: "#00d4aa" },
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
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading product tests…</p>
        ) : errorMessage ? null : sortedCampaigns.length === 0 ? (
          <div className="card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>
            <h2 style={{ fontSize: 18, marginBottom: 8 }}>No product tests are live yet</h2>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>Check back soon when product owners publish a test.</p>
          </div>
        ) : sortedCampaigns.map((c) => {
          const application = applications.find((item) => item.campaign_id === c.id);
          return (
            <div
              key={c.id}
              className="card"
              style={{ display: "flex", flexDirection: "column", gap: 0, overflow: "hidden", padding: 0, transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(37, 99, 235, 0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 35px rgba(37, 99, 235, 0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 4 }}>PRODUCT TEST</div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3, marginBottom: 0 }}>{c.title}</h3>
                </div>
                <div
                  style={{
                    background: "#eff6ff", border: "1.5px solid #bfdbfe",
                    borderRadius: 10, padding: "8px 14px", textAlign: "center", flexShrink: 0, marginLeft: 12,
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 20, color: "#2563eb" }}>${Number(c.reward_amount).toFixed(2)}</div>
                  <div style={{ fontSize: 10, color: "#1d4ed8", fontWeight: 700 }}>REWARD</div>
                </div>
              </div>

              <div style={{ padding: "14px 20px", flex: 1 }}>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 14 }}>
                  {c.description}
                </p>
                <p style={{ fontSize: 12, color: "var(--muted)" }}>
                  Up to {c.max_testers} testers
                  {c.target_countries.length > 0 && ` · Preferred countries: ${c.target_countries.join(", ")}`}
                  {c.target_ages.length > 0 && ` · Ages ${c.target_ages.join(", ")}`}
                </p>
                {c.product_url && (
                  <a href={c.product_url} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontSize: 13, fontWeight: 600 }}>
                    Open product ↗
                  </a>
                )}
              </div>

              <div style={{ padding: "0 20px 20px" }}>
                {application ? (
                  <span className={`badge badge-${application.status}`} style={{ display: "inline-flex" }}>
                    Application {application.status}
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => applyToCampaign(c.id)}
                    disabled={applyingTo === c.id}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {applyingTo === c.id ? "Sending application…" : "Apply to test →"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
