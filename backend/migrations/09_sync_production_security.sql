-- Migration 09: bring the repo in line with the security rules running in production.
-- Production (snapshot 2026-11-28) had policies, constraints and triggers that were added in the
-- dashboard and never written to a migration. Rebuilding from 01-08 alone would recreate three holes:
-- negative rewards, users changing their own role, and every user reading every profile.
-- Everything here is idempotent: on production it changes nothing except section 6 (grants).

-- 1. Helper functions -----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.has_role(required_role public.user_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
    SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = required_role);
$$;

CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS public.user_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- New users default to tester; only an explicit 'owner' in signup metadata makes an owner.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO ''
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

-- 2. Role lock: signed-in users can never change their own role or id ------------------------------
CREATE OR REPLACE FUNCTION private.lock_profile_role()
RETURNS trigger LANGUAGE plpgsql SET search_path TO ''
AS $$
BEGIN
    IF coalesce(auth.role(), '') IN ('anon', 'authenticated')
       AND (NEW.role IS DISTINCT FROM OLD.role OR NEW.id IS DISTINCT FROM OLD.id) THEN
        RAISE EXCEPTION 'Profile role and id cannot be changed';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_lock_role ON public.profiles;
CREATE TRIGGER profiles_lock_role
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION private.lock_profile_role();

-- 3. Applications: testers apply as themselves, only owners review, tester limits hold -------------
CREATE OR REPLACE FUNCTION private.enforce_campaign_application_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO ''
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

DROP TRIGGER IF EXISTS campaign_applications_enforce_limit ON public.campaign_applications;
CREATE TRIGGER campaign_applications_enforce_limit
    BEFORE INSERT ON public.campaign_applications
    FOR EACH ROW EXECUTE FUNCTION private.enforce_campaign_application_limit();

DROP TRIGGER IF EXISTS campaign_applications_enforce_review ON public.campaign_applications;
CREATE TRIGGER campaign_applications_enforce_review
    BEFORE UPDATE ON public.campaign_applications
    FOR EACH ROW EXECUTE FUNCTION private.enforce_campaign_application_limit();

-- 4. Constraints (NOT VALID ones only check new and changed rows, matching production) -------------
ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_status_check;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_status_check
    CHECK (status IN ('draft', 'active', 'paused', 'completed'));

DO $$
DECLARE
    c RECORD;
BEGIN
    FOR c IN SELECT * FROM (VALUES
        ('campaigns', 'campaigns_reward_amount_check', 'CHECK (reward_amount > 0)', false),
        ('campaigns', 'campaigns_reward_amount_range', 'CHECK (reward_amount > 0 AND reward_amount <= 1000000)', true),
        ('campaigns', 'campaigns_max_testers_range', 'CHECK (max_testers >= 1 AND max_testers <= 10000)', true),
        ('campaigns', 'campaigns_product_url_http', $c$CHECK (product_url IS NULL OR product_url = '' OR product_url ~* '^https?://[^\s]+$')$c$, true),
        ('campaigns', 'campaigns_text_lengths', 'CHECK (char_length(title) <= 200 AND COALESCE(char_length(description), 0) <= 5000 AND COALESCE(char_length(product_url), 0) <= 2048)', true),
        ('profiles', 'profiles_bio_check', 'CHECK (char_length(bio) <= 300)', false),
        ('profiles', 'profiles_text_lengths', $c$CHECK (COALESCE(char_length(full_name), 0) <= 100 AND COALESCE(char_length(bio), 0) <= 300 AND (username IS NULL OR username ~ '^[a-z0-9_]{3,30}$'))$c$, true),
        ('profiles', 'profiles_website_http', $c$CHECK (website IS NULL OR website = '' OR website ~* '^https?://[^\s]+$')$c$, true)
    ) AS t(tbl, name, def, not_valid)
    LOOP
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = c.name AND conrelid = ('public.' || c.tbl)::regclass) THEN
            EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I %s%s',
                           c.tbl, c.name, c.def, CASE WHEN c.not_valid THEN ' NOT VALID' ELSE '' END);
        END IF;
    END LOOP;
END;
$$;

-- 5. Row level security policies ------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Old, looser policies from migrations 01 and 05 that production no longer has
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile non-role fields" ON public.profiles;
DROP POLICY IF EXISTS "Campaign owners can view campaign submissions" ON public.submissions;

-- profiles: see yourself, plus testers who applied to your campaigns
DROP POLICY IF EXISTS "Users view own profile and applicants to own campaigns" ON public.profiles;
CREATE POLICY "Users view own profile and applicants to own campaigns" ON public.profiles
    FOR SELECT TO authenticated
    USING (
        (SELECT auth.uid()) = id
        OR EXISTS (
            SELECT 1
              FROM public.campaign_applications application
              JOIN public.campaigns campaign ON campaign.id = application.campaign_id
             WHERE application.tester_id = profiles.id
               AND campaign.owner_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING ((SELECT auth.uid()) = id)
    WITH CHECK ((SELECT auth.uid()) = id AND role = public.get_current_role());

-- campaigns
DROP POLICY IF EXISTS "Owners can create campaigns" ON public.campaigns;
CREATE POLICY "Owners can create campaigns" ON public.campaigns
    FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) = owner_id AND public.has_role('owner'::public.user_role));

DROP POLICY IF EXISTS "Owners can update own campaigns" ON public.campaigns;
CREATE POLICY "Owners can update own campaigns" ON public.campaigns
    FOR UPDATE TO authenticated
    USING ((SELECT auth.uid()) = owner_id AND public.has_role('owner'::public.user_role))
    WITH CHECK ((SELECT auth.uid()) = owner_id AND public.has_role('owner'::public.user_role));

DROP POLICY IF EXISTS "Owners can delete own campaigns" ON public.campaigns;
CREATE POLICY "Owners can delete own campaigns" ON public.campaigns
    FOR DELETE TO authenticated
    USING ((SELECT auth.uid()) = owner_id AND public.has_role('owner'::public.user_role));

DROP POLICY IF EXISTS "Owners view own and testers view active campaigns" ON public.campaigns;
CREATE POLICY "Owners view own and testers view active campaigns" ON public.campaigns
    FOR SELECT TO authenticated
    USING (
        ((SELECT auth.uid()) = owner_id AND public.has_role('owner'::public.user_role))
        OR (status = 'active' AND public.has_role('tester'::public.user_role))
    );

-- campaign_applications
DROP POLICY IF EXISTS "Testers can view own campaign applications" ON public.campaign_applications;
CREATE POLICY "Testers can view own campaign applications" ON public.campaign_applications
    FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) = tester_id AND public.has_role('tester'::public.user_role));

DROP POLICY IF EXISTS "Owners can view applications for own campaigns" ON public.campaign_applications;
CREATE POLICY "Owners can view applications for own campaigns" ON public.campaign_applications
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.campaigns campaign
         WHERE campaign.id = campaign_applications.campaign_id
           AND campaign.owner_id = (SELECT auth.uid())
           AND public.has_role('owner'::public.user_role)
    ));

DROP POLICY IF EXISTS "Testers can apply to active campaigns" ON public.campaign_applications;
CREATE POLICY "Testers can apply to active campaigns" ON public.campaign_applications
    FOR INSERT TO authenticated
    WITH CHECK (
        (SELECT auth.uid()) = tester_id
        AND public.has_role('tester'::public.user_role)
        AND EXISTS (SELECT 1 FROM public.campaigns campaign
                     WHERE campaign.id = campaign_applications.campaign_id AND campaign.status = 'active')
    );

DROP POLICY IF EXISTS "Owners can review applications for own campaigns" ON public.campaign_applications;
CREATE POLICY "Owners can review applications for own campaigns" ON public.campaign_applications
    FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.campaigns campaign
         WHERE campaign.id = campaign_applications.campaign_id
           AND campaign.owner_id = (SELECT auth.uid())
           AND public.has_role('owner'::public.user_role)
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.campaigns campaign
         WHERE campaign.id = campaign_applications.campaign_id
           AND campaign.owner_id = (SELECT auth.uid())
           AND public.has_role('owner'::public.user_role)
    ));

-- submissions: only accepted testers submit, as themselves; owners see their campaigns' submissions
DROP POLICY IF EXISTS "Testers can insert own submissions" ON public.submissions;
CREATE POLICY "Testers can insert own submissions" ON public.submissions
    FOR INSERT TO authenticated
    WITH CHECK (
        (SELECT auth.uid()) = tester_id
        AND public.has_role('tester'::public.user_role)
        AND status = 'submitted'
        AND EXISTS (SELECT 1 FROM public.campaign_applications application
                     WHERE application.campaign_id = submissions.campaign_id
                       AND application.tester_id = (SELECT auth.uid())
                       AND application.status = 'accepted')
    );

DROP POLICY IF EXISTS "Testers can view own submissions" ON public.submissions;
CREATE POLICY "Testers can view own submissions" ON public.submissions
    FOR SELECT TO authenticated
    USING (
        tester_id = (SELECT auth.uid())
        OR campaign_id IN (SELECT campaigns.id FROM public.campaigns WHERE campaigns.owner_id = (SELECT auth.uid()))
    );

-- todos
DROP POLICY IF EXISTS "Users can manage own todos" ON public.todos;
CREATE POLICY "Users can manage own todos" ON public.todos
    FOR ALL TO authenticated
    USING (user_id = (SELECT auth.uid()))
    WITH CHECK (user_id = (SELECT auth.uid()));

-- 6. Grants: NEW TIGHTENING, not yet in production ------------------------------------------------
-- Production still gives anon and authenticated every privilege (including TRUNCATE, which ignores
-- RLS) on these tables. Logged-out visitors only ever read published_reports, and signed-in users only
-- need the operations below.
REVOKE ALL ON public.profiles, public.campaigns, public.submissions, public.todos FROM anon;
REVOKE ALL ON public.profiles, public.campaigns, public.submissions, public.todos FROM authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT SELECT, INSERT ON public.submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.todos TO authenticated;
-- campaign_applications, published_reports, form_rate_limits are already locked by migrations 06-08.

-- Revoke the function access Postgres gives everyone by default
REVOKE ALL ON FUNCTION private.lock_profile_role() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.enforce_campaign_application_limit() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
