import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SecurityCheckIcon, Mail01Icon } from 'hugeicons-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Corrections Policy & Submissions | SecureTools.live',
  description: 'Our policy on factual corrections, product updates, and verification requests for software listed on SecureTools.live.',
  alternates: {
    canonical: 'https://securetools.live/corrections',
  }
};

export default function CorrectionsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Corrections Policy' }]} />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 sm:p-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
          <SecurityCheckIcon size={14} className="text-[#2563eb]" />
          <span>Factual Integrity Protocol</span>
          <span className="text-[#d4d4d8]">•</span>
          <span>48-Hour SLA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#09090b]">
          Corrections & Verification Policy
        </h1>
        <p className="text-[13px] text-[#71717a] mt-1.5 leading-relaxed max-w-2xl">
          SecureTools.live is committed to absolute factual precision across our software directory and research publications.
        </p>
      </div>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-[15px] font-bold text-[#09090b]">Our Factual Accuracy Commitment</h2>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          Software products, cryptographic features, API capabilities, and pricing models change rapidly. We take factual discrepancies seriously. When an error is identified, we commit to correcting it promptly and transparently.
        </p>
      </section>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-[15px] font-bold text-[#09090b]">How to Submit a Correction</h2>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          If you are a vendor, security researcher, or user and have identified an outdated or incorrect technical specification on our platform:
        </p>
        <ol className="space-y-2 text-[12px] text-[#71717a] list-decimal list-inside">
          <li>Email our editorial desk at <strong className="text-[#09090b]">corrections@securetools.live</strong>.</li>
          <li>Include the specific page URL (e.g. <span className="font-mono text-[#09090b]">https://securetools.live/tools/tresorit</span>).</li>
          <li>Reference the exact sentence or specification requiring amendment.</li>
          <li>Provide a direct link to authoritative public documentation, cryptographic whitepaper, or audit certificate verifying the updated fact.</li>
        </ol>
      </section>

      <div className="blueprint-card p-6 rounded-xl border border-[#e4e4e7] bg-white shadow-xs">
        <h3 className="text-[14px] font-bold text-[#09090b] mb-1">Direct Contact</h3>
        <p className="text-[12px] text-[#71717a] mb-3">
          Inquiries regarding technical corrections receive priority review within 48 business hours.
        </p>
        <a
          href="mailto:corrections@securetools.live"
          className="btn-align-fancy text-[12px] inline-flex items-center gap-1.5"
        >
          <Mail01Icon size={14} />
          <span>Email Corrections Desk</span>
        </a>
      </div>
    </div>
  );
}
