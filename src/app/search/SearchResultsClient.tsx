'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search01Icon, 
  ArrowRight01Icon, 
  SecurityCheckIcon, 
  Layers01Icon, 
  BookOpen01Icon
} from 'hugeicons-react';
import { searchDatabase } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SoftwareCard } from '@/components/SoftwareCard';

export function SearchResultsClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const results = searchDatabase(query);
  const total = results.software.length + results.categories.length + results.articles.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <Breadcrumbs items={[{ label: 'Search' }, ...(query ? [{ label: `"${query}"` }] : [])]} />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 mb-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b] mb-4">
          Directory Search Results
        </h1>

        <form onSubmit={(e) => e.preventDefault()} className="max-w-xl flex items-center relative">
          <Search01Icon size={16} className="text-[#71717a] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search software, categories, encryption standards..."
            className="app-input w-full pl-10 pr-4 py-2 text-[13px]"
          />
        </form>

        <div className="font-mono text-[11px] text-[#71717a] mt-3">
          {query.trim() ? (
            <span>
              Found <strong className="text-[#09090b]">{total}</strong> verified {total === 1 ? 'match' : 'matches'} for &ldquo;{query}&rdquo;
            </span>
          ) : (
            <span>Type a search query above to explore verified directory records.</span>
          )}
        </div>
      </div>

      {query.trim() && total === 0 ? (
        <div className="pt-2 sm:pt-3 pb-12 px-4 text-center flex flex-col items-center justify-center bg-transparent text-[13px] text-[#71717a]">
          <div className="w-[150px] sm:w-[170px] aspect-[255/241] mb-3 flex items-center justify-center overflow-hidden">
            <Image
              src="/animations/05-browser-scan.gif"
              alt="No results found"
              width={170}
              height={160}
              unoptimized
              className="w-full h-full object-contain"
            />
          </div>
          <p className="font-semibold text-[#09090b] mb-1">No verified results found</p>
          <p className="text-[12px] text-[#71717a] mb-4">
            Try searching for broad terms like &ldquo;File Sharing&rdquo;, &ldquo;Cloud Storage&rdquo;, or &ldquo;Zero-Knowledge&rdquo;.
          </p>
          <Link href="/" className="font-mono text-[11px] text-[#02ccc1] underline">
            Browse full software directory &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Software Listings */}
          {results.software.length > 0 && (
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-wider text-[#09090b] font-semibold mb-3 flex items-center gap-1.5">
                <SecurityCheckIcon size={14} className="text-[#2563eb]" />
                Software Listings ({results.software.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {results.software.map((item) => (
                  <SoftwareCard key={item.id} software={item} />
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {results.categories.length > 0 && (
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-wider text-[#09090b] font-semibold mb-3 flex items-center gap-1.5">
                <Layers01Icon size={14} className="text-[#2563eb]" />
                Taxonomy Categories ({results.categories.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="p-3.5 bg-white rounded-xl border border-[#e4e4e7] hover:border-[#122368] transition-colors flex justify-between items-center shadow-xs"
                  >
                    <div>
                      <div className="font-bold text-[13px] text-[#09090b] mb-0.5">{cat.name}</div>
                      <div className="font-mono text-[10px] text-[#71717a]">{cat.pillar} • {cat.toolCount} tools</div>
                    </div>
                    <ArrowRight01Icon size={14} className="text-[#71717a]" />
                  </Link>
                ))}
              </div>
            </div>
          )}


          {/* Articles & Guides */}
          {results.articles.length > 0 && (
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-wider text-[#09090b] font-semibold mb-3 flex items-center gap-1.5">
                <BookOpen01Icon size={14} className="text-[#2563eb]" />
                Research & Guides ({results.articles.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {results.articles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/guides/${art.slug}`}
                    className="p-4 bg-white rounded-xl border border-[#e4e4e7] hover:border-[#122368] transition-colors block shadow-xs"
                  >
                    <div className="font-mono text-[10px] text-[#2563eb] mb-1 font-semibold uppercase">{art.type}</div>
                    <div className="font-bold text-[13px] text-[#09090b] mb-1">{art.title}</div>
                    <div className="text-[12px] text-[#71717a] line-clamp-2">{art.summary}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
