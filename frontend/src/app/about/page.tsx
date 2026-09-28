import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Testado — Real Insights for Real Decisions",
  description:
    "Learn what Testado is building and why real customer feedback should be part of the decision before a launch.",
};

export default function AboutPage() {
  const G = "#224F34";

  return (
    <div style={{ background: "#F8F9FA", color: "#101828", fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>
      <Navbar />

      <main>
        {/* ── HERO ─────────────────────────────────────── */}
        <section style={{ padding: "160px 40px 80px", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <span className="section-label">About Testado</span>
          <div className="divider" />
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(36px, 5.5vw, 64px)",
              fontWeight: 800,
              color: G,
              lineHeight: 1.15,
              maxWidth: 960,
              margin: "20px auto",
            }}
          >
            We Believe Businesses Should Get Closer to the People They Are Building For —{" "}
            <em style={{ fontStyle: "italic" }}>Before the Launch Decides Everything.</em>
          </h1>
          <p style={{ fontSize: 18, color: "#475569", maxWidth: 800, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Testado is being built around a simple belief: the earlier you learn how real target customers react,
            the more useful that learning can be.
          </p>
        </section>

        {/* ── THE IDEA & QUOTE ─────────────────────────── */}
        <section style={{ padding: "80px 40px", background: "#ffffff" }}>
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
                  color: G,
                  marginBottom: 16,
                }}
              >
                Feedback is only valuable when it changes a decision.
              </h2>
              <p style={{ color: "#475569", fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
                A random collection of opinions can be interesting. It is much more useful when the people
                are relevant, the questions are clear, and the responses can be analyzed into patterns that
                a business can act on.
              </p>
              <p style={{ color: "#475569", fontSize: 16, lineHeight: 1.7 }}>
                That is the direction Testado is building toward: a human-first testing platform that helps
                businesses learn before they commit further — and gives everyday people a way to participate
                in that process.
              </p>
            </div>

            <div
              style={{
                padding: "48px 40px",
                background: "rgba(194,239,212,0.2)",
                borderRadius: 12,
                borderLeft: `6px solid ${G}`,
              }}
            >
              <blockquote
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(26px, 3.5vw, 38px)",
                  fontStyle: "italic",
                  color: G,
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                “Test before you invest.”
              </blockquote>
              <span style={{ display: "block", marginTop: 14, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#667085" }}>
                Testado Philosophy
              </span>
            </div>
          </div>
        </section>

        {/* ── OUR TWO SIDES ────────────────────────────── */}
        <section style={{ padding: "90px 40px", background: "#F8F9FA" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
            <span className="section-label">Platform Model</span>
            <div className="divider" />
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                color: G,
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
              <div className="card" style={{ padding: 32 }}>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 20, color: G, marginBottom: 8 }}>
                  1. Businesses
                </h3>
                <p style={{ color: "#667085", fontSize: 14, lineHeight: 1.6 }}>
                  Come to learn whether an idea, product or offer is likely to work with their target customer before risking full scale.
                </p>
              </div>

              <div className="card" style={{ padding: 32 }}>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 20, color: G, marginBottom: 8 }}>
                  2. Curation
                </h3>
                <p style={{ color: "#667085", fontSize: 14, lineHeight: 1.6 }}>
                  Testado finds and organizes relevant participants so the responses are informative, honest, and high-signal.
                </p>
              </div>

              <div className="card" style={{ padding: 32 }}>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 20, color: G, marginBottom: 8 }}>
                  3. Testers
                </h3>
                <p style={{ color: "#667085", fontSize: 14, lineHeight: 1.6 }}>
                  Get eligible opportunities to participate in genuine tests, share authentic experiences, and earn rewards.
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
