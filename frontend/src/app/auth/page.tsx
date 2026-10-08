"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/Toast";

function AuthContent() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"owner" | "tester">("owner");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });

        // Email not confirmed — show the confirmation screen with resend option
        if (error?.message?.toLowerCase().includes("email not confirmed")) {
          setEmailSent(true);
          setLoading(false);
          return;
        }

        if (error) throw error;

        // Fetch the user's role: first check user_metadata, then check profiles table
        const user = signInData.user;
        let userRole: "owner" | "tester" = (user?.user_metadata?.role as "owner" | "tester") || "owner";

        if (user?.id) {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", user.id)
              .maybeSingle();

            if (profile?.role) {
              userRole = profile.role as "owner" | "tester";
            }
          } catch (profileErr) {
            console.warn("Could not fetch profile role:", profileErr);
          }
        }

        toast.success("Signed in successfully!");
        window.location.href = userRole === "owner" ? "/dashboard/owner" : "/dashboard/tester";
      } else {
        // Sign up — send full_name AND role via user_metadata so it is saved in auth.users immediately
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: role,
            },
          },
        });

        // User already exists but unconfirmed — treat as "check email"
        if (error?.message?.toLowerCase().includes("already registered") || error?.message?.toLowerCase().includes("user already registered")) {
          setEmailSent(true);
          toast.success("Account already exists — check your email for the confirmation link.");
          setLoading(false);
          return;
        }

        if (error) throw error;
        if (!data.user) throw new Error("User creation failed");

        // Attempt to create the profile record in profiles table
        try {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: name,
            role: role,
          });
        } catch (profileError: any) {
          console.warn("Profile upsert notice:", profileError?.message);
        }

        // Email confirmation required — no session yet
        if (!data.session) {
          setEmailSent(true);
          toast.success("Check your email to confirm your account!");
          setLoading(false);
          return;
        }

        toast.success("Account created successfully!");
        window.location.href = role === "owner" ? "/dashboard/owner" : "/dashboard/tester";
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) throw error;
      toast.success("Confirmation email resent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Could not resend email.");
    }
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
          {emailSent ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📧</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, fontFamily: "var(--font-playfair), Georgia, serif" }}>
                Confirm your email
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                We sent a confirmation link to <strong>{email}</strong>.<br />
                Click it to activate your account, then come back to sign in.
              </p>
              <button
                className="btn-primary"
                onClick={handleResendEmail}
                style={{ justifyContent: "center", width: "100%", marginBottom: 16 }}
              >
                Resend confirmation email
              </button>
              <button
                className="auth-text-button"
                onClick={() => { setEmailSent(false); setMode("login"); }}
                style={{ fontSize: 14 }}
              >
                ← Back to sign in
              </button>
            </div>
          ) : (
            <>
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
                      <input
                        className="input"
                        id="auth-name"
                        name="name"
                        autoComplete="name"
                        type="text"
                        placeholder="Alex Johnson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="label" htmlFor="auth-email">Email address</label>
                    <input
                      className="input"
                      id="auth-email"
                      name="email"
                      autoComplete="username"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <div className="auth-field-heading">
                      <label className="label" htmlFor="auth-password">Password</label>
                      {mode === "login" && <button type="button" className="auth-text-button">Forgot password?</button>}
                    </div>
                    <input
                      className="input"
                      id="auth-password"
                      name="password"
                      autoComplete={mode === "register" ? "new-password" : "current-password"}
                      type="password"
                      placeholder={mode === "register" ? "At least 8 characters" : "Your password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary auth-submit">
                    {loading
                      ? <><span className="auth-spinner" />{mode === "login" ? "Signing in..." : "Creating account..."}</>
                      : mode === "login" ? "Sign in to Testado" : "Create my account"}
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
            </>
          )}
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
