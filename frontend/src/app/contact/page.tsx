import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Testado — Talk to a Real Person",
  description:
    "Contact Testado by phone or Instagram, or start a free tester application or business market testing request.",
};

export default function ContactPage() {
  const BLUE_HEADINGS = "#07172e";
  const BLUE_PRIMARY = "#2563eb";
  const BLUE_ACCENT = "#78a8ff";
  const BG_LIGHT_BLUE = "#f4f8fd";
  const BG_ALT_BLUE = "#edf3fb";

  return (
    <div style={{ background: BG_LIGHT_BLUE, color: "#081426", fontFamily: "var(--font-inter), 'Inter', sans-serif", overflowX: "hidden" }}>
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
              color: BLUE_HEADINGS,
              lineHeight: 1.15,
              maxWidth: 960,
              margin: "20px auto",
              letterSpacing: "-0.5px",
            }}
          >
            Talk to a <span style={{ color: BLUE_PRIMARY }}>Real Person.</span>
          </h1>
          <p style={{ fontSize: 18, color: "#475569", maxWidth: 780, margin: "0 auto 40px", lineHeight: 1.75 }}>
            For business launch validation and market insights, start with our business request form.
            For tester questions, apply 100% free through the tester page or reach us directly on phone or Instagram.
          </p>
        </section>

        {/* ── CONTACT GRID ─────────────────────────────── */}
        <section style={{ padding: "40px 40px 90px", background: "#ffffff", borderTop: "1px solid #e2eaf5", borderBottom: "1px solid #e2eaf5" }}>
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 26,
            }}
          >
            {/* Phone Card */}
            <div
              className="card"
              style={{
                padding: 36,
                background: "linear-gradient(135deg, #06101d 0%, #0b1d35 100%)",
                color: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid rgba(120, 168, 255, 0.2)",
                boxShadow: "0 18px 45px rgba(6, 16, 29, 0.2)",
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: BLUE_ACCENT, display: "block", marginBottom: 12 }}>
                  DIRECT CALL
                </span>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 24, marginBottom: 8, color: "#ffffff" }}>
                  Call Testado
                </h3>
                <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                  Direct questions, launch planning, and general market testing enquiries.
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
                <div style={{ fontSize: 13, color: "#94a3b8" }}>
                  Available in the evening: <strong>5:00 PM – 11:30 PM IST</strong>
                </div>
              </div>
            </div>

            {/* Instagram Card (Lightish Blue / White) */}
            <div
              className="card"
              style={{
                padding: 36,
                background: "linear-gradient(145deg, #ffffff, #f4f8fd)",
                border: "1.5px solid #dbe5f2",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: BLUE_PRIMARY, display: "block", marginBottom: 12 }}>
                  INSTANT MESSAGING
                </span>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 24, color: BLUE_HEADINGS, marginBottom: 8 }}>
                  Instagram
                </h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                  Message our team directly, follow product validation updates, or ask quick questions.
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
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 12 }}>
                  Direct messages answered daily
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CHOOSE YOUR ROUTE ────────────────────────── */}
        <section style={{ padding: "90px 40px", background: BG_ALT_BLUE }}>
          <div style={{ maxWidth: 1040, margin: "0 auto", textAlign: "center" }}>
            <span className="section-label">Choose Your Route</span>
            <div className="divider" />
            <h2
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                color: BLUE_HEADINGS,
                marginBottom: 36,
              }}
            >
              Ready to Validate with Real People?
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 26,
                textAlign: "left",
              }}
            >
              <div className="card" style={{ padding: 36, background: "#ffffff", border: "1.5px solid #dbe5f2" }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: BLUE_PRIMARY, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  FOR BUSINESSES
                </span>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 24, color: BLUE_HEADINGS, marginBottom: 12 }}>
                  Validate Your Market Fit
                </h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
                  Put your product or concept before verified buyers and receive structured market insights before scaling.
                </p>
                <Link href="/businesses#business-form" className="btn-primary">
                  Request Market Insights →
                </Link>
              </div>

              <div className="card" style={{ padding: 36, background: "#ffffff", border: "1.5px solid #bfdbfe" }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: BLUE_PRIMARY, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  FOR TESTERS • 100% FREE
                </span>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 24, color: BLUE_HEADINGS, marginBottom: 12 }}>
                  Become a Tester for Free
                </h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
                  Zero fees, zero investment. Test new products in your free time, share honest reactions, and earn rewards.
                </p>
                <Link href="/testers" className="btn-primary" style={{ background: "#0a1728", borderColor: "#0a1728" }}>
                  Join Free as a Tester →
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
