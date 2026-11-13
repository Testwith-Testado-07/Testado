"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/landing/Hero";

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
      title: "Define the market objective",
      desc: "We pinpoint what you need to validate — target customer profile, pricing tolerance, core value proposition, and critical launch risks.",
    },
    {
      num: "02",
      title: "Target a verified audience",
      desc: "We identify exact target demographic participants so the market insights reflect genuine potential buyers, not random crowds.",
    },
    {
      num: "03",
      title: "Capture real behavior",
      desc: "Participants interact with your product, service, or concept to reveal actual usability, buying hesitation, and core appeal.",
    },
    {
      num: "04",
      title: "Turn it into decisions",
      desc: "We synthesize user behavior into structured market intelligence, recurring objections, demand validation, and go/no-go launch metrics.",
    },
  ];

  return (
    <div style={{ background: BG_LIGHT_BLUE, color: "#081426", fontFamily: "var(--font-inter), 'Inter', sans-serif", overflowX: "hidden" }}>
      <Navbar />

      <main>
        <Hero />

        {/* ── CHOOSE YOUR PATH ─────────────────────────── */}
        <section
          style={{
            padding: "0 40px 90px",
            maxWidth: 1240,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
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
                  fontWeight: 500,
                }}
              >
                Free to join
              </div>

              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: BLUE_PRIMARY,
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  For everyday testers
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 28,
                    fontWeight: 500,
                    color: BLUE_HEADINGS,
                    marginBottom: 14,
                  }}
                >
                  Get paid to test new products
                </h3>
                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
                  Join Testado completely <strong>free with zero fees or investments</strong>. Test early-stage apps, websites, and products in your free time, share your genuine reactions, and <strong>earn cash payouts & rewards</strong>.
                </p>
                <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#1e3a8a", fontWeight: 600, marginBottom: 24, flexWrap: "wrap" }}>
                  <span>No registration fee</span>
                  <span>Direct payouts</span>
                  <span>No selling or pitching</span>
                </div>
              </div>
              <Link href="/testers" className="btn-primary" style={{ alignSelf: "flex-start" }}>
                Join free and start earning
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
                  fontWeight: 500,
                }}
              >
                Market insights
              </div>

              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: BLUE_PRIMARY,
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  For businesses and founders
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 28,
                    fontWeight: 500,
                    color: BLUE_HEADINGS,
                    marginBottom: 14,
                  }}
                >
                  De-risk a launch before you spend
                </h3>
                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
                  Vague opinions won&apos;t save a failed launch. We deliver <strong>deep market insights</strong> —
                  measuring customer purchase intent, pricing sensitivity, value clarity, and adoption barriers before you burn your marketing budget.
                </p>
                <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#1e3a8a", fontWeight: 600, marginBottom: 24, flexWrap: "wrap" }}>
                  <span>Purchase intent data</span>
                  <span>Friction and objection analysis</span>
                  <span>A clear go or no-go</span>
                </div>
              </div>
              <Link href="/businesses" className="btn-primary" style={{ alignSelf: "flex-start", background: BLUE_DARK, borderColor: BLUE_DARK }}>
                Validate your market
              </Link>
            </div>
          </div>

          <p style={{ fontSize: 13, color: "#64748b" }}>
            Two paths. One purpose: high-conviction decisions built with validated consumer intelligence.
          </p>

        </section>

        {/* ── WHAT WE DO (Lightish Blue Section) ───────────────── */}
        <section id="what-we-do" style={{ padding: "100px 40px", background: "#ffffff", borderTop: "1px solid #e2eaf5", borderBottom: "1px solid #e2eaf5" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span className="section-label">What we do</span>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 500,
                  color: BLUE_HEADINGS,
                  marginTop: 8,
                  lineHeight: 1.2,
                }}
              >
                Real consumer behavior, turned into<br />
                <span style={{ color: BLUE_PRIMARY }}>market insights you can act on</span>
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
                <h4 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 23, color: BLUE_HEADINGS, marginBottom: 14 }}>
                  For businesses and product leaders
                </h4>
                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.7 }}>
                  Companies don&apos;t fail because of poor execution; they fail because they build things the market doesn&apos;t want.
                  Testado connects your concept, MVP, or product with verified target prospects. We analyze their reactions to identify
                  <strong> price tolerance, value clarity, objections, and buying intent</strong>, giving you concrete market insights to steer critical decisions.
                </p>
              </div>

              <div className="card" style={{ padding: 36, background: "linear-gradient(145deg, #ffffff, #f0f7ff)", border: "1px solid #bfdbfe" }}>
                <h4 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 23, color: BLUE_HEADINGS, marginBottom: 14 }}>
                  Earn flexible income as a Testado tester
                </h4>
                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.7 }}>
                  Anyone 18 or older can join Testado completely free with zero membership fees or inventory requirements. Get matched with products and services tailored to you, share your authentic feedback, and earn direct cash rewards for every completed testing opportunity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW TESTADO WORKS (Very lightish blue section) ──── */}
        <section style={{ padding: "100px 40px", background: BG_ALT_BLUE }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <span className="section-label">How Testado works</span>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 500,
                  color: BLUE_HEADINGS,
                  marginTop: 8,
                }}
              >
                From real reactions to clear market data
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
                      fontWeight: 500,
                      color: BLUE_PRIMARY,
                      background: "#eff6ff",
                      border: "1px solid #dbeafe",
                      width: "fit-content",
                      padding: "4px 10px",
                      borderRadius: 6,
                      marginBottom: 20,
                    }}
                  >
                    Phase {s.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                      fontSize: 20,
                      fontWeight: 500,
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
                fontWeight: 500,
                marginBottom: 14,
              }}
            >
              Why market insights matter
            </span>
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 500,
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              A launch should be a calculated decision, <span style={{ color: BLUE_ACCENT }}>not an expensive bet</span>
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
                  fontWeight: 500,
                  color: "#ffffff",
                  fontSize: 15,
                  backdropFilter: "blur(10px)",
                }}
              >
                Measure real purchase intent and value
              </div>
              <div
                style={{
                  padding: "26px 22px",
                  borderRadius: 16,
                  border: "1px solid rgba(120, 168, 255, 0.25)",
                  background: "rgba(255, 255, 255, 0.05)",
                  fontWeight: 500,
                  color: "#ffffff",
                  fontSize: 15,
                  backdropFilter: "blur(10px)",
                }}
              >
                Find friction before it burns capital
              </div>
              <div
                style={{
                  padding: "26px 22px",
                  borderRadius: 16,
                  border: "1px solid rgba(120, 168, 255, 0.25)",
                  background: "rgba(255, 255, 255, 0.05)",
                  fontWeight: 500,
                  color: "#ffffff",
                  fontSize: 15,
                  backdropFilter: "blur(10px)",
                }}
              >
                Make confident go or pivot decisions
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

          <div style={{ position: "relative", zIndex: 1, maxWidth: 740, margin: "0 auto" }}>
            <span
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 500,
                color: BLUE_ACCENT,
                marginBottom: 16,
              }}
            >
              Don’t risk your launch on assumptions
            </span>
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(34px, 5vw, 56px)",
                fontWeight: 500,
                lineHeight: 1.15,
                marginBottom: 18,
              }}
            >
              Stop guessing.<br />
              <span style={{ color: BLUE_ACCENT }}>Validate with real customers first</span>
            </h2>
            <p style={{ fontSize: 16, color: "#cbd5e1", marginBottom: 36, lineHeight: 1.7 }}>
              Tell Testado what you are building and the market decisions you need to validate.
              We will design a targeted test that delivers data you can bet your business on.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/businesses#business-form" className="btn-primary" style={{ padding: "14px 32px", fontSize: 14 }}>
                Request market insights
              </Link>
              <Link href="/testers" className="btn-secondary" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.4)", padding: "14px 30px" }}>
                Join as a tester, free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
