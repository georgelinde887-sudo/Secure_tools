import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { File01Icon, ArrowRight01Icon } from 'hugeicons-react';
import { getAllFormats } from '@/lib/data';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'File Formats Knowledge Base & Security Profiles | SecureTools.live',
  description: 'Technical specifications, macro execution risks, and metadata exposure profiles for common digital document formats (PDF, PDF/A, 7z).',
  alternates: {
    canonical: 'https://securetools.live/formats',
  }
};

export default function FormatsIndexPage() {
  const formats = getAllFormats();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <Breadcrumbs items={[{ label: 'File Formats' }]} />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 mb-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
          <File01Icon size={14} className="text-[#2563eb]" />
          <span>Format Specifications</span>
          <span className="text-[#d4d4d8]">•</span>
          <span>{formats.length} Standardized Types</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b]">
          File Formats Knowledge Base
        </h1>
        <p className="text-[13px] text-[#71717a] mt-1.5 max-w-2xl leading-relaxed">
          Understand format specifications, hidden metadata vulnerabilities, archival compliance standards (PDF/A), and recommended enterprise security tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {formats.map((fmt) => (
          <Link
            key={fmt.id}
            href={`/formats/${fmt.slug}`}
            className="group bg-white p-5 rounded-xl border border-[#e4e4e7] hover:border-[#122368] hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[13px] font-bold text-[#2563eb] bg-[#f4f4f5] px-2.5 py-0.5 rounded border border-[#e4e4e7]">
                  {fmt.extension}
                </span>
                <span className="font-mono text-[10px] text-[#71717a]">{fmt.standard}</span>
              </div>

              <h2 className="text-[14px] font-bold text-[#09090b] group-hover:text-[#2563eb] transition-colors mb-1.5">
                {fmt.fullName}
              </h2>

              <p className="text-[12px] text-[#71717a] leading-relaxed line-clamp-3 mb-4">
                {fmt.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#f4f4f5] flex items-center justify-between text-[11px] text-[#71717a]">
              <span className="font-mono text-[10px] text-[#71717a]">Security Profile</span>
              <span className="text-[#2563eb] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[12px]">
                Read Specs <ArrowRight01Icon size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
