-- Add the data needed to publish product tests and handle tester applications.

ALTER TABLE public.campaigns
    ADD COLUMN IF NOT EXISTS product_url TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS max_testers INTEGER NOT NULL DEFAULT 50 CHECK (max_testers > 0),
    ADD COLUMN IF NOT EXISTS questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS target_countries TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS target_ages TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS company_name TEXT,
    ADD COLUMN IF NOT EXISTS industry TEXT,
    ADD COLUMN IF NOT EXISTS country TEXT,
    ADD COLUMN IF NOT EXISTS age_range TEXT,
    ADD COLUMN IF NOT EXISTS gender TEXT,
    ADD COLUMN IF NOT EXISTS interests TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS devices TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS campaigns_status_created_at_idx
    ON public.campaigns (status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.campaign_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    tester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (campaign_id, tester_id)
);

CREATE INDEX IF NOT EXISTS campaign_applications_campaign_status_idx
    ON public.campaign_applications (campaign_id, status);
CREATE INDEX IF NOT EXISTS campaign_applications_tester_created_at_idx
    ON public.campaign_applications (tester_id, created_at DESC);

ALTER TABLE public.campaign_applications ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.campaign_applications FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.campaign_applications TO authenticated;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Testers can view own campaign applications" ON public.campaign_applications;
CREATE POLICY "Testers can view own campaign applications"
    ON public.campaign_applications
    FOR SELECT
    TO authenticated
    USING (
        (SELECT auth.uid()) = tester_id
        AND public.has_role('tester'::public.user_role)
    );

DROP POLICY IF EXISTS "Owners can view applications for own campaigns" ON public.campaign_applications;
CREATE POLICY "Owners can view applications for own campaigns"
    ON public.campaign_applications
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.campaigns AS campaign
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
            SELECT 1
            FROM public.campaigns AS campaign
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
            SELECT 1
            FROM public.campaigns AS campaign
            WHERE campaign.id = campaign_applications.campaign_id
              AND campaign.owner_id = (SELECT auth.uid())
              AND public.has_role('owner'::public.user_role)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.campaigns AS campaign
            WHERE campaign.id = campaign_applications.campaign_id
              AND campaign.owner_id = (SELECT auth.uid())
              AND public.has_role('owner'::public.user_role)
        )
    );

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

        SELECT campaign.max_testers
          INTO campaign_limit
          FROM public.campaigns AS campaign
         WHERE campaign.id = NEW.campaign_id
           AND campaign.status = 'active'
         FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'This campaign is not accepting applications';
        END IF;

        SELECT COUNT(*)
          INTO active_application_count
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

    SELECT campaign.max_testers
      INTO campaign_limit
      FROM public.campaigns AS campaign
     WHERE campaign.id = OLD.campaign_id
       AND campaign.owner_id = auth.uid()
     FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'The campaign is not available for application review';
    END IF;

    IF NEW.status = 'accepted' THEN
        SELECT COUNT(*)
          INTO active_application_count
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

DROP TRIGGER IF EXISTS campaign_applications_enforce_limit ON public.campaign_applications;
CREATE TRIGGER campaign_applications_enforce_limit
    BEFORE INSERT ON public.campaign_applications
    FOR EACH ROW
    EXECUTE FUNCTION private.enforce_campaign_application_limit();

DROP TRIGGER IF EXISTS campaign_applications_enforce_review ON public.campaign_applications;
CREATE TRIGGER campaign_applications_enforce_review
    BEFORE UPDATE ON public.campaign_applications
    FOR EACH ROW
    EXECUTE FUNCTION private.enforce_campaign_application_limit();
