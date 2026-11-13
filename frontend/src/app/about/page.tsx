import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Testado — Market Insights & Free Tester Community",
  description:
    "Learn what Testado is building and why validated market insights must lead product decisions before public launch.",
};

export default function AboutPage() {
  const BLUE_HEADINGS = "#07172e";
  const BLUE_PRIMARY = "#2563eb";
  const BG_LIGHT_BLUE = "#f4f8fd";
  const BG_ALT_BLUE = "#edf3fb";

  return (
    <div style={{ background: BG_LIGHT_BLUE, color: "#081426", fontFamily: "var(--font-inter), 'Inter', sans-serif", overflowX: "hidden" }}>
      <Navbar />

      <main>
        {/* ── HERO ─────────────────────────────────────── */}
        <section style={{ padding: "160px 40px 80px", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <span className="section-label">About Testado</span>
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(36px, 5.5vw, 64px)",
              fontWeight: 800,
              color: BLUE_HEADINGS,
              lineHeight: 1.15,
              maxWidth: 980,
              margin: "20px auto",
              letterSpacing: "-0.5px",
            }}
          >
            We Believe Businesses Should Get Ground-Level Customer Truth —{" "}
            <span style={{ color: BLUE_PRIMARY }}>Before the Launch Decides Everything.</span>
          </h1>
          <p style={{ fontSize: 18, color: "#475569", maxWidth: 800, margin: "0 auto 40px", lineHeight: 1.75 }}>
            Testado was built around an undeniable business reality: the earlier you validate customer demand and behavior, the less capital you burn on false assumptions.
          </p>
        </section>

        {/* ── THE IDEA & QUOTE ─────────────────────────── */}
        <section style={{ padding: "80px 40px", background: "#ffffff", borderTop: "1px solid #e2eaf5", borderBottom: "1px solid #e2eaf5" }}>
          <div
            style={{
              maxWidth: 1140,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 40,
              alignItems: "center",
            }}
          >
            <div>
              <span className="section-label">The Core Idea</span>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 800,
                  color: BLUE_HEADINGS,
                  marginBottom: 16,
                }}
              >
                Market insights are only valuable when they de-risk a real business decision.
              </h2>
              <p style={{ color: "#475569", fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
                A collection of random opinions doesn&apos;t move a business forward. What leadership teams need are structured market insights:
                understanding what target customers actually notice, what creates immediate buying intent, and what friction stops conversion.
              </p>
              <p style={{ color: "#475569", fontSize: 16, lineHeight: 1.7 }}>
                Testado bridges this divide: empowering businesses to launch with high-conviction market validation, while giving everyday people
                the ability to test early innovations and earn side income 100% for free.
              </p>
            </div>

            <div
              style={{
                padding: "48px 40px",
                background: "linear-gradient(145deg, #ffffff, #eff6ff)",
                borderRadius: 20,
                borderLeft: `6px solid ${BLUE_PRIMARY}`,
                border: "1.5px solid #bfdbfe",
                boxShadow: "0 12px 35px rgba(37, 99, 235, 0.08)",
              }}
            >
              <blockquote
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(26px, 3.5vw, 38px)",
                  fontStyle: "italic",
                  color: BLUE_HEADINGS,
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                “Test before you invest.”
              </blockquote>
              <span style={{ display: "block", marginTop: 14, fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: BLUE_PRIMARY }}>
                The Testado Philosophy
              </span>
            </div>
          </div>
        </section>

        {/* ── OUR TWO SIDES ────────────────────────────── */}
        <section style={{ padding: "90px 40px", background: BG_ALT_BLUE }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
            <span className="section-label">Platform Ecosystem</span>
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                color: BLUE_HEADINGS,
                marginBottom: 40,
              }}
            >
              One Platform. Two Reasons to Show Up.
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
                textAlign: "left",
              }}
            >
              <div className="card" style={{ padding: 32, background: "#ffffff", border: "1px solid #dbe5f2" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 20, color: BLUE_HEADINGS, marginBottom: 8 }}>
                  1. For Businesses
                </h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65 }}>
                  Access actionable market insights and demand validation with your exact customer demographic before scaling expensive engineering or marketing.
                </p>
              </div>

              <div className="card" style={{ padding: 32, background: "#ffffff", border: "1px solid #dbe5f2" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 20, color: BLUE_HEADINGS, marginBottom: 8 }}>
                  2. Targeted Curation
                </h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65 }}>
                  Testado hand-matches verified target participants to eliminate bias and generate clean, statistically significant behavioral signals.
                </p>
              </div>

              <div className="card" style={{ padding: 32, background: "#ffffff", border: "1.5px solid #dbe5f2" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 20, color: BLUE_HEADINGS, marginBottom: 8 }}>
                  3. For Testers (100% Free)
                </h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65 }}>
                  Anyone 18+ can join completely free. Test exciting products in your spare time and earn cash payouts or rewards for completed opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
