import React from 'react';
import { Metadata } from 'next';
import { SecurityCheckIcon } from 'hugeicons-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy | SecureTools.live',
  description: 'Our privacy commitments, cookie policies, and data processing practices under GDPR and CCPA.',
  alternates: {
    canonical: 'https://securetools.live/privacy',
  }
};

export default function PrivacyPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 sm:p-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
          <SecurityCheckIcon size={14} className="text-[#2563eb]" />
          <span>Data Governance</span>
          <span className="text-[#d4d4d8]">•</span>
          <span>GDPR & CCPA Compliant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#09090b]">
          Privacy Policy
        </h1>
        <p className="font-mono text-[11px] text-[#71717a] mt-2">
          Last Updated: October 2026
        </p>
      </div>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-4 text-[13px] text-[#71717a] leading-relaxed shadow-xs">
        <h2 className="text-[15px] font-bold text-[#09090b]">1. Overview</h2>
        <p>
          SecureTools.live is dedicated to user privacy and minimal data collection. We do not sell, rent, or trade personal data with third-party data brokers.
        </p>

        <h2 className="text-[15px] font-bold text-[#09090b]">2. Information We Collect</h2>
        <p>
          • <strong>Voluntary Submissions:</strong> When you submit software or contact our editorial desk, we collect the contact name, email address, and organizational information you provide to process your request.
        </p>
        <p>
          • <strong>Aggregate Server Logs:</strong> Standard web server logs collect IP addresses, browser user agents, and page access timestamps strictly for abuse prevention, rate limiting, and infrastructure diagnostics.
        </p>

        <h2 className="text-[15px] font-bold text-[#09090b]">3. Cookies and Tracking</h2>
        <p>
          We do not use invasive cross-site behavioral tracking cookies. Outbound links to external software vendors may contain affiliate referral tokens to identify SecureTools.live as the referring platform.
        </p>

        <h2 className="text-[15px] font-bold text-[#09090b]">4. GDPR & CCPA Rights</h2>
        <p>
          Residents of the European Economic Area (EEA), United Kingdom, and California hold statutory rights to access, rectify, or erase any personal information held in our records. To exercise these rights, email <strong className="text-[#09090b]">privacy@securetools.live</strong>.
        </p>
      </section>
    </div>
  );
}
