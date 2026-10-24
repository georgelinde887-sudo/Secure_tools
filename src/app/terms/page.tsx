import React from 'react';
import { Metadata } from 'next';
import { File01Icon } from 'hugeicons-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Service | SecureTools.live',
  description: 'Terms and conditions governing the use of SecureTools.live software research and comparison services.',
  alternates: {
    canonical: 'https://securetools.live/terms',
  }
};

export default function TermsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 sm:p-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
          <File01Icon size={14} className="text-[#2563eb]" />
          <span>Legal Agreement</span>
          <span className="text-[#d4d4d8]">•</span>
          <span>Terms of Use</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#09090b]">
          Terms of Service
        </h1>
        <p className="font-mono text-[11px] text-[#71717a] mt-2">
          Last Updated: October 2026
        </p>
      </div>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-4 text-[13px] text-[#71717a] leading-relaxed shadow-xs">
        <h2 className="text-[15px] font-bold text-[#09090b]">1. Informational Nature of Directory</h2>
        <p>
          SecureTools.live is an independent software directory and research publication. Information provided on this website is for informational and educational purposes only and does not constitute formal legal, cybersecurity, or procurement advice.
        </p>

        <h2 className="text-[15px] font-bold text-[#09090b]">2. No Guarantee of Third-Party Performance</h2>
        <p>
          While we diligently verify technical specifications, encryption models, and certifications against published documentation, SecureTools.live does not operate third-party software and cannot warrant the uptime, security, or legal suitability of any third-party software listed.
        </p>

        <h2 className="text-[15px] font-bold text-[#09090b]">3. Intellectual Property</h2>
        <p>
          Product names, trademarks, and logos displayed on SecureTools.live remain the property of their respective trademark holders. Their use on SecureTools.live is strictly nominative to identify and describe software products under fair use principles.
        </p>

        <h2 className="text-[15px] font-bold text-[#09090b]">4. Modifications to Listings</h2>
        <p>
          SecureTools.live reserves the right to edit, update, or remove software listings that fail to maintain required security standards or fail to provide responsive technical documentation.
        </p>
      </section>
    </div>
  );
}
