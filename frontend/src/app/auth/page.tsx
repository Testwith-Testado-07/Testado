"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="auth-page">
      <section className="auth-story">
        <Link href="/" className="auth-story-logo">Testado</Link>
        <div className="auth-story-content">
          <span className="auth-eyebrow">The Testado portal</span>
          <h1>Make better decisions before launch.</h1>
          <p>
            One place for business owners to run sharper tests and for testers to turn honest feedback into opportunity.
          </p>
          <ul className="auth-proof-list">
            <li><span>01</span> Structured testing for real-world decisions</li>
            <li><span>02</span> Matched opportunities for thoughtful testers</li>
            <li><span>03</span> Clear feedback without the guesswork</li>
          </ul>
        </div>
        <div className="auth-story-footer">Real people. Real insights. Real problems.</div>
      </section>

      <main className="auth-main">
        <div className="auth-topline">
          <span>Secure access</span>
          <Link href="/">Back to website</Link>
        </div>

        <div className="auth-form-wrap">
          <Image
            src="/assets/testado-logo-transparent.png"
            alt="Testado"
            width={1531}
            height={382}
            loading="eager"
            sizes="220px"
            className="auth-logo"
          />
          <div className="auth-form-card">
            <div className="auth-heading">
              <span className="auth-form-kicker">{mode === "login" ? "Welcome back" : "Join Testado"}</span>
              <h2>{mode === "login" ? "Sign in to your account" : "Create your account"}</h2>
              <p>
                {mode === "login"
                  ? "Access your testing workspace and keep your next decision moving."
                  : "Choose your path and start building better product decisions."}
              </p>
            </div>

            {mode === "register" && (
              <div className="auth-role-group">
                <div className="label">I am joining as</div>
                <div className="auth-role-options">
                  {(["owner", "tester"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`auth-role-option${role === r ? " selected" : ""}`}
                    >
                      <span className="auth-role-icon">{r === "owner" ? "◈" : "◌"}</span>
                      <span>
                        <strong>{r === "owner" ? "Product owner" : "Tester"}</strong>
                        <small>{r === "owner" ? "Launch and learn" : "Test and earn"}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {mode === "register" && (
                <div>
                  <label className="label" htmlFor="auth-name">Full name</label>
                  <input className="input" id="auth-name" name="name" autoComplete="name" type="text" placeholder="Alex Johnson" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div>
                <label className="label" htmlFor="auth-email">Email address</label>
                <input className="input" id="auth-email" name="email" autoComplete="username" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <div className="auth-field-heading">
                  <label className="label" htmlFor="auth-password">Password</label>
                  {mode === "login" && <button type="button" className="auth-text-button">Forgot password?</button>}
                </div>
                <input className="input" id="auth-password" name="password" autoComplete={mode === "register" ? "new-password" : "current-password"} type="password" placeholder={mode === "register" ? "At least 8 characters" : "Your password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button type="submit" disabled={loading} className="btn-primary auth-submit">
                {loading ? <><span className="auth-spinner" />{mode === "login" ? "Signing in..." : "Creating account..."}</> : mode === "login" ? "Sign in to Testado" : "Create my account"}
              </button>
            </form>

            <div className="auth-switch">
              {mode === "login" ? (
                <>New to Testado? <button type="button" onClick={() => setMode("register")} className="auth-text-button">Create an account</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => setMode("login")} className="auth-text-button">Sign in</button></>
              )}
            </div>
          </div>
          <p className="auth-legal">By continuing, you agree to use Testado for genuine testing and feedback.</p>
        </div>
      </main>

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
