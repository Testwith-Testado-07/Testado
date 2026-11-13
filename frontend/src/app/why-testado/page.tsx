import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Why Testado — Pre-Launch Market Insights & Validation",
  description:
    "Discover how Testado helps businesses replace guesswork with validated market insights, customer demand signals, and behavioral intelligence.",
};

export default function WhyTestadoPage() {
  const BLUE_HEADINGS = "#07172e";
  const BLUE_PRIMARY = "#2563eb";
  const BG_LIGHT_BLUE = "#f4f8fd";
  const BG_ALT_BLUE = "#edf3fb";

  const pillars = [
    {
      num: "01 — TARGET AUDIENCE",
      title: "Start with the Exact Customer Profile",
      desc: "Market testing is only valuable when the participants represent the demographic you actually intend to sell to.",
    },
    {
      num: "02 — REAL INTERACTION",
      title: "Evaluate Real Human Reactions",
      desc: "Put the actual product, service, or concept in front of users and capture what they immediately understand, question, or reject.",
    },
    {
      num: "03 — MARKET SIGNALS",
      title: "Transform Behavior into Market Insights",
      desc: "Look across data points for repeated purchase hesitation, price sensitivity, friction, and clear demand signals.",
    },
    {
      num: "04 — DECISION METRICS",
      title: "Gain Clear Go / No-Go Direction",
      desc: "Empower leadership with concrete data on whether to proceed with launch, adjust messaging, fix usability, or pivot the concept.",
    },
    {
      num: "05 — DE-RISK CAPITAL",
      title: "Catch Dealbreakers Before Burning Budget",
      desc: "Uncovering a fatal flaw pre-launch costs 100x less than trying to fix customer churn after a public rollout.",
    },
    {
      num: "06 — AUTHENTIC INTELLIGENCE",
      title: "Genuine Human Truth, Not Synthetic Noise",
      desc: "Algorithms predict trends, but real buyers determine your revenue. Testado delivers honest, ground-level market intelligence.",
    },
  ];

  return (
    <div style={{ background: BG_LIGHT_BLUE, color: "#081426", fontFamily: "var(--font-inter), 'Inter', sans-serif", overflowX: "hidden" }}>
      <Navbar />

      <main>
        {/* ── SALES HERO ────────────────── */}
        <section
          style={{
            padding: "160px 40px 90px",
            maxWidth: 1200,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <span className="section-label">Why Testado • Market Intelligence</span>

          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(38px, 5.5vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.15,
              color: BLUE_HEADINGS,
              maxWidth: 980,
              margin: "20px auto",
              letterSpacing: "-0.5px",
            }}
          >
            Your Target Market Can Tell You How Your Launch Fares{" "}
            <span style={{ color: BLUE_PRIMARY }}>Before You Risk Your Capital.</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#475569",
              maxWidth: 800,
              margin: "0 auto 36px",
              lineHeight: 1.75,
            }}
          >
            Testado is built for the highest-stakes moment in product development: when you have built enough to have conviction, but before committing irreversible launch budgets.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <Link href="/businesses#business-form" className="btn-primary" style={{ padding: "14px 30px" }}>
              Request Market Insights →
            </Link>
            <Link href="/testers" className="btn-secondary" style={{ padding: "14px 30px" }}>
              Join as a Tester (100% Free)
            </Link>
          </div>

          {/* 3 Proof Cards (Light Blue Tinted White Cards) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
              textAlign: "left",
            }}
          >
            <div className="card" style={{ padding: 32, background: "#ffffff", border: "1.5px solid #dbe5f2" }}>
              <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 20, color: BLUE_HEADINGS, marginBottom: 8 }}>
                Verified Target Demographics
              </h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65 }}>
                Evaluate concepts only with consumers who represent your authentic buying persona, not unvetted survey crowds.
              </p>
            </div>

            <div className="card" style={{ padding: 32, background: "#ffffff", border: "1.5px solid #dbe5f2" }}>
              <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 20, color: BLUE_HEADINGS, marginBottom: 8 }}>
                Behavioral Market Signals
              </h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65 }}>
                Test authentic interactions and purchase triggers, rather than superficial social media polls asking if it looks nice.
              </p>
            </div>

            <div className="card" style={{ padding: 32, background: "#ffffff", border: "1.5px solid #dbe5f2" }}>
              <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 20, color: BLUE_HEADINGS, marginBottom: 8 }}>
                Synthesized Market Intelligence
              </h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65 }}>
                Identify recurring objections, value clarity, and price tolerance that directly de-risk go-to-market execution.
              </p>
            </div>
          </div>
        </section>

        {/* ── THE TESTADO DIFFERENCE (White Section) ───────── */}
        <section style={{ padding: "100px 40px", background: "#ffffff", borderTop: "1px solid #e2eaf5", borderBottom: "1px solid #e2eaf5" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <span className="section-label">The Testado Standard</span>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 800,
                  color: BLUE_HEADINGS,
                }}
              >
                We Don’t Sell Casual Opinions.<br />
                <span style={{ color: BLUE_PRIMARY }}>We Deliver Actionable Market Insights.</span>
              </h2>
              <p style={{ color: "#64748b", fontSize: 16, maxWidth: 680, margin: "14px auto 0" }}>
                A hundred unstructured comments leave you more confused than when you started.
                Testado structures testing to answer the exact market questions behind your launch.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 26,
              }}
            >
              {pillars.map((p) => (
                <div key={p.num} className="card" style={{ padding: 32, background: "linear-gradient(145deg, #ffffff, #f4f8fd)", border: "1px solid #dbe5f2" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: BLUE_PRIMARY, letterSpacing: 1.5, marginBottom: 12 }}>
                    {p.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                      fontSize: 20,
                      color: BLUE_HEADINGS,
                      marginBottom: 8,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT A BUSINESS WALKS AWAY WITH (Lightish Blue) ─────── */}
        <section style={{ padding: "100px 40px", background: BG_ALT_BLUE }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 54 }}>
              <span className="section-label">Concrete Outcomes</span>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 800,
                  color: BLUE_HEADINGS,
                }}
              >
                Clear Answers to High-Stakes Launch Questions
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 28,
              }}
            >
              <div className="card" style={{ padding: 36, background: "#ffffff", borderTop: `4px solid ${BLUE_PRIMARY}` }}>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 24,
                    color: BLUE_HEADINGS,
                    marginBottom: 12,
                  }}
                >
                  “Does the Market Understand It?”
                </h3>
                <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
                  Discover where your core message or interface is crystal clear, and where target customers encounter confusion or cognitive friction.
                </p>
                <ul style={{ paddingLeft: 20, color: "#475569", fontSize: 14, lineHeight: 1.8 }}>
                  <li>First-impression value comprehension</li>
                  <li>Clarity of unique selling proposition (USP)</li>
                  <li>Ambiguous messaging or confusing workflows</li>
                </ul>
              </div>

              <div className="card" style={{ padding: 36, background: "#ffffff", borderTop: `4px solid ${BLUE_PRIMARY}` }}>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 24,
                    color: BLUE_HEADINGS,
                    marginBottom: 12,
                  }}
                >
                  “Will the Market Actually Pay For It?”
                </h3>
                <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>
                  Quantify genuine customer interest, perceived pricing fairness, and specific objections that stop users from converting into paying customers.
                </p>
                <ul style={{ paddingLeft: 20, color: "#475569", fontSize: 14, lineHeight: 1.8 }}>
                  <li>Perceived value and willingness to pay</li>
                  <li>Purchase intent and conversion triggers</li>
                  <li>Competitive alternatives and buyer objections</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────── */}
        <section
          style={{
            padding: "95px 40px",
            background: "linear-gradient(135deg, #06101d 0%, #0a1728 50%, #0f2240 100%)",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(30px, 4vw, 50px)",
                fontWeight: 800,
                marginBottom: 16,
                color: "#ffffff",
              }}
            >
              Don’t Bet Your Company on Unverified Assumptions
            </h2>
            <p style={{ color: "#cbd5e1", fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>
              Tell Testado what you are building and what market questions you need validated. We will design a targeted testing plan that gives you unshakeable clarity.
            </p>
            <Link href="/businesses#business-form" className="btn-primary" style={{ padding: "14px 32px", fontSize: 14 }}>
              Discuss Your Launch Market Test →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
