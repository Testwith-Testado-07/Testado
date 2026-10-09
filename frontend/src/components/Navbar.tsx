"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "What We Do", href: "/#what-we-do" },
    { label: "Why Testado", href: "/why-testado" },
    { label: "For Businesses", href: "/businesses" },
    { label: "For Testers", href: "/testers" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(244, 248, 253, 0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: scrolled ? "1px solid #dbe5f2" : "1px solid rgba(219, 229, 242, 0.6)",
        transition: "all 0.3s ease",
        padding: "16px 36px",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Image
            src="/assets/testado-logo-transparent.png"
            alt="Testado"
            width={1531}
            height={382}
            priority
            sizes="160px"
            style={{ width: 160, height: 40, objectFit: "contain" }}
          />
        </Link>

        {/* Desktop Links */}
        <div style={{ gap: 20, alignItems: "center" }} className="hidden lg:flex items-center">
          {navLinks.map((l) => {
            const isActive = pathname === l.href;
            const isTester = l.href === "/testers";
            const isBusiness = l.href === "/businesses";
            return (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link"
                style={{
                  color: isActive ? "#2563eb" : isBusiness ? "#07172e" : isTester ? "#1d4ed8" : "#334155",
                  fontWeight: isActive ? 800 : isBusiness || isTester ? 700 : 600,
                  fontSize: 13,
                  padding: "6px 10px",
                  borderRadius: 8,
                  background: isTester
                    ? "rgba(37, 99, 235, 0.06)"
                    : isBusiness
                    ? "rgba(7, 23, 46, 0.04)"
                    : "transparent",
                  border: isTester
                    ? "1px solid rgba(37, 99, 235, 0.15)"
                    : isBusiness
                    ? "1px solid rgba(7, 23, 46, 0.1)"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div style={{ alignItems: "center", gap: 12 }} className="hidden md:flex">
          <Link
            href="/auth"
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: "#0a1728",
              textDecoration: "none",
              padding: "10px 16px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#2563eb"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#0a1728"; }}
          >
            Sign In
          </Link>
          <Link href="/businesses#business-form" className="btn-primary" style={{ padding: "10px 20px", fontSize: 13 }}>
            Get Market Insights
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          style={{
            background: "none",
            border: "none",
            fontSize: 24,
            color: "#0a1728",
            cursor: "pointer",
            padding: 4,
          }}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            background: "#ffffff",
            borderTop: "1px solid #dbe5f2",
            padding: "20px 24px",
            marginTop: 16,
            borderRadius: 16,
            boxShadow: "0 14px 35px rgba(6, 16, 29, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: pathname === l.href ? "#2563eb" : "#081426",
                textDecoration: "none",
                padding: "8px 0",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ borderTop: "1px solid #edf3fb", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <Link
              href="/businesses#business-form"
              className="btn-primary"
              onClick={() => setMobileOpen(false)}
              style={{ textAlign: "center", justifyContent: "center" }}
            >
              Request Market Insights
            </Link>
            <Link
              href="/auth"
              onClick={() => setMobileOpen(false)}
              style={{
                textAlign: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#2563eb",
                padding: "8px 0",
                textDecoration: "none",
              }}
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
