"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

interface SidebarProps {
  role: "owner" | "tester";
  navItems: NavItem[];
}

interface UserProfile {
  name: string;
  email: string;
  initials: string;
}

function useCurrentUser(): UserProfile {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Loading...",
    email: "",
    initials: "?",
  });

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Try profiles table first for full_name, fall back to user_metadata
      let fullName = user.user_metadata?.full_name || user.user_metadata?.name;

      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profileData?.full_name) {
          fullName = profileData.full_name;
        }
      } catch (err) {
        console.warn("Could not query profiles:", err);
      }

      if (!fullName) {
        fullName = user.email?.split("@")[0] || "User";
      }

      const email = user.email || "";
      const initials = fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      setProfile({ name: fullName, email, initials });
    })();
  }, []);

  return profile;
}

export function Sidebar({ role, navItems }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

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
        <span style={{ display: "inline-flex", flexShrink: 0 }}>
          <Image
            src="/assets/testado-logo-transparent.png"
            alt="Testado - Real People. Real Insights. Real Problems."
            width={1531}
            height={382}
            loading="eager"
            sizes="150px"
            style={{ width: 150, height: 37, display: "block", filter: "brightness(0) invert(1)" }}
          />
        </span>
      </Link>

      {/* Role pill */}
      <div
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 12px", borderRadius: 999, marginBottom: 28,
          fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8,
          background: role === "owner" ? "rgba(37, 99, 235, 0.2)" : "rgba(120, 168, 255, 0.15)",
          color: role === "owner" ? "#78a8ff" : "#93c5fd",
          border: `1px solid ${role === "owner" ? "rgba(37, 99, 235, 0.4)" : "rgba(120, 168, 255, 0.3)"}`,
        }}
      >
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
      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: 20, marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 16 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: "rgba(37, 99, 235, 0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 13,
              color: "#78a8ff",
              border: "1px solid rgba(120, 168, 255, 0.3)",
            }}
          >
            {user.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.email}
            </div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="sidebar-link"
          style={{ color: "rgba(255,107,107,0.9)", background: "none", border: "none", width: "100%", cursor: "pointer", textAlign: "left" }}
        >
          Sign Out
        </button>
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
