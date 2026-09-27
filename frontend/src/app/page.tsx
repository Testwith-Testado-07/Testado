"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

/* ─── Data ─────────────────────────────────────────── */
const stats = [
  { value: "12,400+", label: "Products Tested" },
  { value: "$2.8M",   label: "Paid to Testers" },
  { value: "98%",     label: "Owner Satisfaction" },
  { value: "48h",     label: "Avg. First Feedback" },
];

const steps = [
  {
    num: "01",
    role: "Owner",
    roleColor: "#224F34",
    roleBg: "rgba(34,79,52,0.1)",
    title: "Create a Campaign",
    desc: "Define your product, set questions, target the right audience, and set a reward budget.",
  },
  {
    num: "02",
    role: "Tester",
    roleColor: "#2d6a45",
    roleBg: "rgba(194,239,212,0.5)",
    title: "Discover & Test",
    desc: "Browse campaigns that match your profile, test the product, and submit detailed feedback.",
  },
  {
    num: "03",
    role: "Owner",
    roleColor: "#224F34",
    roleBg: "rgba(34,79,52,0.1)",
    title: "Review & Approve",
    desc: "Read each submission, approve quality feedback, and reject spam — all in your dashboard.",
  },
  {
    num: "04",
    role: "Tester",
    roleColor: "#2d6a45",
    roleBg: "rgba(194,239,212,0.5)",
    title: "Earn Rewards",
    desc: "Approved submissions automatically credit your wallet. Withdraw anytime.",
  },
];

const features = [
  { icon: "🎯", title: "Smart Audience Matching",    desc: "Target by country, device, age range, and interests. Campaigns are only shown to matching testers." },
  { icon: "🔒", title: "Escrow-Protected Budget",    desc: "Campaign budget is locked in escrow when you publish. Funds only release on approved submissions." },
  { icon: "⚡", title: "Real-Time Dashboard",         desc: "Watch submissions roll in live. Approve, reject, and comment — all from one clean interface." },
  { icon: "💸", title: "Instant Tester Wallets",     desc: "Testers earn into an in-app wallet the moment a submission is approved. No waiting, no friction." },
  { icon: "📊", title: "Structured Feedback",        desc: "Custom survey builder with multiple question types — rating, text, multiple choice, screenshots." },
  { icon: "🛡️", title: "Enterprise-Grade Security", desc: "Row-level security, encrypted data, and role-based access control built in from day one." },
];

const testimonials = [
  { quote: "We validated our pricing model in 72 hours. No more guessing — Testado gave us real data.", name: "Sarah Chen",  role: "Product Manager, Fintrek",   initials: "SC", stars: 5 },
  { quote: "I earned $340 last month testing apps in my spare time. The campaigns are genuinely interesting.", name: "Marcus J.", role: "Tester, Lagos 🇳🇬",         initials: "MJ", stars: 5 },
  { quote: "The quality of feedback from real users blew us away. This replaced 3 tools we were using.", name: "Priya Nair", role: "Founder, Loop Health",        initials: "PN", stars: 5 },
];

const marqueeItems = [
  "Validate Products", "Real User Feedback", "Structured Insights", "Global Testers",
  "Escrow Payments", "Launch with Confidence", "No More Guessing",
];

/* ─── Helpers ──────────────────────────────────────── */
function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FFC107">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Component ────────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const G = "#224F34";   // forest green
  const MINT = "#C2EFD4";

  return (
    <div style={{ background: "#F8F9FA", color: "#101828", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>

      {/* ── NAVBAR ──────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 48px", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(248,249,250,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #e2e8e4" : "none",
        transition: "all 0.3s ease",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: G, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: "#fff",
          }}>T</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: G, letterSpacing: "-0.5px" }}>
            Testado
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {["How It Works", "Features", "Testimonials"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="nav-link"
              style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#344054", textDecoration: "none" }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/auth" className="btn-secondary" style={{ padding: "8px 20px", fontSize: 11 }}>
            Sign In
          </Link>
          <Link href="/auth?mode=register" className="btn-primary" style={{ padding: "8px 20px", fontSize: 11 }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        paddingTop: 68,
        overflow: "hidden",
      }}>
        {/* Left text column */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "80px 64px 80px 80px",
          position: "relative",
        }}>
          {/* Dot grid decoration */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            backgroundImage: `radial-gradient(circle, ${G} 1px, transparent 1px)`,
            backgroundSize: "20px 20px", opacity: 0.05, zIndex: 0,
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Eyebrow badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: MINT, border: `1px solid #9de0b8`,
              borderRadius: 999, padding: "6px 16px", marginBottom: 28,
              fontSize: 11, fontWeight: 700, color: G, letterSpacing: 1, textTransform: "uppercase",
              animation: "fadeUp 0.5s ease forwards",
            }}>
              <span>✦</span>
              <span>Now in Public Beta — Free to Join</span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(40px, 5vw, 68px)",
              fontWeight: 800, lineHeight: 1.1, color: G,
              marginBottom: 24, animation: "fadeUp 0.6s 0.1s ease both",
            }}>
              Validate Your<br />
              Product With<br />
              <em style={{ fontStyle: "italic", color: "#3a8255" }}>Real Users</em>
            </h1>

            <p style={{
              fontSize: 17, color: "#667085", lineHeight: 1.75, maxWidth: 420,
              marginBottom: 40, animation: "fadeUp 0.6s 0.2s ease both",
            }}>
              Testado connects Product Owners with a global network of paid Testers.
              Launch a campaign, collect structured feedback, and ship with confidence.
            </p>

            <div style={{
              display: "flex", gap: 12, flexWrap: "wrap",
              animation: "fadeUp 0.6s 0.3s ease both",
            }}>
              <Link href="/auth?mode=register&role=owner" className="btn-primary" style={{ fontSize: 11, padding: "14px 28px" }}>
                Start a Campaign →
              </Link>
              <Link href="/auth?mode=register&role=tester" className="btn-secondary" style={{ fontSize: 11, padding: "14px 28px" }}>
                Earn as a Tester
              </Link>
            </div>

            {/* Stats row */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0, marginTop: 56, paddingTop: 40,
              borderTop: "1px solid #e2e8e4",
              animation: "fadeUp 0.6s 0.4s ease both",
            }}>
              {stats.map((s, i) => (
                <div key={s.label} style={{
                  paddingRight: 24, borderRight: i < stats.length - 1 ? "1px solid #e2e8e4" : "none",
                  paddingLeft: i > 0 ? 24 : 0,
                }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: G }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 4, fontWeight: 600, letterSpacing: 0.5 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right image column */}
        <div style={{
          background: `linear-gradient(160deg, ${G} 0%, #1a3d27 100%)`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "80px 60px", gap: 32, position: "relative", overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", border: `1px solid rgba(194,239,212,0.15)` }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", border: `1px solid rgba(194,239,212,0.1)` }} />

          {/* Campaign preview card */}
          <div style={{
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.2)", borderRadius: 16,
            padding: "24px 28px", width: "100%", maxWidth: 360,
            animation: "fadeUp 0.6s 0.3s ease both",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: MINT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🚀</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#fff", fontSize: 15 }}>Mobile App Beta Test</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Fintrek Inc. · Active</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[["$25", "per tester"], ["50", "testers"], ["72h", "deadline"]].map(([v, l]) => (
                <div key={l} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>{v}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
              Test our onboarding flow and payment screen. Submit screenshots + written feedback.
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <div style={{ flex: 1, background: MINT, borderRadius: 6, padding: "10px", textAlign: "center", fontSize: 11, fontWeight: 700, color: G, letterSpacing: 1, textTransform: "uppercase" }}>
                Apply Now
              </div>
            </div>
          </div>

          {/* Submission preview card */}
          <div style={{
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12,
            padding: "16px 20px", width: "100%", maxWidth: 360,
            animation: "fadeUp 0.6s 0.5s ease both",
          }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 600 }}>
              Latest Submissions
            </div>
            {[
              { name: "Marcus J.", score: "4.8/5", status: "Approved", initials: "MJ" },
              { name: "Aisha R.",  score: "4.6/5", status: "Pending",  initials: "AR" },
              { name: "Tom K.",    score: "4.9/5", status: "Approved", initials: "TK" },
            ].map((s) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(194,239,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: MINT, flexShrink: 0 }}>
                  {s.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Rating: {s.score}</div>
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", borderRadius: 999, padding: "3px 10px",
                  background: s.status === "Approved" ? "rgba(194,239,212,0.2)" : "rgba(251,191,36,0.2)",
                  color: s.status === "Approved" ? MINT : "#fbbf24",
                }}>
                  {s.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE BAND ────────────────────────────── */}
      <div style={{
        background: G, padding: "18px 0", overflow: "hidden",
        borderTop: "1px solid #1a3d27", borderBottom: "1px solid #1a3d27",
      }}>
        <div className="marquee-track" style={{ display: "flex", gap: 48, width: "max-content", alignItems: "center" }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 16, color: "#fff", letterSpacing: 0.5 }}>
                {item}
              </span>
              <span style={{ color: MINT, fontSize: 18 }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span className="section-label">How It Works</span>
            <div className="divider" />
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: G, marginTop: 8,
            }}>
              Four Steps to <em style={{ fontStyle: "italic" }}>Validated Insights</em>
            </h2>
            <p style={{ fontSize: 16, color: "#667085", marginTop: 16, maxWidth: 520, margin: "16px auto 0" }}>
              A simple, transparent flow that works for both Product Owners and Testers.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="card"
                style={{ position: "relative", overflow: "hidden", padding: 32 }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = G; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8e4"; }}
              >
                {/* Big bg number */}
                <div style={{
                  position: "absolute", top: -10, right: 12,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 96, fontWeight: 800, color: "rgba(34,79,52,0.05)", lineHeight: 1, userSelect: "none",
                }}>
                  {step.num}
                </div>

                {/* Role chip */}
                <div style={{
                  display: "inline-flex", padding: "4px 14px",
                  background: step.roleBg, color: step.roleColor,
                  borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                  textTransform: "uppercase", marginBottom: 20,
                }}>
                  {step.role}
                </div>

                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: G, marginBottom: 12 }}>
                  {step.num}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#101828", marginBottom: 12 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: "#667085", lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────── */}
      <section id="features" style={{ padding: "120px 80px", background: "#F8F9FA" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span className="section-label">Features</span>
            <div className="divider" />
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: G, marginTop: 8,
            }}>
              Everything You Need,<br /><em style={{ fontStyle: "italic" }}>Nothing You Don&apos;t</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {features.map((f) => (
              <div
                key={f.title}
                className="card"
                style={{ display: "flex", flexDirection: "column", padding: 32 }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = G; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#e2e8e4"; }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#101828", marginBottom: 12 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: "#667085", lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ────────────────────────── */}
      <div style={{ background: G, padding: "48px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
          {[
            { value: "3,000+", label: "Companies Onboarded" },
            { value: "92,000+", label: "Feedback Submissions" },
            { value: "4.9 / 5", label: "Average Rating" },
            { value: "40+", label: "Countries Reached" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center", flex: "1 1 160px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS ────────────────────────────── */}
      <section id="testimonials" style={{ padding: "120px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <span className="section-label">Testimonials</span>
            <div className="divider" />
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: G, marginTop: 8,
            }}>
              Loved by Owners<br /><em style={{ fontStyle: "italic" }}>and Testers Alike</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="card"
                style={{
                  display: "flex", flexDirection: "column", padding: 36,
                  background: i === activeTestimonial ? G : "#fff",
                  borderColor: i === activeTestimonial ? G : "#e2e8e4",
                  cursor: "pointer", transition: "all 0.3s ease",
                }}
                onClick={() => setActiveTestimonial(i)}
                onMouseEnter={e => { if (i !== activeTestimonial) { e.currentTarget.style.borderColor = G; } }}
                onMouseLeave={e => { if (i !== activeTestimonial) { e.currentTarget.style.borderColor = "#e2e8e4"; } }}
              >
                <StarRating count={t.stars} />
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18, lineHeight: 1.65, flex: 1, marginBottom: 24,
                  color: i === activeTestimonial ? "#fff" : "#101828",
                  fontStyle: "italic",
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: i === activeTestimonial ? "rgba(194,239,212,0.25)" : MINT,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14,
                    color: i === activeTestimonial ? "#fff" : G, flexShrink: 0,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: i === activeTestimonial ? "#fff" : "#101828" }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: 12, color: i === activeTestimonial ? "rgba(255,255,255,0.65)" : "#667085" }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section style={{
        padding: "120px 80px", textAlign: "center",
        background: `linear-gradient(135deg, ${G} 0%, #1a3d27 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative rings */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", border: "1px solid rgba(194,239,212,0.1)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(194,239,212,0.15)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <span style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(194,239,212,0.7)", marginBottom: 20 }}>
            Ready to Start?
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, color: "#fff",
            lineHeight: 1.2, marginBottom: 20,
          }}>
            Stop Guessing.<br /><em style={{ fontStyle: "italic", color: MINT }}>Start Validating.</em>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", marginBottom: 44, lineHeight: 1.75 }}>
            Join 3,000+ companies using Testado to validate their products with real users before launch.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth?mode=register&role=owner" className="btn-mint" style={{ fontSize: 11, padding: "14px 32px" }}>
              Start Free as an Owner →
            </Link>
            <Link href="/auth?mode=register&role=tester" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", color: "#fff",
              border: "2px solid rgba(255,255,255,0.4)",
              borderRadius: 6, padding: "14px 32px", fontSize: 11,
              fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
              textDecoration: "none", transition: "all 0.25s ease",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)"; }}
            >
              Join as a Tester
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer style={{
        background: "#101828",
        padding: "48px 80px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: G,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 16, color: "#fff",
          }}>T</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>
            Testado
          </span>
          <span style={{ fontSize: 12, color: "#667085", marginLeft: 8 }}>© 2026</span>
        </div>

        <div style={{ display: "flex", gap: 32, fontSize: 12, color: "#667085" }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <Link key={l} href="#" style={{
              color: "inherit", textDecoration: "none", fontWeight: 600, letterSpacing: 0.5,
              transition: "color 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = MINT; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#667085"; }}
            >
              {l}
            </Link>
          ))}
        </div>

        <div style={{ fontSize: 12, color: "#667085" }}>
          Built for builders. Powered by real feedback.
        </div>
      </footer>
    </div>
  );
}
