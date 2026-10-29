"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";

import { getBreadcrumbs, type DashboardRole } from "./nav-config";
import { UserMenu } from "./UserMenu";

interface DashboardHeaderProps {
  role: DashboardRole;
  sidebarId: string;
  mobileNavOpen: boolean;
  onOpenMobileNav: () => void;
}

export function DashboardHeader({ role, sidebarId, mobileNavOpen, onOpenMobileNav }: DashboardHeaderProps) {
  const crumbs = getBreadcrumbs(role, usePathname());

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-white/75 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        aria-controls={sidebarId}
        aria-expanded={mobileNavOpen}
        className="-ml-1 grid size-9 place-items-center rounded-lg text-[var(--text-body)] hover:bg-muted lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex items-center gap-1.5 text-sm">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={crumb.href + index} className={isLast ? "flex min-w-0 items-center gap-1.5" : "hidden items-center gap-1.5 sm:flex"}>
                {isLast ? (
                  <span aria-current="page" className="truncate font-semibold text-foreground">{crumb.label}</span>
                ) : (
                  <>
                    <Link href={crumb.href} className="whitespace-nowrap text-muted-foreground transition-colors hover:text-primary">
                      {crumb.label}
                    </Link>
                    <ChevronRight className="size-3.5 text-[var(--text-light)]" aria-hidden="true" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <UserMenu role={role} />
    </header>
  );
}
