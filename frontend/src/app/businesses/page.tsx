"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BusinessesPage() {
  const G = "#224F34";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    testType: "",
    stage: "Ready to test",
    targetCustomer: "",
    decisionQuestion: "",
    additionalInfo: "",
    consent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div style={{ background: "#F8F9FA", color: "#101828", fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>
      <Navbar />

      <main>
        {/* ── HERO ─────────────────────────────────────── */}
        <section style={{ padding: "160px 40px 80px", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <span className="section-label">For Businesses & Idea Owners</span>
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
            Before You Spend More, Find Out Whether the Market is{" "}
            <em style={{ fontStyle: "italic" }}>Likely to Say Yes.</em>
          </h1>
          <p style={{ fontSize: 18, color: "#475569", maxWidth: 820, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Testado helps you put your product, service, concept or idea in front of people who match your
            target customer — then we analyze the feedback to help you understand what is working, what is not,
            and what should change.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
              maxWidth: 900,
              margin: "0 auto",
              textAlign: "left",
            }}
          >
            <div className="card" style={{ padding: 28, borderLeft: `4px solid ${G}` }}>
              <strong style={{ display: "block", color: G, fontSize: 16, marginBottom: 6 }}>
                Not just “collect feedback.”
              </strong>
              <span style={{ color: "#667085", fontSize: 14, lineHeight: 1.6 }}>
                We structure the test around the decision you need to make and look for meaningful patterns in the responses.
              </span>
            </div>

            <div className="card" style={{ padding: 28, borderLeft: `4px solid ${G}` }}>
              <strong style={{ display: "block", color: G, fontSize: 16, marginBottom: 6 }}>
                Not just “ask people if they like it.”
              </strong>
              <span style={{ color: "#667085", fontSize: 14, lineHeight: 1.6 }}>
                We help you see the reasons behind reactions — interest, confusion, friction, appeal, objections and adoption signals.
              </span>
            </div>
          </div>
        </section>

        {/* ── ANALYSIS BAND ────────────────────────────── */}
        <section style={{ padding: "90px 40px", background: "#ffffff" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <span className="section-label">What We Help You Learn</span>
              <div className="divider" />
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 800,
                  color: G,
                }}
              >
                The Real Value is in the Analysis After the Feedback
              </h2>
              <p style={{ color: "#667085", fontSize: 15, maxWidth: 680, margin: "12px auto 0" }}>
                A useful test helps you understand where the offer is strong, where it loses people, and what to do next.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
              <div className="card" style={{ padding: 36 }}>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 22, color: G, marginBottom: 10 }}>
                  What people respond to
                </h3>
                <p style={{ color: "#667085", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                  We examine first impressions, perceived value, product appeal, clarity, usability and purchase intent.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["What immediately makes sense", "What creates interest or excitement", "What creates hesitation or confusion"].map((s) => (
                    <div key={s} style={{ padding: "10px 14px", borderRadius: 8, background: "#f1f4f2", color: G, fontSize: 13, fontWeight: 700 }}>
                      ✓ {s}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 36 }}>
                <h3 style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: 22, color: G, marginBottom: 10 }}>
                  What the responses are telling you
                </h3>
                <p style={{ color: "#667085", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                  We identify recurring themes and signals that help you decide whether to proceed, adjust, or rethink.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Patterns across relevant participants", "Repeated objections or friction points", "Areas worth changing before launch"].map((s) => (
                    <div key={s} style={{ padding: "10px 14px", borderRadius: 8, background: "#f1f4f2", color: G, fontSize: 13, fontWeight: 700 }}>
                      ✦ {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTAKE FORM SECTION ──────────────────────── */}
        <section id="business-form" style={{ padding: "90px 40px", background: "#F8F9FA" }}>
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
                background: G,
                color: "#ffffff",
                padding: 36,
                position: "sticky",
                top: 100,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: 26,
                  lineHeight: 1.2,
                  marginBottom: 12,
                }}
              >
                Start with the business question.
              </h3>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
                The stronger the question, the more useful the test. Tell us what you are building, who you want
                to understand, and what decision you need help making.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { n: "01", b: "Tell us what you have", s: "Product, service, idea or concept." },
                  { n: "02", b: "Tell us who matters", s: "Describe the customer you need feedback from." },
                  { n: "03", b: "Tell us what you need to know", s: "Share the question or decision behind the test." },
                  { n: "04", b: "We discuss the test", s: "We’ll contact you to understand requirements and next steps." },
                ].map((step) => (
                  <div
                    key={step.n}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <b style={{ display: "block", fontSize: 13, color: "var(--mint)", marginBottom: 2 }}>
                      {step.n} — {step.b}
                    </b>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{step.s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Form Card */}
            <div className="card" style={{ padding: 36 }}>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: 28,
                  color: G,
                  marginBottom: 6,
                }}
              >
                Discuss a Testado Test
              </h2>
              <p style={{ color: "#667085", fontSize: 14, marginBottom: 24 }}>
                Give us the basics first. We’ll speak with you about the best way to structure the testing requirement.
              </p>

              {submitted ? (
                <div
                  style={{
                    padding: "24px 20px",
                    borderRadius: 8,
                    background: "rgba(194,239,212,0.3)",
                    border: `1.5px solid ${G}`,
                    color: G,
                  }}
                >
                  <strong style={{ fontSize: 16, display: "block", marginBottom: 6 }}>
                    ✓ Request received successfully!
                  </strong>
                  <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                    We’ll review your testing goals and contact you directly to discuss setup and timeline.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label className="label">
                      Your name <span style={{ color: G }}>*</span>
                    </label>
                    <input
                      className="input"
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label className="label">
                        Business / Brand <span style={{ color: G }}>*</span>
                      </label>
                      <input
                        className="input"
                        required
                        placeholder="Company name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">
                        Phone number <span style={{ color: G }}>*</span>
                      </label>
                      <input
                        className="input"
                        type="tel"
                        required
                        placeholder="+91 9325694956"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      Email address <span style={{ color: G }}>*</span>
                    </label>
                    <input
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
                      <label className="label">
                        Testing type <span style={{ color: G }}>*</span>
                      </label>
                      <select
                        className="input"
                        required
                        value={formData.testType}
                        onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                      >
                        <option value="">Select type</option>
                        <option value="Product">Product (App / Physical)</option>
                        <option value="Service">Service</option>
                        <option value="Idea">Idea</option>
                        <option value="Concept">Concept</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Stage</label>
                      <select
                        className="input"
                        value={formData.stage}
                        onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      >
                        <option value="Just an idea">Just an idea</option>
                        <option value="Prototype">Prototype</option>
                        <option value="Ready to test">Ready to test</option>
                        <option value="Already launched">Already launched</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      Target customer <span style={{ color: G }}>*</span>
                    </label>
                    <textarea
                      className="input"
                      rows={3}
                      required
                      placeholder="Describe the people you want feedback from — e.g. age range, location, interests, habits."
                      value={formData.targetCustomer}
                      onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">
                      Decision or question to answer <span style={{ color: G }}>*</span>
                    </label>
                    <textarea
                      className="input"
                      rows={3}
                      required
                      placeholder="e.g. Will people understand the offer? What makes them hesitate?"
                      value={formData.decisionQuestion}
                      onChange={(e) => setFormData({ ...formData, decisionQuestion: e.target.value })}
                    />
                  </div>

                  <div
                    style={{
                      padding: "12px 14px",
                      borderRadius: 8,
                      background: "#f1f4f2",
                      fontSize: 12,
                      color: "#475569",
                      lineHeight: 1.5,
                    }}
                  >
                    🔒 Please share only the information required for your enquiry. Do not submit passwords, financial
                    details, government IDs, trade secrets, or confidential credentials. No payments are made through
                    this website.
                  </div>

                  <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "#475569", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      style={{ marginTop: 2 }}
                    />
                    <span>
                      I confirm that the information submitted is suitable for an initial enquiry and does not contain confidential information.
                    </span>
                  </label>

                  <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: "flex-start" }}>
                    {loading ? "Submitting..." : "Talk to Testado about my test →"}
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
