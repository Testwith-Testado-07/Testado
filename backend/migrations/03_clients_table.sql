-- ============================================================================
-- Migration: Create Clients Table with Row Level Security (RLS)
-- Description: Stores client contacts belonging to an authenticated owner.
-- ============================================================================

-- 1. Project status enum
DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('prospect', 'active', 'on_hold', 'completed', 'churned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    company     TEXT,
    status      project_status NOT NULL DEFAULT 'prospect',
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 4. Indexes
CREATE INDEX IF NOT EXISTS clients_user_id_idx    ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS clients_created_at_idx ON public.clients(created_at DESC);
CREATE INDEX IF NOT EXISTS clients_email_idx      ON public.clients(email);

-- 5. updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS clients_updated_at ON public.clients;
CREATE TRIGGER clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. RLS Policies (owner-scoped)
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
CREATE POLICY "Users can view their own clients"
    ON public.clients FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own clients" ON public.clients;
CREATE POLICY "Users can insert their own clients"
    ON public.clients FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
CREATE POLICY "Users can update their own clients"
    ON public.clients FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;
CREATE POLICY "Users can delete their own clients"
    ON public.clients FOR DELETE
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);
