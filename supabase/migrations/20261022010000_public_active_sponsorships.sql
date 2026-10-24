-- Antigravity Production Directory Schema
-- Migration: 20261022010000_public_active_sponsorships.sql
-- Allow anonymous & public visitors to read active sponsorships

DROP POLICY IF EXISTS "Public can view active sponsorships" ON public.sponsorships;
CREATE POLICY "Public can view active sponsorships" 
  ON public.sponsorships FOR SELECT 
  USING (campaign_status = 'active');
