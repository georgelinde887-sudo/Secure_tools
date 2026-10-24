'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search01Icon, 
  Cancel01Icon,
  AlertCircleIcon, 
  ArrowLeft01Icon
} from 'hugeicons-react';
import { AlternativeToolCard } from '@/components/AlternativeToolCard';
import { SoftwareItem, AlternativeItem } from '@/types';

interface AlternativeDetailClientProps {
  brandName: string;
  displayCount: number;
  aiQuery: string;
  alternativeTools: SoftwareItem[];
  alt: AlternativeItem | null | undefined;
  allSoftwareMap: Record<string, SoftwareItem>;
}

export function AlternativeDetailClient({
  brandName,
  displayCount,
  aiQuery,
  alternativeTools,
  alt,
  allSoftwareMap,
}: AlternativeDetailClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time search filter
  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return alternativeTools;

    return alternativeTools.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchTagline = tool.tagline?.toLowerCase().includes(q);
      const matchDesc = tool.shortDescription?.toLowerCase().includes(q);
      const matchCategory = tool.primaryCategory?.toLowerCase().includes(q);
      const matchPricing = tool.pricingModel?.toLowerCase().includes(q);
      const matchDomain = tool.websiteUrl?.toLowerCase().includes(q);

      // Check tags
      const matchOpenSource = q.includes('open') && (
        tool.pricingModel === 'Open Source' ||
        tool.tagline?.toLowerCase().includes('open source') ||
        tool.shortDescription?.toLowerCase().includes('open source')
      );
      const matchZeroKnowledge = (q.includes('zero') || q.includes('knowledge')) && tool.security?.zeroKnowledgeArchitecture;
      const matchExtension = (q.includes('chrome') || q.includes('extension')) && (
        tool.itemType === 'extension' || tool.platforms?.some((p) => ['Chrome', 'Firefox', 'Edge'].includes(p))
      );
      const matchMcp = (q.includes('mcp') || q.includes('plugin')) && (
        tool.itemType === 'plugin' || tool.platforms?.some((p) => ['MCP', 'Claude', 'ChatGPT'].includes(p))
      );

      return (
        matchName ||
        matchTagline ||
        matchDesc ||
        matchCategory ||
        matchPricing ||
        matchDomain ||
        matchOpenSource ||
        matchZeroKnowledge ||
        matchExtension ||
        matchMcp
      );
    });
  }, [searchQuery, alternativeTools]);

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-[1000px] mx-auto">
      
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#71717a] mb-5 font-geist">
        <Link href="/alternatives" className="hover:text-[#09090b] transition-colors">
          Alternatives
        </Link>
        <span className="text-[#d4d4d8]">/</span>
        <span className="text-[#09090b] font-medium">
          {brandName} alternatives
        </span>
      </nav>

      {/* Main Title Header */}
      <div className="mb-6 font-geist">
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#09090b] mb-3 leading-tight">
          {displayCount} Products Like {brandName}
        </h1>
        <p className="text-[14px] sm:text-[15px] text-[#52525b] max-w-3xl leading-relaxed">
          These are verified software tools and independent solutions on SecureTools.live evaluated as {brandName} alternatives. If you want privacy-first platforms like {brandName} with zero-knowledge encryption, verifiable data sovereignty, and independent security audits, explore our curated list below.
        </p>

        {/* Action Bar: Left = ASK AI, Right = Search Box */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 pt-4 border-t border-[#f4f4f5]">
          
          {/* ASK AI Row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
              ASK AI
            </span>

            {/* ChatGPT */}
            <a
              href={`https://chatgpt.com/?q=${encodeURIComponent(aiQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#52525b] hover:text-[#09090b] transition-colors font-medium"
            >
              <Image
                src="/icons/chatgpt.png"
                alt="ChatGPT"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain rounded-full shrink-0"
                unoptimized
              />
              <span>ChatGPT</span>
            </a>

            <span className="text-[#d4d4d8]">·</span>

            {/* Claude */}
            <a
              href={`https://claude.ai/new?q=${encodeURIComponent(aiQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#52525b] hover:text-[#09090b] transition-colors font-medium"
            >
              <Image
                src="/icons/claude.png"
                alt="Claude"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain rounded-full shrink-0"
                unoptimized
              />
              <span>Claude</span>
            </a>

            <span className="text-[#d4d4d8]">·</span>

            {/* Perplexity */}
            <a
              href={`https://www.perplexity.ai/search?q=${encodeURIComponent(aiQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#52525b] hover:text-[#09090b] transition-colors font-medium"
            >
              <Image
                src="/icons/perplexity.png"
                alt="Perplexity"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain shrink-0"
                unoptimized
              />
              <span>Perplexity</span>
            </a>

            <span className="text-[#d4d4d8]">·</span>

            {/* Grok */}
            <a
              href={`https://x.com/i/grok?text=${encodeURIComponent(aiQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#52525b] hover:text-[#09090b] transition-colors font-medium"
            >
              <Image
                src="/icons/grok.png"
                alt="Grok"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain rounded-sm shrink-0"
                unoptimized
              />
              <span>Grok</span>
            </a>
          </div>

          {/* Right Side: Fast Real-Time Search Box */}
          <div className="relative w-full sm:w-[280px] md:w-[320px] shrink-0">
            <Search01Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${brandName} alternatives...`}
              className="w-full h-[38px] pl-10 pr-9 rounded-xl border border-[#e4e4e7] bg-white text-[13px] text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-[#02ccc1] focus:ring-1 focus:ring-[#02ccc1] shadow-2xs transition-all font-geist"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#09090b] p-1 transition-colors"
                aria-label="Clear search"
              >
                <Cancel01Icon size={14} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 1 Card per Row Alternative Products List (with gap between each card) */}
      {filteredTools.length > 0 ? (
        <section className="space-y-4 mb-14" aria-label={`List of ${brandName} alternatives`}>
          {filteredTools.map((tool) => (
            <AlternativeToolCard key={tool.id} software={tool} />
          ))}
        </section>
      ) : (
        /* Empty State with transparent 05-browser-scan.gif */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center mb-14">
          <div className="w-24 h-24 mb-3 relative flex items-center justify-center">
            <Image
              src="/animations/05-browser-scan.gif"
              alt="No alternative software found"
              width={96}
              height={96}
              unoptimized
              className="object-contain"
            />
          </div>
          <p className="text-[15px] font-semibold text-[#09090b] font-geist">
            No alternatives found matching &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-[13px] text-[#71717a] mt-1 font-geist max-w-sm">
            Try checking your spelling or searching for another privacy-focused category or security keyword.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-4 px-3.5 py-1.5 rounded-lg text-[12px] font-medium text-[#09090b] bg-[#f4f4f5] hover:bg-[#e4e4e7] transition-colors font-geist"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Editorial Comparison & Trade-Off Matrix (if available and no active search filter) */}
      {alt && !searchQuery && (
        <div className="space-y-8 pt-8 border-t border-[#e4e4e7] font-geist">
          {/* Why Seek Alternatives Section */}
          {alt.whyUsersSeekAlternatives && alt.whyUsersSeekAlternatives.length > 0 && (
            <section className="bg-white rounded-2xl border border-[#e4e4e7] p-6 shadow-2xs">
              <h2 className="text-[16px] font-bold text-[#09090b] mb-2 flex items-center gap-2">
                <AlertCircleIcon size={18} className="text-[#02ccc1]" />
                Why Users Seek {brandName} Alternatives
              </h2>
              <p className="text-[13px] text-[#71717a] mb-4">
                Based on security audits, zero-knowledge requirements, and organizational compliance patterns:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alt.whyUsersSeekAlternatives.map((reason, idx) => (
                  <div key={idx} className="p-3.5 bg-[#fafafa] rounded-xl border border-[#e4e4e7] text-[13px] text-[#09090b] flex items-start gap-2.5">
                    <span className="text-[#02ccc1] font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trade-Off Matrix */}
          {alt.tradeOffAnalysis && alt.tradeOffAnalysis.length > 0 && (
            <section className="bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden shadow-2xs">
              <div className="p-5 border-b border-[#e4e4e7] bg-[#fafafa]">
                <h2 className="text-[14px] font-bold text-[#09090b] uppercase tracking-wider font-mono">
                  Key Advantages & Trade-Off Analysis
                </h2>
              </div>
              <div className="divide-y divide-[#e4e4e7]">
                {alt.tradeOffAnalysis.map((item, idx) => {
                  const tool = allSoftwareMap[item.toolId];
                  if (!tool) return null;

                  return (
                    <div key={idx} className="p-5 hover:bg-[#fafafa] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="text-[15px] font-bold text-[#09090b] hover:underline transition-colors"
                        >
                          {tool.name}
                        </Link>
                        <span className="font-mono text-[11px] bg-[#f4f4f5] text-[#09090b] px-2.5 py-0.5 rounded-full font-semibold">
                          {item.bestFor}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] mt-3">
                        <div className="p-3 rounded-xl bg-[#ecfdf5]/50 border border-[#a7f3d0]">
                          <span className="font-mono text-[10px] font-bold text-[#065f46] block mb-1 uppercase tracking-wider">
                            Key Advantage
                          </span>
                          <p className="text-[#09090b] leading-relaxed">{item.keyAdvantageOverOriginal}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
                          <span className="font-mono text-[10px] font-bold text-[#854d0e] block mb-1 uppercase tracking-wider">
                            Potential Consideration
                          </span>
                          <p className="text-[#09090b] leading-relaxed">{item.potentialDrawback}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Back to All Alternatives */}
      <div className="mt-12 text-center font-geist">
        <Link
          href="/alternatives"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-[#09090b] bg-white border border-[#e4e4e7] hover:border-[#09090b] hover:bg-[#f4f4f5] shadow-2xs transition-all"
        >
          <ArrowLeft01Icon size={14} />
          <span>Browse All Software Alternatives</span>
        </Link>
      </div>

    </div>
  );
}
