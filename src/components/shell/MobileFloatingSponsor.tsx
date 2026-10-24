'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { SponsorItem } from '@/data/sponsors';
import { withUtm } from '@/lib/logo-utils';

export function MobileFloatingSponsor() {
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const loadSponsors = useCallback(async () => {
    try {
      const res = await fetch('/api/sponsors', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSponsors(data.sponsors || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadSponsors();
    const handleUpdate = () => loadSponsors();
    window.addEventListener('sponsors-updated', handleUpdate);
    return () => window.removeEventListener('sponsors-updated', handleUpdate);
  }, [loadSponsors]);

  // Auto-slide every 5 seconds if multiple sponsors
  useEffect(() => {
    if (sponsors.length <= 1 || isPaused || isDismissed) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [sponsors.length, isPaused, isDismissed]);

  if (sponsors.length === 0 || isDismissed) return null;

  const current = sponsors[currentIndex] || sponsors[0];

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
    <div
      className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-6 sm:w-[420px] z-40 xl:hidden animate-in slide-in-from-bottom-4 duration-300 font-geist"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-2xl border border-[#e4e4e7] bg-white/95 backdrop-blur-md p-3 sm:p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.14)] flex items-center justify-between gap-3 transition-all">
        {/* Left: Brand Icon + Title + Ad Badge + Description */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-2xs">
            {current.logoUrl ? (
              <img
                src={current.logoUrl}
                alt={`${current.name} logo`}
                width={28}
                height={28}
                className="w-7 h-7 object-contain rounded-md"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.display = 'none';
                  const fb = target.parentElement?.querySelector('.fb-icon') as HTMLElement;
                  if (fb) fb.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`fb-icon ${
                current.logoUrl ? 'hidden' : 'flex'
              } w-full h-full items-center justify-center font-bold text-xs text-[#09090b] bg-[#e4e4e7] rounded-lg`}
            >
              {current.fallbackText || current.name.slice(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[13.5px] text-[#09090b] truncate tracking-tight">
                {current.name}
              </span>
              <span className="text-[9.5px] font-bold uppercase tracking-wider bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7] px-1.5 py-0.5 rounded-md shrink-0">
                {current.promotedLabel || 'AD'}
              </span>
            </div>
            <p className="text-[11.5px] text-[#71717a] truncate leading-tight mt-0.5">
              {current.description}
            </p>
          </div>
        </div>

        {/* Right: Visit Button + Close (X) Button */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={withUtm(current.websiteUrl)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleTrackClick(current.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-white text-[12px] font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <span>{current.ctaLabel || 'Visit'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="w-7 h-7 rounded-full bg-[#f4f4f5] hover:bg-[#e4e4e7] text-[#71717a] hover:text-[#09090b] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Dismiss advertisement"
          >
            <X size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}
