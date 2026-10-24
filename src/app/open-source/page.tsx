import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchOpenSourceFromDb, fetchCategoriesFromDb } from '@/lib/data';
import { OpenSourceClient } from './OpenSourceClient';

export const metadata: Metadata = {
  title: 'Open Source Security Software Directory | Verified & Audited Tools',
  description: 'Explore verified open-source software for encryption, secure cloud storage, and file sharing. Public source code, zero vendor lock-in, and independent cryptographic audit verification.',
  alternates: {
    canonical: 'https://securetools.live/open-source',
  },
};

export default async function OpenSourcePage() {
  const [software, categories] = await Promise.all([
    fetchOpenSourceFromDb(),
    fetchCategoriesFromDb(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center text-sm text-[#71717a]">
          Loading open source directory...
        </div>
      }
    >
      <OpenSourceClient initialSoftware={software} categories={categories} />
    </Suspense>
  );
}
