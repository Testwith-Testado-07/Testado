import {
  CirclePlus,
  ClipboardList,
  Compass,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type DashboardRole = "owner" | "tester";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const DASHBOARD_NAV: Record<DashboardRole, NavItem[]> = {
  owner: [
    { href: "/dashboard/owner", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/owner/campaigns", label: "Campaigns", icon: Megaphone },
    { href: "/dashboard/owner/campaigns/new", label: "New Campaign", icon: CirclePlus },
    { href: "/dashboard/owner/billing", label: "Billing", icon: CreditCard },
  ],
  tester: [
    { href: "/dashboard/tester", label: "Discover", icon: Compass },
    { href: "/dashboard/tester/submissions", label: "My Applications", icon: ClipboardList },
    { href: "/dashboard/tester/wallet", label: "Wallet", icon: Wallet },
  ],
};

export const ROLE_LABEL: Record<DashboardRole, string> = {
  owner: "Product Owner",
  tester: "Tester",
};

/** The nav item whose href is the longest prefix of the path, so /campaigns/new doesn't also light up /campaigns. */
export function getActiveHref(items: NavItem[], pathname: string) {
  return items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

export interface Breadcrumb {
  label: string;
  href: string;
}

export function getBreadcrumbs(role: DashboardRole, pathname: string): Breadcrumb[] {
  const rootHref = `/dashboard/${role}`;
  const items = DASHBOARD_NAV[role];
  const crumbs: Breadcrumb[] = [{ label: role === "owner" ? "Owner workspace" : "Tester workspace", href: rootHref }];

  const segments = pathname.startsWith(rootHref) ? pathname.slice(rootHref.length).split("/").filter(Boolean) : [];
  if (segments.length === 0) {
    crumbs.push({ label: items[0].label, href: rootHref });
    return crumbs;
  }

  let href = rootHref;
  for (const segment of segments) {
    href += `/${segment}`;
    const label = items.find((item) => item.href === href)?.label
      ?? segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    crumbs.push({ label, href });
  }
  return crumbs;
}
