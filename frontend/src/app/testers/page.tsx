"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TesterFeatures from "@/components/TesterFeatures";
import { sendTesterApplicationEmail } from "@/utils/emailjs";

export default function TestersPage() {
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
    phone: "",
    email: "",
    city: "",
    age: "",
    frequency: "Whenever a suitable opportunity comes up",
    interests: "",
    why: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionError("");

    try {
      let emailjsSent = false;
      if (
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY &&
        process.env.NEXT_PUBLIC_EMAILJS_TESTER_TEMPLATE_ID
      ) {
        try {
          await sendTesterApplicationEmail({
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            city: formData.city,
            age: formData.age,
            frequency: formData.frequency,
            interests: formData.interests,
            why: formData.why,
          });
          emailjsSent = true;
        } catch (emailjsErr) {
          console.warn("EmailJS send failed, falling back to API route:", emailjsErr);
        }
      }

      if (!emailjsSent) {
        const response = await fetch("/api/tester-applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, consent: true }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          setSubmissionError(
            response.status === 503
              ? "Email delivery is not configured yet. Your application was not sent."
              : (errorData?.error || "We couldn't send your application. Please try again shortly.")
          );
          return;
        }
      }

      setSubmitted(true);
    } catch {
      setSubmissionError("We couldn't send your application. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: BG_LIGHT_BLUE, color: "#081426", fontFamily: "var(--font-inter), 'Inter', sans-serif", overflowX: "hidden" }}>
      <Navbar />

      <main>
        {/* ── HERO (Darker Blue Headings + Lightish Blue BG) ─── */}
        <section style={{ padding: "160px 40px 80px", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 999,
              background: "#eff6ff",
              border: "1.5px solid #bfdbfe",
              color: BLUE_PRIMARY,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            100% Free to Join • Zero Fees • Zero Investment
          </div>
          <div className="divider" />
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(36px, 5.5vw, 68px)",
              fontWeight: 800,
              color: BLUE_HEADINGS,
              lineHeight: 1.15,
              maxWidth: 980,
              margin: "20px auto",
              letterSpacing: "-0.5px",
            }}
          >
            Earn Real Cash by Becoming a Tester —{" "}
            <span style={{ color: BLUE_PRIMARY }}>Completely FREE.</span>
          </h1>
          <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "#475569", maxWidth: 840, margin: "0 auto 36px", lineHeight: 1.75 }}>
            You don&apos;t need experience, and you will <strong>never be asked to pay a single rupee</strong>.
            Sign up for free, get invited to explore unreleased products in your free time, share your honest reactions, and <strong>get paid directly</strong>.
          </p>

          <TesterFeatures />
        </section>

        {/* ── WHY IS IT 100% FREE EXPLANATION BANNER ─────── */}
        <section style={{ padding: "40px 40px", maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #06101d 0%, #0d2244 100%)",
              color: "#ffffff",
              padding: "36px 40px",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              gap: 28,
              flexWrap: "wrap",
              border: "1px solid rgba(120, 168, 255, 0.2)",
              boxShadow: "0 14px 40px rgba(6, 16, 29, 0.15)",
            }}
          >
            <div style={{ fontSize: 44, flexShrink: 0 }}></div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px", color: "#ffffff" }}>
                How does it work? Why is testing 100% Free for you?
              </h3>
              <p style={{ margin: 0, fontSize: 14, color: "#cbd5e1", lineHeight: 1.7 }}>
                Companies and founders pay Testado to test their new ideas and gather authentic user intelligence before launching.
                We share those funds with you for your time and honest evaluations. That is why you <strong>never pay anything</strong> to test, and you <strong>get rewarded for your participation</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* ── APPLICATION SECTION (Lightish Blue Background) ── */}
        <section style={{ padding: "70px 40px 100px", background: BG_ALT_BLUE }}>
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
                background: "linear-gradient(145deg, #06101d 0%, #0b1d35 100%)",
                color: "#ffffff",
                padding: 36,
                position: "sticky",
                top: 100,
                border: "1px solid rgba(120, 168, 255, 0.2)",
                boxShadow: "0 18px 50px rgba(6, 16, 29, 0.25)",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: BLUE_ACCENT, textTransform: "uppercase" }}>
                ZERO BARRIER TO ENTRY
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: 26,
                  margin: "8px 0 12px",
                  color: "#ffffff",
                }}
              >
                How You Earn as a Tester
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
                The process is straightforward and completely free from start to finish.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { n: "01", b: "Apply 100% Free", s: "Fill out the 60-second form below. No fee or credit card required." },
                  { n: "02", b: "Get Matched", s: "Receive invitations when products matching your interests need testing." },
                  { n: "03", b: "Test & Review", s: "Use the product or app honestly and give your genuine evaluation." },
                  { n: "04", b: "Get Paid", s: "Receive payment or rewards directly for eligible completed tests." },
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

              <div style={{ marginTop: 24, fontSize: 12, color: "#94a3b8" }}>
                Tester applications are currently open for individuals aged 18+.
              </div>
            </div>

            {/* Right Application Form (Clean White Card) */}
            <div className="card" style={{ padding: 36, background: "#ffffff", border: "1.5px solid #dbe5f2" }}>
              <div style={{ display: "inline-block", background: "#eff6ff", color: BLUE_PRIMARY, padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 10 }}>
                FREE REGISTRATION
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: 28,
                  color: BLUE_HEADINGS,
                  marginBottom: 6,
                }}
              >
                Join as a Testado Tester
              </h2>
              <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
                Fill out the basic details so we can match you with suitable tests. <strong>There is never any cost to join.</strong>
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
                    Application Received for FREE!
                  </strong>
                  <p style={{ fontSize: 14, margin: 0, lineHeight: 1.65, color: "#334155" }}>
                    Thank you! We will review your profile and contact you whenever an eligible testing opportunity matches your background. Remember, there is never any fee.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label className="label" htmlFor="tester-name">
                      Full name <span style={{ color: BLUE_PRIMARY }}>*</span>
                    </label>
                    <input
                      id="tester-name"
                      name="name"
                      className="input"
                      required
                      autoComplete="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label className="label" htmlFor="tester-phone">
                        Phone number <span style={{ color: BLUE_PRIMARY }}>*</span>
                      </label>
                      <input
                        id="tester-phone"
                        name="phone"
                        className="input"
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="tester-email">
                        Email address <span style={{ color: BLUE_PRIMARY }}>*</span>
                      </label>
                      <input
                        id="tester-email"
                        name="email"
                        className="input"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label className="label" htmlFor="tester-city">
                        City <span style={{ color: BLUE_PRIMARY }}>*</span>
                      </label>
                      <input
                        id="tester-city"
                        name="city"
                        className="input"
                        required
                        autoComplete="address-level2"
                        placeholder="e.g. Mumbai, Delhi, Bangalore"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="tester-age">
                        Age Confirmation <span style={{ color: BLUE_PRIMARY }}>*</span>
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
                      placeholder="e.g. mobile apps, games, gadgets, e-commerce, food, fashion"
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
                      placeholder="Tell us a little about yourself and what kinds of products you enjoy testing."
                      value={formData.why}
                      onChange={(e) => setFormData({ ...formData, why: e.target.value })}
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
                    <strong>100% Free Guarantee:</strong> Testado will never charge you any fee to apply, join, or receive testing opportunities. Do not submit passwords or financial information.
                  </div>

                  {submissionError && (
                    <p role="alert" style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>
                      {submissionError}
                    </p>
                  )}

                  <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: "flex-start", padding: "13px 30px" }}>
                    {loading ? "Submitting..." : "Apply Free to Become a Tester ↗"}
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
