import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const PRICE_POINTS = [
  { price: "₹399", intent: 78 },
  { price: "₹499", intent: 64, tested: true },
  { price: "₹599", intent: 31 },
];

/** An illustrative Testado report: what a business gets back from one test. */
function SampleReport() {
  return (
    <figure className="rounded-2xl border border-border bg-card shadow-[0_8px_24px_rgba(7,23,46,0.06)]">
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-foreground">Weekly meal-kit subscription</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">Pune · ages 25–34 · 40 testers</p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">Sample report</span>
      </div>

      <div className="px-6 py-5">
        <p className="text-[13px] text-muted-foreground">Would buy at ₹499 a week</p>
        <p className="mt-1 text-[32px] leading-none font-medium text-foreground tabular-nums">64%</p>

        <div className="mt-6 space-y-3">
          {PRICE_POINTS.map(({ price, intent, tested }) => (
            <div key={price} className="grid grid-cols-[48px_1fr_40px] items-center gap-3 text-[13px]">
              <span className={tested ? "font-medium text-foreground" : "text-muted-foreground"}>{price}</span>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={tested ? "h-full rounded-full bg-primary" : "h-full rounded-full bg-[var(--border-dark)]"}
                  style={{ width: `${intent}%` }}
                />
              </div>
              <span className="text-right font-mono text-muted-foreground tabular-nums">{intent}%</span>
            </div>
          ))}
        </div>
      </div>

      <blockquote className="mx-6 border-l-2 border-[var(--border-dark)] pl-4 text-[14px] leading-relaxed text-[var(--text-body)]">
        &ldquo;I&rsquo;d try it, but ₹499 every week is more than I spend on groceries right now.&rdquo;
        <footer className="mt-1 text-xs text-muted-foreground">Tester, 29, Pune</footer>
      </blockquote>

      <div className="mt-5 flex items-center gap-2 border-t border-border px-6 py-4 text-[13px]">
        <span className="size-2 rounded-full bg-emerald-600" aria-hidden="true" />
        <span className="font-medium text-foreground">Go</span>
        <span className="text-muted-foreground">with a lower first-month price, retest at ₹449</span>
      </div>
    </figure>
  );
}

export default function Hero() {
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

        <SampleReport />
      </div>
    </section>
  );
}
