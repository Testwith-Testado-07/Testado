import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Resting fields sit on a faint blue-white so they read as "fillable"; on focus the
 * background brightens to white and a soft 4px brand ring fades in around the border.
 * The legacy `.input` class in globals.css mirrors these styles.
 */
const fieldStyles =
  "w-full min-w-0 rounded-[10px] border-[1.5px] border-input bg-[#f8fbff] px-4 text-[15px] text-foreground shadow-[0_1px_2px_rgb(7_23_46/0.03)] outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-[var(--text-light)] hover:border-[var(--border-dark)] focus-visible:border-ring focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/15";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} data-slot="input" className={cn(fieldStyles, "h-12", className)} {...props} />;
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(fieldStyles, "min-h-28 resize-y py-3 leading-relaxed", className)} {...props} />;
}

/** Native <select> with the browser chrome removed and a matching chevron. */
function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select data-slot="select" className={cn(fieldStyles, "h-12 cursor-pointer appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
    </div>
  );
}

export { Input, Textarea, NativeSelect };
