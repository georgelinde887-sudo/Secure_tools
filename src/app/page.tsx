import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchSoftwareFromDb, fetchCategoriesFromDb } from '@/lib/data';
import { DirectoryClient } from './tools/DirectoryClient';

import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'SecureTools.live | Software Discovery for Files, Documents & Security',
  description: 'Independent software discovery, evaluation, and research platform covering 25 security categories: secure file sharing, encrypted cloud storage, database & backend security, virtual data rooms, and digital signatures.',
  alternates: {
    canonical: 'https://securetools.live',
  },
  openGraph: {
    title: 'SecureTools.live | Software Discovery for Files, Documents & Security',
    description: 'Independent software discovery, evaluation, and research platform covering 25 security categories: secure file sharing, encrypted cloud storage, database & backend security, virtual data rooms, and digital signatures.',
    url: 'https://securetools.live',
    images: [{ url: 'https://securetools.live/og-image.png', width: 1200, height: 630 }],
  },
};

interface HomePageProps {
  searchParams?: Promise<{ code?: string; next?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  if (params?.code) {
    redirect(`/auth/callback?code=${encodeURIComponent(params.code)}&next=${encodeURIComponent(params.next || '/dashboard')}`);
  }

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
