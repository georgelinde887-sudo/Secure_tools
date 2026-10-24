'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  LayoutGrid,
  Folder,
  ArrowLeftRight,
  BookOpen,
  Globe,
  CornerDownLeft,
} from 'lucide-react';
import { searchDatabase, getAllCategories, getAllSoftware, getAllComparisons } from '@/lib/data';
import { SoftwareItem, ComparisonItem } from '@/types';
import { resolveSoftwareLogo, getDisplayDomain } from '@/lib/logo-utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [dbSoftware, setDbSoftware] = useState<SoftwareItem[]>([]);

  useEffect(() => {
    fetch('/api/tools')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setDbSoftware(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const allCategories = useMemo(() => getAllCategories(), []);
  const allSoftware = useMemo(() => (dbSoftware.length > 0 ? dbSoftware : getAllSoftware()), [dbSoftware]);
  const allComparisons = useMemo(() => getAllComparisons(), []);

  // Filter pills
  const filterOptions = [
    'All',
    'Cloud Storage',
    'File Sharing',
    'Doc Management',
    'Security',
    'E-Signatures',
    'Data Rooms',
    'PDF Tools',
  ];

  // Map pill name to category slug keywords
  const filterKeywords: Record<string, string[]> = {
    'Cloud Storage': ['cloud-storage', 'storage', 'backup'],
    'File Sharing': ['file-sharing', 'transfer', 'sharing'],
    'Doc Management': ['document-management', 'dms', 'document'],
    'Security': ['security', 'encryption', 'pdf-security', 'audit'],
    'E-Signatures': ['electronic-signatures', 'signature', 'sign'],
    'Data Rooms': ['virtual-data-rooms', 'vdr', 'data-room'],
    'PDF Tools': ['pdf-editors', 'pdf', 'converter'],
  };

  // Quick actions definition
  const quickActions = [
    {
      id: 'action-submit',
      title: 'Submit a Tool / Add Software',
      description: 'Publish a verified software profile for editorial review',
      href: '/submit',
      icon: Plus,
    },
    {
      id: 'action-dashboard',
      title: 'Open Dashboard',
      description: 'Manage your published software profiles and directory analytics',
      href: '/dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'action-directory',
      title: 'Explore Software Directory',
      description: 'Browse all independent and verified software listings',
      href: '/',
      icon: Folder,
    },
    {
      id: 'action-guides',
      title: 'Editorial Guides & Research',
      description: 'Deep-dive security architecture guides and evaluation checklists',
      href: '/guides',
      icon: BookOpen,
    },
  ];

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveFilter('All');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keyboard shortcut ⌘K / Ctrl+K and ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered software and comparisons results
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    let matchedSoftware: SoftwareItem[] = [];

    if (!q) {
      // When no query, show default featured items or all based on active filter
      matchedSoftware = allSoftware;
    } else {
      const res = searchDatabase(q);
      matchedSoftware = res.software;
    }

    // Apply category pill filter if not 'All'
    if (activeFilter !== 'All') {
      const keywords = filterKeywords[activeFilter] || [activeFilter.toLowerCase()];
      matchedSoftware = matchedSoftware.filter((s) =>
        keywords.some(
          (k) =>
            s.primaryCategory.toLowerCase().includes(k) ||
            s.secondaryCategories.some((sc) => sc.toLowerCase().includes(k))
        )
      );
    }

    return {
      software: matchedSoftware.slice(0, 8),
    };
  }, [query, activeFilter, allSoftware]);

  // Combined flat list for keyboard arrow navigation
  const flatItems = useMemo(() => {
    const items: { id: string; href: string }[] = [];
    if (!query.trim()) {
      quickActions.forEach((a) => items.push({ id: a.id, href: a.href }));
    }
    searchResults.software.forEach((s) =>
      items.push({ id: s.id, href: `/tools/${s.slug}` })
    );
    return items;
  }, [query, searchResults]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeFilter]);

  // Handle arrow keys and enter
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (flatItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = flatItems[selectedIndex];
      if (selected) {
        handleNavigate(selected.href);
      }
    }
  };

  const handleNavigate = (url: string) => {
    onClose();
    router.push(url);
  };

  const getDomain = (url?: string) => {
    return getDisplayDomain(url);
  };

  if (!isOpen) return null;

  let runningIndex = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[860px] bg-white rounded-2xl border border-[#e4e4e7] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyNavigation}
      >
        {/* Top Search Input Row */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e4e4e7] bg-white">
          <Search className="w-5 h-5 text-[#2563eb] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, competitors (e.g. Notion, TinyPNG), or commands..."
            className="w-full text-[14.5px] text-[#09090b] placeholder-[#71717a] outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={onClose}
            className="ml-2 px-2 py-0.5 rounded-md border border-[#e4e4e7] bg-[#f4f4f5] text-[11px] font-mono font-medium text-[#71717a] hover:text-[#09090b] hover:bg-[#e4e4e7] transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills Row */}
        <div className="px-4 py-2 border-b border-[#f4f4f5] bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs shrink-0">
          <span className="font-mono text-[10px] font-bold text-[#71717a] mr-1 uppercase shrink-0">
            FILTER:
          </span>
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full text-[11.5px] font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#09090b] text-white shadow-2xs'
                    : 'bg-white border border-[#e4e4e7] text-[#63636b] hover:text-[#09090b] hover:bg-[#f4f4f5]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Scrollable Results & Quick Actions Body */}
        <div ref={listRef} className="overflow-y-auto p-2.5 space-y-4 max-h-[50vh] divide-y divide-[#f4f4f5]">
          {/* Quick Actions (when query is empty) */}
          {!query.trim() && (
            <div className="pt-1">
              <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-[#71717a] px-3 pb-2">
                QUICK ACTIONS
              </div>
              <div className="space-y-1">
                {quickActions.map((action) => {
                  const itemIndex = runningIndex++;
                  const isSelected = selectedIndex === itemIndex;
                  const Icon = action.icon;

                  return (
                    <div
                      key={action.id}
                      onClick={() => handleNavigate(action.href)}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`px-3 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#f4f4f5] border border-[#e4e4e7]'
                          : 'hover:bg-[#fafafa] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg border border-[#e4e4e7] bg-white text-[#09090b] flex items-center justify-center shrink-0 shadow-2xs">
                          <Icon className="w-4 h-4 text-[#09090b]" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-semibold text-[#09090b] tracking-tight">
                            {action.title}
                          </div>
                          <div className="text-[11.5px] text-[#71717a] truncate">
                            {action.description}
                          </div>
                        </div>
                      </div>
                      <span className="text-[#a1a1aa] font-mono text-xs ml-2 shrink-0">
                        ↵
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Software Listings Results */}
          {searchResults.software.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center justify-between px-3 pb-2 font-mono text-[10.5px] font-bold text-[#71717a] uppercase tracking-wider">
                <span>VERIFIED SOFTWARE ({searchResults.software.length})</span>
                <span className="lowercase text-[10px] text-[#a1a1aa]">press ↵ to view</span>
              </div>
              <div className="space-y-1">
                {searchResults.software.map((software) => {
                  const itemIndex = runningIndex++;
                  const isSelected = selectedIndex === itemIndex;
                  const domain = getDomain(software.websiteUrl);
                  const resolvedLogo = resolveSoftwareLogo(software);
                  const initials = software.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <div
                      key={software.id}
                      onClick={() => handleNavigate(`/tools/${software.slug}`)}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#f4f4f5] border border-[#e4e4e7]'
                          : 'hover:bg-[#fafafa] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg border border-[#e4e4e7] bg-white flex items-center justify-center shrink-0 p-1 shadow-2xs relative overflow-hidden">
                          {resolvedLogo ? (
                            <img
                              src={resolvedLogo}
                              alt={`${software.name} logo`}
                              width={24}
                              height={24}
                              className="w-5 h-5 object-contain rounded"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLElement;
                                target.style.display = 'none';
                                const fallback = target.parentElement?.querySelector(
                                  '.search-fallback'
                                ) as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className={`search-fallback ${
                              resolvedLogo ? 'hidden' : 'flex'
                            } w-full h-full items-center justify-center font-bold text-[10px] text-[#09090b] font-mono bg-[#f4f4f5] rounded`}
                          >
                            {initials}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13.5px] font-bold text-[#09090b] tracking-tight truncate">
                              {software.name}
                            </span>
                            {software.verificationStatus === 'Verified' && (
                              <span title="Verified by SecureTools" className="inline-flex items-center shrink-0">
                                <svg
                                  className="w-3.5 h-3.5 text-[#1d9bf0] fill-[#1d9bf0]"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.41-1.41 2.09 2.09 5.69-5.69 1.41 1.41-7.1 7.1z" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <div className="text-[11.5px] text-[#71717a] truncate max-w-md">
                            {software.shortDescription}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center shrink-0 ml-3">
                        <span className="text-[11px] font-mono text-[#71717a] bg-[#f4f4f5] px-2.5 py-1 rounded-md">
                          {software.primaryCategory.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {query.trim() && searchResults.software.length === 0 && (
            <div className="py-10 text-center text-xs text-[#71717a]">
                <p className="font-semibold text-[#09090b] text-[13px] mb-1">
                  No verified results found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-[11.5px] text-[#a1a1aa]">
                  Try searching by product name, or switch the filter pill above to &ldquo;All&rdquo;.
                </p>
              </div>
            )}
        </div>

        {/* Footer Bar */}
        <div className="border-t border-[#e4e4e7] px-4 py-2.5 bg-[#fafafa] flex items-center justify-between text-[11px] text-[#71717a] select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#e4e4e7] font-mono text-[10px] text-[#09090b]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#e4e4e7] font-mono text-[10px] text-[#09090b]">
                ↓
              </kbd>{' '}
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#e4e4e7] font-mono text-[10px] text-[#09090b]">
                ↵
              </kbd>{' '}
              open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#e4e4e7] font-mono text-[10px] text-[#09090b]">
                esc
              </kbd>{' '}
              close
            </span>
          </div>
          <span className="font-mono text-[10.5px] text-[#a1a1aa]">
            SecureTools &bull; Command Palette
          </span>
        </div>
      </div>
    </div>
  );
}
