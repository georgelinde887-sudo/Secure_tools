'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
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
  FolderSecurityIcon,
  Folder01Icon,
  Database01Icon,
} from 'hugeicons-react';
import { SoftwareItem, Category, getItemPath } from '@/types';
import { HeroBanner } from '@/components/HeroBanner';
import { sortSoftwareByEnterpriseRank } from '@/lib/data';
import { resolveSoftwareLogo, getDisplayDomain, withUtm } from '@/lib/logo-utils';

interface DirectoryClientProps {
  initialSoftware: SoftwareItem[];
  categories: Category[];
  defaultTab?: 'all' | 'free' | 'freemium' | 'paid' | 'opensource';
  showHero?: boolean;
}

export function DirectoryClient({
  initialSoftware,
  categories,
  defaultTab = 'all',
  showHero = false,
}: DirectoryClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  // View navigation: 'all' | 'free' | 'freemium' | 'paid' | 'opensource'
  const tabFromQuery = (searchParams.get('tab') || searchParams.get('filter')) as
    | 'all'
    | 'free'
    | 'freemium'
    | 'paid'
    | 'opensource'
    | null;
  const initialTab = tabFromQuery || defaultTab;
  const [viewTab, setViewTab] = useState<'all' | 'free' | 'freemium' | 'paid' | 'opensource'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync tab with URL searchParams if query param changes
  useEffect(() => {
    const tabParam = searchParams.get('tab') || searchParams.get('filter');
    if (
      tabParam === 'opensource' ||
      tabParam === 'free' ||
      tabParam === 'freemium' ||
      tabParam === 'paid'
    ) {
      setViewTab(tabParam);
    } else if (tabParam === 'all') {
      setViewTab('all');
    } else if (!tabParam && defaultTab) {
      setViewTab(defaultTab);
    }
  }, [searchParams, defaultTab]);

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

  // Reset pagination when filter or view changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, viewTab]);

  // Helper for Free vs Freemium vs Paid classification
  const getPricingLabel = (software: SoftwareItem): 'Free' | 'Freemium' | 'Paid' => {
    if (software.pricingModel === 'Freemium') {
      return 'Freemium';
    }
    if (software.freeTierAvailable && software.startingPrice) {
      return 'Freemium';
    }
    if (software.pricingModel === 'Free' || software.pricingModel === 'Open Source') {
      return 'Free';
    }
    if (software.freeTierAvailable && !software.startingPrice) {
      return 'Free';
    }
    return 'Paid';
  };

  // Filter and Sort
  const filteredAndSorted = useMemo(() => {
    let list = softwareItems.filter((item) => item.published);

    // Filter by single category dropdown
    if (selectedCategory) {
      list = list.filter(
        (item) =>
          item.primaryCategory === selectedCategory ||
          item.secondaryCategories.includes(selectedCategory)
      );
    }

    // Filter by view tab: 'all' | 'free' | 'freemium' | 'paid' | 'opensource'
    if (viewTab === 'all') {
      list = list.filter((item) => item.itemType !== 'extension' && item.itemType !== 'plugin');
    } else if (viewTab === 'free') {
      list = list.filter((item) => getPricingLabel(item) === 'Free' && item.itemType !== 'extension' && item.itemType !== 'plugin');
    } else if (viewTab === 'freemium') {
      list = list.filter((item) => getPricingLabel(item) === 'Freemium' && item.itemType !== 'extension' && item.itemType !== 'plugin');
    } else if (viewTab === 'paid') {
      list = list.filter((item) => getPricingLabel(item) === 'Paid' && item.itemType !== 'extension' && item.itemType !== 'plugin');
    } else if (viewTab === 'opensource') {
      list = list.filter((item) => item.itemType === 'open-source' || item.pricingModel === 'Open Source');
    }

    // Enterprise Dynamic Ranking: Reviews (Tier 1) -> Views (Tier 2) -> Latest Launch Recency (Tier 3)
    return sortSoftwareByEnterpriseRank(list);
  }, [softwareItems, selectedCategory, viewTab]);

  const paginatedList = filteredAndSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSorted.length || hasMoreApi;

  // Infinite Scroll fetcher / paginator
  const loadMore = useCallback(async () => {
    if (isLoadingMore) return;

    if (visibleCount < filteredAndSorted.length) {
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
          page: String(nextPage),
          limit: '100',
        });
        if (viewTab === 'opensource') {
          params.set('type', 'open-source');
        } else {
          params.set('type', 'software');
          if (viewTab !== 'all') {
            params.set('pricing', viewTab);
          }
        }
        if (selectedCategory) {
          params.set('category', selectedCategory);
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
        console.error('Error fetching more tools:', err);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [isLoadingMore, visibleCount, filteredAndSorted.length, hasMoreApi, apiPage, viewTab, selectedCategory]);

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

  // Selected Category Label
  const selectedCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const categoryButtonLabel = selectedCategoryObj ? selectedCategoryObj.name : 'All Categories';

  // Helper to extract clean domain
  const getDomain = (url?: string) => {
    return getDisplayDomain(url);
  };

  // Helper for category display name
  const getCategoryName = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug);
    if (cat) return cat.name;
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
    if (s.includes('database') || s.includes('backend')) return Database01Icon;
    return Folder01Icon;
  };


  return (
    <div className="w-full max-w-6xl mx-auto space-y-5">
      {/* 1. Header: Hero Banner on homepage, compact title on directory */}
      {showHero ? (
        <HeroBanner />
      ) : (
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#09090b] tracking-tight">
            Explore Software
          </h1>
          <p className="text-xs text-[#71717a] mt-0.5 subtitle">
            Independent Software Directory
          </p>
        </div>
      )}

      {/* 2. Navigation & Category Control Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-3 border-b border-[#e4e4e7]">
        {/* Left: View Tabs (All Software | Free | Freemium | Paid) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setViewTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              viewTab === 'all'
                ? 'bg-[#09090b] text-white shadow-2xs'
                : 'text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5]'
            }`}
          >
            All Software
          </button>
          <button
            type="button"
            onClick={() => setViewTab('free')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              viewTab === 'free'
                ? 'bg-[#09090b] text-white shadow-2xs'
                : 'text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5]'
            }`}
          >
            Free
          </button>
          <button
            type="button"
            onClick={() => setViewTab('freemium')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              viewTab === 'freemium'
                ? 'bg-[#09090b] text-white shadow-2xs'
                : 'text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5]'
            }`}
          >
            Freemium
          </button>
          <button
            type="button"
            onClick={() => setViewTab('paid')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
              viewTab === 'paid'
                ? 'bg-[#09090b] text-white shadow-2xs'
                : 'text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5]'
            }`}
          >
            Paid
          </button>
        </div>

        {/* Right: Search Input Button + Exactly ONE Category Dropdown */}
        <div className="flex items-center gap-2.5">
          {/* Search Trigger Button matching Screenshot 1 */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-search-modal'))}
            className="inline-flex items-center gap-2.5 h-[36px] px-3.5 py-1.5 rounded-lg bg-white border border-[#e4e4e7] hover:border-[#d4d4d8] hover:bg-[#fafafa] text-[13px] text-[#09090b] shadow-2xs transition-all cursor-pointer"
            title="Search products (⌘K)"
          >
            <Search className="w-4 h-4 text-[#09090b]" />
            <span className="text-[#09090b] font-normal">Search products...</span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-[#f4f4f5] border border-[#e4e4e7] text-[11px] font-mono font-bold text-[#09090b] shadow-2xs">
              ⌘ K
            </span>
          </button>

          {/* Right: Exactly ONE Category Dropdown with Glassmorphism */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              className="inline-flex items-center justify-between gap-2.5 h-[36px] px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-[#e4e4e7] text-[13px] font-medium text-[#09090b] hover:border-[#d4d4d8] hover:bg-white transition-all shadow-2xs cursor-pointer min-w-[200px]"
              aria-haspopup="listbox"
              aria-expanded={isCategoryOpen}
            >
              <div className="flex items-center gap-2 truncate">
                {(() => {
                  const CurrentIcon = getCategoryIcon(selectedCategory);
                  return <CurrentIcon size={15} strokeWidth={1.8} className="text-[#71717a] shrink-0" />;
                })()}
                <span className="truncate">{categoryButtonLabel}</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#71717a] transition-transform duration-150 shrink-0 ${
                  isCategoryOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isCategoryOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl border border-white/80 bg-white/90 backdrop-blur-xl p-2 shadow-[0_12px_40px_rgba(0,0,0,0.14)] z-30 space-y-0.5">
                {/* "All categories" option */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('');
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-[13px] transition-all flex items-center justify-between cursor-pointer rounded-xl ${
                    !selectedCategory
                      ? 'bg-[#1c63ed] text-white font-semibold shadow-xs'
                      : 'text-[#09090b] hover:bg-black/5 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GridIcon
                      size={16}
                      strokeWidth={!selectedCategory ? 2 : 1.7}
                      className={`shrink-0 ${!selectedCategory ? 'text-white' : 'text-[#71717a]'}`}
                    />
                    <span className="truncate">All categories</span>
                  </div>
                  {!selectedCategory && <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />}
                </button>

                {/* Categories list */}
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
                          ? 'bg-[#1c63ed] text-white font-semibold shadow-xs'
                          : 'text-[#09090b] hover:bg-black/5 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CatIcon
                          size={16}
                          strokeWidth={isSelected ? 2 : 1.7}
                          className={`shrink-0 ${isSelected ? 'text-white' : 'text-[#71717a]'}`}
                        />
                        <span className="truncate">{c.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[2.5] shrink-0" />}
                    </button>
                  );
                })}

                {/* Down chevron indicator at the bottom */}
                <div className="flex justify-center pt-1.5 pb-0.5 text-[#71717a]">
                  <ChevronDown className="w-3.5 h-3.5 text-[#a1a1aa]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. 2-Card Grid Layout (clean & uncongested) */}
      {paginatedList.length === 0 ? (
        <div className="pt-2 sm:pt-3 pb-12 px-4 text-center flex flex-col items-center justify-center bg-transparent">
          <div className="w-[150px] sm:w-[170px] aspect-[255/241] mb-3 flex items-center justify-center overflow-hidden">
            <Image
              src="/animations/05-browser-scan.gif"
              alt="No software found"
              width={170}
              height={160}
              unoptimized
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-sm font-semibold text-[#09090b] mb-1">
            No software found in this category
          </p>
          <p className="text-xs text-[#71717a] max-w-sm mx-auto mb-4">
            There are currently no published tools matching the selected category filter.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className="inline-flex items-center justify-center h-[34px] px-4 rounded-[9px] border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[12px] font-semibold text-[#09090b] shadow-2xs transition-colors cursor-pointer"
          >
            View All Software
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {paginatedList.map((software) => {
            const domain = getDomain(software.websiteUrl);
            const resolvedLogo = resolveSoftwareLogo(software);
            const categoryName = getCategoryName(software.primaryCategory);
            const CategoryIcon = getCategoryIcon(software.primaryCategory);
            const pricingLabel = getPricingLabel(software);
            const initials = software.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={software.id}
                className="group rounded-2xl border border-[#e4e4e7] bg-white hover:border-[#1c63ed] transition-all p-5 sm:p-6 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Large Logo + Title + Free/Paid Badge + Domain with Blue Checkmark + Top Right External Link */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-14 h-14 rounded-2xl border border-[#e4e4e7] bg-white flex items-center justify-center shrink-0 p-2.5 shadow-2xs group-hover:border-[#1c63ed]/30 transition-colors relative overflow-hidden">
                        {resolvedLogo ? (
                          <img
                            src={resolvedLogo}
                            alt={`${software.name} logo`}
                            width={36}
                            height={36}
                            className="w-9 h-9 object-contain rounded-lg"
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
                          } w-full h-full items-center justify-center font-bold text-sm text-[#09090b] font-mono bg-[#f4f4f5] rounded-xl`}
                        >
                          {initials}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={getItemPath(software)}
                          className="text-[19px] sm:text-[20px] font-bold text-[#09090b] tracking-tight truncate block"
                        >
                          {software.name}
                        </Link>

                        <div className="flex items-center gap-1.5 mt-0.5 text-[14px] text-[#71717a] font-medium truncate">
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

                  {/* Card Description */}
                  <p className="text-[14px] text-[#63636b] leading-relaxed line-clamp-2 my-5">
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
                        ? 'bg-[#1c63ed]/10 text-[#1c63ed] border-[#1c63ed]/30'
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
                          ? 'text-[#1c63ed]'
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

      {/* 4. Infinite Scroll Sentinel & Pagination Status */}
      {hasMore && (
        <div ref={sentinelRef} className="py-6 flex flex-col items-center justify-center gap-2">
          {isLoadingMore && (
            <div className="flex items-center gap-2 text-[12.5px] text-[#71717a] font-medium font-geist">
              <div className="w-4 h-4 border-2 border-[#09090b] border-t-transparent rounded-full animate-spin" />
              <span>Loading more software...</span>
            </div>
          )}
          <span className="text-[11px] font-mono text-[#a1a1aa]">
            Showing {paginatedList.length} of {filteredAndSorted.length} software
          </span>
        </div>
      )}

      {!hasMore && filteredAndSorted.length > 0 && (
        <div className="py-8 text-center flex items-center justify-center gap-2 text-[12px] font-mono text-[#a1a1aa]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span>Showing all {filteredAndSorted.length} verified software</span>
        </div>
      )}
    </div>
  );
}
