"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Plus, Rocket } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { MetricCard, MetricCardSkeleton, MetricGrid } from "@/components/dashboard/MetricCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

      const { data: campaignRows, error: campaignError } = await supabase
        .from("campaigns")
        .select("id, title, status, reward_amount, max_testers")
        // RLS lets every signed-in user read active campaigns (testers need them), so scope to this owner
        .eq("owner_id", user.id)
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

  const pendingCount = campaigns.reduce((total, campaign) => total + campaign.pending_count, 0);

  return (
    <>
      <PageHeader
        title="Overview"
        description="Here's what's happening with your campaigns today."
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
      {loading ? (
        <MetricGrid>
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </MetricGrid>
      ) : !loadError && (
        <MetricGrid>
          <MetricCard
            label="Active campaigns"
            value={campaigns.filter((campaign) => campaign.status === "active").length}
            hint={`${campaigns.length} total ${campaigns.length === 1 ? "campaign" : "campaigns"}`}
          />
          <MetricCard
            label="Tester applications"
            value={campaigns.reduce((total, campaign) => total + campaign.application_count, 0)}
            hint={pendingCount > 0 ? `${pendingCount} awaiting your review` : "Nothing waiting on review"}
          />
          <MetricCard
            label="Potential reward budget"
            value={`$${campaigns.reduce((total, campaign) => total + Number(campaign.reward_amount) * campaign.max_testers, 0).toFixed(2)}`}
            hint="Based on campaign tester limits"
          />
        </MetricGrid>
      )}

      {!loading && !loadError && campaigns.length === 0 && (
        <EmptyState
          icon={Rocket}
          title="Launch your first campaign"
          description="Describe what you want validated and Testado will match it with testers from your target audience."
          action={
            <Button asChild>
              <Link href="/dashboard/owner/campaigns/new">Create a campaign</Link>
            </Button>
          }
        />
      )}

      {campaigns.length > 0 && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
            <h2 className="text-[17px] font-medium">Your campaigns</h2>
            <Link
              href="/dashboard/owner/campaigns"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              View all
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["Campaign", "Status", "Applicants", "Pending", "Reward", "Potential budget"].map((h) => (
                    <th key={h} scope="col" className="px-6 py-3 text-xs font-medium text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {campaigns.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-[#f8fbff]">
                    <td className="px-6 py-4">
                      <Link href="/dashboard/owner/campaigns" className="text-sm font-semibold text-foreground hover:text-primary">
                        {c.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge badge-${c.status}`}>
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-1.5 min-w-20 flex-1 overflow-hidden rounded-full bg-border">
                          <div
                            className={c.status === "active" ? "h-full rounded-full bg-primary transition-[width] duration-500" : c.status === "completed" ? "h-full rounded-full bg-emerald-600" : "h-full rounded-full bg-slate-400"}
                            style={{ width: `${Math.min((c.application_count / c.max_testers) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="whitespace-nowrap text-xs text-muted-foreground tabular-nums">
                          {c.application_count}/{c.max_testers}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {c.pending_count > 0 ? (
                        <span className="badge badge-pending">{c.pending_count} pending</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600 tabular-nums">${Number(c.reward_amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground tabular-nums">${(Number(c.reward_amount) * c.max_testers).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
