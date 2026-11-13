import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[var(--border-dark)] bg-card/60 px-6 py-14 text-center">
      <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-blue-50 text-primary ring-1 ring-inset ring-blue-100">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-medium text-foreground">{title}</h2>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
