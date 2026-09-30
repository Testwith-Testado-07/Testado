"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TestersPage() {
  const G = "#224F34";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    age: "",
    frequency: "Whenever a suitable opportunity comes up",
    interests: "",
    why: "",
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
          <span className="section-label">For Testers</span>
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
            Turn Your Honest Opinions into a{" "}
            <em style={{ fontStyle: "italic" }}>Flexible Side-Income Stream.</em>
          </h1>
          <p style={{ fontSize: 18, color: "#475569", maxWidth: 820, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Testado gives people the chance to take part in eligible product, service and concept testing
            opportunities. You test, tell us what you really think, and may get paid or rewarded for the
            opportunities you are selected for.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
              maxWidth: 960,
              margin: "0 auto",
            }}
          >
            <div className="card" style={{ padding: 24, textAlign: "left" }}>
              <b style={{ color: G, display: "block", marginBottom: 4 }}>Earn for eligible tests</b>
              <span style={{ fontSize: 14, color: "#667085" }}>
                Payment or rewards apply to completed opportunities you are chosen for.
              </span>
            </div>
            <div className="card" style={{ padding: 24, textAlign: "left" }}>
              <b style={{ color: G, display: "block", marginBottom: 4 }}>Choose matching products</b>
              <span style={{ fontSize: 14, color: "#667085" }}>
                Take part in opportunities that fit your background and personal interests.
              </span>
            </div>
            <div className="card" style={{ padding: 24, textAlign: "left" }}>
              <b style={{ color: G, display: "block", marginBottom: 4 }}>No sales or pitching</b>
              <span style={{ fontSize: 14, color: "#667085" }}>
                Your value is in honest, direct feedback on what works and what doesn&apos;t.
              </span>
            </div>
          </div>
        </section>

        {/* ── APPLICATION SECTION ──────────────────────── */}
        <section style={{ padding: "80px 40px 100px", background: "#ffffff" }}>
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
            {/* Left 4-step sidebar */}
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
                  marginBottom: 12,
                }}
              >
                How the tester side works
              </h3>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
                We keep the first step simple. Give us the basic information needed to understand who you are
                and what kinds of opportunities fit you.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { n: "01", b: "Apply", s: "Share your contact details and general interests." },
                  { n: "02", b: "We match", s: "When an opportunity fits your profile, you may be invited." },
                  { n: "03", b: "Test & respond", s: "Complete the activity honestly and follow test instructions." },
                  { n: "04", b: "Earn rewards", s: "Eligible completed opportunities include payments or rewards." },
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

              <div style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                🔒 Tester applications are currently for people aged 18+.
              </div>
            </div>

            {/* Right Application Form */}
            <div className="card" style={{ padding: 36, border: "1.5px solid #e2e8e4" }}>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: 28,
                  color: G,
                  marginBottom: 6,
                }}
              >
                Become a Testado Tester
              </h2>
              <p style={{ color: "#667085", fontSize: 14, marginBottom: 24 }}>
                Only share the basic information needed for contact and matching. There is no payment required to apply.
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
                    ✓ Application received successfully!
                  </strong>
                  <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                    We’ll review your details and reach out when an eligible testing opportunity matches your profile.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label className="label" htmlFor="tester-name">
                      Full name <span style={{ color: G }}>*</span>
                    </label>
                    <input
                      id="tester-name"
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
                      <label className="label" htmlFor="tester-phone">
                        Phone number <span style={{ color: G }}>*</span>
                      </label>
                      <input
                        id="tester-phone"
                        name="phone"
                        className="input"
                        type="tel"
                        required
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="tester-email">
                        Email address <span style={{ color: G }}>*</span>
                      </label>
                      <input
                        id="tester-email"
                        name="email"
                        className="input"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label className="label" htmlFor="tester-city">
                        City <span style={{ color: G }}>*</span>
                      </label>
                      <input
                        id="tester-city"
                        name="city"
                        className="input"
                        required
                        placeholder="e.g. Mumbai, Pune, Bangalore"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="tester-age">
                        Age Confirmation <span style={{ color: G }}>*</span>
                      </label>
                      <select
                        id="tester-age"
                        name="age"
                        className="input"
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      >
                        <option value="">Select age range</option>
                        <option value="18–24">18–24</option>
                        <option value="25–34">25–34</option>
                        <option value="35–44">35–44</option>
                        <option value="45+">45+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="tester-frequency">How often would you like to test?</label>
                    <select
                      className="input"
                      id="tester-frequency"
                      name="frequency"
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    >
                      <option value="Whenever a suitable opportunity comes up">Whenever suitable</option>
                      <option value="A few times a month">A few times a month</option>
                      <option value="Occasionally">Occasionally</option>
                    </select>
                  </div>

                  <div>
                    <label className="label" htmlFor="tester-interests">What kinds of products interest you?</label>
                    <input
                      className="input"
                      id="tester-interests"
                      name="interests"
                      placeholder="e.g. mobile apps, tech, gaming, fashion, food delivery, finance"
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="tester-why">Why would you like to become a tester?</label>
                    <textarea
                      className="input"
                      rows={3}
                      id="tester-why"
                      name="why"
                      placeholder="Tell us a little about yourself and what you enjoy testing."
                      value={formData.why}
                      onChange={(e) => setFormData({ ...formData, why: e.target.value })}
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
                    🔒 Please share only the information required for your application. Do not submit passwords,
                    financial details, government IDs, or confidential documents. No payments are made through this website.
                  </div>

                  <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "#475569", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      id="tester-consent"
                      name="consent"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      style={{ marginTop: 2 }}
                    />
                    <span>
                      I understand that testing opportunities are not guaranteed and that payment/rewards apply only
                      to eligible opportunities I am selected for and complete.
                    </span>
                  </label>

                  <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: "flex-start" }}>
                    {loading ? "Submitting..." : "Apply to become a tester →"}
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
