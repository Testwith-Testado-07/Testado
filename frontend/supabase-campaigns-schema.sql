-- Run this in Supabase SQL Editor to enable Campaigns and Applications

-- 1. Campaigns Table
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

-- Campaign Policies:
-- Anyone authenticated can view active campaigns
DROP POLICY IF EXISTS "Authenticated users can view active campaigns" ON public.campaigns;
CREATE POLICY "Authenticated users can view active campaigns" ON public.campaigns
  FOR SELECT TO authenticated
  USING (status = 'active' OR owner_id = (select auth.uid()));

-- Product owners can insert their own campaigns
DROP POLICY IF EXISTS "Owners can insert their own campaigns" ON public.campaigns;
CREATE POLICY "Owners can insert their own campaigns" ON public.campaigns
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = (select auth.uid()));

-- Product owners can update their own campaigns
DROP POLICY IF EXISTS "Owners can update their own campaigns" ON public.campaigns;
CREATE POLICY "Owners can update their own campaigns" ON public.campaigns
  FOR UPDATE TO authenticated
  USING (owner_id = (select auth.uid()))
  WITH CHECK (owner_id = (select auth.uid()));

-- 2. Campaign Applications Table
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

-- Application Policies:
-- Testers can see their own applications, and campaign owners can see applications for their campaigns
DROP POLICY IF EXISTS "Testers and owners can view applications" ON public.campaign_applications;
CREATE POLICY "Testers and owners can view applications" ON public.campaign_applications
  FOR SELECT TO authenticated
  USING (
    tester_id = (select auth.uid()) OR
    campaign_id IN (SELECT id FROM public.campaigns WHERE owner_id = (select auth.uid()))
  );

-- Testers can apply to campaigns
DROP POLICY IF EXISTS "Testers can apply" ON public.campaign_applications;
CREATE POLICY "Testers can apply" ON public.campaign_applications
  FOR INSERT TO authenticated
  WITH CHECK (tester_id = (select auth.uid()));

-- Testers and owners can update application status/answers
DROP POLICY IF EXISTS "Testers and owners can update applications" ON public.campaign_applications;
CREATE POLICY "Testers and owners can update applications" ON public.campaign_applications
  FOR UPDATE TO authenticated
  USING (
    tester_id = (select auth.uid()) OR
    campaign_id IN (SELECT id FROM public.campaigns WHERE owner_id = (select auth.uid()))
  );
