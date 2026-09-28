"use client";

import Link from "next/link";
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
        background: scrolled ? "rgba(248, 249, 250, 0.96)" : "rgba(248, 249, 250, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid #e2e8e4" : "1px solid transparent",
        transition: "all 0.3s ease",
        padding: "16px 40px",
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
          <img
            src="/assets/testado-logo.png"
            alt="Testado"
            style={{
              height: 32,
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden md:flex">
          {navLinks.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link"
                style={{
                  color: isActive ? "var(--green-dark)" : "var(--text-body)",
                  fontWeight: isActive ? 800 : 700,
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hidden md:flex">
          <Link
            href="/auth"
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: "var(--green-dark)",
              textDecoration: "none",
              padding: "10px 16px",
            }}
          >
            Sign In
          </Link>
          <Link href="/businesses#business-form" className="btn-primary" style={{ padding: "10px 22px", fontSize: 11 }}>
            Start a Test
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
            color: "var(--green-dark)",
            cursor: "pointer",
            padding: 4,
          }}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            background: "#ffffff",
            borderTop: "1px solid #e2e8e4",
            padding: "20px 24px",
            marginTop: 16,
            borderRadius: 12,
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
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
                color: "var(--text-primary)",
                textDecoration: "none",
                padding: "8px 0",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ borderTop: "1px solid #f1f4f2", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <Link
              href="/businesses#business-form"
              className="btn-primary"
              onClick={() => setMobileOpen(false)}
              style={{ textAlign: "center", justifyContent: "center" }}
            >
              Start a Test
            </Link>
            <Link
              href="/auth"
              onClick={() => setMobileOpen(false)}
              style={{
                textAlign: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--green-dark)",
                textTransform: "uppercase",
                padding: "8px 0",
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
