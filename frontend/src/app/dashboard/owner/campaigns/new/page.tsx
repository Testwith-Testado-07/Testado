"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/Toast";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Alert } from "@/components/ui/alert";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";

const QUESTION_TYPES = [
  { value: "text", label: "Long Text" },
  { value: "rating", label: "Rating (1–10)" },
  { value: "choice", label: "Multiple Choice" },
  { value: "yesno", label: "Yes / No" },
];

interface Question {
  id: string;
  type: string;
  text: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  const { toast } = useToast();

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

  const handleLaunch = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Sign in to publish a campaign.");
      if (!Number.isFinite(Number(rewardPerTester)) || Number(rewardPerTester) <= 0) {
        throw new Error("Enter a reward greater than zero.");
      }
      if (!Number.isInteger(Number(maxTesters)) || Number(maxTesters) <= 0) {
        throw new Error("Enter a whole number of testers greater than zero.");
      }
      if (questions.length === 0 || questions.some((question) => !question.text.trim())) {
        throw new Error("Add text to every survey question before publishing.");
      }

      const { error } = await supabase.from("campaigns").insert({
        owner_id: user.id,
        title: title.trim(),
        description: description.trim(),
        product_url: productUrl.trim(),
        reward_amount: Number(rewardPerTester),
        max_testers: Number(maxTesters),
        questions,
        target_countries: targetCountries.split(",").map((country) => country.trim()).filter(Boolean),
        target_ages: targetAges,
        status: "active",
      });
      if (error) throw error;

      toast.success("Campaign launched. Testers can now discover it.");
      router.push("/dashboard/owner/campaigns");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "The campaign could not be published.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <PageHeader
          title="Create a campaign"
          description="Define your product test, set your reward, and launch to matched testers."
        />

        {/* Progress Steps */}
        <ol aria-label="Campaign setup progress" style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 40, overflowX: "auto", listStyle: "none", padding: 0 }}>
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: i < step ? "#059669" : i === step ? "#2563eb" : "var(--card-border)",
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
                    background: i < step ? "#2563eb" : "var(--card-border)",
                    transition: "background 0.3s",
                    marginBottom: 26,
                  }}
                />
              )}
            </li>
          ))}
        </ol>

        {/* Step 0: Basics */}
        {step === 0 && (
          <div className="card card--static" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 28 }}>Campaign Basics</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div>
                <label className="label" htmlFor="campaign-title">Campaign Title *</label>
                <Input id="campaign-title" name="title" placeholder="e.g. Mobile App UX Feedback" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="campaign-description">Description *</label>
                <Textarea
                  id="campaign-description"
                  name="description"
                  rows={4}
                  placeholder="Describe what you want testers to do and what kind of feedback you're looking for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="campaign-product-url">Product URL *</label>
                <Input id="campaign-product-url" name="productUrl" type="url" placeholder="https://your-app.com" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                <div>
                  <label className="label" htmlFor="campaign-reward">Reward per Tester (USD) *</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>$</span>
                    <Input
                      className="pl-7" type="number" placeholder="8.00" min="1"
                      id="campaign-reward" name="rewardPerTester"
                      value={rewardPerTester} onChange={(e) => setRewardPerTester(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="campaign-max-testers">Max Testers *</label>
                  <Input
                    type="number" placeholder="50" min="1"
                    id="campaign-max-testers" name="maxTesters"
                    value={maxTesters} onChange={(e) => setMaxTesters(e.target.value)}
                  />
                </div>
              </div>
              {totalBudget > 0 && (
                <div
                  style={{
                    padding: "14px 18px", borderRadius: 10,
                    background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.25)",
                  }}
                >
                  <span style={{ color: "#1d4ed8", fontWeight: 600, fontSize: 14 }}>
                    Total campaign budget: <strong style={{ color: "#2563eb" }}>${totalBudget.toFixed(2)}</strong>
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
          <div className="card card--static" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
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
                    background: "var(--bg)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ color: "var(--muted)", fontWeight: 700, fontSize: 12, minWidth: 20 }}>Q{i + 1}</span>
                    <NativeSelect
                      id={`question-type-${q.id}`}
                      name={`question-type-${q.id}`}
                      aria-label={`Question ${i + 1} type`}
                      value={q.type}
                      onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
                      className="h-8 w-auto rounded-lg bg-white px-2.5 pr-8 text-xs font-semibold"
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </NativeSelect>
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      aria-label={`Remove question ${i + 1}`}
                      className="ml-auto grid size-8 place-items-center rounded-lg text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </div>
                  <Input
                    id={`question-text-${q.id}`}
                    name={`question-text-${q.id}`}
                    aria-label={`Question ${i + 1}`}
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
          <div className="card card--static" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Target Audience</h2>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 28 }}>
              Narrow down who sees your campaign. Leave blank to show to all testers.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <label className="label" htmlFor="campaign-countries">Countries (comma-separated)</label>
                <Input
                  id="campaign-countries"
                  name="targetCountries"
                  placeholder="e.g. United States, United Kingdom, India"
                  value={targetCountries}
                  onChange={(e) => setTargetCountries(e.target.value)}
                />
              </div>
              <div>
                <div className="label" id="campaign-ages-label">Age Ranges</div>
                <div role="group" aria-labelledby="campaign-ages-label" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["18–24", "25–34", "35–44", "45–54", "55+"].map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => toggleAge(age)}
                      aria-pressed={targetAges.includes(age)}
                      style={{
                        padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                        border: `1px solid ${targetAges.includes(age) ? "#2563eb" : "var(--card-border)"}`,
                        background: targetAges.includes(age) ? "rgba(37,99,235,0.15)" : "transparent",
                        color: targetAges.includes(age) ? "#1d4ed8" : "var(--muted)",
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
          <div className="card card--static" style={{ padding: "clamp(24px, 4vw, 36px)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 28 }}>Review & Launch</h2>
            {submitError && <Alert>{submitError}</Alert>}
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
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 0", borderBottom: "1px solid var(--card-border)"
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}

              <div
                style={{
                  padding: "16px 20px", borderRadius: 12,
                  background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.25)",
                  fontSize: 13, color: "var(--muted)", lineHeight: 1.7,
                }}
              >
                Your product test will be published for testers to discover. You can review applications from your Campaigns page.
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
              <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button
                className="btn-primary"
                onClick={handleLaunch}
                disabled={submitting}
              >
                {submitting ? "Launching..." : "Launch Campaign"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
