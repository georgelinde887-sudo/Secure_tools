import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SecurityIcon, LockKeyIcon, File01Icon, ArrowRight01Icon } from 'hugeicons-react';
import { getFormatBySlug, getAllFormats, getSoftwareById } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const formats = getAllFormats();
  return formats.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fmt = getFormatBySlug(slug);
  if (!fmt) return { title: 'Format Not Found' };

  return {
    title: `${fmt.extension} File Format Security Specs & Standards | SecureTools.live`,
    description: fmt.description,
    alternates: {
      canonical: `https://securetools.live/formats/${fmt.slug}`,
    }
  };
}

export default async function FormatDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const fmt = getFormatBySlug(slug);

  if (!fmt) {
    notFound();
  }

  const recommendedTools = fmt.recommendedTools
    .map(id => getSoftwareById(id))
    .filter(Boolean);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <Breadcrumbs
        items={[
          { label: 'File Formats', href: '/formats' },
          { label: `${fmt.extension} (${fmt.fullName})` }
        ]}
      />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 mb-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-base font-bold text-[#2563eb] bg-[#f4f4f5] px-3 py-0.5 rounded border border-[#e4e4e7]">
            {fmt.extension}
          </span>
          <span className="font-mono text-[11px] text-[#71717a]">{fmt.standard} • Maintained by {fmt.developer}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b] mb-2">
          {fmt.fullName}
        </h1>
        <p className="text-[13px] text-[#71717a] max-w-2xl leading-relaxed">
          {fmt.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Security & Threat Profile */}
          <section className="bg-white rounded-xl border border-[#e4e4e7] p-5 shadow-xs">
            <h2 className="text-[14px] font-bold text-[#09090b] mb-4 flex items-center gap-2">
              <SecurityIcon size={16} className="text-[#2563eb]" />
              Format Security & Threat Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e4e7]">
                <span className="font-mono text-[10px] text-[#71717a] uppercase tracking-wider block mb-1">
                  Macro / Script Execution Risk
                </span>
                <span className={`text-[13px] font-bold ${fmt.securityProfile.macroRisk === 'None' ? 'text-[#166534]' : 'text-[#854d0e]'}`}>
                  {fmt.securityProfile.macroRisk}
                </span>
              </div>

              <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e4e7]">
                <span className="font-mono text-[10px] text-[#71717a] uppercase tracking-wider block mb-1">
                  Native Cryptographic Encryption
                </span>
                <span className="text-[13px] font-bold text-[#09090b]">
                  {fmt.securityProfile.encryptionSupported ? 'Supported' : 'Not Supported (Standard forbids)'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e4e7] text-[12px]">
              <strong className="text-[#09090b] block mb-1 font-mono text-[11px] uppercase tracking-wider">Metadata Leakage Profile:</strong>
              <p className="text-[#71717a] leading-relaxed">{fmt.securityProfile.metadataExposure}</p>
            </div>
          </section>

          {/* Technical Specifications Matrix */}
          <section className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#e4e4e7] bg-[#fafafa]">
              <h2 className="text-[13px] font-bold text-[#09090b] uppercase tracking-wider font-mono">
                Technical Specifications & Standards
              </h2>
            </div>
            <div className="divide-y divide-[#e4e4e7] text-[12px]">
              {Object.entries(fmt.technicalSpecs).map(([key, val], idx) => (
                <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-semibold text-[#09090b]">{key}</span>
                  <span className="text-[#71717a] font-mono text-[11px]">{val}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Common Uses */}
          <section className="bg-white rounded-xl border border-[#e4e4e7] p-5 shadow-xs">
            <h2 className="text-[14px] font-bold text-[#09090b] mb-3">
              Standard Enterprise Use Cases
            </h2>
            <div className="flex flex-wrap gap-2">
              {fmt.commonUses.map((use, idx) => (
                <span key={idx} className="font-mono text-[11px] bg-[#fafafa] px-2.5 py-1 rounded-lg border border-[#e4e4e7] text-[#09090b]">
                  {use}
                </span>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-white rounded-xl border border-[#e4e4e7] p-4 shadow-xs">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-[#09090b] font-semibold mb-3 flex items-center gap-1.5">
              <LockKeyIcon size={14} className="text-[#2563eb]" />
              Recommended Security Tools
            </h3>
            <div className="space-y-2">
              {recommendedTools.map((t) => (
                <Link
                  key={t!.id}
                  href={`/tools/${t!.slug}`}
                  className="block p-2.5 rounded-lg border border-[#e4e4e7] hover:border-[#122368] bg-[#fafafa] hover:bg-white transition-colors"
                >
                  <div className="font-bold text-[12px] text-[#09090b] mb-0.5">{t!.name}</div>
                  <div className="text-[11px] text-[#71717a] line-clamp-1">{t!.shortDescription}</div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
