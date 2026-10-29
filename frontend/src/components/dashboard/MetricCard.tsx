import type { LucideIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TONES = {
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
} as const;

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
}

export function MetricCard({ label, value, hint, icon: Icon, tone = "blue" }: MetricCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground tabular-nums">{value}</p>
        </div>
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl ring-1 ring-inset", TONES[tone])}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      {hint && <p className="mt-4 text-xs font-medium text-muted-foreground">{hint}</p>}
    </article>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="size-11 rounded-xl" />
      </div>
      <Skeleton className="mt-5 h-3 w-40" />
    </div>
  );
}

/** Three-up responsive grid for summary metrics. */
export function MetricGrid({ children }: { children: React.ReactNode }) {
  return (
    <section aria-labelledby="summary-heading" className="mb-9">
      <h2 id="summary-heading" className="sr-only">Summary</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}
