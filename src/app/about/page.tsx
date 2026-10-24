import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SecurityCheckIcon, CheckmarkCircle02Icon, ArrowRight01Icon, Mail01Icon } from 'hugeicons-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About SecureTools.live | Independent Digital File Software Directory',
  description: 'Learn about the mission, editorial standards, and research team behind SecureTools.live.',
  alternates: {
    canonical: 'https://securetools.live/about',
  }
};

export default function AboutPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      {/* Blueprint Header */}
      <div className="blueprint-card p-6 sm:p-8 border border-[#e4e4e7] rounded-xl bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
          <SecurityCheckIcon size={14} className="text-[#2563eb]" />
          <span>Independent Research Platform</span>
          <span className="text-[#d4d4d8]">•</span>
          <span>Security & Privacy First</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#09090b]">
          About SecureTools.live
        </h1>
        <p className="text-[14px] text-[#71717a] mt-2 leading-relaxed max-w-2xl">
          Discover the right tools for files, documents, and digital security.
        </p>
      </div>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-3.5 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#09090b]">Our Objective & Mission</h2>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          SecureTools.live is an independent software discovery, comparison, and research platform covering the entire digital file and document ecosystem.
        </p>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          In an era where data breaches, foreign surveillance statutes, and intellectual property theft threaten corporate operations, choosing the right file software is a mission-critical decision. We help individuals, startups, IT teams, security professionals, and enterprise buyers discover, evaluate, compare, and understand software used to store, share, secure, transfer, sign, view, track, and manage digital assets.
        </p>
      </section>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 space-y-3.5 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#09090b]">The Problem with Mainstream Review Sites</h2>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          Most software directories today are pay-to-play marketing directories. Products that spend the most on pay-per-click bids or affiliate bounties receive prime placement, glowing badge awards, and fabricated five-star ratings.
        </p>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          SecureTools.live rejects this model entirely:
        </p>
        <div className="space-y-2 pt-1">
          <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e4e7] text-[12px] text-[#09090b] flex items-start gap-2.5">
            <CheckmarkCircle02Icon size={16} className="text-[#166534] shrink-0 mt-0.5" />
            <span><strong>Zero Sponsored Rankings:</strong> No vendor can pay for higher placement, better ratings, or favorable verdicts in our comparison matrices.</span>
          </div>
          <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e4e7] text-[12px] text-[#09090b] flex items-start gap-2.5">
            <CheckmarkCircle02Icon size={16} className="text-[#166534] shrink-0 mt-0.5" />
            <span><strong>Technical Verification:</strong> We distinguish vendor claims from verifiable cryptographic implementations, such as client-side key derivation vs. server-managed keys.</span>
          </div>
          <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e4e4e7] text-[12px] text-[#09090b] flex items-start gap-2.5">
            <CheckmarkCircle02Icon size={16} className="text-[#166534] shrink-0 mt-0.5" />
            <span><strong>No Fabricated Ratings:</strong> We do not publish artificial aggregate stars, fake testimonials, or automated satisfaction scores.</span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-[#e4e4e7] p-6 sm:p-8 shadow-xs">
        <h2 className="text-[16px] font-bold text-[#09090b] mb-3">Our 8 Architectural Pillars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11px] text-[#71717a]">
          <div className="p-3 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">1. File Sharing & Transfer</div>
          <div className="p-3 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">2. Cloud Storage & Backup</div>
          <div className="p-3 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">3. Document Management</div>
          <div className="p-3 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">4. Virtual Data Rooms</div>
          <div className="p-3 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">5. PDF & File Tools</div>
          <div className="p-3 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">6. Electronic Signatures</div>
          <div className="p-3 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">7. Security & Compliance</div>
          <div className="p-3 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">8. Document Intelligence</div>
        </div>
      </section>

      <div className="blueprint-card p-6 rounded-xl border border-[#e4e4e7] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h3 className="text-[14px] font-bold text-[#09090b]">Have questions or corrections?</h3>
          <p className="text-[12px] text-[#71717a] mt-0.5">Our editorial research desk responds promptly to factual verification inquiries.</p>
        </div>
        <Link
          href="/contact"
          className="btn-align-fancy text-[12px] whitespace-nowrap"
        >
          <Mail01Icon size={14} />
          <span>Contact Research Team</span>
        </Link>
      </div>
    </div>
  );
}
