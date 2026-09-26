-- ============================================================================
-- Testado RBAC & Security Migration: Step 1 Database RLS Policies
-- Description: Sets up roles, profiles, campaigns, and submissions with strict RLS.
-- ============================================================================

-- 1. Create user role enum type if not already defined
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'tester');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security Definer helper to check roles without infinite policy recursion
CREATE OR REPLACE FUNCTION public.has_role(required_role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
          AND role = required_role
    );
$$;

-- Security Definer helper to fetch the role of current user
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.profiles
    WHERE id = auth.uid();
$$;

-- RLS: Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile non-role fields" ON public.profiles;
CREATE POLICY "Users can update own profile non-role fields"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    );

-- 3. Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reward_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- RLS: Campaigns INSERT (Only users with 'owner' role can create campaigns)
DROP POLICY IF EXISTS "Owners can create campaigns" ON public.campaigns;
CREATE POLICY "Owners can create campaigns"
    ON public.campaigns
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = owner_id
        AND public.has_role('owner'::user_role)
    );

-- RLS: Campaigns UPDATE (Only creator owner can update)
DROP POLICY IF EXISTS "Owners can update own campaigns" ON public.campaigns;
CREATE POLICY "Owners can update own campaigns"
    ON public.campaigns
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = owner_id
        AND public.has_role('owner'::user_role)
    )
    WITH CHECK (
        auth.uid() = owner_id
        AND public.has_role('owner'::user_role)
    );

-- RLS: Campaigns DELETE (Only creator owner can delete)
DROP POLICY IF EXISTS "Owners can delete own campaigns" ON public.campaigns;
CREATE POLICY "Owners can delete own campaigns"
    ON public.campaigns
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() = owner_id
        AND public.has_role('owner'::user_role)
    );

-- RLS: Campaigns SELECT (Owners view own campaigns, Testers view active campaigns)
DROP POLICY IF EXISTS "Owners view own and testers view active campaigns" ON public.campaigns;
CREATE POLICY "Owners view own and testers view active campaigns"
    ON public.campaigns
    FOR SELECT
    TO authenticated
    USING (
        (auth.uid() = owner_id AND public.has_role('owner'::user_role))
        OR (status = 'active' AND public.has_role('tester'::user_role))
    );

-- 4. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    tester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- RLS: Submissions SELECT (Testers can only view their own submissions)
DROP POLICY IF EXISTS "Testers can view own submissions" ON public.submissions;
CREATE POLICY "Testers can view own submissions"
    ON public.submissions
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = tester_id
        AND public.has_role('tester'::user_role)
    );

-- RLS: Submissions SELECT (Campaign owners can view submissions for their campaigns)
DROP POLICY IF EXISTS "Campaign owners can view campaign submissions" ON public.submissions;
CREATE POLICY "Campaign owners can view campaign submissions"
    ON public.submissions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.campaigns c
            WHERE c.id = submissions.campaign_id
              AND c.owner_id = auth.uid()
        )
    );

-- RLS: Submissions INSERT (Testers can only insert their own submissions)
DROP POLICY IF EXISTS "Testers can insert own submissions" ON public.submissions;
CREATE POLICY "Testers can insert own submissions"
    ON public.submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = tester_id
        AND public.has_role('tester'::user_role)
    );
