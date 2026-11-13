import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(7,23,46,0.04)]">
      <h3 className="text-sm text-muted-foreground">{label}</h3>
      <p className="mt-2 text-[32px] leading-none font-medium tracking-tight text-foreground tabular-nums">{value}</p>
      {hint && <p className="mt-4 text-[13px] text-muted-foreground">{hint}</p>}
    </article>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(7,23,46,0.04)]">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="mt-3 h-8 w-20" />
      <Skeleton className="mt-5 h-3 w-40" />
    </div>
  );
}

/** Three-up responsive grid for summary metrics. */
export function MetricGrid({ children }: { children: React.ReactNode }) {
  return (
    <section aria-labelledby="summary-heading" className="mb-8">
      <h2 id="summary-heading" className="sr-only">Summary</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}
