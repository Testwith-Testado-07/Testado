"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "testado-privacy-consent";
// Matches the policy's "Last updated" date; change it when the policy changes to ask everyone again
const POLICY_VERSION = "2026-11-16";

type Choice = "accepted" | "declined" | null;

const listeners = new Set<() => void>();
// Fallback for browsers that block storage (some private modes), so a choice still holds for the visit
let memoryChoice: Choice = null;

function readChoice(): Choice {
  try {
    const [choice, version] = (localStorage.getItem(STORAGE_KEY) ?? "").split(":");
    if (version === POLICY_VERSION && (choice === "accepted" || choice === "declined")) return choice;
  } catch {
    // storage unavailable
  }
  return memoryChoice;
}

function saveChoice(choice: Exclude<Choice, null>) {
  memoryChoice = choice;
  try {
    localStorage.setItem(STORAGE_KEY, `${choice}:${POLICY_VERSION}`);
  } catch {
    // storage unavailable; memoryChoice covers this visit
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/**
 * Requires visitors to accept the privacy policy before using the site. Until they accept, the page
 * behind the prompt is inert; if they decline, access stays blocked. The policy page itself stays
 * readable so people can review it before deciding.
 */
export function ConsentGate({ children }: { children: React.ReactNode }) {
  // "unknown" on the server and during hydration, so server HTML never includes the prompt
  const choice = useSyncExternalStore<Choice | "unknown">(subscribe, readChoice, () => "unknown");
  const onPolicyPage = usePathname() === "/privacy";

  const undecided = choice === null;
  const declined = choice === "declined";
  const blocked = (undecided || declined) && !onPolicyPage;

  return (
    <>
      <div inert={blocked}>{children}</div>

      {blocked && <div aria-hidden="true" className="fixed inset-0 z-[110] bg-navy/40 backdrop-blur-[2px] animate-in fade-in-0" />}

      {(undecided || (declined && onPolicyPage)) && (
        <section
          role="dialog"
          aria-modal={blocked}
          aria-labelledby="consent-title"
          className="fixed inset-x-0 bottom-0 z-[120] border-t border-border bg-card shadow-[0_-8px_24px_rgba(7,23,46,0.08)] animate-in slide-in-from-bottom-4 fade-in-0 duration-300"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-10 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="max-w-2xl">
              <h2 id="consent-title" className="text-[15px] font-medium text-foreground">
                Your privacy on Testado
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                We use essential cookies and handle your information as described in our{" "}
                <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                  Privacy policy
                </Link>
                . You need to accept it to use Testado.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Button type="button" variant="outline" onClick={() => saveChoice("declined")}>
                Decline
              </Button>
              <Button type="button" onClick={() => saveChoice("accepted")}>
                Accept
              </Button>
            </div>
          </div>
        </section>
      )}

      {declined && !onPolicyPage && (
        <section
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="consent-declined-title"
          className="fixed inset-0 z-[120] grid place-items-center bg-background px-4"
        >
          <div className="max-w-md text-center">
            <h2 id="consent-declined-title" className="font-serif text-3xl font-medium text-ink">
              Testado needs your consent
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-body)]">
              You declined the privacy policy, so the website can&rsquo;t be used. You can close this tab, or read the
              policy and accept it to continue.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="outline">
                <Link href="/privacy">Read the privacy policy</Link>
              </Button>
              <Button type="button" onClick={() => saveChoice("accepted")}>
                Accept and continue
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
