import * as React from "react";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

/** Inline, persistent error message for failed loads. Transient action errors use toasts instead. */
function Alert({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="alert"
      className={cn("mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800", className)}
      {...props}
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden="true" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export { Alert };
