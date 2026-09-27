"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard/owner", icon: "📊", label: "Overview" },
  { href: "/dashboard/owner/campaigns", icon: "📋", label: "Campaigns" },
  { href: "/dashboard/owner/campaigns/new", icon: "➕", label: "New Campaign" },
  { href: "/dashboard/owner/billing", icon: "💳", label: "Billing" },
];

const QUESTION_TYPES = [
  { value: "text", label: "Long Text", icon: "📝" },
  { value: "rating", label: "Rating (1–10)", icon: "⭐" },
  { value: "choice", label: "Multiple Choice", icon: "☑️" },
  { value: "yesno", label: "Yes / No", icon: "✅" },
];

interface Question {
  id: string;
  type: string;
  text: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [rewardPerTester, setRewardPerTester] = useState("");
  const [maxTesters, setMaxTesters] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: "q1", type: "text", text: "What was your first impression of the product?" },
    { id: "q2", type: "rating", text: "How would you rate the overall experience?" },
  ]);
  const [targetCountries, setTargetCountries] = useState("");
  const [targetAges, setTargetAges] = useState<string[]>([]);

  const STEPS = ["Campaign Basics", "Survey Questions", "Target Audience", "Review & Launch"];

  const addQuestion = () => {
    setQuestions([...questions, { id: `q${Date.now()}`, type: "text", text: "" }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof Question, value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const toggleAge = (age: string) => {
    setTargetAges(targetAges.includes(age) ? targetAges.filter((a) => a !== age) : [...targetAges, age]);
  };

  const totalBudget = parseFloat(rewardPerTester || "0") * parseInt(maxTesters || "0");

  const handleLaunch = () => {
    setSubmitting(true);
    setTimeout(() => router.push("/dashboard/owner"), 1500);
  };

  return (
    <DashboardLayout role="owner" navItems={NAV}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Create a Campaign</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Define your product test, set your reward, and launch to matched testers.
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 40, overflowX: "auto" }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: i < step ? "#00d4aa" : i === step ? "#6c63ff" : "var(--card-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13,
                    color: i <= step ? "white" : "var(--muted)",
                    transition: "all 0.3s",
                    flexShrink: 0,
                  }}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  style={{
                    fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                    color: i === step ? "var(--foreground)" : "var(--muted)",
                  }}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    height: 2, flex: 1,
                    background: i < step ? "#6c63ff" : "var(--card-border)",
                    transition: "background 0.3s",
                    marginBottom: 26,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Basics */}
        {step === 0 && (
          <div className="card" style={{ padding: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 28 }}>Campaign Basics</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <label className="label">Campaign Title *</label>
                <input className="input" placeholder="e.g. Mobile App UX Feedback" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea
                  className="input"
                  rows={4}
                  placeholder="Describe what you want testers to do and what kind of feedback you're looking for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: "vertical" }}
                />
              </div>
              <div>
                <label className="label">Product URL *</label>
                <input className="input" placeholder="https://your-app.com" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="label">Reward per Tester (USD) *</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>$</span>
                    <input
                      className="input" type="number" placeholder="8.00" min="1"
                      value={rewardPerTester} onChange={(e) => setRewardPerTester(e.target.value)}
                      style={{ paddingLeft: 28 }}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Max Testers *</label>
                  <input
                    className="input" type="number" placeholder="50" min="1"
                    value={maxTesters} onChange={(e) => setMaxTesters(e.target.value)}
                  />
                </div>
              </div>
              {totalBudget > 0 && (
                <div
                  style={{
                    padding: "14px 18px", borderRadius: 10,
                    background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.25)",
                  }}
                >
                  <span style={{ color: "#a78bfa", fontWeight: 600, fontSize: 14 }}>
                    Total campaign budget: <strong style={{ color: "#6c63ff" }}>${totalBudget.toFixed(2)}</strong>
                  </span>
                </div>
              )}
              <button
                className="btn-primary"
                style={{ alignSelf: "flex-end", padding: "12px 28px" }}
                onClick={() => setStep(1)}
                disabled={!title || !description || !productUrl || !rewardPerTester || !maxTesters}
              >
                Next: Survey →
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Questions */}
        {step === 1 && (
          <div className="card" style={{ padding: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Survey Questions</h2>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 28 }}>
              Add questions testers will answer when submitting feedback.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  style={{
                    padding: 20, borderRadius: 12,
                    border: "1px solid var(--card-border)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ color: "var(--muted)", fontWeight: 700, fontSize: 12, minWidth: 20 }}>Q{i + 1}</span>
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                      style={{
                        background: "var(--card)", border: "1px solid var(--card-border)",
                        borderRadius: 8, padding: "6px 10px", color: "var(--foreground)",
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeQuestion(q.id)}
                      style={{
                        marginLeft: "auto", background: "none", border: "none",
                        color: "#ff6b9d", cursor: "pointer", fontSize: 14, fontWeight: 700,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    className="input"
                    placeholder="Enter your question..."
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                  />
                </div>
              ))}
              <button
                onClick={addQuestion}
                className="btn-secondary"
                style={{ justifyContent: "center" }}
              >
                + Add Question
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
              <button className="btn-secondary" onClick={() => setStep(0)}>← Back</button>
              <button className="btn-primary" onClick={() => setStep(2)} disabled={questions.length === 0}>
                Next: Audience →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Audience */}
        {step === 2 && (
          <div className="card" style={{ padding: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Target Audience</h2>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 28 }}>
              Narrow down who sees your campaign. Leave blank to show to all testers.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label className="label">Countries (comma-separated)</label>
                <input
                  className="input"
                  placeholder="e.g. United States, United Kingdom, India"
                  value={targetCountries}
                  onChange={(e) => setTargetCountries(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Age Ranges</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["18–24", "25–34", "35–44", "45–54", "55+"].map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => toggleAge(age)}
                      style={{
                        padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                        border: `1px solid ${targetAges.includes(age) ? "#6c63ff" : "var(--card-border)"}`,
                        background: targetAges.includes(age) ? "rgba(108,99,255,0.15)" : "transparent",
                        color: targetAges.includes(age) ? "#a78bfa" : "var(--muted)",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >{age}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
              <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" onClick={() => setStep(3)}>Next: Review →</button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="card" style={{ padding: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 28 }}>Review & Launch</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Summary items */}
              {[
                { label: "Campaign Title", value: title },
                { label: "Product URL", value: productUrl },
                { label: "Reward per Tester", value: `$${rewardPerTester}` },
                { label: "Max Testers", value: maxTesters },
                { label: "Total Budget", value: `$${totalBudget.toFixed(2)}` },
                { label: "Questions", value: `${questions.length} question${questions.length !== 1 ? "s" : ""}` },
                { label: "Target Countries", value: targetCountries || "All countries" },
                { label: "Target Age Ranges", value: targetAges.length > 0 ? targetAges.join(", ") : "All ages" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 0", borderBottom: "1px solid var(--card-border)" }}
                >
                  <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}

              <div
                style={{
                  padding: "16px 20px", borderRadius: 12,
                  background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.25)",
                  fontSize: 13, color: "var(--muted)", lineHeight: 1.7,
                }}
              >
                💡 <strong style={{ color: "#00d4aa" }}>Heads up:</strong> Launching this campaign will lock{" "}
                <strong style={{ color: "white" }}>${totalBudget.toFixed(2)}</strong> from your wallet balance into escrow.
                Funds are only released when you approve submissions.
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
              <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button
                className="btn-primary"
                onClick={handleLaunch}
                disabled={submitting}
                style={{ opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? "Launching..." : "🚀 Launch Campaign"}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
