import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { CheckmarkCircle02Icon, SecurityCheckIcon } from 'hugeicons-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Review & Verification Methodology | SecureTools.live',
  description: 'Detailed explanation of how SecureTools.live evaluates file sharing, cloud storage, and digital document security software.',
  alternates: {
    canonical: 'https://securetools.live/review-methodology',
  }
};

export default function ReviewMethodologyPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'Review Methodology' }]} />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 sm:p-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
          <SecurityCheckIcon size={14} className="text-[#2563eb]" />
          <span>Research Framework</span>
          <span className="text-[#d4d4d8]">•</span>
          <span>Technical Auditing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#09090b]">
          Review & Verification Methodology
        </h1>
        <p className="text-[13px] text-[#71717a] mt-1.5 leading-relaxed max-w-2xl">
          How our research desk analyzes, audits, and compares tools across the digital file ecosystem.
        </p>
      </div>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#09090b]">Evaluation Framework Pillars</h2>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          Every software product evaluated by SecureTools.live undergoes systematic evaluation across five core operational dimensions:
        </p>

        <div className="space-y-3 pt-1">
          <div className="p-4 bg-[#fafafa] rounded-xl border border-[#e4e4e7]">
            <h3 className="text-[13px] font-bold text-[#09090b] mb-1">1. Cryptographic Architecture & Threat Model</h3>
            <p className="text-[12px] text-[#71717a] leading-relaxed">
              We analyze where encryption keys are derived. True zero-knowledge platforms derive keys locally on the endpoint using memory-hard functions (Argon2id, scrypt). For server-managed encryption, we inspect customer key management options (AWS KMS, Google Cloud KMS, BYOK).
            </p>
          </div>

          <div className="p-4 bg-[#fafafa] rounded-xl border border-[#e4e4e7]">
            <h3 className="text-[13px] font-bold text-[#09090b] mb-1">2. Access Governance & Link Controls</h3>
            <p className="text-[12px] text-[#71717a] leading-relaxed">
              We verify capabilities for password-protected download links, hard expiration limits, recipient verification (SMS/OTP/email gating), and dynamic recipient watermarking to deter unauthorized leaks.
            </p>
          </div>

          <div className="p-4 bg-[#fafafa] rounded-xl border border-[#e4e4e7]">
            <h3 className="text-[13px] font-bold text-[#09090b] mb-1">3. Regulatory Audits & Compliance</h3>
            <p className="text-[12px] text-[#71717a] leading-relaxed">
              We do not take vendor compliance badges at face value. We verify active SOC 2 Type II reports, ISO 27001 certificates, HIPAA Business Associate Agreement (BAA) availability, and GDPR legal frameworks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
