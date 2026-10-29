"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { UpdateProfileSchema, formatZodError } from "@/utils/schemas";
import { useToast } from "@/components/Toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  website: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#344054",
  letterSpacing: 0.5,
  marginBottom: 6,
  textTransform: "uppercase",
};

function getInitials(name: string | null, email: string | null): string {
  const src = name ?? email ?? "U";
  return src.split(/[ @]/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function ProfilePage() {
  const supabase = createClient();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (cancelled) return;
      setUser(u);

      if (u) {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", u.id).single();
        if (cancelled) return;
        if (error) {
          toast.error(error.message);
        } else {
          setProfile(data ?? {});
        }
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [supabase, toast]);

  const set = (k: keyof Profile, v: string) => {
    setProfile((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => { const e = { ...p }; delete e[k]; return e; });
  };

  function fieldProps(name: string): React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    return { className: "input", "aria-invalid": errors[name] ? true : undefined };
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = UpdateProfileSchema.safeParse({
      full_name: profile.full_name,
      username: profile.username,
      bio: profile.bio,
      website: profile.website,
    });

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

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update(parsed.data)
      .eq("id", user!.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile saved!");
    }
    setSaving(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", padding: "48px 20px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>

      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        {/* Nav */}
        <div style={{ marginBottom: 28 }}>
          <Link href="/" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
            ← Back to Home
          </Link>
        </div>

        {/* Avatar + header */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          {loading ? (
            <Skeleton className="size-18 shrink-0 rounded-full" />
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg, #06101d, #2563eb)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 24, flexShrink: 0,
              boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
            }}>
              {getInitials(profile.full_name ?? null, user?.email ?? null)}
            </div>
          )}
          <div>
            {loading ? (
              <>
                <Skeleton className="mb-2 h-5 w-45" />
                <Skeleton className="h-3.5 w-60" />
              </>
            ) : (
              <>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#07172e", margin: 0 }}>
                  {profile.full_name || "Your Profile"}
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: "3px 0 0" }}>
                  {user?.email}
                  {profile.role && (
                    <span style={{ marginLeft: 8, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "2px 8px", borderRadius: 20, fontWeight: 700, fontSize: 11 }}>
                      {profile.role}
                    </span>
                  )}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Form */}
        {!loading && !user && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12, padding: 24, textAlign: "center" }}>
            <p style={{ color: "#991B1B", fontWeight: 600, margin: "0 0 12px" }}>You must be signed in to edit your profile.</p>
            <Link href="/auth" style={{ background: "#2563eb", color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
              Sign In
            </Link>
          </div>
        )}

        {!loading && user && (
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #dbe5f2", padding: "36px 40px", boxShadow: "0 10px 40px rgba(7,23,46,0.05)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#07172e", margin: "0 0 24px" }}>Edit Profile</h2>

            <form onSubmit={handleSave} noValidate>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label htmlFor="full-name" style={labelStyle}>Full Name</label>
                  <input
                    id="full-name"
                    type="text"
                    placeholder="Your full name"
                    value={profile.full_name ?? ""}
                    onChange={(e) => set("full_name", e.target.value)}
                    {...fieldProps("full_name")}
                  />
                  {errors.full_name && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.full_name}</p>}
                </div>
                <div>
                  <label htmlFor="username" style={labelStyle}>Username</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#98A2B3", fontSize: 14, pointerEvents: "none" }}>@</span>
                    <input
                      id="username"
                      type="text"
                      placeholder="Username"
                      value={profile.username ?? ""}
                      onChange={(e) => set("username", e.target.value.toLowerCase())}
                      {...fieldProps("username")}
                      style={{ paddingLeft: 28 }}
                    />
                  </div>
                  {errors.username && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.username}</p>}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label htmlFor="bio" style={labelStyle}>Bio</label>
                <textarea
                  id="bio"
                  rows={3}
                  placeholder="Tell us a little about yourself…"
                  value={profile.bio ?? ""}
                  onChange={(e) => set("bio", e.target.value)}
                  className="input"
                  aria-invalid={errors.bio ? true : undefined}
                  style={{ resize: "vertical" }}
                />
                {errors.bio && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.bio}</p>}
                <p style={{ fontSize: 11, color: "#98A2B3", margin: "4px 0 0", textAlign: "right" }}>
                  {(profile.bio ?? "").length}/300
                </p>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label htmlFor="website" style={labelStyle}>Website</label>
                <input
                  id="website"
                  type="url"
                  placeholder="https://yoursite.com"
                  value={profile.website ?? ""}
                  onChange={(e) => set("website", e.target.value)}
                  {...fieldProps("website")}
                />
                {errors.website && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{errors.website}</p>}
              </div>

              <button
                type="submit"
                id="save-profile-btn"
                disabled={saving}
                style={{
                  width: "100%", padding: "13px",
                  background: saving ? "#93c5fd" : "#2563eb",
                  color: "#fff", border: "none", borderRadius: 10,
                  fontWeight: 700, fontSize: 15, cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                  boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
                }}
              >
                {saving ? "Saving…" : "Save Profile"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
