import React from 'react';
import { Metadata } from 'next';
import { AlternativesClient } from './AlternativesClient';
import { POPULAR_ALTERNATIVES_LIST } from '@/data/alternatives';

export const metadata: Metadata = {
  title: 'Software Alternatives & Competitor Research | SecureTools.live',
  description: 'Explore editorially curated software alternatives to popular file sharing, cloud storage, and security platforms based on verified architectural trade-offs.',
  alternates: {
    canonical: 'https://securetools.live/alternatives',
  }
};

export default function AlternativesIndexPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <AlternativesClient initialItems={POPULAR_ALTERNATIVES_LIST} />
    </div>
  );
}
