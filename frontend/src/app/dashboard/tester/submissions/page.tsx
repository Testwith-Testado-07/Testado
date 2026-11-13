"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { CampaignRowSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { MetricCard, MetricCardSkeleton, MetricGrid } from "@/components/dashboard/MetricCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Application {
  id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  campaign: { title: string; reward_amount: number | string } | null;
}

const STATUS_BORDER: Record<Application["status"], string> = {
  pending: "border-l-amber-500",
  accepted: "border-l-emerald-500",
  rejected: "border-l-red-400",
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
    <>
      <PageHeader
        title="My applications"
        description={loading ? "Loading your applications…" : `Track the ${applications.length} product ${applications.length === 1 ? "test" : "tests"} you have applied to.`}
      />

      {errorMessage && <Alert>{errorMessage}</Alert>}

      {loading ? (
        <MetricGrid>
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </MetricGrid>
      ) : !errorMessage && (
        <MetricGrid>
          <MetricCard label="Awaiting review" value={pendingCount} hint="The product owner hasn't decided yet" />
          <MetricCard label="Accepted" value={acceptedCount} hint="Tests you can start now" />
          <MetricCard label="Not accepted" value={rejectedCount} hint="Keep applying, new tests go live often" />
        </MetricGrid>
      )}

      {loading ? (
        <div className="flex flex-col gap-3.5">
          {[1, 2, 3].map((i) => <CampaignRowSkeleton key={i} />)}
        </div>
      ) : !errorMessage && applications.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Explore available product tests and apply to one that interests you."
          action={
            <Button asChild>
              <Link href="/dashboard/tester">Discover product tests</Link>
            </Button>
          }
        />
      ) : !errorMessage ? (
        <ul className="flex flex-col gap-3.5">
          {applications.map((application) => (
            <li key={application.id}>
              <Card className={cn("flex-row flex-wrap items-center justify-between gap-4 border-l-[3px] p-5", STATUS_BORDER[application.status])}>
                <div className="min-w-0">
                  <h2 className="mb-1 text-[15px] font-medium">
                    {application.campaign?.title || "Product test no longer available"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Applied {new Date(application.created_at).toLocaleDateString()}
                    {application.campaign && ` · Reward $${Number(application.campaign.reward_amount).toFixed(2)}`}
                  </p>
                </div>
                <span className={`badge badge-${application.status}`}>{application.status}</span>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
