import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchExtensionsFromDb, fetchCategoriesFromDb } from '@/lib/data';
import { ExtensionsClient } from './ExtensionsClient';

export const metadata: Metadata = {
  title: 'Security Browser Extensions Directory | Chrome, Firefox & Edge Add-ons',
  description: 'Discover verified browser extensions for privacy protection, zero-knowledge password management, tracker blocking, and secure web browsing on Chrome, Firefox, and Edge.',
  alternates: {
    canonical: 'https://securetools.live/extensions',
  },
};

export default async function ExtensionsPage() {
  const [extensions, categories] = await Promise.all([
    fetchExtensionsFromDb(),
    fetchCategoriesFromDb(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center text-sm text-[#71717a]">
          Loading browser extensions directory...
        </div>
      }
    >
      <ExtensionsClient initialSoftware={extensions} categories={categories} />
    </Suspense>
  );
}
