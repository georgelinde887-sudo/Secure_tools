-- Antigravity Production Directory Schema
-- Migration: 20261018000000_initial_schema.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  company_name TEXT,
  avatar_url TEXT,
  authentication_provider TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  pillar TEXT,
  description TEXT,
  icon_name TEXT,
  tool_count INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  parent_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  listing_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_pillar ON public.categories(pillar);

-- 3. LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.listings (
  id TEXT PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('software', 'open-source', 'extension', 'plugin')),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  short_description TEXT NOT NULL,
  full_description TEXT,
  official_website_url TEXT NOT NULL,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  logo_asset_id TEXT,
  logo_url TEXT,
  pricing_model TEXT,
  starting_price TEXT,
  submission_plan TEXT NOT NULL DEFAULT 'free' CHECK (submission_plan IN ('free', 'instant')),
  submission_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (submission_status IN ('pending_review', 'under_review', 'changes_requested', 'approved', 'published', 'rejected')),
  link_attribute TEXT NOT NULL DEFAULT 'nofollow' CHECK (link_attribute IN ('nofollow', 'dofollow', 'sponsored')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_slug ON public.listings(slug);
CREATE INDEX IF NOT EXISTS idx_listings_owner_id ON public.listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_type_status ON public.listings(listing_type, submission_status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_published ON public.listings(published_at DESC) WHERE submission_status = 'published';

-- 4. LISTING DETAILS TABLE
CREATE TABLE IF NOT EXISTS public.listing_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id TEXT UNIQUE NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  extension_store_url TEXT,
  extension_id TEXT,
  browser_compatibility JSONB DEFAULT '[]'::jsonb,
  repository_url TEXT,
  license TEXT,
  programming_language TEXT,
  documentation_url TEXT,
  package_url TEXT,
  mcp_platforms JSONB DEFAULT '[]'::jsonb,
  mcp_protocol TEXT,
  mcp_run_command TEXT,
  mcp_config_snippet TEXT,
  mcp_capabilities TEXT,
  pricing_plans TEXT,
  deployment JSONB DEFAULT '[]'::jsonb,
  platforms JSONB DEFAULT '[]'::jsonb,
  key_features JSONB DEFAULT '[]'::jsonb,
  alternatives JSONB DEFAULT '[]'::jsonb,
  integrations JSONB DEFAULT '[]'::jsonb,
  submitter_name TEXT,
  submitter_email TEXT,
  relationship TEXT,
  extra_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listing_details_listing_id ON public.listing_details(listing_id);

-- 5. LISTING ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.listing_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id TEXT NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL,
  public_url TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('logo', 'screenshot', 'banner', 'document')),
  mime_type TEXT,
  file_size BIGINT,
  width INT,
  height INT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listing_assets_listing_id ON public.listing_assets(listing_id);

-- 6. LISTING REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.listing_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id TEXT NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  review_status TEXT NOT NULL,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listing_reviews_listing_id ON public.listing_reviews(listing_id);

-- 7. SPONSORSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.sponsorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id TEXT REFERENCES public.listings(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  campaign_status TEXT NOT NULL DEFAULT 'draft' CHECK (campaign_status IN ('draft', 'pending', 'approved', 'active', 'paused', 'completed')),
  placement TEXT NOT NULL DEFAULT 'sticky_sidebar',
  start_date DATE,
  end_date DATE,
  target_url TEXT,
  utm_params JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sponsorships_owner_id ON public.sponsorships(owner_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_status ON public.sponsorships(campaign_status);

-- 8. SPONSORSHIP ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.sponsorship_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsorship_id UUID NOT NULL REFERENCES public.sponsorships(id) ON DELETE CASCADE,
  total_impressions INT NOT NULL DEFAULT 0,
  total_clicks INT NOT NULL DEFAULT 0,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  metrics_data JSONB DEFAULT '{}'::jsonb,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sponsorship_analytics_sponsorship_id ON public.sponsorship_analytics(sponsorship_id);

-- 9. USER SIGNUP TRIGGER (Create profile on auth.users insert)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, authentication_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorship_analytics ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Categories Policies
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Only admins can modify categories" ON public.categories;
CREATE POLICY "Only admins can modify categories" 
  ON public.categories FOR ALL 
  USING (public.is_admin());

-- Listings Policies
DROP POLICY IF EXISTS "Published listings are viewable by everyone" ON public.listings;
CREATE POLICY "Published listings are viewable by everyone" 
  ON public.listings FOR SELECT 
  USING (submission_status = 'published' OR auth.uid() = owner_id OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can submit listings" ON public.listings;
CREATE POLICY "Authenticated users can submit listings" 
  ON public.listings FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = owner_id);

DROP POLICY IF EXISTS "Admins can update any listing" ON public.listings;
CREATE POLICY "Admins can update any listing" 
  ON public.listings FOR UPDATE 
  USING (public.is_admin());

-- Listing Details Policies
DROP POLICY IF EXISTS "Details viewable for published or owned listings" ON public.listing_details;
CREATE POLICY "Details viewable for published or owned listings" 
  ON public.listing_details FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l 
      WHERE l.id = listing_details.listing_id 
        AND (l.submission_status = 'published' OR l.owner_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Authenticated users can insert details" ON public.listing_details;
CREATE POLICY "Authenticated users can insert details" 
  ON public.listing_details FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings l 
      WHERE l.id = listing_details.listing_id 
        AND (l.owner_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Admins can update details" ON public.listing_details;
CREATE POLICY "Admins can update details" 
  ON public.listing_details FOR UPDATE 
  USING (public.is_admin());

-- Listing Assets Policies
DROP POLICY IF EXISTS "Assets viewable for published or owned listings" ON public.listing_assets;
CREATE POLICY "Assets viewable for published or owned listings" 
  ON public.listing_assets FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l 
      WHERE l.id = listing_assets.listing_id 
        AND (l.submission_status = 'published' OR l.owner_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Authenticated users can insert assets" ON public.listing_assets;
CREATE POLICY "Authenticated users can insert assets" 
  ON public.listing_assets FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings l 
      WHERE l.id = listing_assets.listing_id 
        AND (l.owner_id = auth.uid() OR public.is_admin())
    )
  );

-- Listing Reviews Policies (Admin only)
DROP POLICY IF EXISTS "Reviews accessible by admins only" ON public.listing_reviews;
CREATE POLICY "Reviews accessible by admins only" 
  ON public.listing_reviews FOR ALL 
  USING (public.is_admin());

-- Sponsorships Policies
DROP POLICY IF EXISTS "Owners and admins can view sponsorships" ON public.sponsorships;
CREATE POLICY "Owners and admins can view sponsorships" 
  ON public.sponsorships FOR SELECT 
  USING (auth.uid() = owner_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage sponsorships" ON public.sponsorships;
CREATE POLICY "Admins can manage sponsorships" 
  ON public.sponsorships FOR ALL 
  USING (public.is_admin());

-- Sponsorship Analytics Policies
DROP POLICY IF EXISTS "Owners and admins can view sponsorship analytics" ON public.sponsorship_analytics;
CREATE POLICY "Owners and admins can view sponsorship analytics" 
  ON public.sponsorship_analytics FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.sponsorships s 
      WHERE s.id = sponsorship_analytics.sponsorship_id 
        AND (s.owner_id = auth.uid() OR public.is_admin())
    )
  );
