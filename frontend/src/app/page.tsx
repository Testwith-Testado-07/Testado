"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const BLUE_DARK = "#06101d";      // Dark navy for contrast sections & cards
  const BLUE_HEADINGS = "#07172e";  // Darker blue for main headings
  const BLUE_PRIMARY = "#2563eb";   // Vibrant action blue
  const BLUE_ACCENT = "#78a8ff";
  const BG_LIGHT_BLUE = "#f4f8fd";  // Very lightish blue section background
  const BG_ALT_BLUE = "#eaf2fb";    // Soft alternating lightish blue

  const steps = [
    {
      num: "01",
      title: "Define the Market Objective",
      desc: "We pinpoint what you need to validate — target customer profile, pricing tolerance, core value proposition, and critical launch risks.",
    },
    {
      num: "02",
      title: "Target Your Verified Audience",
      desc: "We identify exact target demographic participants so the market insights reflect genuine potential buyers, not random crowds.",
    },
    {
      num: "03",
      title: "Capture Behavioral Market Signals",
      desc: "Participants interact with your product, service, or concept to reveal actual usability, buying hesitation, and core appeal.",
    },
    {
      num: "04",
      title: "Extract Actionable Market Insights",
      desc: "We synthesize user behavior into structured market intelligence, recurring objections, demand validation, and go/no-go launch metrics.",
    },
  ];

  return (
    <div style={{ background: BG_LIGHT_BLUE, color: "#081426", fontFamily: "var(--font-inter), 'Inter', sans-serif", overflowX: "hidden" }}>
      <Navbar />

      <main>
        {/* ── HERO ─────────────────────────────────────── */}
        <section
          style={{
            padding: "160px 40px 90px",
            maxWidth: 1240,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <span className="section-label">Targeted Consumer Testing & Market Intelligence</span>
          <div className="divider" />

          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(42px, 6vw, 76px)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: BLUE_HEADINGS,
              maxWidth: 980,
              margin: "24px auto 20px",
              letterSpacing: "-0.5px",
            }}
          >
            Don’t Just Launch.<br />
            <span style={{ color: BLUE_PRIMARY }}>Know the Market Before You Bet on It.</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              color: "#475569",
              maxWidth: 820,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Testado helps businesses gain validated <strong>market insights</strong> from their exact target demographic —
            evaluating customer demand, spotting friction, and de-risking launches before committing heavy capital.
          </p>

          {/* Dual Choice Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 26,
              maxWidth: 1060,
              margin: "0 auto 36px",
              textAlign: "left",
            }}
          >
            {/* For Testers Card (Emphasizing Earn for FREE) */}
            <div
              className="card"
              style={{
                padding: "38px 34px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "linear-gradient(145deg, #ffffff, #f0f7ff)",
                border: "1.5px solid #bfdbfe",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 18,
                  background: "#eff6ff",
                  color: BLUE_PRIMARY,
                  border: "1px solid #93c5fd",
                  borderRadius: 999,
                  padding: "4px 12px",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                100% Free to Join
              </div>

              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: BLUE_PRIMARY,
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  FOR EVERYDAY TESTERS
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: BLUE_HEADINGS,
                    marginBottom: 14,
                  }}
                >
                  Earn by Testing for FREE
                </h3>
                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
                  Join Testado completely <strong>free with zero fees or investments</strong>. Test early-stage apps, websites, and products in your free time, share your genuine reactions, and <strong>earn cash payouts & rewards</strong>.
                </p>
                <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#1e3a8a", fontWeight: 600, marginBottom: 24, flexWrap: "wrap" }}>
                  <span>✓ Zero Registration Fee</span>
                  <span>✓ Direct Payouts</span>
                  <span>✓ No Sales/Pitching</span>
                </div>
              </div>
              <Link href="/testers" className="btn-primary" style={{ alignSelf: "flex-start" }}>
                Join Free & Start Earning →
              </Link>
            </div>

            {/* For Businesses Card (Emphasizing Market Insights) */}
            <div
              className="card"
              style={{
                padding: "38px 34px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "linear-gradient(145deg, #ffffff, #f4f8fd)",
                border: "1.5px solid #2563eb",
                boxShadow: "0 12px 35px rgba(37, 99, 235, 0.12)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 18,
                  background: "#1d4ed8",
                  color: "#ffffff",
                  borderRadius: 999,
                  padding: "4px 12px",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Market Intelligence
              </div>

              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: BLUE_PRIMARY,
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  FOR BUSINESSES & FOUNDERS
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: BLUE_HEADINGS,
                    marginBottom: 14,
                  }}
                >
                  De-Risk with Market Insights
                </h3>
                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
                  Vague opinions won&apos;t save a failed launch. We deliver <strong>deep market insights</strong> —
                  measuring customer purchase intent, pricing sensitivity, value clarity, and adoption barriers before you burn your marketing budget.
                </p>
                <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#1e3a8a", fontWeight: 600, marginBottom: 24, flexWrap: "wrap" }}>
                  <span>✓ Purchase Intent Data</span>
                  <span>✓ Friction & Objection Analysis</span>
                  <span>✓ Go/No-Go Clarity</span>
                </div>
              </div>
              <Link href="/businesses" className="btn-primary" style={{ alignSelf: "flex-start", background: BLUE_DARK, borderColor: BLUE_DARK }}>
                Validate Your Market →
              </Link>
            </div>
          </div>

          <p style={{ fontSize: 13, color: "#64748b" }}>
            Two paths. One purpose: high-conviction decisions built with validated consumer intelligence.
          </p>

          {/* High-priority Clickable Instagram Callout Strip (Navy Blue gradient) */}
          <div style={{ maxWidth: 1060, margin: "36px auto 0" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #06101d 0%, #0d2244 100%)",
                color: "#ffffff",
                borderRadius: 20,
                padding: "24px 34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 20,
                textAlign: "left",
                boxShadow: "0 14px 40px rgba(6, 16, 29, 0.25)",
                border: "1px solid rgba(120, 168, 255, 0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #5b72ff, #ff5f9d, #ffc857)",
                    color: "#ffffff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 22,
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  ◎
                </div>
                <div>
                  <strong style={{ fontSize: 16, display: "block", color: "#ffffff" }}>
                    Want to talk before you submit a test request?
                  </strong>
                  <p style={{ margin: "2px 0 0", fontSize: 14, color: "#cbd5e1" }}>
                    Message our team directly on Instagram: @testwithtestado
                  </p>
                </div>
              </div>

              <a
                href="https://www.instagram.com/testwithtestado/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  padding: "11px 24px",
                  borderRadius: 999,
                  background: "rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  textDecoration: "none",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "background 0.2s",
                }}
              >
                Open Instagram ↗
              </a>
            </div>
          </div>
        </section>

        {/* ── WHAT WE DO (Lightish Blue Section) ───────────────── */}
        <section id="what-we-do" style={{ padding: "100px 40px", background: "#ffffff", borderTop: "1px solid #e2eaf5", borderBottom: "1px solid #e2eaf5" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span className="section-label">What We Do</span>
              <div className="divider" />
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 800,
                  color: BLUE_HEADINGS,
                  marginTop: 8,
                  lineHeight: 1.2,
                }}
              >
                Transforming Real Consumer Behavior into<br />
                <span style={{ color: BLUE_PRIMARY }}>Actionable Market Insights</span>
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 32,
              }}
            >
              <div className="card" style={{ padding: 36, background: "linear-gradient(145deg, #ffffff, #f4f8fd)", border: "1px solid #dbe5f2" }}>
                <div style={{ display: "inline-block", padding: "6px 12px", background: "#eff6ff", color: BLUE_PRIMARY, borderRadius: 8, fontSize: 11, fontWeight: 800, marginBottom: 16 }}>
                  BUSINESS INTELLIGENCE
                </div>
                <h4 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 23, color: BLUE_HEADINGS, marginBottom: 14 }}>
                  For Businesses & Product Leaders
                </h4>
                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.7 }}>
                  Companies don&apos;t fail because of poor execution; they fail because they build things the market doesn&apos;t want.
                  Testado connects your concept, MVP, or product with verified target prospects. We analyze their reactions to identify
                  <strong> price tolerance, value clarity, objections, and buying intent</strong>, giving you concrete market insights to steer critical decisions.
                </p>
              </div>

              <div className="card" style={{ padding: 36, background: "linear-gradient(145deg, #ffffff, #f0f7ff)", border: "1px solid #bfdbfe" }}>
                <div style={{ display: "inline-block", padding: "6px 12px", background: "#eff6ff", color: BLUE_PRIMARY, borderRadius: 8, fontSize: 11, fontWeight: 800, marginBottom: 16 }}>
                  100% FREE PARTICIPATION
                </div>
                <h4 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 23, color: BLUE_HEADINGS, marginBottom: 14 }}>
                  For Testers Earning Flexible Income
                </h4>
                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.7 }}>
                  Anyone 18+ can become a Testado tester completely for <strong>FREE</strong>. Never pay for access or buy inventory.
                  Get matched with relevant products and services, experience them honestly, answer targeted questions, and receive cash rewards
                  for every completed testing opportunity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW TESTADO WORKS (Very lightish blue section) ──── */}
        <section style={{ padding: "100px 40px", background: BG_ALT_BLUE }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <span className="section-label">How Testado Works</span>
              <div className="divider" />
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 800,
                  color: BLUE_HEADINGS,
                  marginTop: 8,
                }}
              >
                Turning Real Reactions into Definite Market Data
              </h2>
              <p style={{ color: "#64748b", fontSize: 16, maxWidth: 640, margin: "12px auto 0" }}>
                We bridge the gap between building an offer and knowing whether people will actually pay for it.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 22,
              }}
            >
              {steps.map((s) => (
                <div key={s.num} className="card" style={{ padding: 32, background: "#ffffff", border: "1px solid #dbe5f2" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: 12,
                      fontWeight: 900,
                      color: BLUE_PRIMARY,
                      background: "#eff6ff",
                      border: "1px solid #dbeafe",
                      width: "fit-content",
                      padding: "4px 10px",
                      borderRadius: 6,
                      marginBottom: 20,
                    }}
                  >
                    PHASE {s.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                      fontSize: 20,
                      fontWeight: 700,
                      color: BLUE_HEADINGS,
                      marginBottom: 10,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY THIS MATTERS ───────────────── */}
        <section
          style={{
            padding: "100px 40px",
            background: "linear-gradient(135deg, #06101d 0%, #0a1728 50%, #0f2240 100%)",
            color: "#ffffff",
          }}
        >
          <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
            <span
              style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(120, 168, 255, 0.15)",
                color: BLUE_ACCENT,
                border: "1px solid rgba(120, 168, 255, 0.3)",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Why Market Insights Matter
            </span>
            <div style={{ width: 48, height: 3, background: BLUE_PRIMARY, margin: "12px auto 20px", borderRadius: 2 }} />
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              A Launch Must Be a Calculated Decision — <em style={{ fontStyle: "italic", color: BLUE_ACCENT }}>Not an Expensive Bet.</em>
            </h2>
            <p style={{ color: "#cbd5e1", fontSize: 16, maxWidth: 740, margin: "0 auto 40px", lineHeight: 1.7 }}>
              Testing with real customers isolates friction points, uncovers hidden customer objections, and proves market viability before you commit significant engineering and ad spend.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              <div
                style={{
                  padding: "26px 22px",
                  borderRadius: 16,
                  border: "1px solid rgba(120, 168, 255, 0.25)",
                  background: "rgba(255, 255, 255, 0.05)",
                  fontWeight: 700,
                  color: "#ffffff",
                  fontSize: 15,
                  backdropFilter: "blur(10px)",
                }}
              >
                📊 Measure Genuine Purchase Intent & Value
              </div>
              <div
                style={{
                  padding: "26px 22px",
                  borderRadius: 16,
                  border: "1px solid rgba(120, 168, 255, 0.25)",
                  background: "rgba(255, 255, 255, 0.05)",
                  fontWeight: 700,
                  color: "#ffffff",
                  fontSize: 15,
                  backdropFilter: "blur(10px)",
                }}
              >
                ⚡ Eliminate Friction Before It Burns Capital
              </div>
              <div
                style={{
                  padding: "26px 22px",
                  borderRadius: 16,
                  border: "1px solid rgba(120, 168, 255, 0.25)",
                  background: "rgba(255, 255, 255, 0.05)",
                  fontWeight: 700,
                  color: "#ffffff",
                  fontSize: 15,
                  backdropFilter: "blur(10px)",
                }}
              >
                🎯 Make High-Conviction Go / Pivot Decisions
              </div>
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION ───────────────────────────── */}
        <section
          style={{
            padding: "110px 40px",
            textAlign: "center",
            background: "linear-gradient(135deg, #07172e 0%, #0d274d 100%)",
            position: "relative",
            overflow: "hidden",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 520,
              height: 520,
              borderRadius: "50%",
              border: "1px solid rgba(120, 168, 255, 0.15)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 740, margin: "0 auto" }}>
            <span
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                color: BLUE_ACCENT,
                marginBottom: 16,
              }}
            >
              Don’t Risk Your Launch on Assumptions
            </span>
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(34px, 5vw, 56px)",
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 18,
              }}
            >
              Stop Guessing.<br />
              <span style={{ color: BLUE_ACCENT }}>Start Validating with Real Insights.</span>
            </h2>
            <p style={{ fontSize: 16, color: "#cbd5e1", marginBottom: 36, lineHeight: 1.7 }}>
              Tell Testado what you are building and the market decisions you need to validate.
              We will design a targeted test that delivers data you can bet your business on.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/businesses#business-form" className="btn-primary" style={{ padding: "14px 32px", fontSize: 14 }}>
                Request Business Market Insights →
              </Link>
              <Link href="/testers" className="btn-secondary" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.4)", padding: "14px 30px" }}>
                Join as a Tester (100% Free)
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
