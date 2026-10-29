"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { DASHBOARD_NAV, ROLE_LABEL, getActiveHref, type DashboardRole } from "./nav-config";

interface SidebarProps {
  id: string;
  role: DashboardRole;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
}

export function Sidebar({ id, role, collapsed, mobileOpen, onToggleCollapsed, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const items = DASHBOARD_NAV[role];
  const activeHref = getActiveHref(items, pathname);

  return (
    <>
      {mobileOpen && (
        <div aria-hidden="true" onClick={onCloseMobile} className="fixed inset-0 z-30 bg-navy/50 backdrop-blur-sm animate-in fade-in-0 lg:hidden" />
      )}

      <aside
        id={id}
        aria-label="Dashboard sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/[0.08] bg-linear-to-b from-[#06101e] to-navy-mid px-3 py-6 text-white",
          "transition-[width,translate] duration-300 ease-out-soft",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          "lg:translate-x-0 lg:shadow-none",
          collapsed ? "lg:w-[76px]" : "lg:w-64"
        )}
      >
        <div className={cn("mb-8 flex items-center justify-between px-3", collapsed && "lg:justify-center lg:px-0")}>
          <Link href="/" aria-label="Testado home" className="flex items-center">
            <Image
              src="/assets/testado-logo-transparent.png"
              alt=""
              width={1531}
              height={382}
              loading="eager"
              sizes="140px"
              className={cn("block h-[35px] w-[140px] brightness-0 invert", collapsed && "lg:hidden")}
            />
            <span
              aria-hidden="true"
              className={cn("hidden size-10 place-items-center rounded-xl bg-primary font-serif text-lg font-extrabold shadow-glow", collapsed && "lg:grid")}
            >
              T
            </span>
          </Link>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="grid size-9 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <p
          className={cn(
            "mx-3 mb-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300",
            collapsed && "lg:sr-only"
          )}
        >
          {ROLE_LABEL[role]}
        </p>

        <nav aria-label="Dashboard" className="flex-1">
          <ul className="space-y-1">
            {items.map(({ href, label, icon: Icon }) => {
              const active = href === activeHref;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onCloseMobile}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? label : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-colors duration-150 hover:bg-white/[0.06] hover:text-white",
                      active &&
                        "bg-blue-500/15 font-semibold text-white ring-1 ring-inset ring-blue-400/25 before:absolute before:-left-3 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-blue-400",
                      collapsed && "lg:justify-center lg:px-0"
                    )}
                  >
                    <Icon className={cn("size-[18px] shrink-0", active ? "text-blue-300" : "text-white/50")} aria-hidden="true" />
                    <span className={cn(collapsed && "lg:sr-only")}>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-6 hidden border-t border-white/10 pt-4 lg:block">
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls={id}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? <PanelLeftOpen className="size-[18px]" aria-hidden="true" /> : <PanelLeftClose className="size-[18px]" aria-hidden="true" />}
            <span className={cn(collapsed && "sr-only")}>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
