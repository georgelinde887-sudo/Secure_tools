'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search01Icon, 
  Cancel01Icon, 
  ArrowRight01Icon,
  ArrowDown01Icon,
  CheckmarkCircle02Icon
} from 'hugeicons-react';
import { Article } from '@/types';
import { HeroBanner } from '@/components/HeroBanner';
import { useSearchParams } from 'next/navigation';

interface BlogClientProps {
  articles: Article[];
}

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export function BlogClient({ articles }: BlogClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'Show All');
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(LANGUAGES[0]);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // SecureTools Official Categories
  const categories = [
    'Show All',
    'Cloud Storage',
    'File Sharing',
    'Document Management',
    'Document Security',
    'PDF & File Tools',
    'E-Signatures',
    'File Transfer',
    'Virtual Data Rooms',
    'Due Diligence',
    'Sales Enablement',
    'Fundraising',
    'M&A',
  ];

  // Filter articles by search query & category
  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return articles.filter((art) => {
      // Category filter matching SecureTools data taxonomy
      let matchesCategory = selectedCategory === 'Show All';

      if (!matchesCategory) {
        const catLow = selectedCategory.toLowerCase().trim();
        const artCat = art.category.toLowerCase().trim();

        if (artCat === catLow) {
          matchesCategory = true;
        } else if (catLow === 'file sharing' && artCat.includes('file sharing')) {
          matchesCategory = true;
        } else if (catLow === 'cloud storage' && artCat.includes('cloud storage')) {
          matchesCategory = true;
        } else if (catLow === 'document management' && artCat.includes('document management')) {
          matchesCategory = true;
        } else if (catLow === 'document security' && (artCat.includes('document security') || artCat.includes('security'))) {
          matchesCategory = true;
        } else if (catLow === 'pdf & file tools' && (artCat.includes('pdf') || artCat.includes('file tools'))) {
          matchesCategory = true;
        } else if (catLow === 'virtual data rooms' && (artCat.includes('data room') || artCat.includes('vdr'))) {
          matchesCategory = true;
        } else if (catLow === 'due diligence' && artCat.includes('diligence')) {
          matchesCategory = true;
        } else if (catLow === 'sales enablement' && artCat.includes('sales')) {
          matchesCategory = true;
        } else if (catLow === 'fundraising' && artCat.includes('fundraising')) {
          matchesCategory = true;
        } else if (catLow === 'm&a' && artCat.includes('m&a')) {
          matchesCategory = true;
        }
      }

      if (!matchesCategory) return false;

      // Search query filter
      if (!q) return true;

      const matchTitle = art.title.toLowerCase().includes(q);
      const matchSummary = art.summary.toLowerCase().includes(q);
      const matchCategoryText = art.category.toLowerCase().includes(q);
      const matchAuthor = art.author.name.toLowerCase().includes(q);

      return matchTitle || matchSummary || matchCategoryText || matchAuthor;
    });
  }, [articles, searchQuery, selectedCategory]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full pb-16 font-geist">
      {/* 1. Hero Banner matching site design */}
      <div className="mb-8">
        <HeroBanner
          title="Explore smarter ways to use software."
          description="Read practical guides, software comparisons, and security tips to help you choose better tools, protect your files, and work more confidently online."
          ctaText="Explore Articles"
          ctaHref="#articles"
        />
      </div>

      {/* Anchor target for Explore Articles CTA button */}
      <div id="articles" className="scroll-mt-6" />

      {/* 2. Action Bar: Left = Boxed Search Input, Right = Multi-Language Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        {/* Left: Boxed Search Box */}
        <div className="relative w-full sm:w-[280px] md:w-[320px]">
          <Search01Icon
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles or topics..."
            className="w-full h-[38px] pl-10 pr-9 rounded-xl border border-[#e4e4e7] bg-white text-[13px] text-[#09090b] placeholder-[#71717a] shadow-2xs focus:outline-none focus:border-[#02ccc1] focus:ring-1 focus:ring-[#02ccc1] transition-all font-geist"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#09090b] p-1 transition-colors"
              aria-label="Clear search"
            >
              <Cancel01Icon size={14} />
            </button>
          )}
        </div>

        {/* Right: Multi-Language Selector Dropdown with Flags */}
        <div ref={langDropdownRef} className="relative shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsLangDropdownOpen((prev) => !prev)}
            className="h-[38px] px-3 rounded-xl border border-[#e4e4e7] bg-white hover:border-[#02ccc1] text-[13px] font-medium text-[#09090b] shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
            aria-haspopup="listbox"
            aria-expanded={isLangDropdownOpen}
          >
            <span className="text-base leading-none">{selectedLang.flag}</span>
            <span className="font-geist">{selectedLang.name}</span>
            <ArrowDown01Icon
              size={14}
              className={`text-[#71717a] transition-transform duration-150 ${
                isLangDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isLangDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-[#e4e4e7] bg-white shadow-lg py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 font-geist">
              <div className="px-3 py-1 text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#71717a] border-b border-[#f4f4f5]">
                Select Language
              </div>
              <div className="pt-1">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLang.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setSelectedLang(lang);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-[13px] flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#f4f4f5] text-[#09090b] font-semibold'
                          : 'text-[#52525b] hover:bg-[#fafafa] hover:text-[#09090b]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                      {isSelected && (
                        <CheckmarkCircle02Icon size={14} className="text-[#02ccc1]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Category Filter Tabs with hidden scrollbars */}
      <div className="border-b border-[#e4e4e7] mb-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-6 sm:gap-7 min-w-max pb-3 text-[13.5px]">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`relative pb-2 font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#09090b] font-bold'
                    : 'text-[#71717a] hover:text-[#09090b]'
                }`}
              >
                <span>{cat}</span>
                {isActive && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[#09090b] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. 3 Cards Per Row Grid Layout */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <Link
              key={art.id}
              href={`/guides/${art.slug}`}
              className="group rounded-2xl border border-[#e4e4e7] bg-white overflow-hidden hover:border-[#02ccc1] hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Cover Image Container */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#f4f4f5]">
                  {art.coverImage ? (
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0c2340] to-[#02ccc1] text-white/80 font-mono text-xs">
                      SecureTools Guide
                    </div>
                  )}
                </div>

                {/* Card Content Area */}
                <div className="p-5">
                  {/* Date */}
                  <div className="text-[12px] text-[#71717a] font-normal mb-2">
                    {formatDate(art.publishedAt)}
                  </div>

                  {/* Title */}
                  <h2 className="text-[16px] sm:text-[17px] font-bold text-[#09090b] transition-colors leading-snug tracking-tight line-clamp-2 mb-2 font-geist">
                    {art.title}
                  </h2>

                  {/* Summary / Excerpt */}
                  <p className="text-[13px] text-[#52525b] leading-relaxed line-clamp-3 font-normal">
                    {art.summary}
                  </p>
                </div>
              </div>

              {/* Bottom Metadata Pill: Only show category when selectedCategory === 'Show All' */}
              <div className={`px-5 pb-5 pt-0 flex items-center ${selectedCategory === 'Show All' ? 'justify-between' : 'justify-end'}`}>
                {selectedCategory === 'Show All' && (
                  <span className="inline-flex items-center text-[11px] font-medium font-mono text-[#71717a] bg-[#f4f4f5] px-2.5 py-1 rounded-md">
                    {art.category}
                  </span>
                )}
                <span className="text-[12px] font-semibold text-[#02ccc1] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Read <ArrowRight01Icon size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State with transparent 05-browser-scan.gif */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-24 h-24 mb-3 relative flex items-center justify-center">
            <Image
              src="/animations/05-browser-scan.gif"
              alt="No articles found"
              width={96}
              height={96}
              unoptimized
              className="object-contain"
            />
          </div>
          <p className="text-[15px] font-semibold text-[#09090b]">
            No articles found matching &ldquo;{searchQuery || selectedCategory}&rdquo;
          </p>
          <p className="text-[13px] text-[#71717a] mt-1 max-w-sm">
            Try searching with a different keyword or select &ldquo;Show All&rdquo; to view all guides.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Show All');
            }}
            className="mt-4 px-4 py-1.5 rounded-lg text-[12px] font-medium text-[#09090b] bg-[#f4f4f5] hover:bg-[#e4e4e7] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
