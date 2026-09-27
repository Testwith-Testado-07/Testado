"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

interface SidebarProps {
  role: "owner" | "tester";
  navItems: NavItem[];
}

export function Sidebar({ role, navItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex", alignItems: "center", gap: 10,
          textDecoration: "none", marginBottom: 36,
        }}
      >
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6c63ff, #00d4aa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 16, color: "white", flexShrink: 0,
          }}
        >T</div>
        <span style={{ fontWeight: 800, fontSize: 18, color: "var(--foreground)" }}>Testado</span>
      </Link>

      {/* Role pill */}
      <div
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 12px", borderRadius: 999, marginBottom: 28,
          fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8,
          background: role === "owner" ? "rgba(108,99,255,0.15)" : "rgba(0,212,170,0.15)",
          color: role === "owner" ? "#a78bfa" : "#00d4aa",
          border: `1px solid ${role === "owner" ? "rgba(108,99,255,0.3)" : "rgba(0,212,170,0.3)"}`,
        }}
      >
        <span>{role === "owner" ? "🏢" : "🧪"}</span>
        {role === "owner" ? "Product Owner" : "Tester"}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href));
          const exactActive = item.href === `/dashboard/${role}` && pathname === item.href;
          const active = exactActive || (item.href !== `/dashboard/${role}` && isActive);
          return (
            <Link key={item.href} href={item.href} className={`sidebar-link${active ? " active" : ""}`}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: 20, marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 16 }}>
          <div
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: role === "owner" ? "rgba(108,99,255,0.25)" : "rgba(0,212,170,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 13,
              color: role === "owner" ? "#a78bfa" : "#00d4aa",
            }}
          >
            {role === "owner" ? "AJ" : "MK"}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{role === "owner" ? "Alex Johnson" : "Maria Kim"}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{role === "owner" ? "alex@acme.com" : "maria@email.com"}</div>
          </div>
        </div>
        <Link href="/auth" className="sidebar-link" style={{ color: "#ff6b9d" }}>
          <span>🚪</span> Sign Out
        </Link>
      </div>
    </aside>
  );
}

export function DashboardLayout({
  children,
  role,
  navItems,
}: {
  children: React.ReactNode;
  role: "owner" | "tester";
  navItems: NavItem[];
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role={role} navItems={navItems} />
      <main className="main-content">{children}</main>
    </div>
  );
}
