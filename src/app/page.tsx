"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const stats = [
  { value: "12,400+", label: "Products Tested" },
  { value: "$2.8M", label: "Paid to Testers" },
  { value: "98%", label: "Owner Satisfaction" },
  { value: "48h", label: "Avg. First Feedback" },
];

const steps = [
  {
    num: "01",
    role: "Owner",
    color: "#6c63ff",
    title: "Create a Campaign",
    desc: "Define your product, set questions, target the right audience, and set a reward budget.",
  },
  {
    num: "02",
    role: "Tester",
    color: "#00d4aa",
    title: "Discover & Test",
    desc: "Browse campaigns that match your profile, test the product, and submit detailed feedback.",
  },
  {
    num: "03",
    role: "Owner",
    color: "#6c63ff",
    title: "Review & Approve",
    desc: "Read each submission, approve quality feedback, and reject spam — all in your dashboard.",
  },
  {
    num: "04",
    role: "Tester",
    color: "#00d4aa",
    title: "Earn Rewards",
    desc: "Approved submissions automatically credit your wallet. Withdraw anytime.",
  },
];

const features = [
  {
    icon: "🎯",
    title: "Smart Audience Matching",
    desc: "Target by country, device, age range, and interests. Campaigns are only shown to matching testers.",
    color: "#6c63ff",
  },
  {
    icon: "🔒",
    title: "Escrow-Protected Budget",
    desc: "Campaign budget is locked in escrow when you publish. Funds only release on approved submissions.",
    color: "#00d4aa",
  },
  {
    icon: "⚡",
    title: "Real-Time Dashboard",
    desc: "Watch submissions roll in live. Approve, reject, and comment — all from one clean interface.",
    color: "#ff6b9d",
  },
  {
    icon: "💸",
    title: "Instant Tester Wallets",
    desc: "Testers earn into an in-app wallet the moment a submission is approved. No waiting, no friction.",
    color: "#fbbf24",
  },
  {
    icon: "📊",
    title: "Structured Feedback",
    desc: "Custom survey builder with multiple question types — rating, text, multiple choice, screenshots.",
    color: "#a78bfa",
  },
  {
    icon: "🛡️",
    title: "Enterprise-Grade Security",
    desc: "Row-level security, encrypted data, and role-based access control built in from day one.",
    color: "#00d4aa",
  },
];

const testimonials = [
  {
    quote: "We validated our pricing model in 72 hours. No more guessing — Testado gave us data.",
    name: "Sarah Chen",
    role: "Product Manager, Fintrek",
    avatar: "SC",
    color: "#6c63ff",
  },
  {
    quote: "I earned $340 last month testing apps in my spare time. The campaigns are genuinely interesting.",
    name: "Marcus J.",
    role: "Tester, Lagos 🇳🇬",
    avatar: "MJ",
    color: "#00d4aa",
  },
  {
    quote: "The quality of feedback from real users blew us away. This replaced 3 tools we were using.",
    name: "Priya Nair",
    role: "Founder, Loop Health",
    avatar: "PN",
    color: "#ff6b9d",
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh", overflow: "hidden" }}>
      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(7,8,15,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6c63ff, #00d4aa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 16,
              color: "white",
            }}
          >
            T
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: "var(--foreground)" }}>
            Testado
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/auth" className="btn-secondary" style={{ padding: "9px 20px", fontSize: 14 }}>
            Sign In
          </Link>
          <Link href="/auth?mode=register" className="btn-primary" style={{ padding: "9px 20px", fontSize: 14 }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
          position: "relative",
        }}
      >
        {/* Background orbs */}
        <div
          className="orb"
          style={{ width: 600, height: 600, background: "rgba(108,99,255,0.15)", top: -100, left: -150 }}
        />
        <div
          className="orb"
          style={{ width: 400, height: 400, background: "rgba(0,212,170,0.1)", bottom: 0, right: -100 }}
        />
        <div
          className="orb"
          style={{ width: 300, height: 300, background: "rgba(255,107,157,0.08)", top: "30%", right: "5%" }}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(108,99,255,0.12)",
            border: "1px solid rgba(108,99,255,0.3)",
            borderRadius: 999,
            padding: "6px 16px",
            marginBottom: 32,
            fontSize: 13,
            fontWeight: 600,
            color: "#a78bfa",
            animation: "fadeUp 0.5s ease forwards",
          }}
        >
          <span>✦</span>
          <span>Now in Public Beta — Free to Join</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: 28,
            maxWidth: 900,
            animation: "fadeUp 0.6s 0.1s ease both",
          }}
        >
          Validate Your Product{" "}
          <span className="gradient-text">With Real Users,</span>
          <br />
          Not Assumptions
        </h1>

        <p
          style={{
            fontSize: "clamp(17px, 2vw, 21px)",
            color: "var(--muted)",
            maxWidth: 620,
            lineHeight: 1.7,
            marginBottom: 44,
            animation: "fadeUp 0.6s 0.2s ease both",
          }}
        >
          Testado connects Product Owners with a global network of paid Testers.
          Launch a campaign, collect structured feedback, and ship with confidence.
        </p>

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeUp 0.6s 0.3s ease both",
          }}
        >
          <Link href="/auth?mode=register&role=owner" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
            Start a Campaign →
          </Link>
          <Link href="/auth?mode=register&role=tester" className="btn-teal" style={{ fontSize: 16, padding: "14px 32px" }}>
            Earn as a Tester
          </Link>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 48,
            marginTop: 80,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeUp 0.6s 0.4s ease both",
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--foreground)" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 24px", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ color: "#6c63ff", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
              How It Works
            </p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800 }}>
              Four steps to{" "}
              <span className="gradient-text-purple">validated insights</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
            }}
          >
            {steps.map((step) => (
              <div
                key={step.num}
                className="card"
                style={{ position: "relative", overflow: "hidden", transition: "transform 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -10,
                    fontSize: 80,
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.03)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    padding: "4px 12px",
                    background: step.color + "22",
                    color: step.color,
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 16,
                  }}
                >
                  {step.role}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: step.color, marginBottom: 8 }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "100px 24px", background: "rgba(14,16,24,0.5)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ color: "#00d4aa", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
              Features
            </p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800 }}>
              Everything you need,{" "}
              <span className="gradient-text">nothing you don&apos;t</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                className="card"
                style={{ transition: "all 0.2s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = f.color + "55";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--card-border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: f.color + "22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    marginBottom: 20,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ color: "#ff6b9d", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>
              Testimonials
            </p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800 }}>
              Loved by Owners <span className="gradient-text">and Testers</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {testimonials.map((t) => (
              <div key={t.name} className="card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ fontSize: 32, color: t.color }}>❝</div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--foreground)", flex: 1 }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: t.color + "33",
                      border: `2px solid ${t.color}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 14,
                      color: t.color,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "100px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="orb"
          style={{ width: 500, height: 500, background: "rgba(108,99,255,0.2)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, marginBottom: 24 }}>
            Ready to stop guessing?
          </h2>
          <p style={{ fontSize: 18, color: "var(--muted)", marginBottom: 40, lineHeight: 1.7 }}>
            Join 3,000+ companies using Testado to validate their products with real users before launch.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth?mode=register&role=owner" className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }}>
              Start Free as an Owner →
            </Link>
            <Link href="/auth?mode=register&role=tester" className="btn-secondary" style={{ fontSize: 16, padding: "14px 36px" }}>
              Join as a Tester
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid var(--card-border)",
          padding: "40px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6c63ff, #00d4aa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 14,
              color: "white",
            }}
          >
            T
          </div>
          <span style={{ fontWeight: 700, color: "var(--muted)" }}>Testado © 2026</span>
        </div>
        <div style={{ display: "flex", gap: 24, color: "var(--muted)", fontSize: 14 }}>
          <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy</Link>
          <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms</Link>
          <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Contact</Link>
        </div>
      </footer>
    </div>
  );
}
