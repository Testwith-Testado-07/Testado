-- ============================================================================
-- Migration: Enhance Profiles Table (Path B — User Profiles)
-- Description: Adds avatar_url, username, bio, and website to profiles.
-- ============================================================================

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS username    TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS bio         TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url  TEXT,
    ADD COLUMN IF NOT EXISTS website     TEXT;

-- Index for username lookups
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);

-- RLS policy: users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = id)
    WITH CHECK ((SELECT auth.uid()) = id);
