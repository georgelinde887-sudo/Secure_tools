-- Antigravity Production Directory Schema
-- Migration: 20261022020000_enterprise_ranking_and_analytics.sql
-- Implements enterprise ranking: Reviews (Tier 1) -> Views / Popularity (Tier 2) -> Launch Recency (Tier 3)

-- 1. Add analytics & review counters to listings
ALTER TABLE public.listings 
  ADD COLUMN IF NOT EXISTS views_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS clicks_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reviews_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) NOT NULL DEFAULT 0.0;

-- 2. Create listing analytics summary table
CREATE TABLE IF NOT EXISTS public.listing_analytics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id TEXT NOT NULL UNIQUE,
  tool_slug TEXT NOT NULL,
  total_views INT NOT NULL DEFAULT 0,
  unique_views INT NOT NULL DEFAULT 0,
  total_clicks INT NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listing_analytics_summary_slug ON public.listing_analytics_summary(tool_slug);

-- 3. Create listing analytics raw events table
CREATE TABLE IF NOT EXISTS public.listing_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click')),
  visitor_hash TEXT NOT NULL,
  user_id UUID,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listing_analytics_events_slug_time ON public.listing_analytics_events(tool_slug, event_type, created_at);

-- 4. Ranking performance indexes
CREATE INDEX IF NOT EXISTS idx_listings_ranking_all 
  ON public.listings (reviews_count DESC, views_count DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listings_category_ranking 
  ON public.listings (category_id, reviews_count DESC, views_count DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listings_type_ranking 
  ON public.listings (listing_type, reviews_count DESC, views_count DESC, created_at DESC);

-- 5. Backfill reviews_count from existing user_reviews
UPDATE public.listings l
SET 
  reviews_count = sub.cnt,
  average_rating = ROUND(sub.avg_rating, 2)
FROM (
  SELECT tool_slug, COUNT(*) as cnt, AVG(rating) as avg_rating
  FROM public.user_reviews
  GROUP BY tool_slug
) sub
WHERE l.slug = sub.tool_slug OR l.id = sub.tool_slug;

-- 6. Trigger to automatically keep reviews_count & average_rating synced
CREATE OR REPLACE FUNCTION public.sync_listing_review_stats()
RETURNS TRIGGER AS $$
DECLARE
  target_slug TEXT;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    target_slug := OLD.tool_slug;
  ELSE
    target_slug := NEW.tool_slug;
  END IF;

  UPDATE public.listings l
  SET 
    reviews_count = COALESCE(sub.cnt, 0),
    average_rating = COALESCE(ROUND(sub.avg_rating, 2), 0)
  FROM (
    SELECT COUNT(*) as cnt, AVG(rating) as avg_rating
    FROM public.user_reviews
    WHERE tool_slug = target_slug
  ) sub
  WHERE l.slug = target_slug OR l.id = target_slug;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_listing_review_stats ON public.user_reviews;
CREATE TRIGGER trg_sync_listing_review_stats
AFTER INSERT OR UPDATE OR DELETE ON public.user_reviews
FOR EACH ROW EXECUTE FUNCTION public.sync_listing_review_stats();
