import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchSoftwareFromDb, fetchCategoriesFromDb } from '@/lib/data';
import { DirectoryClient } from './tools/DirectoryClient';

export const metadata: Metadata = {
  title: 'SecureTools.live | Software Discovery for Files, Documents & Security',
  description: 'Independent software discovery, evaluation, and research platform covering the digital file and document ecosystem: secure file sharing, cloud storage, virtual data rooms, and digital signatures.',
  alternates: {
    canonical: 'https://securetools.live',
  }
};

export default async function HomePage() {
  const [software, categories] = await Promise.all([
    fetchSoftwareFromDb(),
    fetchCategoriesFromDb(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12 text-center text-sm text-[#71717a]">
          Loading directory...
        </div>
      }
    >
      <DirectoryClient
        initialSoftware={software}
        categories={categories}
        defaultTab="all"
        showHero={true}
      />
    </Suspense>
  );
}
