-- Complete Database Schema for Testado (run in hbhjfwvqbfxoaottgzca SQL Editor)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  bio TEXT CHECK (char_length(bio) <= 300),
  website TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'tester' CHECK (role IN ('owner', 'tester')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles 
  FOR SELECT TO authenticated 
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE TO authenticated 
  USING ((select auth.uid()) = id) 
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles 
  FOR INSERT TO authenticated 
  WITH CHECK ((select auth.uid()) = id);

-- Auto-create profile trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'tester')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  product_url TEXT,
  reward_amount NUMERIC NOT NULL CHECK (reward_amount > 0),
  max_testers INTEGER NOT NULL CHECK (max_testers > 0),
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_countries TEXT[] DEFAULT '{}',
  target_ages TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view active campaigns" ON public.campaigns;
CREATE POLICY "Authenticated users can view active campaigns" ON public.campaigns
  FOR SELECT TO authenticated
  USING (status = 'active' OR owner_id = (select auth.uid()));

DROP POLICY IF EXISTS "Owners can insert their own campaigns" ON public.campaigns;
CREATE POLICY "Owners can insert their own campaigns" ON public.campaigns
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = (select auth.uid()));

DROP POLICY IF EXISTS "Owners can update their own campaigns" ON public.campaigns;
CREATE POLICY "Owners can update their own campaigns" ON public.campaigns
  FOR UPDATE TO authenticated
  USING (owner_id = (select auth.uid()))
  WITH CHECK (owner_id = (select auth.uid()));

-- 3. Campaign Applications Table
CREATE TABLE IF NOT EXISTS public.campaign_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  tester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'approved', 'rejected', 'submitted', 'paid')),
  answers JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (campaign_id, tester_id)
);

ALTER TABLE public.campaign_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Testers and owners can view applications" ON public.campaign_applications;
CREATE POLICY "Testers and owners can view applications" ON public.campaign_applications
  FOR SELECT TO authenticated
  USING (
    tester_id = (select auth.uid()) OR
    campaign_id IN (SELECT id FROM public.campaigns WHERE owner_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "Testers can apply" ON public.campaign_applications;
CREATE POLICY "Testers can apply" ON public.campaign_applications
  FOR INSERT TO authenticated
  WITH CHECK (tester_id = (select auth.uid()));

DROP POLICY IF EXISTS "Testers and owners can update applications" ON public.campaign_applications;
CREATE POLICY "Testers and owners can update applications" ON public.campaign_applications
  FOR UPDATE TO authenticated
  USING (
    tester_id = (select auth.uid()) OR
    campaign_id IN (SELECT id FROM public.campaigns WHERE owner_id = (select auth.uid()))
  );

-- 4. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  tester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback TEXT,
  answers JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Testers can view own submissions" ON public.submissions;
CREATE POLICY "Testers can view own submissions" ON public.submissions
  FOR SELECT TO authenticated
  USING (
    tester_id = (select auth.uid()) OR
    campaign_id IN (SELECT id FROM public.campaigns WHERE owner_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "Testers can insert submissions" ON public.submissions;
CREATE POLICY "Testers can insert submissions" ON public.submissions
  FOR INSERT TO authenticated
  WITH CHECK (tester_id = (select auth.uid()));

-- 5. Todos Table
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own todos" ON public.todos;
CREATE POLICY "Users can manage own todos" ON public.todos
  FOR ALL TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- 6. Testado table (General inquiries / requests log)
CREATE TABLE IF NOT EXISTS public."Testado table" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  company TEXT,
  phone TEXT,
  type TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public."Testado table" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read and insert" ON public."Testado table";
CREATE POLICY "Allow authenticated read and insert" ON public."Testado table"
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
