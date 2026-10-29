import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton for a client card */
export function ClientCardSkeleton() {
  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-3.5">
        <Skeleton className="size-11 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-[55%]" />
          <Skeleton className="h-3 w-[70%]" />
        </div>
        <Skeleton className="h-6 w-18 rounded-full" />
      </div>
      <Skeleton className="h-3 w-2/5" />
    </div>
  );
}

/** Skeleton for a single row-style card, e.g. owner campaigns or tester applications. */
export function CampaignRowSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="min-w-[180px] flex-1 space-y-2.5">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-6 w-44 rounded-full" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}

/** Skeleton matching the tester "product test" card: header + reward chip, copy lines, CTA. */
export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-start justify-between gap-4 p-5 pb-0">
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-4.5 w-3/4" />
        </div>
        <Skeleton className="h-14 w-20 rounded-xl" />
      </div>
      <div className="space-y-2.5 p-5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[92%]" />
        <Skeleton className="h-3 w-3/5" />
      </div>
      <div className="p-5 pt-0">
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}
