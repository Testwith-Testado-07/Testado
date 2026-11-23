-- 08: Security hardening (role lock, profile privacy, input limits, stale permissive policies)
-- NOTE: Only for databases built from migrations 01-07. The live database was built from
-- frontend/supabase-all-tables.sql instead; run 09_bring_legacy_database_up_to_date.sql there,
-- which includes everything in this file plus the pieces of 01, 05 and 06 that are missing.
-- Safe to run more than once. Run in the Supabase SQL editor after 01-07.

-- ── 1. Users must not change their own role ───────────────────────────────
-- Migration 05 added a second UPDATE policy that only checks auth.uid() = id.
-- Permissive policies are OR'ed, so it cancelled the role check from 01.
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Defence in depth: even if a permissive policy is added later, block role/id
-- changes from API callers. The SQL editor and service role are not affected.
CREATE OR REPLACE FUNCTION private.lock_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF coalesce(auth.role(), '') IN ('anon', 'authenticated')
       AND (NEW.role IS DISTINCT FROM OLD.role OR NEW.id IS DISTINCT FROM OLD.id) THEN
        RAISE EXCEPTION 'Profile role and id cannot be changed';
    END IF;
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.lock_profile_role() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS profiles_lock_role ON public.profiles;
CREATE TRIGGER profiles_lock_role
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION private.lock_profile_role();

-- ── 2. Profiles are private ───────────────────────────────────────────────
-- Before: any signed-in user could read every profile (gender, age, country, company).
-- Now: your own profile, plus testers who applied to one of your campaigns.
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile and applicants to own campaigns" ON public.profiles;
CREATE POLICY "Users view own profile and applicants to own campaigns"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
        (SELECT auth.uid()) = id
        OR EXISTS (
            SELECT 1
            FROM public.campaign_applications AS application
            JOIN public.campaigns AS campaign ON campaign.id = application.campaign_id
            WHERE application.tester_id = profiles.id
              AND campaign.owner_id = (SELECT auth.uid())
        )
    );

-- ── 3. Input limits the browser cannot bypass ─────────────────────────────
-- NOT VALID: enforced for new and updated rows without failing on old data.
ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_reward_amount_range;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_reward_amount_range
    CHECK (reward_amount > 0 AND reward_amount <= 1000000) NOT VALID;

ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_max_testers_range;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_max_testers_range
    CHECK (max_testers BETWEEN 1 AND 10000) NOT VALID;

ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_product_url_http;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_product_url_http
    CHECK (product_url = '' OR product_url ~* '^https?://[^\s]+$') NOT VALID;

ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_text_lengths;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_text_lengths
    CHECK (char_length(title) <= 200 AND char_length(description) <= 5000 AND char_length(product_url) <= 2048) NOT VALID;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_website_http;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_website_http
    CHECK (website IS NULL OR website = '' OR website ~* '^https?://[^\s]+$') NOT VALID;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_text_lengths;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_text_lengths
    CHECK (
        coalesce(char_length(full_name), 0) <= 100
        AND coalesce(char_length(bio), 0) <= 300
        AND (username IS NULL OR username ~ '^[a-z0-9_]{3,30}$')
    ) NOT VALID;

-- ── 4. Submissions: testers cannot approve themselves ─────────────────────
DROP POLICY IF EXISTS "Testers can insert submissions" ON public.submissions;   -- old, no role check
DROP POLICY IF EXISTS "Testers can insert own submissions" ON public.submissions;
CREATE POLICY "Testers can insert own submissions"
    ON public.submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (SELECT auth.uid()) = tester_id
        AND public.has_role('tester'::public.user_role)
        AND status = 'submitted'
        AND EXISTS (
            SELECT 1
            FROM public.campaign_applications AS application
            WHERE application.campaign_id = submissions.campaign_id
              AND application.tester_id = (SELECT auth.uid())
              AND application.status = 'accepted'
        )
    );

-- ── 5. Remove permissive policies from the old frontend/*.sql scripts ─────
-- These may exist if those scripts were ever run; 01 and 06 replace them.
DROP POLICY IF EXISTS "Owners can insert their own campaigns" ON public.campaigns;          -- no role check
DROP POLICY IF EXISTS "Owners can update their own campaigns" ON public.campaigns;          -- no role check
DROP POLICY IF EXISTS "Authenticated users can view active campaigns" ON public.campaigns;  -- owners saw competitors' campaigns
DROP POLICY IF EXISTS "Testers and owners can view applications" ON public.campaign_applications;
DROP POLICY IF EXISTS "Testers can apply" ON public.campaign_applications;                  -- no role check
DROP POLICY IF EXISTS "Testers and owners can update applications" ON public.campaign_applications;

-- "Testado table" allowed every signed-in user to read and write every row.
DO $$
BEGIN
    IF to_regclass('public."Testado table"') IS NOT NULL THEN
        EXECUTE 'DROP POLICY IF EXISTS "Allow authenticated read and insert" ON public."Testado table"';
        EXECUTE 'ALTER TABLE public."Testado table" ENABLE ROW LEVEL SECURITY';
        EXECUTE 'REVOKE ALL ON public."Testado table" FROM anon, authenticated';
    END IF;
END $$;
