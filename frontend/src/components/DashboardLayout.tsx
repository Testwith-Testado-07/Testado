"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import type { DashboardRole } from "@/components/dashboard/nav-config";

const SIDEBAR_ID = "dashboard-sidebar";

/** Rendered from app/dashboard/{owner,tester}/layout.tsx so the shell persists across page navigations. */
export function DashboardLayout({ children, role }: { children: React.ReactNode; role: DashboardRole }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        id={SIDEBAR_ID}
        role={role}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-col transition-[padding] duration-300 ease-out-soft",
          collapsed ? "lg:pl-[76px]" : "lg:pl-64"
        )}
      >
        <DashboardHeader
          role={role}
          sidebarId={SIDEBAR_ID}
          mobileNavOpen={mobileOpen}
          onOpenMobileNav={() => setMobileOpen(true)}
        />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
