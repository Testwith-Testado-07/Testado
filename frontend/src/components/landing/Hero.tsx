import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";

type Verdict = "go" | "pivot" | "no-go";

interface Report {
  title: string;
  audience: string;
  tester_count: number;
  headline_label: string;
  headline_percent: number;
  breakdown: { label: string; percent: number; highlight?: boolean }[];
  quote: string | null;
  quote_author: string | null;
  verdict: Verdict;
  verdict_note: string | null;
}

/** Shown until a real result is published in the `published_reports` table. */
const SAMPLE_REPORT: Report = {
  title: "Weekly meal-kit subscription",
  audience: "Pune · ages 25–34",
  tester_count: 40,
  headline_label: "Would buy at ₹499 a week",
  headline_percent: 64,
  breakdown: [
    { label: "₹399", percent: 78 },
    { label: "₹499", percent: 64, highlight: true },
    { label: "₹599", percent: 31 },
  ],
  quote: "I’d try it, but ₹499 every week is more than I spend on groceries right now.",
  quote_author: "Tester, 29, Pune",
  verdict: "go",
  verdict_note: "with a lower first-month price, retest at ₹449",
};

const VERDICTS: Record<Verdict, { label: string; dot: string }> = {
  go: { label: "Go", dot: "bg-emerald-600" },
  pivot: { label: "Pivot", dot: "bg-amber-500" },
  "no-go": { label: "No-go", dot: "bg-red-600" },
};

function isBreakdownRow(row: unknown): row is Report["breakdown"][number] {
  if (!row || typeof row !== "object") return false;
  const { label, percent } = row as { label?: unknown; percent?: unknown };
  return typeof label === "string" && typeof percent === "number";
}

/** Newest published real test result, or null when there is none (or the table isn't set up yet). */
async function getPublishedReport(): Promise<Report | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const { data, error } = await createClient(url, key, { auth: { persistSession: false } })
    .from("published_reports")
    .select("title, audience, tester_count, headline_label, headline_percent, breakdown, quote, quote_author, verdict, verdict_note")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;

  const breakdown = Array.isArray(data.breakdown) ? data.breakdown.filter(isBreakdownRow).slice(0, 4) : [];
  return { ...(data as Report), breakdown };
}

function TestReport({ report, isSample }: { report: Report; isSample: boolean }) {
  const verdict = VERDICTS[report.verdict] ?? VERDICTS.go;
  return (
    <figure className="rounded-2xl border border-border bg-card shadow-[0_8px_24px_rgba(7,23,46,0.06)]">
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-foreground">{report.title}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {report.audience} · {report.tester_count} testers
          </p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{isSample ? "Sample report" : "Real test result"}</span>
      </div>

      <div className="px-6 py-5">
        <p className="text-[13px] text-muted-foreground">{report.headline_label}</p>
        <p className="mt-1 text-[32px] leading-none font-medium text-foreground tabular-nums">{report.headline_percent}%</p>

        {report.breakdown.length > 0 && (
          <div className="mt-6 space-y-3">
            {report.breakdown.map(({ label, percent, highlight }) => (
              <div key={label} className="grid grid-cols-[minmax(48px,auto)_1fr_40px] items-center gap-3 text-[13px]">
                <span className={highlight ? "font-medium text-foreground" : "text-muted-foreground"}>{label}</span>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={highlight ? "h-full rounded-full bg-primary" : "h-full rounded-full bg-[var(--border-dark)]"}
                    style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
                  />
                </div>
                <span className="text-right font-mono text-muted-foreground tabular-nums">{percent}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {report.quote && (
        <blockquote className="mx-6 border-l-2 border-[var(--border-dark)] pl-4 text-[14px] leading-relaxed text-[var(--text-body)]">
          &ldquo;{report.quote}&rdquo;
          {report.quote_author && <footer className="mt-1 text-xs text-muted-foreground">{report.quote_author}</footer>}
        </blockquote>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-border px-6 py-4 text-[13px]">
        <span className={`size-2 rounded-full ${verdict.dot}`} aria-hidden="true" />
        <span className="font-medium text-foreground">{verdict.label}</span>
        {report.verdict_note && <span className="text-muted-foreground">{report.verdict_note}</span>}
      </div>
    </figure>
  );
}

export default async function Hero() {
  const published = await getPublishedReport();

  return (
    <section aria-labelledby="hero-heading" className="px-4 pt-32 pb-20 sm:px-10 lg:pt-40 lg:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <h1
            id="hero-heading"
            className="font-serif text-[clamp(40px,4.2vw,58px)] leading-[1.05] font-medium tracking-[-0.02em] text-ink"
          >
            Don&rsquo;t just launch.
            <br />
            <span className="text-primary">Know the market first</span>
          </h1>

          <p className="mt-6 max-w-xl text-[clamp(16px,1.6vw,19px)] leading-relaxed text-[var(--text-body)]">
            Put your idea, prototype or product in front of the customers you actually want, and see whether they
            would buy before you spend. Testers join free and get paid for honest feedback.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/businesses">Validate your idea</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="group">
              <Link href="/testers">
                Earn as a tester
                <ArrowRight className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <TestReport report={published ?? SAMPLE_REPORT} isSample={!published} />
      </div>
    </section>
  );
}
