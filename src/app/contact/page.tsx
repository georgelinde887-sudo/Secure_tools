import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  Mail01Icon,
  MarketingIcon,
  FileEditIcon,
  ArrowUpRight01Icon,
  SecurityCheckIcon,
  ArrowRight01Icon,
  AlertCircleIcon,
} from 'hugeicons-react';

export const metadata: Metadata = {
  title: 'Contact Us | SecureTools.live',
  description:
    'Have a question, feedback, or collaboration idea? Contact the SecureTools team for general inquiries, sponsorships, guest posts, submissions, and security disclosures.',
  alternates: {
    canonical: 'https://securetools.live/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 font-geist">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />
      </div>

      {/* Hero */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09090b] tracking-tight mb-2">
          Contact Us
        </h1>
        <p className="text-[14px] font-medium text-[#52525b] leading-relaxed">
          We&apos;re Here to Help.
        </p>
        <p className="text-[13.5px] text-[#71717a] leading-relaxed mt-2 max-w-2xl">
          Have a question, feedback, or collaboration idea? We&apos;d love to hear from you.
          Whether you&apos;re a software developer, SaaS founder, security researcher, or someone
          exploring better tools, the SecureTools team is here to help you connect with the right people.
        </p>
      </div>

      {/* Unified Channels List */}
      <div className="rounded-2xl border border-[#e4e4e7] bg-white overflow-hidden divide-y divide-[#e4e4e7] shadow-2xs mb-10">
        
        {/* 1. General Inquiries */}
        <div className="p-5 sm:p-6 hover:bg-[#fafafa]/50 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl border border-[#e4e4e7] bg-[#fafafa] text-[#09090b] flex items-center justify-center shrink-0 mt-0.5">
              <Mail01Icon size={17} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-bold text-[#09090b] mb-1">
                General Inquiries
              </h2>
              <p className="text-[13px] font-medium text-[#27272a] mb-0.5">
                Have a question about SecureTools, our directory, or a listed product?
              </p>
              <p className="text-[12.5px] text-[#71717a] leading-relaxed mb-3">
                Reach out for general questions, feedback, corrections, or other inquiries.
              </p>
              <div>
                <a
                  href="mailto:contact@securetools.live"
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#09090b] hover:text-[#52525b] underline underline-offset-4 transition-colors"
                >
                  <Mail01Icon size={13} strokeWidth={1.8} />
                  <span>contact@securetools.live</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Sponsorship (Right below General Inquiries) */}
        <div className="p-5 sm:p-6 hover:bg-[#fafafa]/50 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl border border-[#e4e4e7] bg-[#fafafa] text-[#09090b] flex items-center justify-center shrink-0 mt-0.5">
              <MarketingIcon size={17} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[15px] font-bold text-[#09090b]">
                  Sponsorship
                </h2>
                <span className="text-[11px] font-semibold text-[#09090b] bg-[#f4f4f5] px-2 py-0.5 rounded-md border border-[#e4e4e7]">
                  $49 / week
                </span>
              </div>
              <p className="text-[13px] font-medium text-[#27272a] mb-0.5">
                Featured sidebar placement across all directory pages.
              </p>
              <p className="text-[12.5px] text-[#71717a] leading-relaxed mb-3">
                Includes sponsored card in the sticky right sidebar, product logo, description &amp; website link, prominent placement on top category pages, permanent do-follow backlink, and direct UTM referral tracking.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[12.5px]">
                <a
                  href="mailto:contact@securetools.live?subject=Sponsorship%20Booking%20%E2%80%94%20SecureTools"
                  className="inline-flex items-center gap-1 font-semibold text-[#09090b] hover:text-[#52525b] transition-colors"
                >
                  <span>Book Sponsorship</span>
                  <ArrowRight01Icon size={13} strokeWidth={2} />
                </a>
                <span className="text-[#d4d4d8]">•</span>
                <a
                  href="mailto:contact@securetools.live?subject=Sponsorship%20Inquiry"
                  className="inline-flex items-center gap-1.5 font-medium text-[#71717a] hover:text-[#09090b] underline underline-offset-4 transition-colors"
                >
                  <Mail01Icon size={13} strokeWidth={1.8} />
                  <span>contact@securetools.live</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Guest Posts & Partnerships */}
        <div className="p-5 sm:p-6 hover:bg-[#fafafa]/50 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl border border-[#e4e4e7] bg-[#fafafa] text-[#09090b] flex items-center justify-center shrink-0 mt-0.5">
              <FileEditIcon size={17} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-bold text-[#09090b] mb-1">
                Guest Posts &amp; Partnerships
              </h2>
              <p className="text-[13px] font-medium text-[#27272a] mb-0.5">
                Interested in writing for us or collaborating with SecureTools?
              </p>
              <p className="text-[12.5px] text-[#71717a] leading-relaxed mb-3">
                We welcome original guest articles, mutual content collaborations, relevant editorial link partnerships, and other opportunities to work together.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[12.5px]">
                <a
                  href="mailto:contact@securetools.live?subject=Guest%20Post%20%2F%20Partnership%20Enquiry"
                  className="inline-flex items-center gap-1.5 font-medium text-[#09090b] hover:text-[#52525b] underline underline-offset-4 transition-colors"
                >
                  <Mail01Icon size={13} strokeWidth={1.8} />
                  <span>contact@securetools.live</span>
                </a>
                <span className="text-[#d4d4d8]">•</span>
                <Link
                  href="/write-for-us"
                  className="inline-flex items-center gap-1 font-semibold text-[#09090b] hover:text-[#52525b] transition-colors"
                >
                  <span>Explore Write for Us</span>
                  <ArrowRight01Icon size={13} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Submit Your Software */}
        <div className="p-5 sm:p-6 hover:bg-[#fafafa]/50 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl border border-[#e4e4e7] bg-[#fafafa] text-[#09090b] flex items-center justify-center shrink-0 mt-0.5">
              <ArrowUpRight01Icon size={17} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-bold text-[#09090b] mb-1">
                Submit Your Software
              </h2>
              <p className="text-[13px] font-medium text-[#27272a] mb-0.5">
                Built a useful tool that deserves to be discovered?
              </p>
              <p className="text-[12.5px] text-[#71717a] leading-relaxed mb-3.5">
                Submit your browser extension, open-source project, MCP server or plugin, or SaaS application for consideration in our directory. We welcome software that aligns with our focus on security, privacy, transparency, and practical value.
              </p>
              <div>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#09090b] text-white text-[12.5px] font-medium hover:bg-black/85 transition-colors shadow-2xs"
                >
                  <span>Submit Your Tool</span>
                  <ArrowRight01Icon size={12} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Report a Security Issue */}
        <div className="p-5 sm:p-6 hover:bg-[#fafafa]/50 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl border border-[#e4e4e7] bg-[#fafafa] text-[#09090b] flex items-center justify-center shrink-0 mt-0.5">
              <SecurityCheckIcon size={17} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-bold text-[#09090b] mb-1">
                Report a Security Issue
              </h2>
              <p className="text-[13px] font-medium text-[#27272a] mb-0.5">
                Found a security vulnerability, suspicious listing, or potentially unsafe software?
              </p>
              <p className="text-[12.5px] text-[#71717a] leading-relaxed mb-2.5">
                Help us keep SecureTools a trustworthy place to discover technology.
              </p>
              <div className="mb-3">
                <span className="text-[12.5px] text-[#52525b]">
                  For responsible security disclosures, contact:{' '}
                </span>
                <a
                  href="mailto:security@securetools.live?subject=Responsible%20Security%20Disclosure"
                  className="text-[12.5px] font-semibold text-[#09090b] underline underline-offset-4 hover:text-[#52525b] transition-colors"
                >
                  security@securetools.live
                </a>
              </div>
              <div className="p-3 rounded-lg border border-[#e4e4e7] bg-[#fafafa] flex items-start gap-2.5 text-[12px] text-[#71717a] leading-relaxed">
                <AlertCircleIcon size={15} className="text-[#a1a1aa] shrink-0 mt-0.5" />
                <span>
                  Please include a clear description of the issue and relevant technical details. Avoid sharing sensitive information unnecessarily.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Let's Connect CTA */}
      <section className="rounded-2xl border border-[#e4e4e7] bg-[#09090b] px-6 py-7 text-center">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
          <Mail01Icon size={18} className="text-white" strokeWidth={1.8} />
        </div>
        <h2 className="text-[16px] font-bold text-white mb-1 tracking-tight">
          Let&apos;s Connect
        </h2>
        <p className="text-[12.5px] text-[#a1a1aa] mb-5 max-w-md mx-auto leading-relaxed">
          Questions, suggestions, partnerships, or feedback — we&apos;re always happy to hear from people who care about better software.
        </p>
        <a
          href="mailto:contact@securetools.live"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#09090b] text-[13px] font-semibold hover:bg-[#f4f4f5] transition-colors shadow-sm"
        >
          <Mail01Icon size={14} strokeWidth={2} />
          <span>contact@securetools.live</span>
        </a>
      </section>
    </div>
  );
}
