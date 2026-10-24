'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import {
  CloudIcon,
  Share01Icon,
  File01Icon,
  Shield01Icon,
  Pdf01Icon,
  SignatureIcon,
  ArrowUpRight01Icon,
  Key01Icon,
  FileZipIcon,
  Tag01Icon,
  Database01Icon,
} from 'hugeicons-react';
import { SoftwareItem, getItemPath } from '@/types';
import { resolveSoftwareLogo, getDisplayDomain, withUtm } from '@/lib/logo-utils';

interface SoftwareCardProps {
  software: SoftwareItem;
}

export function SoftwareCard({ software }: SoftwareCardProps) {
  const initials = software.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const domain = getDisplayDomain(software.websiteUrl);
  const resolvedLogo = resolveSoftwareLogo(software);

  const getCategoryIcon = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes('compression') || s.includes('archive') || s.includes('zip')) return FileZipIcon;
    if (s.includes('cloud') || s.includes('storage') || s.includes('backup')) return CloudIcon;
    if (s.includes('share') || s.includes('transfer')) return Share01Icon;
    if (s.includes('pdf')) return Pdf01Icon;
    if (s.includes('sign')) return SignatureIcon;
    if (s.includes('database') || s.includes('backend')) return Database01Icon;
    if (s.includes('security') || s.includes('encrypt')) return Shield01Icon;
    if (s.includes('data-room') || s.includes('vdr') || s.includes('key')) return Key01Icon;
    if (s.includes('large-file') || s.includes('fast-transfer')) return ArrowUpRight01Icon;
    return File01Icon;
  };

  const getPricingLabel = (s: SoftwareItem): 'Free' | 'Freemium' | 'Paid' => {
    if (s.pricingModel === 'Freemium') {
      return 'Freemium';
    }
    if (s.freeTierAvailable && s.startingPrice) {
      return 'Freemium';
    }
    if (s.pricingModel === 'Free' || s.pricingModel === 'Open Source') {
      return 'Free';
    }
    if (s.freeTierAvailable && !s.startingPrice) {
      return 'Free';
    }
    return 'Paid';
  };

  const categoryName = software.primaryCategory
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const CategoryIcon = getCategoryIcon(software.primaryCategory);
  const pricingLabel = getPricingLabel(software);

  return (
    <div className="group rounded-2xl border border-[#e4e4e7] bg-white hover:border-[#02ccc1] transition-all p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
      <div>
        {/* Card Header: Large Logo + Title + Free/Paid Badge + Domain with Blue Badge + Top Right External Link */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-xl border border-[#e4e4e7] bg-white flex items-center justify-center shrink-0 p-2 shadow-2xs group-hover:border-[#02ccc1]/30 transition-colors relative overflow-hidden">
              {resolvedLogo ? (
                <img
                  src={resolvedLogo}
                  alt={`${software.name} logo`}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain rounded-md"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector(
                      '.card-fallback'
                    ) as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`card-fallback ${
                  resolvedLogo ? 'hidden' : 'flex'
                } w-full h-full items-center justify-center font-bold text-xs text-[#09090b] font-mono bg-[#f4f4f5] rounded-lg`}
              >
                {initials}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={getItemPath(software)}
                className="text-[17px] sm:text-[18px] font-bold text-[#09090b] tracking-tight truncate block"
              >
                {software.name}
              </Link>

              <div className="flex items-center gap-1.5 mt-0.5 text-[13px] text-[#71717a] font-medium truncate">
                <span>{domain || software.name}</span>
                <svg
                  className="w-4 h-4 text-[#1d9bf0] fill-[#1d9bf0] shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.41-1.41 2.09 2.09 5.69-5.69 1.41 1.41-7.1 7.1z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Top Right External Link Icon */}
          <a
            href={withUtm(software.websiteUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-md text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors shrink-0"
            title={`Visit ${software.name} official site`}
          >
            <ExternalLink className="w-5 h-5 text-[#71717a]" />
          </a>
        </div>

        {/* Card Description (10% tighter margins) */}
        <p className="text-[13.5px] text-[#63636b] leading-relaxed line-clamp-2 my-3.5">
          {software.shortDescription}
        </p>
      </div>

      {/* Card Bottom Row: Category with enterprise icon (Left) + Pricing Badge (Right) */}
      <div className="flex items-center justify-between pt-1">
        {/* Category with enterprise icon */}
        <div className="flex items-center gap-2 text-[13.5px] font-medium text-[#63636b] min-w-0 pr-2">
          <CategoryIcon size={18} strokeWidth={1.8} className="text-[#71717a] shrink-0" />
          <span className="truncate">{categoryName}</span>
        </div>

        {/* Free / Freemium / Paid Badge (Clean dashboard-style rounded box) */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-[11.5px] font-semibold shrink-0 border ${
            pricingLabel === 'Free'
              ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]/80'
              : pricingLabel === 'Freemium'
              ? 'bg-[#02ccc1]/10 text-[#008f87] border-[#02ccc1]/30'
              : 'bg-[#f4f4f5] text-[#18181b] border-[#e4e4e7]'
          }`}
        >
          <Tag01Icon
            size={12}
            strokeWidth={2}
            className={`shrink-0 ${
              pricingLabel === 'Free'
                ? 'text-[#059669]'
                : pricingLabel === 'Freemium'
                ? 'text-[#02ccc1]'
                : 'text-[#52525b]'
            }`}
          />
          <span>{pricingLabel}</span>
        </span>
      </div>
    </div>
  );
}
