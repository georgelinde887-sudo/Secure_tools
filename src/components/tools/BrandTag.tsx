'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Cpu,
  Webhook,
  Code2,
  Database,
  Globe,
  ArrowRight,
} from 'lucide-react';

interface BrandTagProps {
  name: string;
  domain?: string;
  href?: string;
  isClickable?: boolean;
}

// Clean domain mapper with extensive coverage of security, dev tools, and SaaS ecosystem
export function resolveDomainForBrand(name: string, explicitDomain?: string): string {
  if (explicitDomain && explicitDomain.trim()) {
    let clean = explicitDomain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    return clean.replace(/^www\./, '');
  }

  const lower = name.toLowerCase().trim();

  // 1. Cloud, CDN & Infrastructure
  if (lower.includes('vercel')) return 'vercel.com';
  if (lower.includes('cloudflare') || lower.includes('r2')) return 'cloudflare.com';
  if (lower.includes('aws') || lower.includes('amazon') || lower.includes('s3')) return 'aws.amazon.com';
  if (lower.includes('supabase')) return 'supabase.com';
  if (lower.includes('firebase')) return 'firebase.google.com';
  if (lower.includes('azure')) return 'azure.microsoft.com';
  if (lower.includes('google cloud') || lower.includes('gcp')) return 'cloud.google.com';
  if (lower.includes('digitalocean')) return 'digitalocean.com';
  if (lower.includes('heroku')) return 'heroku.com';
  if (lower.includes('render')) return 'render.com';
  if (lower.includes('fly.io')) return 'fly.io';
  if (lower.includes('railway')) return 'railway.app';
  if (lower.includes('netlify')) return 'netlify.com';

  // 2. Protocols, APIs & Developer Tools
  if (lower === 'mcp' || lower.includes('model context protocol')) return 'modelcontextprotocol.io';
  if (lower.includes('oauth')) return 'oauth.net';
  if (lower.includes('webhook')) return 'webhook.site';
  if (lower.includes('rest api') || lower === 'api' || lower.includes('graphql')) return 'api.org';
  if (lower.includes('github')) return 'github.com';
  if (lower.includes('gitlab')) return 'gitlab.com';
  if (lower.includes('docker')) return 'docker.com';
  if (lower.includes('sentry')) return 'sentry.io';
  if (lower.includes('datadog')) return 'datadoghq.com';

  // 3. AI & LLMs
  if (lower.includes('chatgpt') || lower.includes('openai') || lower.includes('gpt')) return 'openai.com';
  if (lower.includes('claude') || lower.includes('anthropic')) return 'anthropic.com';
  if (lower.includes('huggingface') || lower.includes('hugging face')) return 'huggingface.co';
  if (lower.includes('ollama')) return 'ollama.com';

  // 4. Productivity, CRM & Communications
  if (lower.includes('slack')) return 'slack.com';
  if (lower.includes('hubspot')) return 'hubspot.com';
  if (lower.includes('salesforce')) return 'salesforce.com';
  if (lower.includes('notion')) return 'notion.so';
  if (lower.includes('linear')) return 'linear.app';
  if (lower.includes('jira') || lower.includes('confluence') || lower.includes('atlassian')) return 'atlassian.com';
  if (lower.includes('google drive') || lower.includes('gdrive')) return 'drive.google.com';
  if (lower.includes('microsoft') || lower.includes('office 365')) return 'microsoft.com';
  if (lower.includes('zapier')) return 'zapier.com';
  if (lower.includes('make.com') || lower === 'make') return 'make.com';

  // 5. UI Frameworks & Libraries
  if (lower.includes('bootstrap')) return 'getbootstrap.com';
  if (lower.includes('tailwind')) return 'tailwindcss.com';
  if (lower.includes('maven')) return 'maven.apache.org';
  if (lower.includes('glassfish')) return 'glassfish.org';
  if (lower.includes('jodconverter')) return 'jodconverter.org';
  if (lower.includes('openoffice')) return 'openoffice.org';
  if (lower.includes('libreoffice')) return 'libreoffice.org';
  if (lower.includes('primefaces')) return 'primefaces.org';
  if (lower.includes('eclipse') || lower.includes('eclipselink')) return 'eclipse.org';
  if (lower.includes('java ee') || lower.includes('jakarta') || lower.includes('ejb') || lower.includes('faces') || lower.includes('jsf')) return 'jakarta.ee';
  if (lower === 'java' || lower.includes('openjdk') || lower.includes('jdk')) return 'oracle.com';
  if (lower.includes('spring') || lower.includes('springboot')) return 'spring.io';
  if (lower.includes('mysql')) return 'mysql.com';
  if (lower.includes('postgres')) return 'postgresql.org';
  if (lower.includes('redis')) return 'redis.io';
  if (lower.includes('mongodb')) return 'mongodb.com';
  if (lower.includes('sqlite')) return 'sqlite.org';

  // 6. Secure File Sharing, VDR & Document Security (Alternatives & Competitors)
  if (lower.includes('sendnow')) return 'sendnow.live';
  if (lower.includes('papermark')) return 'papermark.com';
  if (lower.includes('docsend')) return 'docsend.com';
  if (lower.includes('digify')) return 'digify.com';
  if (lower.includes('firmroom')) return 'firmroom.com';
  if (lower.includes('ideals')) return 'idealsvdr.com';
  if (lower.includes('datasite')) return 'datasite.com';
  if (lower.includes('intralinks')) return 'intralinks.com';
  if (lower.includes('firmex')) return 'firmex.com';
  if (lower.includes('tresorit')) return 'tresorit.com';
  if (lower.includes('box')) return 'box.com';
  if (lower.includes('dropbox')) return 'dropbox.com';
  if (lower.includes('nextcloud')) return 'nextcloud.com';
  if (lower.includes('owncloud')) return 'owncloud.com';
  if (lower.includes('wetransfer')) return 'wetransfer.com';
  if (lower.includes('cryptomator')) return 'cryptomator.org';
  if (lower.includes('veracrypt')) return 'veracrypt.fr';
  if (lower.includes('axcrypt')) return 'axcrypt.net';
  if (lower.includes('nordlocker')) return 'nordlocker.com';
  if (lower.includes('proton')) return 'proton.me';
  if (lower.includes('bitwarden')) return 'bitwarden.com';
  if (lower.includes('1password')) return '1password.com';
  if (lower.includes('docusign')) return 'docusign.com';
  if (lower.includes('adobe') || lower.includes('acrobat')) return 'adobe.com';
  if (lower.includes('pandadoc')) return 'pandadoc.com';

  // Fallback domain
  if (lower.includes('.')) {
    return lower.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
  }
  const sanitized = lower.replace(/[^a-z0-9]/g, '');
  return sanitized ? `${sanitized}.com` : 'securetools.live';
}

function getSimpleIconSlugForBrand(name: string): string | null {
  const lower = name.toLowerCase().trim();
  if (lower.includes('bootstrap')) return 'bootstrap';
  if (lower.includes('maven')) return 'apachemaven';
  if (lower === 'mysql' || lower.includes('mysql')) return 'mysql';
  if (lower.includes('openoffice')) return 'apacheopenoffice';
  if (lower.includes('libreoffice')) return 'libreoffice';
  if (lower === 'eclipse' || lower.includes('eclipse') || lower.includes('eclipselink')) return 'eclipseide';
  if (lower.includes('primefaces')) return 'prime';
  if (lower.includes('glassfish')) return 'eclipseide';
  if (lower.includes('jodconverter')) return 'libreoffice';
  if (lower.includes('java') || lower.includes('ejb') || lower.includes('faces') || lower.includes('jakarta')) return 'openjdk';
  if (lower.includes('spring')) return 'springboot';
  if (lower.includes('docker')) return 'docker';
  if (lower.includes('kubernetes')) return 'kubernetes';
  if (lower.includes('react')) return 'react';
  if (lower.includes('vue')) return 'vuedotjs';
  if (lower.includes('tailwind')) return 'tailwindcss';
  if (lower.includes('github')) return 'github';
  if (lower.includes('gitlab')) return 'gitlab';
  if (lower.includes('slack')) return 'slack';
  if (lower.includes('stripe')) return 'stripe';
  if (lower.includes('postgres')) return 'postgresql';
  if (lower.includes('redis')) return 'redis';
  if (lower.includes('mongodb')) return 'mongodb';
  return null;
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

  // Special Developer Icon Mappings
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

  const simpleSlug = getSimpleIconSlugForBrand(name);
  const sources: string[] = [];
  if (simpleSlug) {
    sources.push(`https://cdn.simpleicons.org/${simpleSlug}`);
  }
  sources.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`);
  sources.push(`https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`);

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
  const resolvedDomain = resolveDomainForBrand(name, domain);

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
