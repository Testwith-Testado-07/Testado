"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const G = "#224F34"; // Forest green
  const MINT = "#C2EFD4";

  const steps = [
    {
      num: "01",
      title: "Define the question",
      desc: "We understand what you are trying to prove, disprove or improve — and who the answer needs to come from.",
    },
    {
      num: "02",
      title: "Reach the right people",
      desc: "We identify participants who fit your target customer profile so feedback is relevant, not just available.",
    },
    {
      num: "03",
      title: "Test & capture feedback",
      desc: "Participants experience your product, service, concept or idea and respond to the areas that matter most.",
    },
    {
      num: "04",
      title: "Analyze what it means",
      desc: "We look across responses for patterns, strengths, objections, confusion and signals that guide your next move.",
    },
  ];

  return (
    <div style={{ background: "#F8F9FA", color: "#101828", fontFamily: "var(--font-inter), 'Inter', sans-serif", overflowX: "hidden" }}>
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
          <span className="section-label">Consumer testing, built around real decisions</span>
          <div className="divider" />

          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(42px, 6vw, 76px)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: G,
              maxWidth: 960,
              margin: "24px auto 20px",
            }}
          >
            Don’t Just Launch.<br />
            <em style={{ fontStyle: "italic", fontWeight: 700 }}>Know Before You Bet on It.</em>
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
            Testado helps businesses find out how their target customers are likely to react to a
            product, service, concept or idea — by putting it in front of the right people,
            collecting structured feedback and analyzing what that feedback actually means.
          </p>

          {/* Dual Choice Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
              maxWidth: 1040,
              margin: "0 auto 36px",
              textAlign: "left",
            }}
          >
            {/* For Testers Card */}
            <div
              className="card"
              style={{
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "#ffffff",
                border: "1.5px solid #e2e8e4",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: G,
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  FOR PEOPLE
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: G,
                    marginBottom: 14,
                  }}
                >
                  Become a Testado Tester
                </h3>
                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                  Get access to eligible testing opportunities, share your honest experience, and{" "}
                  <strong>build a flexible side-income stream</strong> from opportunities that match your interests.
                </p>
              </div>
              <Link href="/testers" className="btn-secondary" style={{ alignSelf: "flex-start" }}>
                Join as a Tester →
              </Link>
            </div>

            {/* For Businesses Card */}
            <div
              className="card"
              style={{
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "#ffffff",
                border: `1.5px solid ${G}`,
                boxShadow: "0 10px 30px rgba(34,79,52,0.06)",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: G,
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  FOR BUSINESSES & IDEA OWNERS
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: G,
                    marginBottom: 14,
                  }}
                >
                  Find Out If Your Idea Can Work
                </h3>
                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                  We don’t just collect comments. We help you{" "}
                  <strong>understand whether your offer is likely to work with the people you want to reach</strong> —
                  and what needs to change before you commit more.
                </p>
              </div>
              <Link href="/businesses" className="btn-primary" style={{ alignSelf: "flex-start" }}>
                Start a Test →
              </Link>
            </div>
          </div>

          <p style={{ fontSize: 13, color: "#667085" }}>
            Two paths. One purpose: better decisions made with real people in the picture.
          </p>

          {/* High-priority Clickable Instagram Callout Strip */}
          <div style={{ maxWidth: 1040, margin: "36px auto 0" }}>
            <div
              style={{
                background: `linear-gradient(135deg, ${G} 0%, #163d25 100%)`,
                color: "#ffffff",
                borderRadius: 16,
                padding: "24px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 20,
                textAlign: "left",
                boxShadow: "0 12px 36px rgba(34,79,52,0.18)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: MINT,
                    color: G,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 20,
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  ◎
                </div>
                <div>
                  <strong style={{ fontSize: 16, display: "block" }}>
                    Want to talk before you fill anything out?
                  </strong>
                  <p style={{ margin: "2px 0 0", fontSize: 14, color: "rgba(255,255,255,0.75)" }}>
                    Message the Testado team directly on Instagram: @testwithtestado
                  </p>
                </div>
              </div>

              <a
                href="https://www.instagram.com/testwithtestado/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-mint"
                style={{ fontSize: 11, padding: "10px 22px" }}
              >
                Open Instagram ↗
              </a>
            </div>
          </div>
        </section>

        {/* ── WHAT WE DO ───────────────────────────────── */}
        <section id="what-we-do" style={{ padding: "100px 40px", background: "#ffffff" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <span className="section-label">What We Do</span>
              <div className="divider" />
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 800,
                  color: G,
                  marginTop: 8,
                  lineHeight: 1.2,
                }}
              >
                Testado connects businesses with real people —<br />
                <em style={{ fontStyle: "italic" }}>then turns their reactions into useful answers.</em>
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 32,
              }}
            >
              <div className="card" style={{ padding: 36, background: "#fbfcfe" }}>
                <h4 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 22, color: G, marginBottom: 12 }}>
                  For Businesses & Founders
                </h4>
                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.7 }}>
                  Businesses come to us when they want to know whether a product, service, concept or idea is
                  likely to work with the people they are trying to reach. We help get it in front of relevant
                  participants, collect structured feedback and analyze responses for patterns, strengths,
                  friction and objections. That helps the business make a better-informed decision before going further.
                </p>
              </div>

              <div className="card" style={{ padding: 36, background: "#fbfcfe" }}>
                <h4 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 22, color: G, marginBottom: 12 }}>
                  For Real Everyday Testers
                </h4>
                <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.7 }}>
                  For testers, Testado creates opportunities to participate in eligible product and idea tests,
                  share honest feedback, and earn payment or rewards for completed opportunities. No selling or
                  pitching required — just genuine human evaluation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW TESTADO WORKS (4 STEPS) ──────────────── */}
        <section style={{ padding: "100px 40px", background: "#F8F9FA" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <span className="section-label">How Testado Works</span>
              <div className="divider" />
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 800,
                  color: G,
                  marginTop: 8,
                }}
              >
                We Turn Real Reactions into a Clearer Business Decision
              </h2>
              <p style={{ color: "#667085", fontSize: 16, maxWidth: 600, margin: "12px auto 0" }}>
                A test is only useful when the feedback answers the question behind the test.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 20,
              }}
            >
              {steps.map((s) => (
                <div key={s.num} className="card" style={{ padding: 32 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: 12,
                      fontWeight: 900,
                      color: G,
                      background: "rgba(34,79,52,0.08)",
                      width: "fit-content",
                      padding: "4px 10px",
                      borderRadius: 6,
                      marginBottom: 20,
                    }}
                  >
                    STEP {s.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                      fontSize: 20,
                      fontWeight: 700,
                      color: G,
                      marginBottom: 10,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#667085", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY THIS MATTERS ─────────────────────────── */}
        <section style={{ padding: "90px 40px", background: "#ffffff" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
            <span className="section-label">Why This Matters</span>
            <div className="divider" />
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                color: G,
                marginBottom: 16,
              }}
            >
              A Launch Should Be a Decision — <em style={{ fontStyle: "italic" }}>Not a Guess.</em>
            </h2>
            <p style={{ color: "#475569", fontSize: 16, maxWidth: 740, margin: "0 auto 40px", lineHeight: 1.65 }}>
              Early testing reveals what sounds good in theory, what makes sense in practice, and where the
              product or message may lose people before more money and effort are committed.
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
                  padding: "24px 20px",
                  borderRadius: 10,
                  border: `1.5px solid ${G}`,
                  background: "rgba(194,239,212,0.12)",
                  fontWeight: 700,
                  color: G,
                  fontSize: 15,
                }}
              >
                See how your target audience reacts
              </div>
              <div
                style={{
                  padding: "24px 20px",
                  borderRadius: 10,
                  border: `1.5px solid ${G}`,
                  background: "rgba(194,239,212,0.12)",
                  fontWeight: 700,
                  color: G,
                  fontSize: 15,
                }}
              >
                Spot friction before it becomes expensive
              </div>
              <div
                style={{
                  padding: "24px 20px",
                  borderRadius: 10,
                  border: `1.5px solid ${G}`,
                  background: "rgba(194,239,212,0.12)",
                  fontWeight: 700,
                  color: G,
                  fontSize: 15,
                }}
              >
                Make a stronger go / change / rethink decision
              </div>
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION ───────────────────────────── */}
        <section
          style={{
            padding: "110px 40px",
            textAlign: "center",
            background: `linear-gradient(135deg, ${G} 0%, #163d25 100%)`,
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
              width: 500,
              height: 500,
              borderRadius: "50%",
              border: "1px solid rgba(194,239,212,0.12)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
            <span
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                color: MINT,
                marginBottom: 16,
              }}
            >
              Don’t Put the Whole Bet on a Guess
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
              <em style={{ fontStyle: "italic", color: MINT }}>Start Validating.</em>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 36, lineHeight: 1.7 }}>
              Tell Testado what you are building and what you need to know. We’ll start from the business question
              and work toward a test that can actually answer it.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/businesses#business-form" className="btn-mint" style={{ padding: "14px 30px" }}>
                Start a Test as a Business →
              </Link>
              <Link href="/testers" className="btn-secondary" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.4)" }}>
                Join as a Tester
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
