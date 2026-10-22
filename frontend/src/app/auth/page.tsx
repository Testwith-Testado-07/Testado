"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/Toast";
import { sendWelcomeEmail } from "@/utils/emailjs";

function AuthContent() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"owner" | "tester">("owner");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "confirmation_failed") {
      toast.error("Email confirmation link was invalid or expired. Please try signing in or registering again.");
    }
  }, [searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setConfirmationNotice(null);

    try {
      if (mode === "login") {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });

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
            emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
          },
        });

        if (error) throw error;
        if (!data.user) throw new Error("User creation failed");

        // Attempt to create the profile record in profiles table
        try {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: name,
            role: role,
          });
        } catch (profileError: unknown) {
          console.warn("Profile upsert notice:", profileError);
        }

        // Send welcome email via EmailJS (gracefully ignored if template/key not yet configured)
        try {
          await sendWelcomeEmail({
            to_name: name || email,
            to_email: email,
            role: role === "owner" ? "Product Owner" : "Tester",
          });
        } catch (emailErr) {
          console.warn("EmailJS welcome email notice:", emailErr);
        }

        if (!data.session) {
          setConfirmationNotice(
            "Account created! We sent a confirmation link to your email. Please check your inbox to activate your account."
          );
          toast.success("Account created! Please check your email to confirm.");
          setMode("login");
          return;
        }

        toast.success("Account created successfully!");
        window.location.href = role === "owner" ? "/dashboard/owner" : "/dashboard/tester";
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
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

                {confirmationNotice && (
                  <div
                    style={{
                      background: "rgba(37, 99, 235, 0.08)",
                      border: "1px solid rgba(37, 99, 235, 0.3)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      marginBottom: "16px",
                      color: "#1e40af",
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    ✉️ {confirmationNotice}
                  </div>
                )}

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
                        placeholder="Your Full Name"
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
