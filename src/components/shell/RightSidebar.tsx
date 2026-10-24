'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Megaphone01Icon } from 'hugeicons-react';
import { SponsorItem, MAX_SPONSOR_SPOTS } from '@/data/sponsors';
import { withUtm } from '@/lib/logo-utils';

export function RightSidebar() {
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSponsors = useCallback(async () => {
    try {
      const res = await fetch('/api/sponsors', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSponsors(data.sponsors || []);
      }
    } catch (err) {
      console.error('Failed to load sponsors:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSponsors();

    const handleUpdate = () => loadSponsors();
    window.addEventListener('sponsors-updated', handleUpdate);
    return () => window.removeEventListener('sponsors-updated', handleUpdate);
  }, [loadSponsors]);

  const spotsLeft = Math.max(0, MAX_SPONSOR_SPOTS - sponsors.length);

  const handleTrackClick = (sponsorId: string) => {
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sponsorshipId: sponsorId,
          toolSlug: `sponsor_${sponsorId}`,
          eventType: 'click',
          userTimeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : '',
          userLocale: typeof navigator !== 'undefined' ? navigator.language : '',
        }),
      }).catch(() => {});
    } catch {}
  };

  return (
    <aside
      className="hidden xl:block w-[285px] shrink-0 border-l border-[#e4e4e7] bg-[#fafafa] p-4 select-none right-sidebar-rail font-geist"
      style={{ height: 'calc(100vh - 57px)', position: 'sticky', top: '57px' }}
    >
      <div className="flex flex-col h-full overflow-y-auto space-y-3 pr-0.5 scrollbar-thin">
        {/* 1. Header: Megaphone Icon + Advertise Text */}
        <div>
          <div className="flex items-center gap-2 text-[#09090b] font-bold text-[14.5px] tracking-tight">
            <Megaphone01Icon size={18} strokeWidth={1.8} className="text-[#09090b]" />
            <span>Advertise</span>
          </div>
          <div className="border-b border-[#e4e4e7] mt-3" />
        </div>

        {/* 2. Dynamic Sponsored Cards (Strictly uniform 162px height, perfect vertical alignment) */}
        <div className="space-y-3">
          {sponsors.slice(0, MAX_SPONSOR_SPOTS).map((sponsor) => (
            <div
              key={sponsor.id}
              className="w-full h-[162px] rounded-[18px] border border-[#e4e4e7] bg-white p-3.5 shadow-xs hover:border-[#d4d4d8] transition-all flex flex-col"
            >
              {/* Top Row: Icon on left, Black Visit Button on right */}
              <div className="flex items-center justify-between gap-2.5 h-9 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-[#f4f4f5] border border-[#e4e4e7]/70 flex items-center justify-center p-1.5 shadow-2xs shrink-0 overflow-hidden">
                  {sponsor.logoUrl ? (
                    <img
                      src={sponsor.logoUrl}
                      alt={`${sponsor.name} logo`}
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain rounded-md"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.sn-fallback') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`sn-fallback ${
                      sponsor.logoUrl ? 'hidden' : 'flex'
                    } w-full h-full items-center justify-center font-bold text-xs text-[#09090b] bg-[#e4e4e7] rounded-lg`}
                  >
                    {sponsor.fallbackText || sponsor.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <a
                  href={withUtm(sponsor.websiteUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleTrackClick(sponsor.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[9px] bg-[#09090b] hover:bg-[#27272a] text-white text-[11.5px] font-semibold transition-colors shadow-2xs shrink-0 cursor-pointer"
                >
                  <span>{sponsor.ctaLabel || 'Visit'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </a>
              </div>

              {/* Middle: Title & Description in clean natural flow */}
              <div className="mt-2.5">
                <div className="font-bold text-[13.5px] text-[#09090b] tracking-tight truncate leading-[18px]">
                  {sponsor.title}
                </div>
                <p className="text-[12px] text-[#71717a] leading-[17px] line-clamp-2 mt-1 h-[34px]">
                  {sponsor.description}
                </p>
              </div>

              {/* Footer: Pinned cleanly to the bottom */}
              <div className="mt-auto pt-2.5">
                <div className="border-t border-[#f4f4f5] pt-2 flex items-center justify-between text-[11px]">
                  <Link
                    href="/contact"
                    className="text-[#71717a] hover:text-[#09090b] font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Advertise</span>
                    <ArrowUpRight className="w-3 h-3 text-[#71717a]" />
                  </Link>
                  <span className="text-[#a1a1aa] font-medium text-[11px]">
                    {sponsor.promotedLabel || 'Promoted'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* 3. Dotted/Dashed Advertise Card */}
          {spotsLeft > 0 && (
            <Link
              href="/contact"
              className="w-full rounded-[18px] border border-dashed border-[#d4d4d8] bg-transparent hover:bg-white/80 transition-colors py-4 px-4 flex flex-col items-center justify-center text-center cursor-pointer block group"
            >
              <Megaphone01Icon size={18} strokeWidth={1.7} className="text-[#71717a] group-hover:text-[#09090b] transition-colors" />
              <div className="font-bold text-[13.5px] text-[#09090b] mt-1.5 transition-colors">
                Advertise
              </div>
              <div className="text-[11.5px] text-[#71717a] mt-0.5 font-medium">
                {spotsLeft} of {MAX_SPONSOR_SPOTS} spots left
              </div>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
