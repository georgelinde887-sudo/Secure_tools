import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const FOOTER_BADGES = [
  {
    href: 'https://nicklaunches.com/products/securetools-live/',
    src: 'https://nicklaunches.com/badges/featured.png',
    alt: 'SecureTools.live on Nick Launches',
    width: 244,
    height: 56,
    imgClass: 'h-[32px] w-auto object-contain',
    rel: 'noopener noreferrer',
  },
  {
    href: 'https://verifieddr.com/website/securetools-live',
    src: 'https://verifieddr.com/badge/securetools-live.svg?metric=truedr',
    alt: 'Verified DR - Verified Domain Rating for securetools.live',
    width: 220,
    height: 68,
    imgClass: 'h-[32px] w-auto object-contain',
    rel: 'noopener noreferrer',
  },
  {
    href: 'https://huzzler.so/products/K3n9FUnWdZ/securetools?utm_source=huzzler_product_website&utm_medium=badge&utm_campaign=free_listing',
    src: 'https://huzzler.so/assets/images/embeddable-badges/featured.png',
    alt: 'Huzzler Embed Badge',
    width: 159,
    height: 55,
    imgClass: 'h-[32px] w-auto object-contain',
    rel: 'noopener noreferrer',
  },
  {
    href: 'https://uno.directory',
    src: 'https://uno.directory/uno-directory.svg',
    alt: 'Listed on Uno Directory',
    width: 120,
    height: 30,
    imgClass: 'h-[28px] w-auto object-contain',
    rel: 'noopener noreferrer',
  },
  {
    href: 'https://lovableapp.org',
    src: 'https://lovableapp.org/lovable-app-badge.svg',
    alt: 'Lovable App Badge',
    width: 160,
    height: 32,
    imgClass: 'h-[28px] w-auto object-contain',
    rel: 'noopener noreferrer',
  },
  {
    href: 'https://startuptrusted.com?ref=securetools.live',
    src: 'https://startuptrusted.com/api/badge?type=featured&style=light',
    alt: 'SecureTools.live | Software Discovery for Files, Documents & Security on StartupTrusted',
    width: 240,
    height: 54,
    imgClass: 'h-[32px] w-auto object-contain',
    rel: 'noopener noreferrer',
  },
  {
    href: 'https://dododirectory.com',
    src: 'https://dododirectory.com/badge-light.png',
    alt: 'Featured on DodoDirectory',
    width: 200,
    height: 54,
    imgClass: 'h-[32px] w-auto object-contain',
    rel: 'dofollow',
  },
  {
    href: 'https://startupbase.io/products/secure-tools?utm_source=startupbase&utm_medium=badge&utm_campaign=launch-badge-light',
    src: 'https://statics.startupbase.io/site/badges/launched-on-sb.svg',
    alt: 'Launched on StartupBase',
    height: 55,
    imgClass: 'h-[32px] w-auto object-contain',
    rel: 'noopener noreferrer',
  },
  {
    href: 'https://www.tinyshelf.co/?ref=securetools.live',
    src: 'https://www.tinyshelf.co/badge/tinyshelf-badge-dark-f4d1216a.svg',
    alt: 'Featured on TinyShelf',
    width: 216,
    height: 64,
    imgClass: 'h-[32px] w-auto object-contain',
    rel: 'dofollow',
  },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-[#e4e4e7] bg-[#fafafa] mt-16 pt-12 pb-10 text-[#52525b] font-geist font-normal">
      <div className="max-w-[1340px] mx-auto px-5 sm:px-6">
        {/* Top 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8 mb-10 text-[13px] leading-relaxed">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1 space-y-3">
            <Link href="/" className="inline-block group" aria-label="SecureTools Home">
              <Image
                src="/securetools-logo.png"
                alt="SecureTools Logo"
                width={154}
                height={35}
                className="h-[34px] w-auto object-contain hover:opacity-90 transition-opacity"
                unoptimized
              />
            </Link>
            <p className="text-[12.5px] text-[#52525b] leading-relaxed">
              Practical comparisons, security guidance, verified capabilities, and research for file security and document tools.
            </p>
            <p className="text-[12.5px] text-[#52525b] leading-relaxed">
              Compare tools, understand encryption controls, and choose the right software for your privacy needs.
            </p>
          </div>

          {/* Column 2: SOLUTIONS */}
          <div>
            <h4 className="text-[11px] font-semibold text-[#09090b] uppercase tracking-wider mb-3">
              SOLUTIONS
            </h4>
            <ul className="space-y-2 text-[12.5px]">
              <li>
                <Link href="/categories" className="hover:text-[#09090b] transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#09090b] transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/open-source" className="hover:text-[#09090b] transition-colors">
                  Open Source
                </Link>
              </li>
              <li>
                <Link href="/extensions" className="hover:text-[#09090b] transition-colors">
                  Extensions
                </Link>
              </li>
              <li>
                <Link href="/plugins" className="hover:text-[#09090b] transition-colors">
                  Plugins & MCP
                </Link>
              </li>
              <li>
                <Link href="/alternatives" className="hover:text-[#09090b] transition-colors">
                  Alternatives
                </Link>
              </li>
              <li>
                <Link href="/categories" className="inline-flex items-center gap-1 font-medium text-[#09090b] hover:underline transition-colors pt-1">
                  <span>All Solutions</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: PROVIDERS & COMPARISONS */}
          <div>
            <h4 className="text-[11px] font-semibold text-[#09090b] uppercase tracking-wider mb-3">
              PROVIDERS & COMPARISONS
            </h4>
            <ul className="space-y-2 text-[12.5px]">
              <li>
                <Link href="/categories/secure-file-sharing" className="inline-flex items-center gap-1.5 font-medium text-[#09090b] hover:underline transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1c63ed] shrink-0" />
                  <span>Secure File Sharing</span>
                </Link>
              </li>
              <li>
                <Link href="/categories/business-cloud-storage" className="hover:text-[#09090b] transition-colors">
                  Encrypted Cloud Storage
                </Link>
              </li>
              <li>
                <Link href="/categories/virtual-data-rooms" className="hover:text-[#09090b] transition-colors">
                  Virtual Data Rooms
                </Link>
              </li>
              <li>
                <Link href="/categories/electronic-signatures" className="hover:text-[#09090b] transition-colors">
                  Electronic Signatures
                </Link>
              </li>
              <li>
                <Link href="/categories/pdf-security" className="hover:text-[#09090b] transition-colors">
                  PDF & Redaction Tools
                </Link>
              </li>
              <li>
                <Link href="/categories/encryption-software" className="hover:text-[#09090b] transition-colors">
                  Zero-Knowledge Encryption
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: RESOURCES */}
          <div>
            <h4 className="text-[11px] font-semibold text-[#09090b] uppercase tracking-wider mb-3">
              RESOURCES
            </h4>
            <ul className="space-y-2 text-[12.5px]">
              <li>
                <Link href="/guides" className="font-medium text-[#09090b] hover:underline transition-colors">
                  Resources & Security Hub
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-[#09090b] transition-colors">
                  Enterprise Security Guide
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-[#09090b] transition-colors">
                  Editorial Standards
                </Link>
              </li>
              <li>
                <Link href="/review-methodology" className="hover:text-[#09090b] transition-colors">
                  Security Standards
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-[#09090b] transition-colors">
                  Cryptographic Research
                </Link>
              </li>
              <li>
                <Link href="/formats" className="hover:text-[#09090b] transition-colors">
                  File Formats & Specs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#09090b] transition-colors">
                  Blog & Guides
                </Link>
              </li>
              <li>
                <Link href="/write-for-us" className="hover:text-[#09090b] transition-colors">
                  Write for Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#09090b] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: POPULAR ARTICLES */}
          <div>
            <h4 className="text-[11px] font-semibold text-[#09090b] uppercase tracking-wider mb-3">
              POPULAR ARTICLES
            </h4>
            <ul className="space-y-2 text-[12.5px]">
              <li>
                <Link href="/compare" className="hover:text-[#09090b] transition-colors">
                  Bitwarden vs 1Password
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#09090b] transition-colors">
                  Cryptomator vs Boxcryptor
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#09090b] transition-colors">
                  Nextcloud vs ownCloud
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-[#09090b] transition-colors">
                  What Is Zero-Knowledge?
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#09090b] transition-colors">
                  7-Zip vs PeaZip Guide
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-[#09090b] transition-colors">
                  How to Redact PDFs Safely
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ASK AI Bar */}
        <div className="border-t border-[#e4e4e7] pt-5 pb-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px]">
            <svg
              className="w-4 h-4 text-[#1c63ed] shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
            <span className="font-semibold text-[#09090b]">ASK AI:</span>
            <span className="text-[#52525b]">
              Analyze and compare software security tools with prefilled query
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {/* ChatGPT */}
            <a
              href="https://chatgpt.com/?q=Analyze+and+compare+software+security+tools+on+SecureTools.live"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] hover:border-[#d4d4d8] text-[12px] font-medium text-[#09090b] shadow-2xs transition-colors cursor-pointer group"
            >
              <Image
                src="/icons/chatgpt.png"
                alt="ChatGPT"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain rounded-full shrink-0"
                unoptimized
              />
              <span>ChatGPT</span>
            </a>

            {/* Claude */}
            <a
              href="https://claude.ai/new?q=Analyze+and+compare+software+security+tools+on+SecureTools.live"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] hover:border-[#d4d4d8] text-[12px] font-medium text-[#09090b] shadow-2xs transition-colors cursor-pointer group"
            >
              <Image
                src="/icons/claude.png"
                alt="Claude"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain rounded-full shrink-0"
                unoptimized
              />
              <span>Claude</span>
            </a>

            {/* Perplexity */}
            <a
              href="https://www.perplexity.ai/search?q=Analyze+and+compare+software+security+tools+on+SecureTools.live"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] hover:border-[#d4d4d8] text-[12px] font-medium text-[#09090b] shadow-2xs transition-colors cursor-pointer group"
            >
              <Image
                src="/icons/perplexity.png"
                alt="Perplexity"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain shrink-0"
                unoptimized
              />
              <span>Perplexity</span>
            </a>

            {/* Grok */}
            <a
              href="https://x.com/i/grok?text=Analyze+and+compare+software+security+tools+on+SecureTools.live"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] hover:border-[#d4d4d8] text-[12px] font-medium text-[#09090b] shadow-2xs transition-colors cursor-pointer group"
            >
              <Image
                src="/icons/grok.png"
                alt="Grok"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain rounded-sm shrink-0"
                unoptimized
              />
              <span>Grok</span>
            </a>
          </div>
        </div>

        {/* Auto-sliding Badges Marquee Row */}
        <div className="border-t border-[#e4e4e7] pt-5 pb-5 mb-5 overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
          <div className="animate-footer-marquee flex items-center gap-7 shrink-0">
            {[...FOOTER_BADGES, ...FOOTER_BADGES].map((badge, idx) => (
              <a
                key={`${badge.href}-${idx}`}
                href={badge.href}
                target="_blank"
                rel={badge.rel}
                title={badge.alt}
                className="shrink-0 hover:opacity-80 transition-opacity flex items-center justify-center"
              >
                <img
                  src={badge.src}
                  alt={badge.alt}
                  width={badge.width}
                  height={badge.height}
                  className={`${badge.imgClass} max-w-none`}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-4 border-t border-[#e4e4e7] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[12px] text-[#71717a]">
          <div>
            © 2026 SecureTools.live. All rights reserved.
          </div>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[#71717a]">
            <Link href="/editorial-policy" className="hover:text-[#09090b] transition-colors">
              Editorial Policy
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-[#09090b] transition-colors">
              Contact
            </Link>
            <span>·</span>
            <a href="mailto:contact@securetools.live" className="hover:text-[#09090b] transition-colors">
              contact@securetools.live
            </a>
            <span>·</span>
            <Link href="/write-for-us" className="hover:text-[#09090b] transition-colors">
              Write for Us
            </Link>
            <span>·</span>
            <Link href="/sitemap.xml" className="hover:text-[#09090b] transition-colors">
              Sitemap
            </Link>
            <span>·</span>
            <Link href="/llms.txt" className="hover:text-[#09090b] transition-colors">
              llms.txt
            </Link>
          </div>
        </div>

        <p className="text-[11.5px] text-[#71717a] mt-2.5">
          SecureTools.live evaluates and audits software discovery platforms against documented security, privacy, and zero-knowledge criteria.
        </p>
      </div>
    </footer>
  );
}
