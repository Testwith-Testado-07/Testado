"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const initialRole = (searchParams.get("role") as "owner" | "tester") || "owner";

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [role, setRole] = useState<"owner" | "tester">(initialRole);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth — redirect to dashboard
    setTimeout(() => {
      window.location.href = role === "owner" ? "/dashboard/owner" : "/dashboard/tester";
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div className="orb" style={{ width: 500, height: 500, background: "rgba(108,99,255,0.12)", top: -100, left: -150 }} />
      <div className="orb" style={{ width: 400, height: 400, background: "rgba(0,212,170,0.08)", bottom: -100, right: -100 }} />

      <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 40, justifyContent: "center" }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #6c63ff, #00d4aa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 18,
              color: "white",
            }}
          >
            T
          </div>
          <span style={{ fontWeight: 800, fontSize: 22, color: "var(--foreground)" }}>Testado</span>
        </Link>

        <div className="card" style={{ padding: 36 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, textAlign: "center" }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", textAlign: "center", marginBottom: 32 }}>
            {mode === "login"
              ? "Sign in to your Testado account"
              : "Join thousands of owners and testers"}
          </p>

          {/* Role selector (register only) */}
          {mode === "register" && (
            <div style={{ marginBottom: 28 }}>
              <label className="label">I am a...</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {(["owner", "tester"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={{
                      padding: "16px 12px",
                      borderRadius: 12,
                      border: `2px solid ${role === r ? (r === "owner" ? "#6c63ff" : "#00d4aa") : "var(--card-border)"}`,
                      background: role === r
                        ? (r === "owner" ? "rgba(108,99,255,0.12)" : "rgba(0,212,170,0.12)")
                        : "transparent",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 26, marginBottom: 6 }}>{r === "owner" ? "🏢" : "🧪"}</div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: role === r
                          ? (r === "owner" ? "#6c63ff" : "#00d4aa")
                          : "var(--foreground)",
                      }}
                    >
                      {r === "owner" ? "Product Owner" : "Tester"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                      {r === "owner" ? "Launch campaigns" : "Earn rewards"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {mode === "register" && (
              <div>
                <label className="label">Full Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder={mode === "register" ? "Min. 8 characters" : "Your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "14px",
                fontSize: 15,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : mode === "login" ? (
                "Sign In →"
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--muted)" }}>
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  style={{ color: "#6c63ff", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  style={{ color: "#6c63ff", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  );
}
