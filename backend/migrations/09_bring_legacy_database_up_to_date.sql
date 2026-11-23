-- 09: Bring a database created from frontend/supabase-all-tables.sql up to date
--
-- The live database was built from the old frontend/*.sql scripts, not from migrations 01-06,
-- so it lacks the columns, role checks and triggers the app now relies on, and it still has
-- permissive policies (for example, testers could update their own application status).
--
-- Run this ONE file in the Supabase SQL editor. It replaces running 01, 05, 06 and 08 on such
-- a database, is safe to run more than once, and runs as a single transaction: if any statement
-- fails, nothing is changed. Migration 07 is independent and can stay as it is.

-- ── 0. Shared pieces ──────────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('owner', 'tester');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ── 1. Profiles: role becomes the enum, missing columns added ────────────
-- Replace the signup trigger first: the legacy one inserts the role as text, which would
-- break every new sign-up once the column becomes an enum.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        CASE WHEN NEW.raw_user_meta_data->>'role' = 'owner' THEN 'owner'::public.user_role
             ELSE 'tester'::public.user_role END
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DO $$
DECLARE
    con RECORD;
BEGIN
    IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role') = 'text' THEN
        -- Drop the legacy CHECK (role IN ('owner','tester')); the enum enforces it now
        FOR con IN
            SELECT conname FROM pg_constraint
            WHERE conrelid = 'public.profiles'::regclass AND contype = 'c'
              AND pg_get_constraintdef(oid) ILIKE '%role%'
        LOOP
            EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT %I', con.conname);
        END LOOP;

        ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
        ALTER TABLE public.profiles ALTER COLUMN role TYPE public.user_role USING role::public.user_role;
    END IF;
END $$;

ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'tester'::public.user_role;

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    ADD COLUMN IF NOT EXISTS company_name TEXT,
    ADD COLUMN IF NOT EXISTS industry TEXT,
    ADD COLUMN IF NOT EXISTS country TEXT,
    ADD COLUMN IF NOT EXISTS age_range TEXT,
    ADD COLUMN IF NOT EXISTS gender TEXT,
    ADD COLUMN IF NOT EXISTS interests TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS devices TEXT[] NOT NULL DEFAULT '{}';

-- Every auth user gets a profile (accounts created before the trigger existed)
INSERT INTO public.profiles (id, full_name, role)
SELECT id,
       COALESCE(raw_user_meta_data->>'full_name', ''),
       CASE WHEN raw_user_meta_data->>'role' = 'owner' THEN 'owner'::public.user_role
            ELSE 'tester'::public.user_role END
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ── 2. Role helpers used by the policies ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.has_role(required_role public.user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = required_role);
$$;

CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ── 3. Profiles: private, and users can never change their own role ──────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
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

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile non-role fields" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = id)
    WITH CHECK ((SELECT auth.uid()) = id AND role = public.get_current_role());

-- Defence in depth: block role/id changes from API callers even if a policy is loosened later.
-- The SQL editor and service role are not affected.
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

-- ── 4. Campaigns: only owners create and manage their own ────────────────
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view active campaigns" ON public.campaigns;  -- owners saw competitors' campaigns
DROP POLICY IF EXISTS "Owners can insert their own campaigns" ON public.campaigns;          -- no role check
DROP POLICY IF EXISTS "Owners can update their own campaigns" ON public.campaigns;          -- no role check

DROP POLICY IF EXISTS "Owners view own and testers view active campaigns" ON public.campaigns;
CREATE POLICY "Owners view own and testers view active campaigns"
    ON public.campaigns
    FOR SELECT
    TO authenticated
    USING (
        ((SELECT auth.uid()) = owner_id AND public.has_role('owner'::public.user_role))
        OR (status = 'active' AND public.has_role('tester'::public.user_role))
    );

DROP POLICY IF EXISTS "Owners can create campaigns" ON public.campaigns;
CREATE POLICY "Owners can create campaigns"
    ON public.campaigns
    FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = owner_id AND public.has_role('owner'::public.user_role));

DROP POLICY IF EXISTS "Owners can update own campaigns" ON public.campaigns;
CREATE POLICY "Owners can update own campaigns"
    ON public.campaigns
    FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = owner_id AND public.has_role('owner'::public.user_role))
    WITH CHECK ((SELECT auth.uid()) = owner_id AND public.has_role('owner'::public.user_role));

DROP POLICY IF EXISTS "Owners can delete own campaigns" ON public.campaigns;
CREATE POLICY "Owners can delete own campaigns"
    ON public.campaigns
    FOR DELETE
    TO authenticated
    USING ((SELECT auth.uid()) = owner_id AND public.has_role('owner'::public.user_role));

-- Input limits the browser cannot bypass (NOT VALID: enforced on new/updated rows only)
ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_reward_amount_range;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_reward_amount_range
    CHECK (reward_amount > 0 AND reward_amount <= 1000000) NOT VALID;
ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_max_testers_range;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_max_testers_range
    CHECK (max_testers BETWEEN 1 AND 10000) NOT VALID;
ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_product_url_http;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_product_url_http
    CHECK (product_url IS NULL OR product_url = '' OR product_url ~* '^https?://[^\s]+$') NOT VALID;
ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_text_lengths;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_text_lengths
    CHECK (char_length(title) <= 200
           AND coalesce(char_length(description), 0) <= 5000
           AND coalesce(char_length(product_url), 0) <= 2048) NOT VALID;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_website_http;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_website_http
    CHECK (website IS NULL OR website = '' OR website ~* '^https?://[^\s]+$') NOT VALID;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_text_lengths;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_text_lengths
    CHECK (coalesce(char_length(full_name), 0) <= 100
           AND coalesce(char_length(bio), 0) <= 300
           AND (username IS NULL OR username ~ '^[a-z0-9_]{3,30}$')) NOT VALID;

-- ── 5. Applications: the statuses and review rules the app uses ──────────
ALTER TABLE public.campaign_applications
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- Old statuses: applied/approved/rejected/submitted/paid -> pending/accepted/rejected.
-- Done before the review trigger below exists, so existing rows convert freely.
DO $$
DECLARE
    con RECORD;
BEGIN
    FOR con IN
        SELECT conname FROM pg_constraint
        WHERE conrelid = 'public.campaign_applications'::regclass AND contype = 'c'
          AND pg_get_constraintdef(oid) ILIKE '%status%'
    LOOP
        EXECUTE format('ALTER TABLE public.campaign_applications DROP CONSTRAINT %I', con.conname);
    END LOOP;
END $$;

DROP TRIGGER IF EXISTS campaign_applications_enforce_limit ON public.campaign_applications;
DROP TRIGGER IF EXISTS campaign_applications_enforce_review ON public.campaign_applications;

UPDATE public.campaign_applications SET status = 'pending' WHERE status = 'applied';
UPDATE public.campaign_applications SET status = 'accepted' WHERE status IN ('approved', 'submitted', 'paid');

ALTER TABLE public.campaign_applications ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE public.campaign_applications ADD CONSTRAINT campaign_applications_status_check
    CHECK (status IN ('pending', 'accepted', 'rejected'));

CREATE INDEX IF NOT EXISTS campaign_applications_campaign_status_idx
    ON public.campaign_applications (campaign_id, status);
CREATE INDEX IF NOT EXISTS campaign_applications_tester_created_at_idx
    ON public.campaign_applications (tester_id, created_at DESC);

ALTER TABLE public.campaign_applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.campaign_applications FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.campaign_applications TO authenticated;

DROP POLICY IF EXISTS "Testers and owners can view applications" ON public.campaign_applications;
DROP POLICY IF EXISTS "Testers can apply" ON public.campaign_applications;                     -- no role check
DROP POLICY IF EXISTS "Testers and owners can update applications" ON public.campaign_applications; -- testers could approve themselves

DROP POLICY IF EXISTS "Testers can view own campaign applications" ON public.campaign_applications;
CREATE POLICY "Testers can view own campaign applications"
    ON public.campaign_applications
    FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = tester_id AND public.has_role('tester'::public.user_role));

DROP POLICY IF EXISTS "Owners can view applications for own campaigns" ON public.campaign_applications;
CREATE POLICY "Owners can view applications for own campaigns"
    ON public.campaign_applications
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.campaigns AS campaign
            WHERE campaign.id = campaign_applications.campaign_id
              AND campaign.owner_id = (SELECT auth.uid())
              AND public.has_role('owner'::public.user_role)
        )
    );

DROP POLICY IF EXISTS "Testers can apply to active campaigns" ON public.campaign_applications;
CREATE POLICY "Testers can apply to active campaigns"
    ON public.campaign_applications
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (SELECT auth.uid()) = tester_id
        AND public.has_role('tester'::public.user_role)
        AND EXISTS (
            SELECT 1 FROM public.campaigns AS campaign
            WHERE campaign.id = campaign_applications.campaign_id
              AND campaign.status = 'active'
        )
    );

DROP POLICY IF EXISTS "Owners can review applications for own campaigns" ON public.campaign_applications;
CREATE POLICY "Owners can review applications for own campaigns"
    ON public.campaign_applications
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.campaigns AS campaign
            WHERE campaign.id = campaign_applications.campaign_id
              AND campaign.owner_id = (SELECT auth.uid())
              AND public.has_role('owner'::public.user_role)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.campaigns AS campaign
            WHERE campaign.id = campaign_applications.campaign_id
              AND campaign.owner_id = (SELECT auth.uid())
              AND public.has_role('owner'::public.user_role)
        )
    );

-- Applying and reviewing go through one atomic check: tester limit, active campaign,
-- only pending -> accepted/rejected, and only by the campaign's owner.
CREATE OR REPLACE FUNCTION private.enforce_campaign_application_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    campaign_limit INTEGER;
    active_application_count INTEGER;
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF auth.uid() IS NULL
           OR auth.uid() <> NEW.tester_id
           OR NOT public.has_role('tester'::public.user_role)
           OR NEW.status <> 'pending' THEN
            RAISE EXCEPTION 'Only the signed-in tester can submit a pending application';
        END IF;

        NEW.created_at := timezone('utc'::text, now());
        NEW.updated_at := NEW.created_at;

        SELECT campaign.max_testers INTO campaign_limit
          FROM public.campaigns AS campaign
         WHERE campaign.id = NEW.campaign_id AND campaign.status = 'active'
         FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'This campaign is not accepting applications';
        END IF;

        SELECT COUNT(*) INTO active_application_count
          FROM public.campaign_applications AS application
         WHERE application.campaign_id = NEW.campaign_id
           AND application.status IN ('pending', 'accepted');

        IF active_application_count >= campaign_limit THEN
            RAISE EXCEPTION 'This campaign has reached its tester limit';
        END IF;

        RETURN NEW;
    END IF;

    IF auth.uid() IS NULL
       OR NOT public.has_role('owner'::public.user_role)
       OR NEW.campaign_id IS DISTINCT FROM OLD.campaign_id
       OR NEW.tester_id IS DISTINCT FROM OLD.tester_id
       OR NEW.id IS DISTINCT FROM OLD.id
       OR NEW.created_at IS DISTINCT FROM OLD.created_at
       OR OLD.status <> 'pending'
       OR NEW.status NOT IN ('accepted', 'rejected') THEN
        RAISE EXCEPTION 'Only the campaign owner can review a pending application';
    END IF;

    SELECT campaign.max_testers INTO campaign_limit
      FROM public.campaigns AS campaign
     WHERE campaign.id = OLD.campaign_id AND campaign.owner_id = auth.uid()
     FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'The campaign is not available for application review';
    END IF;

    IF NEW.status = 'accepted' THEN
        SELECT COUNT(*) INTO active_application_count
          FROM public.campaign_applications AS application
         WHERE application.campaign_id = OLD.campaign_id
           AND application.status = 'accepted'
           AND application.id <> OLD.id;

        IF active_application_count >= campaign_limit THEN
            RAISE EXCEPTION 'This campaign has reached its accepted tester limit';
        END IF;
    END IF;

    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.enforce_campaign_application_limit() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER campaign_applications_enforce_limit
    BEFORE INSERT ON public.campaign_applications
    FOR EACH ROW EXECUTE FUNCTION private.enforce_campaign_application_limit();

CREATE TRIGGER campaign_applications_enforce_review
    BEFORE UPDATE ON public.campaign_applications
    FOR EACH ROW EXECUTE FUNCTION private.enforce_campaign_application_limit();

-- ── 6. Submissions: testers cannot approve themselves ────────────────────
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

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
            SELECT 1 FROM public.campaign_applications AS application
            WHERE application.campaign_id = submissions.campaign_id
              AND application.tester_id = (SELECT auth.uid())
              AND application.status = 'accepted'
        )
    );

-- ── 7. Legacy "Testado table": no access from the website ────────────────
DO $$
BEGIN
    IF to_regclass('public."Testado table"') IS NOT NULL THEN
        EXECUTE 'DROP POLICY IF EXISTS "Allow authenticated read and insert" ON public."Testado table"';
        EXECUTE 'ALTER TABLE public."Testado table" ENABLE ROW LEVEL SECURITY';
        EXECUTE 'REVOKE ALL ON public."Testado table" FROM anon, authenticated';
    END IF;
END $$;

-- Make the API pick up the new columns straight away
NOTIFY pgrst, 'reload schema';
