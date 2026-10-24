import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SecurityCheckIcon } from 'hugeicons-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Affiliate & Advertising Disclosure | SecureTools.live',
  description: 'Full transparency regarding how SecureTools.live is funded and our strict separation between commercial models and editorial ratings.',
  alternates: {
    canonical: 'https://securetools.live/disclosure',
  }
};

export default function DisclosurePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Disclosure' }]} />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 sm:p-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
          <SecurityCheckIcon size={14} className="text-[#2563eb]" />
          <span>Transparency Disclosure</span>
          <span className="text-[#d4d4d8]">•</span>
          <span>Editorial Independence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#09090b]">
          Affiliate & Financial Disclosure
        </h1>
        <p className="text-[13px] text-[#71717a] mt-1.5 leading-relaxed max-w-2xl">
          Commitment to transparent funding and uncompromised editorial objectivity.
        </p>
      </div>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-[15px] font-bold text-[#09090b]">1. How We Sustain Our Research</h2>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          SecureTools.live is dedicated to providing independent, technically verified software research. To support our ongoing testing, infrastructure, and technical editorial staff, some outbound links on our site may contain affiliate tracking codes.
        </p>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          If you click through to a vendor website and subsequently purchase a subscription, SecureTools.live may receive a referral commission at no additional cost to you.
        </p>
      </section>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-[15px] font-bold text-[#09090b]">2. Strict Editorial Non-Influence</h2>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          Affiliate relationships never influence our editorial coverage:
        </p>
        <ul className="space-y-2 text-[12px] text-[#71717a]">
          <li className="flex items-start gap-2">
            <span className="text-[#2563eb] font-bold mt-0.5">•</span>
            <span>We do not grant higher rankings, favorable ratings, or featured status based on referral compensation.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#2563eb] font-bold mt-0.5">•</span>
            <span>We frequently recommend open-source, non-commercial, and free tools (e.g., Cryptomator, 7-Zip, Nextcloud Community) where zero commercial relationship exists.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#2563eb] font-bold mt-0.5">•</span>
            <span>If a vendor lacks an affiliate program but offers exceptional security, they receive equal editorial consideration.</span>
          </li>
        </ul>
      </section>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-[15px] font-bold text-[#09090b]">3. No Sponsored Reviews</h2>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          SecureTools.live does not accept paid guest posts, sponsored product reviews, or vendor-drafted content. All evaluations are researched and authored by our staff.
        </p>
      </section>
    </div>
  );
}
