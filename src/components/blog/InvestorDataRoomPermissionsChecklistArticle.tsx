'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Info, 
  List, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  FileText,
  UserCheck,
  Eye,
  FileCheck,
  Download,
  FolderLock
} from 'lucide-react';
import { BlogFaqAccordion, FaqItem } from '@/components/blog/BlogFaqAccordion';
import { AuthorHeader } from '@/components/blog/AuthorHeader';
import { AuthorCard } from '@/components/blog/AuthorCard';

export function InvestorDataRoomPermissionsChecklistArticle() {
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    'c1': true,
    'c2': true,
    'c3': false,
    'c4': true,
    'c5': false,
    'c6': true,
    'c7': false,
    'c8': true,
    'c9': true,
    'c10': false
  });

  const toggleCheck = (id: string) => {
    setChecklistState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': 'https://securetools.live/blog/investor-data-room-permissions-checklist#article',
        headline: 'Investor Data Room Permissions Checklist Before Sharing Files',
        description: 'Organize permissions by investor stage, sensitivity, document format and revocation expectations. Complete preflight checklist and permission matrix.',
        datePublished: '2026-10-27',
        dateModified: '2026-10-27',
        mainEntityOfPage: {
          '@id': 'https://securetools.live/blog/investor-data-room-permissions-checklist'
        },
        image: 'https://securetools.live/blog-images/investor-data-room-permissions-checklist-cover.jpg',
        author: {
          '@type': 'Person',
          name: 'Mohamed Siraj',
          url: 'https://www.linkedin.com/in/mohamed-siraj-1a1910234/'
        },
        publisher: {
          '@type': 'Organization',
          name: 'SecureTools',
          url: 'https://securetools.live'
        },
        inLanguage: 'en',
        isAccessibleForFree: true
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://securetools.live/blog/investor-data-room-permissions-checklist#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://securetools.live'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://securetools.live/blog'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Virtual Data Rooms',
            item: 'https://securetools.live/categories/virtual-data-rooms'
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Investor Data Room Permissions Checklist',
            item: 'https://securetools.live/blog/investor-data-room-permissions-checklist'
          }
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://securetools.live/blog/investor-data-room-permissions-checklist#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is a password enough to protect confidential material?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Not by itself. Assess the password distribution process, recipient authorization, retained copies and sensitivity of the underlying data. In this guide, the practical next step is to record who owns the decision and validate the actual recipient experience before distribution.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can a shared document be made impossible to screenshot?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No general browser-based sharing workflow can reliably prevent operating-system screenshots, camera photographs or every form of recording. Dynamic watermarks and audit logs deter leaks but cannot physically block screen captures.'
            }
          },
          {
            '@type': 'Question',
            name: 'Does a view event prove that an investor read the document?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Automated scanners, idle tabs and forwarding can make observed events ambiguous. Use the signal as context rather than definitive proof of investor diligence.'
            }
          },
          {
            '@type': 'Question',
            name: 'Should every diligence recipient get the same access?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Usually not. Decide permissions by role, stage and necessity; test them using recipient-like accounts. Separate preliminary screening reviewers from deep legal and technical diligence leads.'
            }
          },
          {
            '@type': 'Question',
            name: 'What should I check before sending the next version?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Check the file contents, version date, audience, existing links, download behavior and whether the change needs an accompanying explanation to avoid conflicting spreadsheet models.'
            }
          }
        ]
      }
    ]
  };

  const tocItems = [
    { id: 'disclosure-inventory', title: '1. Begin with a disclosure inventory' },
    { id: 'groups-over-adhoc', title: '2. Choose groups over ad hoc privileges' },
    { id: 'minimum-viable-access', title: '3. Set the minimum viable access' },
    { id: 'pdfs-vs-spreadsheets', title: '4. Review PDFs and spreadsheets differently' },
    { id: 'document-nda-policy', title: '5. Document your NDA policy' },
    { id: 'investor-experience', title: '6. Prepare the investor experience' },
    { id: 'test-non-admin-account', title: '7. Test access with a non-admin account' },
    { id: 'maintain-changes', title: '8. Maintain changes during diligence' },
    { id: 'revoke-responsibly', title: '9. Revoke access responsibly' },
    { id: 'end-of-process-audit', title: '10. Run an end-of-process audit' },
    { id: 'situations-that-change', title: '11. Situations that change the answer' },
    { id: 'evaluating-claims', title: '12. Community advice: how to evaluate claims' },
    { id: 'decision-checklist', title: '13. Documented decision checklist' },
    { id: 'faq-section', title: '14. Frequently asked questions (FAQ)' },
    { id: 'related-learning', title: '15. Related learning & guides' }
  ];

  const faqItems: FaqItem[] = [
    {
      q: 'Is a password enough to protect confidential material?',
      a: 'Not by itself. Assess the password distribution process, recipient authorization, retained copies and sensitivity of the underlying data. In this guide, the practical next step is to record who owns the decision and validate the actual recipient experience before distribution.'
    },
    {
      q: 'Can a shared document be made impossible to screenshot?',
      a: 'No general browser-based sharing workflow can reliably prevent operating-system screenshots, camera photographs or every form of recording. Dynamic watermarks and audit logs deter leaks but cannot physically block screen captures.'
    },
    {
      q: 'Does a view event prove that an investor read the document?',
      a: 'No. Automated scanners, idle tabs and forwarding can make observed events ambiguous. Use the signal as context rather than definitive proof of investor diligence.'
    },
    {
      q: 'Should every diligence recipient get the same access?',
      a: 'Usually not. Decide permissions by role, stage and necessity; test them using recipient-like accounts. Separate preliminary screening reviewers from deep legal and technical diligence leads.'
    },
    {
      q: 'What should I check before sending the next version?',
      a: 'Check the file contents, version date, audience, existing links, download behavior and whether the change needs an accompanying explanation to avoid conflicting spreadsheet models.'
    }
  ];

  const checklistItems = [
    { id: 'c1', text: 'Identify the file owner, current revision and approved audience.' },
    { id: 'c2', text: 'Determine which information is genuinely necessary for the recipient.' },
    { id: 'c3', text: 'Remove hidden, obsolete or unnecessary sensitive data from workbooks.' },
    { id: 'c4', text: 'Document any confidentiality, legal and retention requirements.' },
    { id: 'c5', text: 'Match link permissions, identity checks and download needs to the workflow.' },
    { id: 'c6', text: 'Test from a recipient account, including mobile viewports where important.' },
    { id: 'c7', text: 'Record exceptions, expiry, version updates and escalation owner.' },
    { id: 'c8', text: 'Explain in ordinary language what the selected controls cannot prevent.' },
    { id: 'c9', text: 'Confirm the intended viewer has a clear channel to ask for clarification.' },
    { id: 'c10', text: 'Revisit access after the transaction or partner discussion changes.' }
  ];

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[840px] mx-auto pb-16 px-4 sm:px-6">
        
        {/* Top Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-4 text-[13px] text-[#71717a]">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-1.5 font-medium hover:text-[#09090b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>

          <div className="flex items-center gap-2">
            <Image 
              src="/icon.png" 
              alt="SecureTools" 
              width={16} 
              height={16} 
              className="w-4 h-4 rounded-sm object-contain" 
            />
            <span className="font-geist">securetools.live • October 2026</span>
          </div>
        </div>

        {/* Category & Badge */}
        <div className="flex items-center gap-2 mb-3 text-[11px] font-mono uppercase tracking-wider text-[#71717a]">
          <Link href="/categories/virtual-data-rooms" className="text-[#2563eb] font-semibold hover:underline">
            Virtual Data Rooms
          </Link>
          <span>•</span>
          <span>Permissions & Diligence Guide</span>
        </div>

        {/* H1 Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] font-bold tracking-tight text-[#09090b] leading-[1.18] mb-4 font-geist">
          Investor Data Room Permissions Checklist Before Sharing Files
        </h1>

        {/* Author / Publication Meta */}
        <AuthorHeader 
          publishDate="October 27, 2026" 
          readTime="12 min read" 
        />

        {/* Hero Stock Image */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-[#e4e4e7] shadow-xs bg-[#f4f4f5]">
          <Image 
            src="/blog-images/investor-data-room-permissions-checklist-cover.jpg"
            alt="Illustrated guide: Investor Data Room Permissions Checklist Before Sharing Files"
            fill
            sizes="(max-width: 840px) 100vw, 840px"
            className="object-cover"
            priority
          />
        </div>

        {/* Cover Asset Download Badge */}
        <div className="flex items-center justify-between text-[12px] text-[#71717a] mb-7 px-1">
          <span>Figure 1.0: Canonical permissions preflight framework for investor data rooms.</span>
          <a 
            href="/blog-images/investor-data-room-permissions-checklist-cover.jpg" 
            download="investor-data-room-permissions-checklist-cover.jpg"
            className="inline-flex items-center gap-1 text-[#2563eb] hover:underline font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </a>
        </div>

        {/* TL;DR Callout Box */}
        <div className="rounded-2xl border border-[#e4e4e7] bg-[#fbfbfb] p-5 sm:p-6 mb-7 shadow-2xs">
          <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-2.5">
            <Info className="w-4 h-4 text-[#2563eb] shrink-0" />
            <span>TL;DR / EXECUTIVE SUMMARY</span>
          </div>
          <p className="text-[14px] sm:text-[14.5px] text-[#27272a] leading-relaxed font-normal">
            Organize permissions by investor stage, sensitivity, document format and revocation expectations. Start by reducing sensitive information, then choose the right access level; test the actual recipient path and record versions and decisions. Never grant blanket full-access permissions early in diligence.
          </p>
        </div>

        {/* Primary CTA Strip */}
        <div className="rounded-xl border border-[#09090b] bg-[#09090b] text-white p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="font-semibold text-[14px] sm:text-[15px] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#38bdf8]" />
              <span>Compare Virtual Data Room Solutions</span>
            </div>
            <p className="text-[12.5px] text-[#a1a1aa] mt-0.5">
              Compare 20+ verified virtual data room platforms, pricing, granular permission matrices, and audit log features.
            </p>
          </div>
          <Link
            href="/categories/virtual-data-rooms"
            className="px-4 py-2 rounded-lg bg-white text-[#09090b] hover:bg-[#f4f4f5] text-[13px] font-semibold transition-colors shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View VDR Category</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table of Contents (Single Column, Line by Line) */}
        <div className="rounded-2xl border border-[#e4e4e7] bg-[#fafafa] p-5 sm:p-6 mb-10 shadow-2xs">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#e4e4e7]">
            <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b]">
              <List className="w-4 h-4 text-[#71717a]" />
              <span>TABLE OF CONTENTS</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
              {tocItems.length} sections
            </span>
          </div>
          <div className="flex flex-col space-y-2 text-[13.5px]">
            {tocItems.map((item, idx) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-[#3f3f46] hover:text-[#09090b] hover:underline flex items-baseline gap-2.5 py-1 border-b border-[#f4f4f5] last:border-b-0 transition-colors"
              >
                <span className="font-mono text-[11px] text-[#a1a1aa] shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                <span className="leading-snug">{item.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Article Body Content */}
        <div className="space-y-10 text-[15px] leading-relaxed text-[#27272a]">
          
          {/* Section 1 */}
          <section id="disclosure-inventory" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              1. Begin with a disclosure inventory
            </h2>
            <p>
              For startup operators and fundraising teams, the important question is not which product offers the longest list of features. It is what the recipient genuinely needs, which sensitive information is being exposed, and how the organization will verify that the intended controls work. This guide addresses <strong>a practical permissions matrix and preflight process for fundraising</strong> with practical checks, realistic limitations and decisions you can document. It avoids promising that any software can prevent a recipient from copying information they are authorized to see.
            </p>
            <p>
              List every folder and sensitive document before inviting an investor. Separate fundraising basics, financial details, legal records, team information and customer data. Identify the owner, update cadence and confidentiality of each item. This inventory prevents broad access granted merely because a file happens to be in the same folder.
            </p>

            {/* Inline Figure 1 */}
            <div className="rounded-2xl border border-[#e4e4e7] overflow-hidden my-6 bg-[#f4f4f5]">
              <div className="relative w-full aspect-[16/9]">
                <Image 
                  src="/blog-images/investor-data-room-permissions-checklist-fig1.jpg"
                  alt="Begin with a disclosure inventory: original checklist diagram for Investor Data Room Permissions Checklist Before Sharing Files"
                  fill
                  sizes="(max-width: 840px) 100vw, 840px"
                  className="object-contain p-2 sm:p-4"
                />
              </div>
              <div className="p-3 bg-white border-t border-[#e4e4e7] text-[12.5px] text-[#71717a] flex items-center justify-between">
                <span>Figure 1.1: Multi-tier disclosure classification inventory for diligence assets.</span>
                <a 
                  href="/blog-images/investor-data-room-permissions-checklist-fig1.jpg" 
                  download 
                  className="text-[#2563eb] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> PNG
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-[#e4e4e7] bg-[#fbfbfb] p-4.5 space-y-2">
              <h3 className="text-[14px] font-bold text-[#09090b] uppercase tracking-wide font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                Apply this to an actual decision
              </h3>
              <p className="text-[14px] text-[#3f3f46]">
                Pause at this step and write down the person accountable for it, the specific recipient, the version of the material, and the exception that would require a different approach. Run a short rehearsal with a colleague who was not involved in preparing the document. Ask them to explain what they could see, what they could export, which parts were ambiguous, and whether a meaningful question could be answered without gaining access to additional private information.
              </p>
              <p className="text-[13px] text-[#71717a] italic">
                Review prompt: What happens if the invited recipient forwards the link, loses access to their email account, or requests an updated version tomorrow?
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="groups-over-adhoc" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              2. Choose groups over ad hoc privileges
            </h2>
            <p>
              Create a small permission matrix describing what an initial investor, diligence lead, counsel and internal administrator can view. Do not assume the same people should access employee records and product roadmaps. Make role definitions readable to the team maintaining the room.
            </p>

            {/* Inline Figure 2 */}
            <div className="rounded-2xl border border-[#e4e4e7] overflow-hidden my-6 bg-[#f4f4f5]">
              <div className="relative w-full aspect-[16/9]">
                <Image 
                  src="/blog-images/investor-data-room-permissions-checklist-fig2.jpg"
                  alt="Choose groups over ad hoc privileges: role grouping and access matrix"
                  fill
                  sizes="(max-width: 840px) 100vw, 840px"
                  className="object-contain p-2 sm:p-4"
                />
              </div>
              <div className="p-3 bg-white border-t border-[#e4e4e7] text-[12.5px] text-[#71717a] flex items-center justify-between">
                <span>Figure 1.2: Structuring role-based group permissions over individual link privileges.</span>
                <a 
                  href="/blog-images/investor-data-room-permissions-checklist-fig2.jpg" 
                  download 
                  className="text-[#2563eb] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> PNG
                </a>
              </div>
            </div>

            <p>
              A useful audit record is deliberately concise: <strong>decision</strong>, <strong>reason</strong>, <strong>owner</strong>, <strong>test result</strong>, and <strong>revisit date</strong>. Do not treat a vendor dashboard screenshot as a substitute for trying a real recipient session. Access behavior can vary across mobile devices, account types and file formats.
            </p>
          </section>

          {/* Section 3 */}
          <section id="minimum-viable-access" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              3. Set the minimum viable access
            </h2>
            <p>
              Grant enough material for a meaningful review but avoid releasing sensitive records early without necessity. Email-based access, link expiry and download controls can be useful depending on platform. Confirm that permissions actually apply to nested folders and newly uploaded files.
            </p>

            {/* Inline Figure 3 */}
            <div className="rounded-2xl border border-[#e4e4e7] overflow-hidden my-6 bg-[#f4f4f5]">
              <div className="relative w-full aspect-[16/9]">
                <Image 
                  src="/blog-images/investor-data-room-permissions-checklist-fig3.jpg"
                  alt="Set the minimum viable access: least privilege boundary diagram"
                  fill
                  sizes="(max-width: 840px) 100vw, 840px"
                  className="object-contain p-2 sm:p-4"
                />
              </div>
              <div className="p-3 bg-white border-t border-[#e4e4e7] text-[12.5px] text-[#71717a] flex items-center justify-between">
                <span>Figure 1.3: Setting minimum viable access boundaries across fundraising phases.</span>
                <a 
                  href="/blog-images/investor-data-room-permissions-checklist-fig3.jpg" 
                  download 
                  className="text-[#2563eb] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> PNG
                </a>
              </div>
            </div>

            {/* Checklist Table */}
            <div className="overflow-x-auto rounded-xl border border-[#e4e4e7] my-6">
              <table className="w-full text-[13.5px] text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4f4f5] border-b border-[#e4e4e7] font-semibold text-[#09090b]">
                    <th className="p-3 sm:p-3.5">Check Control</th>
                    <th className="p-3 sm:p-3.5">Expected Evidence</th>
                    <th className="p-3 sm:p-3.5">Stop &amp; Investigate When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e4e7]">
                  <tr className="hover:bg-[#fafafa]">
                    <td className="p-3 sm:p-3.5 font-medium text-[#09090b]">Recipient Scope</td>
                    <td className="p-3 sm:p-3.5 text-[#3f3f46]">Tested invitation or approved delivery policy</td>
                    <td className="p-3 sm:p-3.5 text-[#b91c1c]">A broader group can access or forward link</td>
                  </tr>
                  <tr className="hover:bg-[#fafafa]">
                    <td className="p-3 sm:p-3.5 font-medium text-[#09090b]">File Version</td>
                    <td className="p-3 sm:p-3.5 text-[#3f3f46]">Visible date, version hash and designated owner</td>
                    <td className="p-3 sm:p-3.5 text-[#b91c1c]">Numbers, cap table or model definitions conflict</td>
                  </tr>
                  <tr className="hover:bg-[#fafafa]">
                    <td className="p-3 sm:p-3.5 font-medium text-[#09090b]">Data Minimization</td>
                    <td className="p-3 sm:p-3.5 text-[#3f3f46]">Reviewed file and sanitized workbook attachments</td>
                    <td className="p-3 sm:p-3.5 text-[#b91c1c]">Unnecessary personal or confidential compensation fields remain</td>
                  </tr>
                  <tr className="hover:bg-[#fafafa]">
                    <td className="p-3 sm:p-3.5 font-medium text-[#09090b]">Revocation Plan</td>
                    <td className="p-3 sm:p-3.5 text-[#3f3f46]">Documented lifecycle, TTL and expiration policy</td>
                    <td className="p-3 sm:p-3.5 text-[#b91c1c]">Team assumes downloaded files can be magically recalled</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4 */}
          <section id="pdfs-vs-spreadsheets" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              4. Review PDFs and spreadsheets differently
            </h2>
            <p>
              PDFs may be suitable for read-only review; spreadsheets often need editable copies for analysts to stress-test financial assumptions. Track the distinction carefully:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#3f3f46]">
              <li><strong>View-only PDFs:</strong> Prevent casual edits and support dynamic viewer watermarking (e.g. viewer email stamped on pages).</li>
              <li><strong>Native Spreadsheets:</strong> Once downloaded, all formulas, hidden tabs, and macro code leave your perimeter. Sanitize proprietary algorithms before distribution.</li>
              <li><strong>Tiered Release:</strong> Provide summary outputs in PDF during preliminary partner screening; release raw financial models only during formal confirmatory diligence.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="document-nda-policy" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              5. Document your NDA policy
            </h2>
            <p>
              Some early-stage venture investors will not sign an NDA during initial screening calls. However, strategic corporate acquirers and late-stage private equity firms routinely expect bilateral NDAs. Keep legal and technical permissions separate: do not rely on an NDA to substitute for missing technical controls, and do not assume software permissions replace enforceable confidentiality agreements.
            </p>
          </section>

          {/* Section 6 */}
          <section id="investor-experience" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              6. Prepare the investor experience
            </h2>
            <p>
              Check filenames, folder hierarchy, introductory README text, currency conventions, and date formats. Disorganized files create friction and generate redundant questions. Provide a clear point of contact for questions directly in the data room welcome index.
            </p>
          </section>

          {/* Section 7 */}
          <section id="test-non-admin-account" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              7. Test access with a non-admin account
            </h2>
            <p>
              Always test the data room invitation using a personal or non-admin test account. Validate:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#3f3f46]">
              <li>Does the email verification or one-time passcode (OTP) arrive promptly?</li>
              <li>Are restricted folders properly hidden or read-only?</li>
              <li>Can files be downloaded if download permissions are disabled?</li>
              <li>How does the viewer display on mobile devices and Safari?</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="maintain-changes" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              8. Maintain changes during diligence
            </h2>
            <p>
              Assign document owners and specify who can publish updates. Annotate revised items and retire outdated versions so reviewers can reconcile changes. Preserve a changelog for financial statements and cap tables to prevent confusion between version iterations.
            </p>
          </section>

          {/* Section 9 */}
          <section id="revoke-responsibly" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              9. Revoke access responsibly
            </h2>
            <p>
              Track investor engagement status. When a firm passes or diligence closes, disable their active access link immediately. Note the realistic security boundary: revoking hosted access prevents future viewing, but it cannot erase copies that were previously downloaded, printed, or screenshotted.
            </p>
          </section>

          {/* Section 10 */}
          <section id="end-of-process-audit" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              10. Run an end-of-process audit
            </h2>
            <p>
              At the close of your fundraising round or M&amp;A transaction, compile an audit log summary:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#3f3f46]">
              <li>List all recipients who accessed the data room.</li>
              <li>Archive the final, signed documentation repository.</li>
              <li>Expire all active external sharing links and revoke guest credentials.</li>
              <li>Record unresolved exceptions or follow-ups for corporate records.</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section id="situations-that-change" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              11. Situations that change the answer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                <h3 className="font-bold text-[14px] text-[#09090b] mb-1.5">A quick introductory conversation</h3>
                <p className="text-[13px] text-[#52525b]">
                  Minimize disclosure and favor clarity. A recipient at this stage only needs high-level deck and problem validation, not deep financial formulas.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                <h3 className="font-bold text-[14px] text-[#09090b] mb-1.5">A negotiated diligence request</h3>
                <p className="text-[13px] text-[#52525b]">
                  Provide substantiating documents and editable analysis where warranted under signed terms. Identify an escalation owner for question reconciliation.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                <h3 className="font-bold text-[14px] text-[#09090b] mb-1.5">A sensitive or regulated attachment</h3>
                <p className="text-[13px] text-[#52525b]">
                  Escalate to privacy or legal counsel before sharing patient, student, or payment card records. Access settings alone do not establish regulatory compliance.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa]">
                <h3 className="font-bold text-[14px] text-[#09090b] mb-1.5">A recipient requiring offline review</h3>
                <p className="text-[13px] text-[#52525b]">
                  Decide whether a sanitized export is acceptable. Acknowledge that offline distribution trades away real-time server-side revocation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section id="evaluating-claims" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              12. Community advice: how to evaluate claims
            </h2>
            <p>
              Discussion threads on Reddit, Quora, and software review platforms highlight common pain points, but unverified claims should never replace technical verification. Distinguish marketing claims from observable mechanics:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#3f3f46]">
              <li>Always test permission behavior with a non-admin account rather than accepting documentation as absolute guarantee.</li>
              <li>Examine whether features like watermarking and download restrictions require premium enterprise plan tiers.</li>
              <li>When evaluating hosted options, tools like <Link href="/tools/sendnow" className="text-[#2563eb] hover:underline font-medium">SendNow</Link> offer controlled document sharing and lightweight data room workflows; confirm features against your transaction security requirements.</li>
            </ul>
          </section>

          {/* Section 13 */}
          <section id="decision-checklist" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              13. Documented decision checklist
            </h2>
            <p className="text-[14px] text-[#52525b]">
              Use this interactive checklist to audit your investor data room configuration before distributing access links:
            </p>
            
            <div className="rounded-2xl border border-[#e4e4e7] bg-[#fafafa] p-5 space-y-3">
              {checklistItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
                >
                  <input 
                    type="checkbox"
                    checked={checklistState[item.id]}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb] cursor-pointer"
                  />
                  <span className={`text-[13.5px] leading-snug ${checklistState[item.id] ? 'text-[#09090b] font-medium' : 'text-[#71717a]'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 14: FAQ */}
          <section id="faq-section" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              14. Frequently asked questions (FAQ)
            </h2>
            <BlogFaqAccordion items={faqItems} />
          </section>

          {/* Section 15: Related Learning */}
          <section id="related-learning" className="space-y-4 pt-4 border-t border-[#e4e4e7]">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4">
              15. Related learning &amp; guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/blog/setting-up-virtual-data-room-seed-series-a-due-diligence"
                className="p-4 rounded-xl border border-[#e4e4e7] hover:border-[#09090b] transition-colors bg-white block group"
              >
                <div className="font-semibold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mb-1">
                  Setting Up a Virtual Data Room for Seed &amp; Series A
                </div>
                <p className="text-[12.5px] text-[#71717a]">
                  Folder structures, checklists, and 2026 pricing breakdowns for founders preparing diligence.
                </p>
              </Link>

              <Link 
                href="/blog/enterprise-file-sharing-security-checklist"
                className="p-4 rounded-xl border border-[#e4e4e7] hover:border-[#09090b] transition-colors bg-white block group"
              >
                <div className="font-semibold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mb-1">
                  The Enterprise File Sharing Security Checklist
                </div>
                <p className="text-[12.5px] text-[#71717a]">
                  12 testable non-negotiable security controls for access governance, encryption, and audit logging.
                </p>
              </Link>

              <Link 
                href="/blog/how-to-protect-pdf-with-dynamic-watermark"
                className="p-4 rounded-xl border border-[#e4e4e7] hover:border-[#09090b] transition-colors bg-white block group"
              >
                <div className="font-semibold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mb-1">
                  How to Protect a PDF With a Dynamic Watermark
                </div>
                <p className="text-[12.5px] text-[#71717a]">
                  Static vs dynamic watermarking, viewer identity stamping, and deterrence configurations.
                </p>
              </Link>

              <Link 
                href="/blog/how-to-share-pdf-without-download"
                className="p-4 rounded-xl border border-[#e4e4e7] hover:border-[#09090b] transition-colors bg-white block group"
              >
                <div className="font-semibold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mb-1">
                  How to Share a PDF Without Download Permissions
                </div>
                <p className="text-[12.5px] text-[#71717a]">
                  View-only sharing links, browser rendering security, and preventing local offline downloads.
                </p>
              </Link>
            </div>
          </section>

          {/* Author Bio Box */}
          <div className="pt-6">
            <AuthorCard />
          </div>

        </div>
      </div>
    </div>
  );
}
