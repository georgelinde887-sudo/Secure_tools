import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { SearchResultsClient } from './SearchResultsClient';

export const metadata: Metadata = {
  title: 'Search Directory & Research | SecureTools.live',
  description: 'Search verified software listings, categories, security comparisons, and educational research across SecureTools.live.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-[1360px] mx-auto px-4 py-12 text-center text-sm text-[#59636E]">Searching directory...</div>}>
      <SearchResultsClient />
    </Suspense>
  );
}
