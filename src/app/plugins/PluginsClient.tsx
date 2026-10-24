'use client';

import { HeroBanner } from '@/components/HeroBanner';
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Check, Search, ExternalLink } from 'lucide-react';
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
  GridIcon,
  Building02Icon,
  UserMultiple02Icon,
  ServerStack01Icon,
  Folder01Icon,
  Plug01Icon,
  CodeIcon,
  SecurityCheckIcon,
  CheckmarkCircle02Icon,
} from 'hugeicons-react';
import { SoftwareItem, Category } from '@/types';
import { sortSoftwareByEnterpriseRank } from '@/lib/data';
import { resolveSoftwareLogo, getDisplayDomain, withUtm } from '@/lib/logo-utils';

interface PluginsClientProps {
  initialSoftware: SoftwareItem[];
  categories: Category[];
}

export function PluginsClient({ initialSoftware, categories }: PluginsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [pricingFilter, setPricingFilter] = useState<'All' | 'Free' | 'Freemium' | 'Paid'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic Pagination & Infinite Scroll (100 items per batch)
  const PAGE_SIZE = 100;
  const [softwareItems, setSoftwareItems] = useState<SoftwareItem[]>(initialSoftware);
  const [apiPage, setApiPage] = useState<number>(1);
  const [hasMoreApi, setHasMoreApi] = useState<boolean>(initialSoftware.length >= 100);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sync with incoming props
  useEffect(() => {
    setSoftwareItems(initialSoftware);
    setHasMoreApi(initialSoftware.length >= 100);
  }, [initialSoftware]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsCategoryOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper to extract clean domain
  const getDomain = (url: string) => {
    return getDisplayDomain(url);
  };

  // Pricing classifier
  const getPricingLabel = (software: SoftwareItem): 'Free' | 'Freemium' | 'Paid' => {
    if (software.pricingModel === 'Freemium') return 'Freemium';
    if (software.freeTierAvailable && software.startingPrice) return 'Freemium';
    if (software.pricingModel === 'Free' || software.pricingModel === 'Open Source') return 'Free';
    if (software.freeTierAvailable && !software.startingPrice) return 'Free';
    return 'Paid';
  };

  // Helper for category name
  const getCategoryName = (slug: string) => {
    const found = categories.find((c) => c.slug === slug);
    if (found) return found.name;
    return slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  // Helper for enterprise category icon
  const getCategoryIcon = (slug: string) => {
    const s = (slug || '').toLowerCase();
    if (!s) return GridIcon;
    if (s.includes('compression') || s.includes('archive') || s.includes('zip')) return FileZipIcon;
    if (s.includes('business')) return Building02Icon;
    if (s.includes('portal') || s.includes('client')) return UserMultiple02Icon;
    if (s.includes('mft') || s.includes('server') || s.includes('sftp') || s.includes('ftp')) return ServerStack01Icon;
    if (s.includes('cloud') || s.includes('storage') || s.includes('backup')) return CloudIcon;
    if (s.includes('large-file') || s.includes('fast-transfer')) return ArrowUpRight01Icon;
    if (s.includes('share') || s.includes('transfer')) return Share01Icon;
    if (s.includes('pdf')) return Pdf01Icon;
    if (s.includes('sign')) return SignatureIcon;
    if (s.includes('security') || s.includes('encrypt')) return Shield01Icon;
    if (s.includes('data-room') || s.includes('vdr') || s.includes('key')) return Key01Icon;
    return Folder01Icon;
  };

  // Filter software
  const filteredSoftware = useMemo(() => {
    let list = softwareItems.filter((item) => item.published);

    if (selectedCategory) {
      list = list.filter(
        (item) =>
          item.primaryCategory === selectedCategory ||
          item.secondaryCategories.includes(selectedCategory)
      );
    }

    if (pricingFilter !== 'All') {
      list = list.filter((item) => getPricingLabel(item) === pricingFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.tagline.toLowerCase().includes(q) ||
          item.shortDescription.toLowerCase().includes(q)
      );
    }

    // Enterprise Dynamic Ranking: Reviews (Tier 1) -> Views (Tier 2) -> Latest Launch Recency (Tier 3)
    return sortSoftwareByEnterpriseRank(list);
  }, [softwareItems, selectedCategory, pricingFilter, searchQuery]);

  const filteredPlugins = filteredSoftware;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, pricingFilter, searchQuery]);

  const hasMore = visibleCount < filteredPlugins.length || hasMoreApi;

  // Infinite Scroll fetcher / paginator
  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;

    if (visibleCount < filteredPlugins.length) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((prev) => prev + PAGE_SIZE);
        setIsLoadingMore(false);
      }, 150);
      return;
    }

    if (hasMoreApi) {
      setIsLoadingMore(true);
      try {
        const nextPage = apiPage + 1;
        const params = new URLSearchParams({
          type: 'plugin',
          page: String(nextPage),
          limit: '100',
        });
        if (selectedCategory) {
          params.set('category', selectedCategory);
        }
        if (pricingFilter !== 'All') {
          params.set('pricing', pricingFilter);
        }
        if (searchQuery.trim()) {
          params.set('search', searchQuery.trim());
        }

        const res = await fetch(`/api/tools?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setSoftwareItems((prev) => {
              const existingIds = new Set(prev.map((i) => i.id));
              const newItems = json.data.filter((i: SoftwareItem) => !existingIds.has(i.id));
              return [...prev, ...newItems];
            });
            setApiPage(nextPage);
            setVisibleCount((prev) => prev + PAGE_SIZE);
            setHasMoreApi(Boolean(json.hasMore));
          } else {
            setHasMoreApi(false);
          }
        }
      } catch (err) {
        console.error('Error fetching more plugins:', err);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [isLoadingMore, visibleCount, filteredPlugins.length, hasMoreApi, apiPage, selectedCategory, pricingFilter, searchQuery]);

  // Infinite Scroll IntersectionObserver Sentinel
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '350px' }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isLoadingMore, loadMore]);

  const paginatedPlugins = useMemo(() => {
    return filteredPlugins.slice(0, visibleCount);
  }, [filteredPlugins, visibleCount]);

  // Selected Category Label
  const selectedCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const categoryButtonLabel = selectedCategoryObj ? selectedCategoryObj.name : 'All Categories';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* 1. Dynamic Hero Banner */}
      <HeroBanner />

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Category Dropdown & Pricing Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#e4e4e7] bg-white text-[13px] font-semibold text-[#09090b] hover:border-[#02ccc1] transition-colors shadow-2xs cursor-pointer"
            >
              <GridIcon size={16} className="text-[#02ccc1]" />
              <span>{categoryButtonLabel}</span>
              <ChevronDown className="w-4 h-4 text-[#71717a]" />
            </button>

            {isCategoryOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl border border-[#e4e4e7] bg-white p-2 shadow-xl z-50">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('');
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-[13px] transition-all flex items-center justify-between cursor-pointer rounded-xl ${
                    !selectedCategory
                      ? 'bg-[#02ccc1] text-white font-semibold shadow-xs'
                      : 'text-[#09090b] hover:bg-black/5 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GridIcon size={16} className={`shrink-0 ${!selectedCategory ? 'text-white' : 'text-[#71717a]'}`} />
                    <span className="truncate">All Categories</span>
                  </div>
                  {!selectedCategory && <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />}
                </button>

                {categories.map((c) => {
                  const isSelected = selectedCategory === c.slug;
                  const CatIcon = getCategoryIcon(c.slug);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-[13px] transition-all flex items-center justify-between cursor-pointer rounded-xl ${
                        isSelected
                          ? 'bg-[#02ccc1] text-white font-semibold shadow-xs'
                          : 'text-[#09090b] hover:bg-black/5 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CatIcon size={16} className={`shrink-0 ${isSelected ? 'text-white' : 'text-[#71717a]'}`} />
                        <span className="truncate">{c.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pricing Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#f4f4f5] border border-[#e4e4e7]">
            {(['All', 'Free', 'Freemium', 'Paid'] as const).map((tab) => {
              const active = pricingFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPricingFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-[#09090b] shadow-2xs'
                      : 'text-[#71717a] hover:text-[#09090b]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins &amp; MCP..."
            className="w-full pl-9 pr-3.5 py-2 text-[13px] rounded-xl border border-[#e4e4e7] bg-white text-[#09090b] placeholder:text-[#a1a1aa] focus:border-[#02ccc1] focus:outline-none shadow-2xs"
          />
        </div>
      </div>

      {/* 3. Plugins Count Bar */}
      <div className="flex items-center justify-between text-[12px] text-[#71717a] px-1 font-mono">
        <span>Showing {filteredSoftware.length} verified plugins &amp; MCP servers</span>
        {selectedCategory && (
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className="text-[#02ccc1] hover:underline cursor-pointer"
          >
            Clear category filter
          </button>
        )}
      </div>

      {/* 4. Directory Grid */}
      {filteredSoftware.length === 0 ? (
        <div className="pt-2 sm:pt-3 pb-12 px-4 text-center flex flex-col items-center justify-center bg-transparent">
          <div className="w-[150px] sm:w-[170px] aspect-[255/241] mb-3 flex items-center justify-center overflow-hidden">
            <Image
              src="/animations/05-browser-scan.gif"
              alt="No plugins found"
              width={170}
              height={160}
              unoptimized
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-base font-bold text-[#09090b]">No plugins found</h3>
          <p className="text-[13px] text-[#71717a] mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or switching to &ldquo;All Categories&rdquo;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedPlugins.map((software) => {
            const domain = getDomain(software.websiteUrl);
            const resolvedLogo = resolveSoftwareLogo(software);
            const categoryName = getCategoryName(software.primaryCategory);
            const CategoryIcon = getCategoryIcon(software.primaryCategory);
            const pricingLabel = getPricingLabel(software);
            const initials = software.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={software.id}
                className="group rounded-2xl border border-[#e4e4e7] bg-white hover:border-[#02ccc1] transition-all p-5 sm:p-6 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Favicon + Title + Domain + External Link */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-13 h-13 rounded-2xl border border-[#e4e4e7] bg-white flex items-center justify-center shrink-0 p-2 shadow-2xs group-hover:border-[#02ccc1]/30 transition-colors relative overflow-hidden">
                        {resolvedLogo ? (
                          <img
                            src={resolvedLogo}
                            alt={`${software.name} logo`}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain rounded-lg"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLElement;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('.card-fallback') as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className={`card-fallback ${resolvedLogo ? 'hidden' : 'flex'} w-full h-full items-center justify-center font-bold text-xs text-[#09090b] font-mono bg-[#f4f4f5] rounded-xl`}
                        >
                          {initials}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/plugins/${software.slug}`}
                          className="text-[18px] sm:text-[19px] font-bold text-[#09090b] tracking-tight truncate block"
                        >
                          {software.name}
                        </Link>

                        <div className="flex items-center gap-1.5 mt-0.5 text-[13px] text-[#71717a] font-medium truncate">
                          <span>{domain || software.name}</span>
                          <svg className="w-3.5 h-3.5 text-[#1d9bf0] fill-[#1d9bf0] shrink-0" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.41-1.41 2.09 2.09 5.69-5.69 1.41 1.41-7.1 7.1z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <a
                      href={withUtm(software.websiteUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors shrink-0"
                      title={`Visit ${software.name} official site`}
                    >
                      <ExternalLink className="w-4 h-4 text-[#71717a]" />
                    </a>
                  </div>

                  {/* Card Description */}
                  <p className="text-[13.5px] text-[#63636b] leading-relaxed line-clamp-2 my-4">
                    {software.shortDescription}
                  </p>

                  {/* Platform & Integration Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {(software.platforms || ['MCP', 'Claude', 'ChatGPT']).map((platform) => (
                      <span
                        key={platform}
                        className="px-2 py-0.5 rounded-md bg-[#fafafa] border border-[#e4e4e7] text-[10.5px] font-mono text-[#71717a]"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Category & Pricing Badge */}
                <div className="flex items-center justify-between pt-2 border-t border-[#f4f4f5]">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#63636b] min-w-0 pr-2">
                    <CategoryIcon size={16} strokeWidth={1.8} className="text-[#71717a] shrink-0" />
                    <span className="truncate">{categoryName}</span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-[11px] font-semibold shrink-0 border ${
                      pricingLabel === 'Free'
                        ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]/80'
                        : pricingLabel === 'Freemium'
                        ? 'bg-[#02ccc1]/10 text-[#008f87] border-[#02ccc1]/30'
                        : 'bg-[#f4f4f5] text-[#18181b] border-[#e4e4e7]'
                    }`}
                  >
                    <Tag01Icon
                      size={11}
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
          })}
        </div>
      )}

      {/* Infinite Scroll Sentinel & Pagination Status */}
      {hasMore && (
        <div ref={sentinelRef} className="py-6 flex flex-col items-center justify-center gap-2">
          {isLoadingMore && (
            <div className="flex items-center gap-2 text-[12.5px] text-[#71717a] font-medium font-geist">
              <div className="w-4 h-4 border-2 border-[#09090b] border-t-transparent rounded-full animate-spin" />
              <span>Loading more plugins & MCP servers...</span>
            </div>
          )}
          <span className="text-[11px] font-mono text-[#a1a1aa]">
            Showing {paginatedPlugins.length} of {filteredSoftware.length} plugins & MCP servers
          </span>
        </div>
      )}

      {!hasMore && filteredSoftware.length > 0 && (
        <div className="py-8 text-center flex items-center justify-center gap-2 text-[12px] font-mono text-[#a1a1aa]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span>Showing all {filteredSoftware.length} verified plugins & MCP servers</span>
        </div>
      )}
    </div>
  );
}
