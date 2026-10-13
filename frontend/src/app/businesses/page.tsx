"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BusinessesPage() {
  const BLUE_HEADINGS = "#07172e";
  const BLUE_PRIMARY = "#2563eb";
  const BLUE_ACCENT = "#78a8ff";
  const BG_LIGHT_BLUE = "#f4f8fd";
  const BG_ALT_BLUE = "#edf3fb";

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    testType: "",
    stage: "Concept / Idea",
    targetCustomer: "",
    decisionQuestion: "",
    additionalInfo: "",
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.consent) return;
    setLoading(true);
    setSubmissionError("");

    try {
      const response = await fetch("/api/business-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setSubmissionError(
          response.status === 503
            ? "Email delivery is not configured yet. Your request was not sent."
            : (errorData?.error || "We couldn't send your request. Please try again shortly.")
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmissionError("We couldn't send your request. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: BG_LIGHT_BLUE, color: "#081426", fontFamily: "var(--font-inter), 'Inter', sans-serif", overflowX: "hidden" }}>
      <Navbar />

      <main>
        {/* ── HERO ────────────────────── */}
        <section
          style={{
            padding: "160px 40px 90px",
            background: "linear-gradient(135deg, #06101d 0%, #0a1728 55%, #0f2240 100%)",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <span
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: 999,
                background: "rgba(120, 168, 255, 0.12)",
                color: BLUE_ACCENT,
                border: "1px solid rgba(120, 168, 255, 0.25)",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              For Businesses and Product Leaders • Market Intelligence
            </span>
            <div style={{ width: 48, height: 3, background: BLUE_PRIMARY, margin: "12px auto 20px", borderRadius: 2 }} />

            <h1
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(36px, 5.5vw, 68px)",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.15,
                maxWidth: 1020,
                margin: "20px auto",
                letterSpacing: "-0.5px",
              }}
            >
              De-Risk Your Launch with Validated{" "}
              <span style={{ color: BLUE_ACCENT }}>Market Insights</span> Before You Burn Capital.
            </h1>
            <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "#cbd5e1", maxWidth: 840, margin: "0 auto 40px", lineHeight: 1.75 }}>
              Companies don&apos;t succeed on casual opinions. They succeed on <strong>validated customer intelligence</strong>.
              Testado puts your product, app, or concept directly before your verified target demographic to measure demand, uncover buyer friction, and deliver high-conviction decision data.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 24,
                maxWidth: 960,
                margin: "0 auto",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  padding: 30,
                  borderRadius: 16,
                  border: "1px solid rgba(120, 168, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <strong style={{ display: "block", color: BLUE_ACCENT, fontSize: 17, marginBottom: 8, fontWeight: 700 }}>
                  Not Casual Opinions — Deep Market Insights
                </strong>
                <span style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.65 }}>
                  We evaluate purchase intent, price sensitivity, value proposition clarity, and competitor positioning across your genuine target market.
                </span>
              </div>

              <div
                style={{
                  padding: 30,
                  borderRadius: 16,
                  border: "1px solid rgba(120, 168, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <strong style={{ display: "block", color: BLUE_ACCENT, fontSize: 17, marginBottom: 8, fontWeight: 700 }}>
                  Not “Do You Like It?” — Actionable Decision Data
                </strong>
                <span style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.65 }}>
                  We uncover why potential buyers hesitate, what objections cause drop-off, and exactly what must be refined before scaling paid acquisition.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── ANALYSIS BAND (Lightish Blue Section) ──────────────── */}
        <section style={{ padding: "95px 40px", background: "#ffffff", borderBottom: "1px solid #dbe5f2" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 54 }}>
              <span className="section-label">Actionable Market Intelligence</span>
              <div className="divider" />
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(28px, 4vw, 46px)",
                  fontWeight: 800,
                  color: BLUE_HEADINGS,
                  marginTop: 8,
                }}
              >
                The Real Value is in the Market Insight Analysis
              </h2>
              <p style={{ color: "#64748b", fontSize: 16, maxWidth: 700, margin: "12px auto 0" }}>
                Raw comments are noisy. We synthesize real user behaviors into concrete market intelligence your leadership team can act on.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 30 }}>
              <div className="card" style={{ padding: 36, background: "linear-gradient(145deg, #ffffff, #f4f8fd)", border: "1px solid #dbe5f2" }}>
                <div style={{ display: "inline-block", background: "#eff6ff", color: BLUE_PRIMARY, padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, marginBottom: 14 }}>
                  BEHAVIORAL SIGNALS
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 23, color: BLUE_HEADINGS, marginBottom: 12 }}>
                  What Your Target Market Reveals
                </h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                  We observe and analyze initial perception, perceived value, feature adoption, and actual willingness to pay.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    "Immediate value proposition comprehension",
                    "Purchase intent and pricing sensitivity thresholds",
                    "Onboarding friction and points of confusion",
                    "Perceived differentiation versus existing alternatives",
                  ].map((s) => (
                    <div key={s} style={{ padding: "11px 14px", borderRadius: 10, background: "#eff6ff", color: "#1e3a8a", fontSize: 13, fontWeight: 700, border: "1px solid #dbeafe" }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 36, background: "linear-gradient(145deg, #ffffff, #f4f8fd)", border: "1px solid #dbe5f2" }}>
                <div style={{ display: "inline-block", background: "#eff6ff", color: BLUE_PRIMARY, padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, marginBottom: 14 }}>
                  STRATEGIC DELIVERABLES
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 23, color: BLUE_HEADINGS, marginBottom: 12 }}>
                  Executive Decision Metrics
                </h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                  We look across all participant interactions to deliver synthesized market insights that eliminate guesswork.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    "Recurring customer objections & dealbreaker patterns",
                    "Target demographic readiness and demand indicators",
                    "Prioritized pre-launch product improvements",
                    "High-conviction Go / Iterate / Rethink recommendation",
                  ].map((s) => (
                    <div key={s} style={{ padding: "11px 14px", borderRadius: 10, background: "#eff6ff", color: "#1e3a8a", fontSize: 13, fontWeight: 700, border: "1px solid #dbeafe" }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTAKE FORM SECTION (Very Lightish Blue Background) ──── */}
        <section id="business-form" style={{ padding: "95px 40px", background: BG_ALT_BLUE }}>
          <div
            style={{
              maxWidth: 1140,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 36,
              alignItems: "start",
            }}
          >
            {/* Left 4-step card */}
            <div
              className="card"
              style={{
                background: "linear-gradient(145deg, #06101d 0%, #0b1d35 100%)",
                color: "#ffffff",
                padding: 36,
                position: "sticky",
                top: 100,
                border: "1px solid rgba(120, 168, 255, 0.2)",
                boxShadow: "0 18px 50px rgba(6, 16, 29, 0.2)",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: BLUE_ACCENT, textTransform: "uppercase" }}>
                LAUNCH VALIDATION
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: 26,
                  lineHeight: 1.2,
                  margin: "8px 0 12px",
                  color: "#ffffff",
                }}
              >
                Define Your Market Objective
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.65, marginBottom: 28 }}>
                The clearer your business question, the more decisive the market insights. Share what you are building, who your target customer is, and what you need to validate.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { n: "01", b: "Your Product or Offer", s: "App, service, physical product, or concept." },
                  { n: "02", b: "Target Demographic", s: "Describe the specific market persona to evaluate it." },
                  { n: "03", b: "Key Market Question", s: "What critical uncertainty must be proven before launch?" },
                  { n: "04", b: "Test & Insights Scoping", s: "We design the test protocol and deliver clear market data." },
                ].map((step) => (
                  <div
                    key={step.n}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(120, 168, 255, 0.15)",
                    }}
                  >
                    <b style={{ display: "block", fontSize: 13, color: BLUE_ACCENT, marginBottom: 3 }}>
                      {step.n} — {step.b}
                    </b>
                    <span style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>{step.s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Form Card (Clean White Card) */}
            <div className="card" style={{ padding: 36, background: "#ffffff", border: "1.5px solid #dbe5f2" }}>
              <div style={{ display: "inline-block", background: "#eff6ff", color: BLUE_PRIMARY, padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 10 }}>
                MARKET RESEARCH ENQUIRY
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: 28,
                  color: BLUE_HEADINGS,
                  marginBottom: 6,
                }}
              >
                Request a Market Insights Test
              </h2>
              <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
                Share your initial requirements below. Our testing strategists will contact you to structure a targeted evaluation.
              </p>

              {submitted ? (
                <div
                  style={{
                    padding: "28px 24px",
                    borderRadius: 14,
                    background: "#eff6ff",
                    border: `1.5px solid ${BLUE_PRIMARY}`,
                    color: BLUE_HEADINGS,
                  }}
                >
                  <strong style={{ fontSize: 18, display: "block", marginBottom: 8, color: BLUE_PRIMARY }}>
                    Request Received Successfully!
                  </strong>
                  <p style={{ fontSize: 14, margin: 0, lineHeight: 1.65, color: "#334155" }}>
                    We have received your testing enquiry. Our team will review your market validation goals and contact you directly to discuss the testing framework, participant demographics, and next steps.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label className="label" htmlFor="business-name">
                      Your name <span style={{ color: BLUE_PRIMARY }}>*</span>
                    </label>
                    <input
                      id="business-name"
                      name="name"
                      className="input"
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label className="label" htmlFor="business-company">
                        Business / Brand <span style={{ color: BLUE_PRIMARY }}>*</span>
                      </label>
                      <input
                        id="business-company"
                        name="company"
                        className="input"
                        required
                        placeholder="Company or Brand name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="business-phone">
                        Phone number <span style={{ color: BLUE_PRIMARY }}>*</span>
                      </label>
                      <input
                        id="business-phone"
                        name="phone"
                        className="input"
                        type="tel"
                        required
                        placeholder="+91 0000000000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="business-email">
                      Email address <span style={{ color: BLUE_PRIMARY }}>*</span>
                    </label>
                    <input
                      id="business-email"
                      name="email"
                      className="input"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label className="label" htmlFor="business-test-type">
                        What are you testing? <span style={{ color: BLUE_PRIMARY }}>*</span>
                      </label>
                      <select
                        id="business-test-type"
                        name="testType"
                        className="input"
                        required
                        value={formData.testType}
                        onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                      >
                        <option value="">Select type</option>
                        <option value="Product">Digital App / Software</option>
                        <option value="Physical Product">Physical Product</option>
                        <option value="Service">Service / Offering</option>
                        <option value="Concept">New Concept / Value Proposition</option>
                      </select>
                    </div>

                    <div>
                      <label className="label" htmlFor="business-stage">Current stage</label>
                      <select
                        className="input"
                        id="business-stage"
                        name="stage"
                        value={formData.stage}
                        onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      >
                        <option value="Concept / Idea">Concept / Idea</option>
                        <option value="Prototype / MVP">Prototype / MVP</option>
                        <option value="Ready to launch">Ready to launch</option>
                        <option value="Already launched (Optimizing)">Already launched (Optimizing)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="business-target-customer">
                      Target customer demographic <span style={{ color: BLUE_PRIMARY }}>*</span>
                    </label>
                    <textarea
                      id="business-target-customer"
                      name="targetCustomer"
                      className="input"
                      rows={3}
                      required
                      placeholder="Describe the audience you need market insights from (e.g. age range, city/location, spending habits, profession, interests)."
                      value={formData.targetCustomer}
                      onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="business-decision-question">
                      Key market question or decision to validate <span style={{ color: BLUE_PRIMARY }}>*</span>
                    </label>
                    <textarea
                      id="business-decision-question"
                      name="decisionQuestion"
                      className="input"
                      rows={3}
                      required
                      placeholder="e.g. Will users pay for this tier? What causes hesitation during signup? Is the core value proposition immediately obvious?"
                      value={formData.decisionQuestion}
                      onChange={(e) => setFormData({ ...formData, decisionQuestion: e.target.value })}
                    />
                  </div>

                  <div
                    style={{
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      fontSize: 12,
                      color: "#1e3a8a",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong style={{ color: 'inherit' }}>Strict Privacy:</strong> Please share only non-confidential information suitable for initial scoping. Do not submit passwords, API keys, or financial credentials. No payments are made through this website.
                  </div>

                  <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "#475569", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      id="business-consent"
                      name="consent"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      style={{ marginTop: 2 }}
                    />
                    <span>
                      I confirm that the information submitted is suitable for an initial enquiry and does not contain confidential information.
                    </span>
                  </label>

                  {submissionError && (
                    <p role="alert" style={{ color: "#dc2626", fontSize: 13, margin: 0, fontWeight: 600 }}>
                      {submissionError}
                    </p>
                  )}

                  <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: "flex-start", padding: "13px 30px" }}>
                    {loading ? "Submitting..." : "Discuss Market Insights for My Launch ↗"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
