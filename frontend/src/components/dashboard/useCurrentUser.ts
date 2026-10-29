"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
}

export function useCurrentUser(): UserProfile {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Loading...",
    email: "",
    initials: "?",
  });

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Try profiles table first for full_name, fall back to user_metadata
      let fullName = user.user_metadata?.full_name || user.user_metadata?.name;

      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profileData?.full_name) {
          fullName = profileData.full_name;
        }
      } catch (err) {
        console.warn("Could not query profiles:", err);
      }

      if (!fullName) {
        fullName = user.email?.split("@")[0] || "User";
      }

      const email = user.email || "";
      const initials = fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      setProfile({ name: fullName, email, initials });
    })();
  }, []);

  return profile;
}
