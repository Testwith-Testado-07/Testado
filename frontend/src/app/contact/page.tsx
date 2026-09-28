import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Testado — Talk to a Real Person",
  description:
    "Contact Testado by phone or Instagram, or start a tester application or business testing request.",
};

export default function ContactPage() {
  const G = "#224F34";
  const MINT = "#C2EFD4";

  return (
    <div style={{ background: "#F8F9FA", color: "#101828", fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>
      <Navbar />

      <main>
        {/* ── HERO ─────────────────────────────────────── */}
        <section style={{ padding: "160px 40px 80px", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <span className="section-label">Contact Testado</span>
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
            Talk to a <em style={{ fontStyle: "italic" }}>Real Person.</em>
          </h1>
          <p style={{ fontSize: 18, color: "#475569", maxWidth: 760, margin: "0 auto 40px", lineHeight: 1.7 }}>
            For business testing requests, start with the business intake form. For tester questions, apply
            through the tester page or reach us directly on phone or Instagram.
          </p>
        </section>

        {/* ── CONTACT GRID ─────────────────────────────── */}
        <section style={{ padding: "40px 40px 90px", background: "#ffffff" }}>
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {/* Phone Card */}
            <div
              className="card"
              style={{
                padding: 36,
                background: G,
                color: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: MINT, display: "block", marginBottom: 12 }}>
                  Direct Phone
                </span>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 24, marginBottom: 8 }}>
                  Call Testado
                </h3>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                  Direct questions, early conversations and general testing enquiries.
                </p>
              </div>

              <div>
                <a
                  href="tel:+919325694956"
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#ffffff",
                    textDecoration: "underline",
                    marginBottom: 10,
                  }}
                >
                  +91 9325694956 ↗
                </a>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                  Available in the evening: <strong>5:00 PM – 11:30 PM IST</strong>
                </div>
              </div>
            </div>

            {/* Instagram Card */}
            <div
              className="card"
              style={{
                padding: 36,
                background: "#ffffff",
                border: "1.5px solid #e2e8e4",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: G, display: "block", marginBottom: 12 }}>
                  Social Messaging
                </span>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 24, color: G, marginBottom: 8 }}>
                  Instagram
                </h3>
                <p style={{ color: "#667085", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                  Message us directly, follow project updates, or ask a quick question.
                </p>
              </div>

              <div>
                <a
                  href="https://www.instagram.com/testwithtestado/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  @testwithtestado ↗
                </a>
                <div style={{ fontSize: 13, color: "#667085", marginTop: 12 }}>
                  Direct messages answered daily
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CHOOSE YOUR ROUTE ────────────────────────── */}
        <section style={{ padding: "90px 40px", background: "#F8F9FA" }}>
          <div style={{ maxWidth: 1040, margin: "0 auto", textAlign: "center" }}>
            <span className="section-label">Choose Your Route</span>
            <div className="divider" />
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                color: G,
                marginBottom: 36,
              }}
            >
              Ready to talk about the right thing?
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 24,
                textAlign: "left",
              }}
            >
              <div className="card" style={{ padding: 32 }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: G, display: "block", marginBottom: 10 }}>
                  FOR PEOPLE
                </span>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 22, color: G, marginBottom: 8 }}>
                  Become a Tester
                </h3>
                <p style={{ color: "#667085", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                  Take part in eligible tests, give honest feedback, and build a flexible side-income stream.
                </p>
                <Link href="/testers" className="btn-secondary">
                  Apply now →
                </Link>
              </div>

              <div className="card" style={{ padding: 32, border: `1.5px solid ${G}` }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: G, display: "block", marginBottom: 10 }}>
                  FOR BUSINESSES
                </span>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 22, color: G, marginBottom: 8 }}>
                  Test Your Product or Idea
                </h3>
                <p style={{ color: "#667085", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                  Get relevant people in the process and use analyzed feedback to make a stronger decision.
                </p>
                <Link href="/businesses" className="btn-primary">
                  Start a test →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
