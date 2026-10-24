export interface SponsorItem {
  id: string;
  name: string;
  title: string;
  description: string;
  websiteUrl: string;
  logoUrl?: string;
  fallbackText: string;
  ctaLabel?: string;
  promotedLabel?: string;
  cardTint?: string;
  active?: boolean;
}

// Static mock items permanently removed per production configuration.
// All sponsorships are dynamically loaded from Supabase via ISM administration.
export const SPONSOR_ITEMS: SponsorItem[] = [];

export const MAX_SPONSOR_SPOTS = 4;

export function getActiveSponsors(): SponsorItem[] {
  return SPONSOR_ITEMS.filter((item) => item.active !== false);
}

export function getSpotsLeft(currentCount: number = 0): number {
  return Math.max(0, MAX_SPONSOR_SPOTS - currentCount);
}

export async function fetchActiveSponsors(): Promise<SponsorItem[]> {
  try {
    const res = await fetch('/api/sponsors', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sponsors || [];
  } catch {
    return [];
  }
}
