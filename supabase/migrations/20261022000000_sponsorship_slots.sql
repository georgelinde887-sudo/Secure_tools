-- Antigravity Production Directory Schema
-- Migration: 20261022000000_sponsorship_slots.sql
-- Add comprehensive fields to sponsorships for AltHunt-style ad slots

ALTER TABLE public.sponsorships 
  ADD COLUMN IF NOT EXISTS display_domain TEXT,
  ADD COLUMN IF NOT EXISTS icon_url TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS cta_label TEXT DEFAULT 'Visit',
  ADD COLUMN IF NOT EXISTS card_tint TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS owner_email TEXT;

CREATE INDEX IF NOT EXISTS idx_sponsorships_owner_email ON public.sponsorships(owner_email);
