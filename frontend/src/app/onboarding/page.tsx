"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const OWNER_STEPS = [
  { id: "company", label: "Company Details" },
  { id: "done", label: "All Set" },
];
const TESTER_STEPS = [
  { id: "demographics", label: "About You" },
  { id: "interests", label: "Interests & Devices" },
  { id: "done", label: "All Set" },
];

const INTERESTS = [
  "Fintech", "Healthcare", "Gaming", "E-commerce", "SaaS", "Education",
  "Travel", "Food & Drink", "Fitness", "Social Media", "Productivity", "AI Tools",
];
const DEVICES = ["iOS", "Android", "Desktop (Mac)", "Desktop (Windows)", "Tablet"];
const AGE_RANGES = ["18–24", "25–34", "35–44", "45–54", "55+"];

export default function OnboardingPage() {
  // Simulated: detect role from URL or default to 'tester'
  const [role] = useState<"owner" | "tester">("tester"); // change to 'owner' to test owner flow
  const steps = role === "owner" ? OWNER_STEPS : TESTER_STEPS;
  const [step, setStep] = useState(0);

  // Owner fields
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");

  // Tester fields
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const toggleItem = (item: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const isDone = steps[step]?.id === "done";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="orb" style={{ width: 500, height: 500, background: "rgba(108,99,255,0.1)", top: -100, right: -100 }} />
      <div className="orb" style={{ width: 400, height: 400, background: "rgba(0,212,170,0.08)", bottom: -100, left: -100 }} />

      <div style={{ width: "100%", maxWidth: 560, position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <Image
              src="/assets/testado-logo-transparent.png"
              alt="Testado - Real People. Real Insights. Real Problems."
              width={1531}
              height={382}
              loading="eager"
              sizes="220px"
              style={{ width: 220, height: 55, objectFit: "contain" }}
            />
          </div>

          {/* Progress */}
          {!isDone && (
            <>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
                {steps.slice(0, -1).map((s, i) => (
                  <div
                    key={s.id}
                    style={{
                      height: 4, width: 40, borderRadius: 4,
                      background: i <= step ? "#6c63ff" : "var(--card-border)",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                Step {step + 1} of {steps.length - 1}
              </p>
            </>
          )}
        </div>

        {/* OWNER: Company Details */}
        {role === "owner" && steps[step]?.id === "company" && (
          <div className="card" style={{ padding: 36 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Tell us about your company</h1>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 32 }}>
              This helps us match your campaigns with the right testers.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="label" htmlFor="onboarding-company">Company Name *</label>
                <input id="onboarding-company" name="companyName" className="input" placeholder="Acme Inc." value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="onboarding-industry">Industry</label>
                <select
                  className="input"
                  id="onboarding-industry"
                  name="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  style={{ appearance: "none" }}
                >
                  <option value="">Select industry...</option>
                  {INTERESTS.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="onboarding-website">Website (optional)</label>
                <input id="onboarding-website" name="website" className="input" placeholder="https://yourcompany.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <button
                className="btn-primary"
                style={{ justifyContent: "center", padding: "14px" }}
                onClick={() => setStep(step + 1)}
                disabled={!companyName}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* TESTER: Demographics */}
        {role === "tester" && steps[step]?.id === "demographics" && (
          <div className="card" style={{ padding: 36 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Tell us about yourself</h1>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 32 }}>
              We use this to match you with relevant campaigns.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div className="label">Age Range *</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {AGE_RANGES.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAgeRange(a)}
                      style={{
                        padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                        border: `1px solid ${ageRange === a ? "#6c63ff" : "var(--card-border)"}`,
                        background: ageRange === a ? "rgba(108,99,255,0.15)" : "transparent",
                        color: ageRange === a ? "#a78bfa" : "var(--muted)",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >{a}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="label">Gender</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Male", "Female", "Non-binary", "Prefer not to say"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      style={{
                        padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                        border: `1px solid ${gender === g ? "#6c63ff" : "var(--card-border)"}`,
                        background: gender === g ? "rgba(108,99,255,0.15)" : "transparent",
                        color: gender === g ? "#a78bfa" : "var(--muted)",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label" htmlFor="onboarding-country">Country *</label>
                <input
                  className="input"
                  id="onboarding-country"
                  name="country"
                  placeholder="e.g. United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <button
                className="btn-primary"
                style={{ justifyContent: "center", padding: "14px" }}
                onClick={() => setStep(step + 1)}
                disabled={!ageRange || !country}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* TESTER: Interests & Devices */}
        {role === "tester" && steps[step]?.id === "interests" && (
          <div className="card" style={{ padding: 36 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Your interests & devices</h1>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 32 }}>
              Get campaigns that match what you actually care about.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <div className="label">Interests (pick a few)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleItem(interest, selectedInterests, setSelectedInterests)}
                      style={{
                        padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                        border: `1px solid ${selectedInterests.includes(interest) ? "#00d4aa" : "var(--card-border)"}`,
                        background: selectedInterests.includes(interest) ? "rgba(0,212,170,0.12)" : "transparent",
                        color: selectedInterests.includes(interest) ? "#00d4aa" : "var(--muted)",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >{interest}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="label">Devices you use</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {DEVICES.map((device) => (
                    <button
                      key={device}
                      type="button"
                      onClick={() => toggleItem(device, selectedDevices, setSelectedDevices)}
                      style={{
                        padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                        border: `1px solid ${selectedDevices.includes(device) ? "#6c63ff" : "var(--card-border)"}`,
                        background: selectedDevices.includes(device) ? "rgba(108,99,255,0.12)" : "transparent",
                        color: selectedDevices.includes(device) ? "#a78bfa" : "var(--muted)",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >{device}</button>
                  ))}
                </div>
              </div>
              <button
                className="btn-primary"
                style={{ justifyContent: "center", padding: "14px" }}
                onClick={() => setStep(step + 1)}
              >
                Finish Setup →
              </button>
            </div>
          </div>
        )}

        {/* DONE state */}
        {isDone && (
          <div className="card" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
              You&apos;re all set!
            </h1>
            <p style={{ fontSize: 15, color: "var(--muted)", marginBottom: 36, lineHeight: 1.7 }}>
              {role === "owner"
                ? "Your company profile is ready. Time to create your first campaign."
                : "Your profile is live! Start discovering test campaigns that match your interests."}
            </p>
            <Link
              href={role === "owner" ? "/dashboard/owner" : "/dashboard/tester"}
              className="btn-primary"
              style={{ fontSize: 16, padding: "14px 32px", textDecoration: "none" }}
            >
              Go to Dashboard →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
