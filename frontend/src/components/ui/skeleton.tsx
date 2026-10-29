import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A low-contrast block with a soft highlight that sweeps across it. The sweep sits on a
 * pseudo-element and animates `transform` only, which keeps it cheap. With reduced
 * motion the sweep is hidden and the block stays static.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "relative isolate overflow-hidden rounded-lg bg-[#e9eff7]",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/70 before:to-transparent motion-safe:before:animate-shimmer motion-reduce:before:hidden",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
