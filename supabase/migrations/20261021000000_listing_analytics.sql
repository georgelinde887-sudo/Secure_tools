-- Antigravity Production Directory Schema
-- Migration: 20261021000000_listing_analytics.sql
-- Real dynamic tracking for tool views and clicks

-- 1. INDIVIDUAL TRACKING EVENTS (Unique visitor footprinted)
CREATE TABLE IF NOT EXISTS public.listing_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click')),
  visitor_hash TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referrer TEXT,
  country_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_listing ON public.listing_analytics_events(listing_id, event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_slug ON public.listing_analytics_events(tool_slug, event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor ON public.listing_analytics_events(listing_id, event_type, visitor_hash);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.listing_analytics_events(created_at DESC);

-- 2. AGGREGATED DAILY SUMMARY TABLE (High-speed cached lookups)
CREATE TABLE IF NOT EXISTS public.listing_analytics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  total_views INT NOT NULL DEFAULT 0,
  unique_views INT NOT NULL DEFAULT 0,
  total_clicks INT NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_listing_analytics_summary UNIQUE (listing_id)
);

CREATE INDEX IF NOT EXISTS idx_analytics_summary_listing ON public.listing_analytics_summary(listing_id);
CREATE INDEX IF NOT EXISTS idx_analytics_summary_slug ON public.listing_analytics_summary(tool_slug);

-- 3. ROW LEVEL SECURITY
ALTER TABLE public.listing_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_analytics_summary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read listing_analytics_summary" ON public.listing_analytics_summary;
CREATE POLICY "Public read listing_analytics_summary"
  ON public.listing_analytics_summary FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role full access analytics_events" ON public.listing_analytics_events;
CREATE POLICY "Service role full access analytics_events"
  ON public.listing_analytics_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access analytics_summary" ON public.listing_analytics_summary;
CREATE POLICY "Service role full access analytics_summary"
  ON public.listing_analytics_summary FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
