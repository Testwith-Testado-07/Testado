"use client";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Compass, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { MetricCard, MetricCardSkeleton, MetricGrid } from "@/components/dashboard/MetricCard";
import { ProjectCardSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useToast } from "@/components/Toast";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [testerId, setTesterId] = useState("");
  const [campaigns, setCampaigns] = useState<ProductCampaign[]>([]);
  const [applications, setApplications] = useState<CampaignApplication[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const loadCampaigns = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Sign in to discover product tests.");

      if (!cancelled) {
        setTesterId(user.id);
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
      toast.error("Sign in to apply for a product test.");
      return;
    }

    setApplyingTo(campaignId);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("campaign_applications")
        .insert({ campaign_id: campaignId, tester_id: testerId })
        .select("campaign_id, status")
        .single();
      if (error) throw error;
      setApplications((current) => [...current, data as CampaignApplication]);
      toast.success("Application sent. The product owner will review it shortly.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Your application could not be sent.");
    } finally {
      setApplyingTo("");
    }
  };

  const sortedCampaigns = [...campaigns].sort((left, right) => {
    if (sortBy === "reward") return Number(right.reward_amount) - Number(left.reward_amount);
    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });
  return (
    <>
      <PageHeader
        title="Discover product tests"
        description={loading
          ? "Loading available product tests…"
          : errorMessage
            ? "Product tests could not be loaded."
            : `${campaigns.length} active product ${campaigns.length === 1 ? "test" : "tests"} available.`}
        actions={
          <>
            <label htmlFor="campaign-sort" className="sr-only">Sort product tests</label>
            <NativeSelect
              id="campaign-sort"
              name="sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-10 w-52 bg-white text-sm font-semibold"
            >
              <option value="newest">Sort: Newest first</option>
              <option value="reward">Sort: Highest reward</option>
            </NativeSelect>
          </>
        }
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
          <MetricCard label="Available now" value={campaigns.length} hint="Active tests matching your profile" />
          <MetricCard
            label="Applications sent"
            value={applications.length}
            hint={`${applications.filter((item) => item.status === "pending").length} awaiting a decision`}
          />
          <MetricCard
            label="Accepted"
            value={applications.filter((item) => item.status === "accepted").length}
            hint="Tests you can start now"
          />
        </MetricGrid>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-5">
        {loading ? (
          [1, 2, 3].map((i) => <ProjectCardSkeleton key={i} />)
        ) : errorMessage ? null : sortedCampaigns.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Compass}
              title="No product tests are live yet"
              description="Check back soon. New tests show up here as soon as product owners publish them."
            />
          </div>
        ) : sortedCampaigns.map((c) => {
          const application = applications.find((item) => item.campaign_id === c.id);
          return (
            <Card key={c.id} interactive className="group overflow-hidden">
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="mb-1 text-xs text-muted-foreground">Product test</p>
                  <CardTitle className="transition-colors duration-200 group-hover:text-primary">{c.title}</CardTitle>
                </div>
                <div className="shrink-0 rounded-xl border-[1.5px] border-blue-200 bg-blue-50 px-3.5 py-2 text-center transition-colors duration-300 group-hover:border-blue-300 group-hover:bg-blue-100/70">
                  <div className="text-xl font-medium text-primary tabular-nums">${Number(c.reward_amount).toFixed(2)}</div>
                  <div className="text-xs text-[var(--blue-hover)]">Reward</div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3.5">
                <p className="text-[13px] leading-relaxed text-muted-foreground">{c.description}</p>
                <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                  <Users className="size-3.5" aria-hidden="true" />
                  Up to {c.max_testers} testers
                  {c.target_countries.length > 0 && ` · Preferred countries: ${c.target_countries.join(", ")}`}
                  {c.target_ages.length > 0 && ` · Ages ${c.target_ages.join(", ")}`}
                </p>
                {c.product_url && (
                  <a
                    href={c.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Open product
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                )}
              </CardContent>

              <CardFooter>
                {application ? (
                  <span className={`badge badge-${application.status}`} style={{ display: "inline-flex" }}>
                    Application {application.status}
                  </span>
                ) : (
                  <Button
                    type="button"
                    onClick={() => applyToCampaign(c.id)}
                    disabled={applyingTo === c.id}
                    className="group/apply h-11 w-full"
                  >
                    {applyingTo === c.id ? "Sending application…" : "Apply to test"}
                    {applyingTo !== c.id && (
                      <ArrowRight className="transition-transform duration-200 group-hover/apply:translate-x-0.5" aria-hidden="true" />
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
