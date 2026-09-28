import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Why Testado — Test Before You Invest",
  description:
    "Learn how Testado uses targeted participants and structured feedback analysis to help businesses make better product and launch decisions.",
};

export default function WhyTestadoPage() {
  const G = "#224F34";
  const MINT = "#C2EFD4";

  const pillars = [
    {
      num: "01 — TARGET",
      title: "Start with the customer that matters",
      desc: "Testing becomes more useful when the people participating resemble the audience you are actually trying to reach.",
    },
    {
      num: "02 — EXPERIENCE",
      title: "Let people experience the idea",
      desc: "Show the product, service, concept or offer and capture what people really notice, understand, question and react to.",
    },
    {
      num: "03 — ANALYZE",
      title: "Turn comments into signals",
      desc: "Look across responses for recurring themes, friction, strengths and objections rather than treating every comment as equally important.",
    },
    {
      num: "04 — DECIDE",
      title: "Know what to do next",
      desc: "Use the findings to decide what to keep, what to improve, what to test again, or whether the idea needs a rethink.",
    },
    {
      num: "05 — LEARN EARLY",
      title: "Catch problems before they get expensive",
      desc: "The earlier you discover a weak point, the more options you have to fix it without dragging a bad assumption into the launch.",
    },
    {
      num: "06 — KEEP IT HUMAN",
      title: "Technology helps. People still decide.",
      desc: "Testado is about getting closer to real human reactions and using them to improve real business decisions.",
    },
  ];

  return (
    <div style={{ background: "#F8F9FA", color: "#101828", fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>
      <Navbar />

      <main>
        {/* ── SALES HERO ───────────────────────────────── */}
        <section
          style={{
            padding: "160px 40px 90px",
            maxWidth: 1200,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <span className="section-label">Why Testado</span>
          <div className="divider" />

          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(38px, 5.5vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.15,
              color: G,
              maxWidth: 960,
              margin: "20px auto",
            }}
          >
            Your Customers Can Tell You What Your Launch{" "}
            <em style={{ fontStyle: "italic" }}>Looks Like Before You Launch It.</em>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#475569",
              maxWidth: 780,
              margin: "0 auto 36px",
              lineHeight: 1.7,
            }}
          >
            Testado is built for one high-value moment: when you have already invested enough to care,
            but not so much that changing course becomes painful.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <Link href="/businesses#business-form" className="btn-primary">
              Talk to Testado →
            </Link>
            <Link href="/testers" className="btn-secondary">
              Become a Tester
            </Link>
          </div>

          {/* 3 Proof Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
              textAlign: "left",
            }}
          >
            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 20, color: G, marginBottom: 8 }}>
                Find the right people
              </h3>
              <p style={{ color: "#667085", fontSize: 14, lineHeight: 1.6 }}>
                Get feedback from participants chosen around the audience you actually want to understand.
              </p>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 20, color: G, marginBottom: 8 }}>
                Capture the real reaction
              </h3>
              <p style={{ color: "#667085", fontSize: 14, lineHeight: 1.6 }}>
                Test the actual offer, not just a casual social-media poll asking whether it looks nice.
              </p>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 20, color: G, marginBottom: 8 }}>
                Turn responses into insight
              </h3>
              <p style={{ color: "#667085", fontSize: 14, lineHeight: 1.6 }}>
                Look for patterns, objections and signals that can directly influence the next decision.
              </p>
            </div>
          </div>
        </section>

        {/* ── THE TESTADO DIFFERENCE ───────────────────── */}
        <section style={{ padding: "100px 40px", background: "#ffffff" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <span className="section-label">The Testado Difference</span>
              <div className="divider" />
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(30px, 4vw, 48px)",
                  fontWeight: 800,
                  color: G,
                }}
              >
                We’re Not Selling “More Opinions.”<br />
                <em style={{ fontStyle: "italic" }}>We’re Selling a Better Way to Decide.</em>
              </h2>
              <p style={{ color: "#667085", fontSize: 16, maxWidth: 650, margin: "14px auto 0" }}>
                A hundred random reactions can still leave you confused. The point of Testado is to make
                feedback relevant to the question you need answered.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 24,
              }}
            >
              {pillars.map((p) => (
                <div key={p.num} className="card" style={{ padding: 32 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: G, letterSpacing: 1.5, marginBottom: 12 }}>
                    {p.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                      fontSize: 20,
                      color: G,
                      marginBottom: 8,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#667085", lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT A BUSINESS WALKS AWAY WITH ───────────── */}
        <section style={{ padding: "100px 40px", background: "#F8F9FA" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <span className="section-label">Concrete Outcomes</span>
              <div className="divider" />
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 800,
                  color: G,
                }}
              >
                A Clearer Answer to the Questions That Actually Matter
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 28,
              }}
            >
              <div className="card" style={{ padding: 36, borderTop: `4px solid ${G}` }}>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 24,
                    color: G,
                    marginBottom: 12,
                  }}
                >
                  “Will people get it?”
                </h3>
                <p style={{ color: "#667085", fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
                  See where your product or message is immediately clear and where people struggle to
                  understand what you are offering.
                </p>
                <ul style={{ paddingLeft: 20, color: "#475569", fontSize: 14, lineHeight: 1.8 }}>
                  <li>First impressions and clarity</li>
                  <li>Value proposition understanding</li>
                  <li>Confusing or missing information</li>
                </ul>
              </div>

              <div className="card" style={{ padding: 36, borderTop: `4px solid ${G}` }}>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: 24,
                    color: G,
                    marginBottom: 12,
                  }}
                >
                  “Will people want it?”
                </h3>
                <p style={{ color: "#667085", fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
                  Understand what creates interest, what makes the offer feel valuable, and what gives
                  people a reason to hesitate.
                </p>
                <ul style={{ paddingLeft: 20, color: "#475569", fontSize: 14, lineHeight: 1.8 }}>
                  <li>Appeal and perceived value</li>
                  <li>Purchase or adoption signals</li>
                  <li>Objections and friction points</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────── */}
        <section
          style={{
            padding: "90px 40px",
            background: `linear-gradient(135deg, ${G} 0%, #163d25 100%)`,
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(30px, 4vw, 48px)",
                fontWeight: 800,
                marginBottom: 16,
              }}
            >
              Don’t Put the Whole Bet on a Guess
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, marginBottom: 32, lineHeight: 1.65 }}>
              Tell Testado what you are building and what you need to know. We’ll start from the business question
              and work toward a test that can actually answer it.
            </p>
            <Link href="/businesses#business-form" className="btn-mint">
              Start the Conversation →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
