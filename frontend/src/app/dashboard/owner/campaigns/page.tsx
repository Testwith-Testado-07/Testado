"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LoaderCircle, Megaphone, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { CampaignRowSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useToast } from "@/components/Toast";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const { toast } = useToast();
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
      toast.success(status === "accepted" ? "Tester accepted." : "Application rejected.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The application could not be updated.");
    } finally {
      setUpdatingApplication("");
    }
  };

  const campaigns = activeFilter === "All"
    ? allCampaigns
    : allCampaigns.filter((campaign) => campaign.status === activeFilter.toLowerCase());

  return (
    <>
      <PageHeader
        title="Campaigns"
        description={loading ? "Loading campaigns…" : `${allCampaigns.length} ${allCampaigns.length === 1 ? "campaign" : "campaigns"} total`}
        actions={
          <Button asChild>
            <Link href="/dashboard/owner/campaigns/new">
              <Plus aria-hidden="true" />
              New campaign
            </Link>
          </Button>
        }
      />

      {loadError && <Alert>{loadError}</Alert>}

      <div role="group" aria-label="Filter campaigns by status" className="mb-6 inline-flex flex-wrap gap-1 rounded-full border border-border bg-white p-1 shadow-soft">
        {FILTER_OPTIONS.map((f) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              aria-pressed={isActive}
              className={cn(
                "rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all duration-200",
                isActive ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          [1, 2, 3].map((i) => <CampaignRowSkeleton key={i} />)
        ) : loadError && allCampaigns.length === 0 ? null : campaigns.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title={activeFilter === "All" ? "No campaigns yet" : `No ${activeFilter.toLowerCase()} campaigns`}
            description={activeFilter === "All" ? "Create a campaign to start collecting tester applications." : "Try a different filter to see your other campaigns."}
            action={activeFilter === "All" && (
              <Button asChild>
                <Link href="/dashboard/owner/campaigns/new">Create a campaign</Link>
              </Button>
            )}
          />
        ) : campaigns.map((campaign) => {
          const campaignApplications = applications.filter((application) => application.campaign_id === campaign.id);
          const pendingCount = campaignApplications.filter((application) => application.status === "pending").length;
          const applicantCount = campaignApplications.filter((application) =>
            application.status === "pending" || application.status === "accepted"
          ).length;
          const reward = Number(campaign.reward_amount);

          return (
            <Card key={campaign.id} className="p-6 transition-[border-color,box-shadow] duration-300 hover:border-blue-200 hover:shadow-lift">
              <div className="flex flex-wrap items-center gap-6">
                <div className="min-w-[180px] flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                    <h2 className="text-base font-bold">{campaign.title}</h2>
                    <span className={`badge badge-${campaign.status}`}>{campaign.status}</span>
                    {pendingCount > 0 && <span className="badge badge-pending">{pendingCount} to review</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Published {new Date(campaign.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="w-44 shrink-0">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-muted-foreground">Testers</span>
                    <span className="font-bold tabular-nums">{applicantCount}/{campaign.max_testers}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-500"
                      style={{ width: `${Math.min((applicantCount / campaign.max_testers) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="min-w-24 shrink-0 text-right">
                  <div className="text-base font-bold text-emerald-600 tabular-nums">${reward.toFixed(2)}/ea</div>
                  <div className="text-xs text-muted-foreground tabular-nums">Up to ${(reward * campaign.max_testers).toFixed(2)}</div>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <h3 className="mb-3 text-sm font-bold">Tester applications</h3>
                {loadError ? (
                  <p role="alert" className="text-[13px] text-red-600">Applications could not be loaded. Refresh the page to try again.</p>
                ) : campaignApplications.length === 0 ? (
                  <p className="text-[13px] text-muted-foreground">No testers have applied yet.</p>
                ) : (
                  <ul className="flex flex-col divide-y divide-border">
                    {campaignApplications.map((application) => {
                      const isUpdating = updatingApplication === application.id;
                      return (
                        <li key={application.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <span className="grid size-8 place-items-center rounded-full bg-blue-50 text-xs font-bold text-primary">
                              {application.tester_name.charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <p className="text-[13px] font-semibold">{application.tester_name}</p>
                              <p className="text-xs text-muted-foreground">Applied {new Date(application.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          {application.status === "pending" ? (
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isUpdating}
                                onClick={() => reviewApplication(application.id, "rejected")}
                              >
                                Reject
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                disabled={isUpdating}
                                onClick={() => reviewApplication(application.id, "accepted")}
                              >
                                {isUpdating && <LoaderCircle className="animate-spin" aria-hidden="true" />}
                                {isUpdating ? "Saving…" : "Accept"}
                              </Button>
                            </div>
                          ) : (
                            <span className={`badge badge-${application.status}`}>{application.status}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
