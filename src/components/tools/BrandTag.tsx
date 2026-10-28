'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Cpu,
  Webhook,
  Code2,
  Database,
  ArrowRight,
} from 'lucide-react';
import { resolveBrandDomain, getBrandFaviconUrls } from '@/lib/brand-icons';

interface BrandTagProps {
  name: string;
  domain?: string;
  href?: string;
  isClickable?: boolean;
}

const BRAND_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-800',
  'bg-indigo-100 text-indigo-700',
];

function getBrandInitials(name: string): string {
  const clean = name.trim().replace(/^[-*•]\s*/, '').replace(/["'`]/g, '');
  const parts = clean.split(/[\s_.-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (clean.slice(0, 2) || clean.slice(0, 1)).toUpperCase();
}

function BrandIcon({ name, domain }: { name: string; domain: string }) {
  const [attempt, setAttempt] = useState(0);
  const lower = name.toLowerCase().trim();

  // Pure generic developer concepts without a specific brand name
  const cleanRoot = name
    .replace(/\b(rest api|restful api|api|sdk|extensions?|add-?ons?|plugins?|integrations?|connectors?|webhooks?|apps?|bots?|clients?|services?)\b/gi, '')
    .trim();

  if (!cleanRoot) {
    if (lower.includes('cli') || lower.includes('terminal') || lower.includes('console')) {
      return <Terminal className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={2} />;
    }
    if (lower === 'mcp' || lower.includes('model context protocol')) {
      return <Cpu className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={2} />;
    }
    if (lower.includes('webhook')) {
      return <Webhook className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={2} />;
    }
    if (lower === 'api' || lower.includes('rest api') || lower.includes('graphql') || lower.includes('sdk')) {
      return <Code2 className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={2} />;
    }
    if (lower.includes('database') || lower.includes('sql')) {
      return <Database className="w-4 h-4 text-[#09090b] shrink-0" strokeWidth={2} />;
    }
  }

  const sources = getBrandFaviconUrls(name, domain);

  if (attempt >= sources.length) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
    const colorClass = BRAND_COLORS[Math.abs(hash) % BRAND_COLORS.length];
    return (
      <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] uppercase shrink-0 select-none ${colorClass}`}>
        {getBrandInitials(name)}
      </span>
    );
  }

  return (
    <img
      src={sources[attempt]}
      alt={name}
      className="w-4 h-4 rounded-full object-contain shrink-0"
      onError={() => setAttempt(prev => prev + 1)}
    />
  );
}

export function BrandTag({ name, domain, href, isClickable = false }: BrandTagProps) {
  const resolvedDomain = resolveBrandDomain(name, domain);

  const content = (
    <>
      <div className="w-5 h-5 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] flex items-center justify-center shrink-0 overflow-hidden">
        <BrandIcon name={name} domain={resolvedDomain} />
      </div>
      <span className="text-[12.5px] font-medium text-[#09090b] font-geist tracking-tight">
        {name}
      </span>
      {isClickable && (
        <ArrowRight className="w-3 h-3 text-[#a1a1aa] group-hover:text-[#09090b] group-hover:translate-x-0.5 transition-all shrink-0 ml-0.5" />
      )}
    </>
  );

  const baseClasses =
    'inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#e4e4e7] shadow-2xs text-[#09090b] transition-all group font-geist';

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} hover:border-[#09090b] hover:shadow-xs cursor-pointer`}
      >
        {content}
      </Link>
    );
  }

  return <span className={baseClasses}>{content}</span>;
}

// Re-export for backward compatibility
export { resolveBrandDomain as resolveDomainForBrand };
