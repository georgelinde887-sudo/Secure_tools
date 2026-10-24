import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllArticles } from '@/lib/data';
import { BlogClient } from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog & Articles | SecureTools.live',
  description: 'Explore practical guides, software comparisons, and security tips to help you choose better tools, protect your files, and work more confidently online.',
  alternates: {
    canonical: 'https://securetools.live/blog',
  }
};

export default function BlogIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="w-full">
      <Suspense fallback={<div className="w-full min-h-[400px] animate-pulse" />}>
        <BlogClient articles={articles} />
      </Suspense>
    </div>
  );
}
