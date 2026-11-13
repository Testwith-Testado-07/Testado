-- 07: Published test reports (landing page) and rate limiting for public forms
-- Safe to run more than once.

-- ── Published reports ──────────────────────────────────────────────────────
-- One row per real test result you want to show on the landing page.
-- The newest row with is_published = true replaces the sample report.
CREATE TABLE IF NOT EXISTS public.published_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    title TEXT NOT NULL,                                   -- e.g. 'Weekly meal-kit subscription'
    audience TEXT NOT NULL,                                -- e.g. 'Pune · ages 25–34'
    tester_count INTEGER NOT NULL CHECK (tester_count > 0),
    headline_label TEXT NOT NULL,                          -- e.g. 'Would buy at ₹499 a week'
    headline_percent INTEGER NOT NULL CHECK (headline_percent BETWEEN 0 AND 100),
    -- Up to 4 bars: [{"label": "₹399", "percent": 78}, {"label": "₹499", "percent": 64, "highlight": true}]
    breakdown JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(breakdown) = 'array'),
    quote TEXT,
    quote_author TEXT,                                     -- e.g. 'Tester, 29, Pune'
    verdict TEXT NOT NULL CHECK (verdict IN ('go', 'pivot', 'no-go')),
    verdict_note TEXT,                                     -- e.g. 'with a lower first-month price'
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS published_reports_published_at_idx
    ON public.published_reports (published_at DESC) WHERE is_published;

ALTER TABLE public.published_reports ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.published_reports FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.published_reports TO anon, authenticated;

-- Anyone may read published reports; writes happen only from the Supabase dashboard
DROP POLICY IF EXISTS "Published reports are public" ON public.published_reports;
CREATE POLICY "Published reports are public"
    ON public.published_reports
    FOR SELECT
    TO anon, authenticated
    USING (is_published);

-- ── Form rate limits ───────────────────────────────────────────────────────
-- Stores a one-way hash of the sender's IP per submission. No raw IPs.
CREATE TABLE IF NOT EXISTS public.form_rate_limits (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    form TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS form_rate_limits_lookup_idx
    ON public.form_rate_limits (form, ip_hash, created_at DESC);

ALTER TABLE public.form_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.form_rate_limits FROM PUBLIC, anon, authenticated;
-- No policies: the table is only reachable through the function below.

-- Records an attempt and returns true when it is within the limit.
CREATE OR REPLACE FUNCTION public.check_form_rate_limit(
    p_form TEXT,
    p_ip_hash TEXT,
    p_max INTEGER,
    p_window_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    recent INTEGER;
BEGIN
    IF p_form NOT IN ('business-request', 'tester-application')
       OR length(p_ip_hash) <> 64
       OR p_max NOT BETWEEN 1 AND 50
       OR p_window_seconds NOT BETWEEN 60 AND 86400 THEN
        RAISE EXCEPTION 'invalid rate limit arguments';
    END IF;

    -- Serialise checks for the same sender so parallel requests can't slip past the limit
    PERFORM pg_advisory_xact_lock(hashtext(p_form || ':' || p_ip_hash));

    -- Keep the table small
    DELETE FROM public.form_rate_limits WHERE created_at < now() - interval '1 day';

    SELECT count(*) INTO recent
    FROM public.form_rate_limits
    WHERE form = p_form
      AND ip_hash = p_ip_hash
      AND created_at > now() - make_interval(secs => p_window_seconds);

    IF recent >= p_max THEN
        RETURN false;
    END IF;

    INSERT INTO public.form_rate_limits (form, ip_hash) VALUES (p_form, p_ip_hash);
    RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.check_form_rate_limit(TEXT, TEXT, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_form_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO anon, authenticated;
