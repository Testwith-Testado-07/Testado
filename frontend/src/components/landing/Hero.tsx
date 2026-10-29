import Link from "next/link";
import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const PROOF_POINTS = ["Verified target audiences", "Free for testers", "Go / no-go clarity"];

/** Slow-drifting blurred colour fields behind a faint grid; frozen when reduced motion is on. */
function MeshBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-[8%] size-[520px] rounded-full bg-blue-400/30 blur-[110px] motion-safe:animate-mesh-a" />
      <div className="absolute -top-24 right-[4%] size-[460px] rounded-full bg-sky-300/35 blur-[110px] motion-safe:animate-mesh-b" />
      <div className="absolute top-[38%] left-[34%] size-[420px] rounded-full bg-indigo-300/25 blur-[120px] motion-safe:animate-mesh-c" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(37_99_235/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(37_99_235/0.06)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_70%_60%_at_50%_35%,black,transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />
    </div>
  );
}

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden px-4 pt-36 pb-20 text-center sm:px-10 sm:pt-44 sm:pb-24">
      <MeshBackground />

      <div className="mx-auto max-w-5xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-soft backdrop-blur-md">
          <Sparkles className="size-3.5" aria-hidden="true" />
          The two-sided market validation platform
        </p>

        <h1
          id="hero-heading"
          className="mx-auto mt-7 max-w-4xl font-serif text-[clamp(40px,7vw,80px)] font-extrabold leading-[1.05] tracking-tight"
        >
          <span className="bg-linear-to-b from-ink to-[#1e3a6e] bg-clip-text text-transparent">Don&rsquo;t just launch.</span>
          <br />
          <span className="bg-linear-to-r from-[#1d4ed8] via-[#3b82f6] to-[#60a5fa] bg-clip-text pb-2 text-transparent">
            Know the market first.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-[clamp(16px,2vw,19px)] leading-relaxed text-[var(--text-body)]">
          Founders put ideas, prototypes and products in front of the exact customers they want to win, and get
          real demand signals before they spend. On the other side, everyday testers join free and get paid for
          honest feedback. One marketplace, with conviction for builders and income for testers.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="w-full hover:scale-[1.04] active:scale-[0.98] sm:w-auto">
            <Link href="/businesses">Validate your idea</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="group w-full sm:w-auto">
            <Link href="/testers">
              Earn as a tester
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <ul className="mx-auto mt-12 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-white/70 bg-white/45 px-6 py-3.5 text-[13px] font-semibold text-[#1e3a8a] shadow-soft backdrop-blur-md">
          {PROOF_POINTS.map((point) => (
            <li key={point} className="inline-flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
