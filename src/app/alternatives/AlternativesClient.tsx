'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search01Icon, Cancel01Icon } from 'hugeicons-react';

export interface AlternativeListItem {
  name: string;
  slug: string;
  count: number;
  category?: string;
}

interface AlternativesClientProps {
  initialItems: AlternativeListItem[];
}

export function AlternativesClient({ initialItems }: AlternativesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return initialItems;
    return initialItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q))
    );
  }, [searchQuery, initialItems]);

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-6">
      {/* 1. Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#09090b] tracking-tight mb-2.5 font-geist">
          Alternatives
        </h1>
        <p className="text-[14.5px] sm:text-[15.5px] text-[#52525b] leading-relaxed max-w-2xl font-geist font-normal">
          Browse {initialItems.length} popular tools with secure file, document, and privacy alternatives on SecureTools.live.
          <br className="hidden sm:inline" /> Pick a brand to see the alternatives our editors curated, ranked by security and features.
        </p>

        {/* ASK AI Row */}
        <div className="flex items-center gap-2.5 sm:gap-3 mt-4 text-[13px] text-[#71717a] flex-wrap font-geist">
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-[#71717a] shrink-0">
            ASK AI
          </span>

          {/* ChatGPT */}
          <a
            href="https://chatgpt.com/?q=Analyze+and+compare+software+security+alternatives+on+SecureTools.live"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#09090b] hover:text-[#71717a] transition-colors"
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
            href="https://claude.ai/new?q=Analyze+and+compare+software+security+alternatives+on+SecureTools.live"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#09090b] hover:text-[#71717a] transition-colors"
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
            href="https://www.perplexity.ai/search?q=Analyze+and+compare+software+security+alternatives+on+SecureTools.live"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#09090b] hover:text-[#71717a] transition-colors"
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
            href="https://x.com/i/grok?text=Analyze+and+compare+software+security+alternatives+on+SecureTools.live"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#09090b] hover:text-[#71717a] transition-colors"
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
      </div>

      {/* 2. Fast Real-Time Search Bar */}
      <div className="relative mb-6 max-w-md">
        <Search01Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search alternatives (e.g. Dropbox, Bitwarden, DocSend)..."
          className="w-full h-[40px] pl-10 pr-9 rounded-xl border border-[#e4e4e7] bg-white text-[13.5px] text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-[#02ccc1] focus:ring-1 focus:ring-[#02ccc1] shadow-2xs transition-all font-geist"
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

      {/* 3. 2-Column Clean Table Grid */}
      {filteredItems.length === 0 ? (
        <div className="pt-2 sm:pt-3 pb-12 px-4 text-center flex flex-col items-center justify-center bg-transparent">
          <div className="w-[150px] sm:w-[170px] aspect-[255/241] mb-3 flex items-center justify-center overflow-hidden">
            <Image
              src="/animations/05-browser-scan.gif"
              alt="No alternatives found"
              width={170}
              height={160}
              unoptimized
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-sm font-semibold text-[#09090b] mb-1 font-geist">
            No alternatives found matching &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-xs text-[#71717a] max-w-sm mx-auto mb-4 font-geist">
            Try searching for another tool name, brand, or clear the search filter.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center justify-center h-[34px] px-4 rounded-[9px] border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[12px] font-semibold text-[#09090b] shadow-2xs transition-colors cursor-pointer font-geist"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-[#e4e4e7] bg-white overflow-hidden shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {filteredItems.map((item, index) => {
              const isLeftColumn = index % 2 === 0;
              return (
                <Link
                  key={item.slug}
                  href={`/alternatives/${item.slug}`}
                  className={`relative flex items-center justify-between px-6 py-4.5 hover:bg-[#f4f4f5] hover:-translate-y-[1.5px] hover:shadow-xs hover:z-10 transition-all duration-150 ease-out group border-b border-[#e4e4e7] ${
                    isLeftColumn ? 'md:border-r md:border-[#e4e4e7]' : ''
                  }`}
                >
                  <span className="text-[14.5px] sm:text-[15px] font-medium text-[#09090b] transition-colors font-geist">
                    {item.name} alternatives
                  </span>
                  <span className="font-mono text-[12px] font-semibold text-[#71717a] bg-[#f4f4f5] group-hover:bg-[#e4e4e7] group-hover:text-[#09090b] px-2.5 py-0.5 rounded-full transition-colors shrink-0 ml-3">
                    {item.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
