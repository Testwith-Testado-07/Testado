-- 10: Store tester applications from the public form (previously email-only).
-- Safe to run more than once.
--
-- Only the server (secret key / service_role) writes here. anon and authenticated get
-- no access at all; read applications from the Supabase dashboard.

CREATE TABLE IF NOT EXISTS public.tester_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
    phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 1 AND 50),
    email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
    city TEXT NOT NULL CHECK (char_length(city) BETWEEN 1 AND 120),
    age_range TEXT NOT NULL CHECK (age_range IN ('18–24', '25–34', '35–44', '45+')),
    frequency TEXT NOT NULL CHECK (frequency IN (
        'Whenever a suitable opportunity comes up',
        'A few times a month',
        'Occasionally'
    )),
    interests TEXT NOT NULL DEFAULT '' CHECK (char_length(interests) <= 1000),
    why TEXT NOT NULL DEFAULT '' CHECK (char_length(why) <= 2000),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tester_applications_created_at_idx
    ON public.tester_applications (created_at DESC);

ALTER TABLE public.tester_applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.tester_applications FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.tester_applications TO service_role;
-- No policies: applicants' personal data is not readable or writable with the public key.
