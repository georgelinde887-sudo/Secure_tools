import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchPluginsFromDb, fetchCategoriesFromDb } from '@/lib/data';
import { PluginsClient } from './PluginsClient';

export const metadata: Metadata = {
  title: 'Security Plugins & MCP Servers Directory | Claude, ChatGPT & IDE Tools',
  description: 'Verified security plugins and Model Context Protocol (MCP) servers for Claude Desktop, ChatGPT Actions, Cursor, and developer IDEs. Automate secret scanning, SAST audits, and DAST testing.',
  alternates: {
    canonical: 'https://securetools.live/plugins',
  },
};

export default async function PluginsPage() {
  const [plugins, categories] = await Promise.all([
    fetchPluginsFromDb(),
    fetchCategoriesFromDb(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center text-sm text-[#71717a]">
          Loading plugins & MCP directory...
        </div>
      }
    >
      <PluginsClient initialSoftware={plugins} categories={categories} />
    </Suspense>
  );
}
