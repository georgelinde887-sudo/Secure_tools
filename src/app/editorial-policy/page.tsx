import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SecurityCheckIcon, CheckmarkCircle02Icon } from 'hugeicons-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Editorial Policy | SecureTools.live',
  description: 'Our strict editorial standards, independence guidelines, and commitment to objective technical evaluation.',
  alternates: {
    canonical: 'https://securetools.live/editorial-policy',
  }
};

export default function EditorialPolicyPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Editorial Policy' }]} />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 sm:p-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
          <SecurityCheckIcon size={14} className="text-[#2563eb]" />
          <span>Integrity & Governance</span>
          <span className="text-[#d4d4d8]">•</span>
          <span>Effective 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#09090b]">
          Editorial Policy & Independence
        </h1>
        <p className="font-mono text-[11px] text-[#71717a] mt-2">
          Effective Date: January 1, 2026 • Last Revised: October 2026
        </p>
      </div>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-[15px] font-bold text-[#09090b]">1. Separation of Editorial and Commercial Activities</h2>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          SecureTools.live maintains strict firewalls between our research team and any commercial or affiliate partnerships. Editorial selections, category rankings, and comparison verdicts are produced solely on the basis of empirical specifications, cryptographic audits, and documented feature capabilities.
        </p>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          No software vendor can purchase inclusion, pay for favorable reviews, or alter our published assessment of product limitations.
        </p>
      </section>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-[15px] font-bold text-[#09090b]">2. Factual Verification Standards</h2>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          Every specification published in our profiles—including encryption algorithms (e.g., AES-256-GCM), key management models (zero-knowledge vs. provider-managed), and regulatory certifications (SOC 2, ISO 27001, HIPAA)—must be supported by verifiable official documentation or independent third-party cryptographic audits.
        </p>
        <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e4e7] text-[12px] text-[#09090b]">
          We explicitly label when a feature is vendor-claimed versus independently verified.
        </div>
      </section>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-[15px] font-bold text-[#09090b]">3. Prohibition of Fabricated Data</h2>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          Unlike many directories, SecureTools.live strictly prohibits:
        </p>
        <ul className="space-y-2 text-[12px] text-[#71717a]">
          <li className="flex items-start gap-2">
            <span className="text-[#2563eb] font-bold mt-0.5">•</span>
            <span>Fake star ratings or manufactured review totals</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#2563eb] font-bold mt-0.5">•</span>
            <span>Pay-per-click sponsored sorting positions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#2563eb] font-bold mt-0.5">•</span>
            <span>Uncredited AI-generated filler content</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
