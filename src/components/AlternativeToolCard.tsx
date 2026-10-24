'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shield01Icon, 
  ArrowUpRight01Icon,
  Tag01Icon,
  CpuIcon,
  PuzzleIcon
} from 'hugeicons-react';
import { SoftwareItem } from '@/types';
import { resolveSoftwareLogo, getDisplayDomain, withUtm } from '@/lib/logo-utils';

interface AlternativeToolCardProps {
  software: SoftwareItem;
}

export function AlternativeToolCard({ software }: AlternativeToolCardProps) {
  const [imgError, setImgError] = useState(false);

  const domain = getDisplayDomain(software.websiteUrl);
  const resolvedLogo = resolveSoftwareLogo(software);

  const initials = software.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Determine Pricing Label & Badge Style
  const getPricingBadge = () => {
    if (software.pricingModel === 'Open Source') {
      return {
        label: 'Open Source',
        className: 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]'
      };
    }
    if (software.pricingModel === 'Free' || (software.freeTierAvailable && !software.startingPrice)) {
      return {
        label: 'Free',
        className: 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
      };
    }
    if (software.pricingModel === 'Freemium' || (software.freeTierAvailable && software.startingPrice)) {
      return {
        label: 'Freemium',
        className: 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
      };
    }
    return {
      label: 'Paid',
      className: 'bg-[#f4f4f5] text-[#52525b] border-[#e4e4e7]'
    };
  };

  const pricingBadge = getPricingBadge();

  // Additional Tags: Open Source, Browser Extension, MCP Server / Plugin
  const isOpenSource =
    software.pricingModel === 'Open Source' ||
    software.tagline?.toLowerCase().includes('open-source') ||
    software.tagline?.toLowerCase().includes('open source') ||
    software.shortDescription?.toLowerCase().includes('open-source') ||
    software.shortDescription?.toLowerCase().includes('open source') ||
    software.security?.certifications?.some((c) => c.toLowerCase().includes('open source'));

  const isExtension =
    software.itemType === 'extension' ||
    software.platforms?.some((p) => ['Chrome', 'Firefox', 'Edge'].includes(p));

  const isMcpOrPlugin =
    software.itemType === 'plugin' ||
    software.platforms?.some((p) => ['MCP', 'Claude', 'ChatGPT'].includes(p));

  const isZeroKnowledge = software.security?.zeroKnowledgeArchitecture;
  const isE2EE = software.security?.endToEndEncrypted;

  // Format category name
  const formattedCategory = software.primaryCategory
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="group rounded-2xl border border-[#e4e4e7] bg-white p-5 sm:p-6 transition-all duration-150 hover:border-[#d4d4d8] hover:-translate-y-0.5 hover:shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
        
        {/* Left Side: Logo */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-[#e4e4e7] bg-[#f8fafc] flex items-center justify-center shrink-0 p-2 relative overflow-hidden group-hover:border-[#d4d4d8] transition-colors">
          {resolvedLogo && !imgError ? (
            <img
              src={resolvedLogo}
              alt={`${software.name} logo`}
              width={40}
              height={40}
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-md"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono font-bold text-sm text-[#09090b] bg-[#f4f4f5] rounded-lg">
              {initials}
            </div>
          )}
        </div>

        {/* Center / Main Content */}
        <div className="flex-1 min-w-0">
          
          {/* Top Line: Name + Verified Checkmark + Domain */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <Link
              href={`/tools/${software.slug}`}
              className="text-[17px] sm:text-[18px] font-bold text-[#09090b] hover:text-[#09090b] transition-colors tracking-tight"
            >
              {software.name}
            </Link>

            {/* Verified Scalloped Badge */}
            <span className="inline-flex items-center text-[#f59e0b]" title="Verified by SecureTools">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.6 2.25A2.25 2.25 0 0 0 6.63 3.65l-.83 1.94a2.25 2.25 0 0 1-1.21 1.21l-1.94.83a2.25 2.25 0 0 0-1.4 1.97v2.12c0 .8.42 1.54 1.1 1.95l1.83 1.08a2.25 2.25 0 0 1 1.08 1.83v2.12a2.25 2.25 0 0 0 1.97 1.4l1.94.83a2.25 2.25 0 0 1 1.21 1.21l.83 1.94a2.25 2.25 0 0 0 1.97 1.4h2.12c.8 0 1.54-.42 1.95-1.1l1.08-1.83a2.25 2.25 0 0 1 1.83-1.08h2.12a2.25 2.25 0 0 0 1.4-1.97l.83-1.94a2.25 2.25 0 0 1 1.21-1.21l1.94-.83a2.25 2.25 0 0 0 1.4-1.97v-2.12a2.25 2.25 0 0 0-1.1-1.95l-1.83-1.08a2.25 2.25 0 0 1-1.08-1.83v-2.12a2.25 2.25 0 0 0-1.97-1.4l-1.94-.83a2.25 2.25 0 0 1-1.21-1.21l-.83-1.94a2.25 2.25 0 0 0-1.97-1.4h-2.12a2.25 2.25 0 0 0-1.95 1.1l-1.08 1.83a2.25 2.25 0 0 1-1.83 1.08H8.6zm7.1 6.8a.75.75 0 0 0-1.06-1.06L10.5 12.14l-1.64-1.65a.75.75 0 0 0-1.06 1.06l2.17 2.18a.75.75 0 0 0 1.06 0l4.67-4.68z"
                />
              </svg>
            </span>

            {/* URL / Domain */}
            {domain && (
              <a
                href={withUtm(software.websiteUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] sm:text-[13px] text-[#71717a] hover:text-[#09090b] font-mono transition-colors inline-flex items-center gap-0.5 ml-1"
                title={`Visit ${domain}`}
              >
                <span>{domain}</span>
                <ArrowUpRight01Icon size={12} className="text-[#a1a1aa]" />
              </a>
            )}
          </div>

          {/* Description */}
          <p className="text-[13px] sm:text-[14px] text-[#52525b] mt-1.5 leading-relaxed line-clamp-2">
            {software.tagline || software.shortDescription}
          </p>

          {/* Badges / Metadata row */}
          <div className="flex flex-wrap items-center gap-2 mt-3.5">
            {/* Category */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#f4f4f5] text-[#52525b] border border-[#e4e4e7]">
              <Tag01Icon size={12} className="text-[#71717a]" />
              <span>{formattedCategory}</span>
            </span>

            {/* Pricing Model Badge */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${pricingBadge.className}`}>
              {pricingBadge.label}
              {software.startingPrice && software.pricingModel !== 'Open Source' && software.pricingModel !== 'Free' && (
                <span className="ml-1 opacity-75 font-normal">({software.startingPrice})</span>
              )}
            </span>

            {/* Open Source Tag */}
            {isOpenSource && software.pricingModel !== 'Open Source' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]">
                Open Source
              </span>
            )}

            {/* Browser / Chrome Extension Tag */}
            {isExtension && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                <PuzzleIcon size={12} className="text-[#92400e]" />
                <span>Chrome Extension</span>
              </span>
            )}

            {/* MCP Server / Plugin Tag */}
            {isMcpOrPlugin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#faf5ff] text-[#6b21a8] border border-[#e9d5ff]">
                <CpuIcon size={12} className="text-[#6b21a8]" />
                <span>MCP Server</span>
              </span>
            )}

            {/* Zero-Knowledge Security Badge */}
            {isZeroKnowledge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#02ccc1]/10 text-[#008f87] border border-[#02ccc1]/30">
                <Shield01Icon size={12} className="text-[#008f87]" />
                <span>Zero-Knowledge</span>
              </span>
            )}

            {/* End-to-End Encrypted */}
            {isE2EE && !isZeroKnowledge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#02ccc1]/10 text-[#008f87] border border-[#02ccc1]/30">
                <Shield01Icon size={12} className="text-[#008f87]" />
                <span>E2EE</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Action: Visit Button */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f4f4f5] sm:shrink-0">
          <Link
            href={`/tools/${software.slug}`}
            className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg text-[12px] font-semibold text-[#09090b] bg-[#f4f4f5] hover:bg-[#02ccc1] hover:text-white transition-colors"
          >
            View Details
          </Link>
          {software.websiteUrl && (
            <a
              href={withUtm(software.websiteUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#71717a] hover:text-[#09090b] transition-colors"
            >
              <span>Visit Site</span>
              <ArrowUpRight01Icon size={12} />
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
