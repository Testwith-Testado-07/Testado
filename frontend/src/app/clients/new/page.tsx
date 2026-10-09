"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { CreateClientSchema, formatZodError, type CreateClientInput } from "@/utils/schemas";
import { useToast, ToastContainer } from "@/components/Toast";

const STATUS_OPTIONS: { value: CreateClientInput["status"]; label: string; color: string }[] = [
  { value: "prospect",  label: "Prospect",   color: "#6366F1" },
  { value: "active",    label: "Active",     color: "#059669" },
  { value: "on_hold",   label: "On Hold",    color: "#D97706" },
  { value: "completed", label: "Completed",  color: "#2563EB" },
  { value: "churned",   label: "Churned",    color: "#DC2626" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid #e2e8e4",
  borderRadius: 8,
  fontSize: 14,
  color: "#101828",
  background: "#fff",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#344054",
  letterSpacing: 0.5,
  marginBottom: 6,
  textTransform: "uppercase",
};

export default function NewClientPage() {
  const supabase = createClient();
  const router = useRouter();
  const { toasts, toast, removeToast } = useToast();

  const [form, setForm] = useState<Partial<CreateClientInput>>({
    status: "prospect",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  function field(name: string): React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    return {
      onFocus: () => setFocusedField(name),
      onBlur: () => setFocusedField(null),
      style: {
        ...inputStyle,
        borderColor: errors[name] ? "#FCA5A5" : focusedField === name ? "#2563eb" : "#dbe5f2",
        boxShadow: focusedField === name && !errors[name] ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
      },
    };
  }

  const set = (k: keyof CreateClientInput, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => { const e = { ...p }; delete e[k]; return e; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const parsed = CreateClientSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue: import('zod').ZodIssue) => {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error(formatZodError(parsed.error));
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("clients").insert(parsed.data);

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    toast.success("Client saved successfully!");
    setTimeout(() => router.push("/clients"), 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8fd", padding: "48px 20px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <Link href="/clients" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
            ← Back to Clients
          </Link>
        </div>

        {/* Form card */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #dbe5f2", padding: "36px 40px", boxShadow: "0 10px 40px rgba(7,23,46,0.05)" }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#2563eb", display: "block", marginBottom: 6 }}>
              Client Management
            </span>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#07172e", margin: 0 }}>Add New Client</h1>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>
              Save a client's contact details and project status.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Row: Name + Company */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label htmlFor="client-name" style={labelStyle}>Name *</label>
                <input
                  id="client-name"
                  type="text"
                  placeholder="Contact full name"
                  value={form.name ?? ""}
                  onChange={(e) => set("name", e.target.value)}
                  {...field("name")}
                />
                {errors.name && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="client-company" style={labelStyle}>Company</label>
                <input
                  id="client-company"
                  type="text"
                  placeholder="Acme Inc."
                  value={form.company ?? ""}
                  onChange={(e) => set("company", e.target.value)}
                  {...field("company")}
                />
                {errors.company && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.company}</p>}
              </div>
            </div>

            {/* Row: Email + Phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label htmlFor="client-email" style={labelStyle}>Email *</label>
                <input
                  id="client-email"
                  type="email"
                  placeholder="jane@example.com"
                  value={form.email ?? ""}
                  onChange={(e) => set("email", e.target.value)}
                  {...field("email")}
                />
                {errors.email && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="client-phone" style={labelStyle}>Phone</label>
                <input
                  id="client-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone ?? ""}
                  onChange={(e) => set("phone", e.target.value)}
                  {...field("phone")}
                />
                {errors.phone && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.phone}</p>}
              </div>
            </div>

            {/* Status */}
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="client-status" style={labelStyle}>Project Status</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    id={`status-${opt.value}`}
                    onClick={() => set("status", opt.value)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 20,
                      border: `2px solid ${form.status === opt.value ? opt.color : "#e2e8e4"}`,
                      background: form.status === opt.value ? opt.color : "transparent",
                      color: form.status === opt.value ? "#fff" : "#344054",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 28 }}>
              <label htmlFor="client-notes" style={labelStyle}>Notes</label>
              <textarea
                id="client-notes"
                rows={4}
                placeholder="Any relevant context about this client..."
                value={form.notes ?? ""}
                onChange={(e) => set("notes", e.target.value)}
                onFocus={() => setFocusedField("notes")}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: 100,
                  borderColor: errors.notes ? "#FCA5A5" : focusedField === "notes" ? "#2563eb" : "#dbe5f2",
                  boxShadow: focusedField === "notes" && !errors.notes ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
                }}
              />
              {errors.notes && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.notes}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="save-client-btn"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "13px",
                background: submitting ? "#93c5fd" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
                letterSpacing: 0.3,
                boxShadow: "0 4px 16px rgba(37,99,235,0.25)",
              }}
            >
              {submitting ? "Saving…" : "Save Client →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
