'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Clock, 
  Calendar, 
  Info, 
  List, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle, 
  BookOpen,
  Sparkles,
  ShieldCheck,
  Lock,
  Layers,
  FileText,
  UserCheck,
  KeyRound,
  FileSearch,
  EyeOff,
  ShieldAlert,
  History,
  Trash2,
  Globe2,
  Flame,
  Check,
  MinusCircle,
  XCircle,
  Download
} from 'lucide-react';
import { BlogFaqAccordion, FaqItem } from '@/components/blog/BlogFaqAccordion';
import { AuthorHeader } from '@/components/blog/AuthorHeader';
import { AuthorCard } from '@/components/blog/AuthorCard';

interface AuditItem {
  control: string;
  requirement: string;
  test: string;
  passCriterion: string;
  owner: string;
}

const auditChecklistData: AuditItem[] = [
  {
    control: '01',
    requirement: 'Classify data before it leaves your tenant',
    test: 'Upload a Restricted test file and attempt sharing to an unapproved external domain.',
    passCriterion: 'An enforced policy blocks it or routes it to an approved exception workflow.',
    owner: 'Data governance'
  },
  {
    control: '02',
    requirement: 'Verify every external recipient',
    test: 'Forward a confidential link to an unrelated browser and email identity.',
    passCriterion: 'Unauthorized identity cannot open the document.',
    owner: 'IAM'
  },
  {
    control: '03',
    requirement: 'Use least privilege and time-bound access',
    test: 'Try downloading and resharing as a view-only guest, then retry after expiry.',
    passCriterion: 'Denied actions fail; expired grants stop working.',
    owner: 'Workspace administrator'
  },
  {
    control: '04',
    requirement: 'Require strong authentication for privileged users',
    test: 'Sign in with a test privileged account without its required second factor.',
    passCriterion: 'Access fails and creates an alert or auditable event.',
    owner: 'IAM'
  },
  {
    control: '05',
    requirement: 'Encrypt data in transit and at rest',
    test: 'Inspect transport configuration and vendor encryption/key-management documentation.',
    passCriterion: 'Approved ciphers/protocols, documented key ownership, and no plaintext public endpoints.',
    owner: 'Security architecture'
  },
  {
    control: '06',
    requirement: 'Preserve meaningful and tamper-resistant audit trails',
    test: 'Perform a share, failed view, download attempt, and link revocation; query exported logs.',
    passCriterion: 'Events identify actor, object, action, timestamp, and outcome; access to logs is restricted.',
    owner: 'SOC / Compliance'
  },
  {
    control: '07',
    requirement: 'Control downloading and reduce leakage',
    test: 'Attempt browser download, print, copy and screen capture on representative devices.',
    passCriterion: 'Policy blocks supported actions, logs exceptions, and documents residual capture risks.',
    owner: 'DLP'
  },
  {
    control: '08',
    requirement: 'Scan uploads and inspect outgoing content',
    test: 'Upload a benign malware test artifact in an authorized environment and a dummy file with synthetic sensitive records.',
    passCriterion: 'Malware workflow quarantines and DLP policy blocks, warns, or logs as configured.',
    owner: 'Endpoint / DLP'
  },
  {
    control: '09',
    requirement: 'Revoke access fast and terminate orphaned links',
    test: 'Revoke a link and disable its owner, then attempt access from an existing and a new session.',
    passCriterion: 'Future server-mediated requests are denied within the documented propagation window.',
    owner: 'IT Operations'
  },
  {
    control: '10',
    requirement: 'Define retention, deletion, and legal hold',
    test: 'Place a sample file under hold, request deletion, then verify policy response.',
    passCriterion: 'The hold prevails where required; deletion/retention evidence is available.',
    owner: 'Legal / Records'
  },
  {
    control: '11',
    requirement: 'Review vendors, integrations and cross-border flows',
    test: 'Inspect supplier documentation and test a third-party integration with minimal permissions.',
    passCriterion: 'Data flows and accountabilities are documented and risky scopes are rejected.',
    owner: 'Procurement / Security'
  },
  {
    control: '12',
    requirement: 'Practice incident response and access recertification',
    test: 'Simulate misdirected sharing; time discovery, revocation, escalation, and notification decision.',
    passCriterion: 'Evidence supports playbook execution; deviations become tracked remediation tasks.',
    owner: 'IR lead'
  }
];

export function EnterpriseFileSharingChecklistArticle() {
  const [assessmentStatus, setAssessmentStatus] = useState<Record<string, 'pass' | 'partial' | 'fail'>>({
    '01': 'pass',
    '02': 'pass',
    '03': 'pass',
    '04': 'pass',
    '05': 'pass',
    '06': 'pass',
    '07': 'partial',
    '08': 'partial',
    '09': 'pass',
    '10': 'partial',
    '11': 'partial',
    '12': 'partial'
  });

  const setStatus = (id: string, status: 'pass' | 'partial' | 'fail') => {
    setAssessmentStatus(prev => ({ ...prev, [id]: status }));
  };

  const calculatedScore = Object.values(assessmentStatus).reduce((acc, curr) => {
    if (curr === 'pass') return acc + 2;
    if (curr === 'partial') return acc + 1;
    return acc;
  }, 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': 'https://securetools.live/blog/enterprise-file-sharing-security-checklist#article',
        headline: 'The Enterprise File Sharing Security Checklist: 12 Non-Negotiables',
        description: 'Audit enterprise file sharing with 12 testable controls for access, encryption, audit logs, DLP, retention and incident response. Includes pass/fail checks.',
        mainEntityOfPage: {
          '@id': 'https://securetools.live/blog/enterprise-file-sharing-security-checklist'
        },
        image: [
          'https://securetools.live/blog-images/enterprise-file-sharing-security-checklist-hero.jpg'
        ],
        datePublished: '2026-10-26',
        dateModified: '2026-10-26',
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
        '@id': 'https://securetools.live/blog/enterprise-file-sharing-security-checklist#breadcrumb',
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
            name: 'Enterprise File Sharing Security Checklist',
            item: 'https://securetools.live/blog/enterprise-file-sharing-security-checklist'
          }
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://securetools.live/blog/enterprise-file-sharing-security-checklist#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is an encrypted file-sharing link safe by itself?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Encryption protects data in transit or storage, but a forwarded link can still grant access if there is no recipient identity check, scope restriction, or expiration.'
            }
          },
          {
            '@type': 'Question',
            name: 'Does disabling downloads prevent screenshots?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Browser restrictions may discourage routine downloading, but a recipient can still capture the visible content using screenshots, screen recording, or an external camera.'
            }
          },
          {
            '@type': 'Question',
            name: 'What is the difference between MFA and email verification?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'MFA combines independent authentication factors to reduce account compromise risk. A one-time email code usually confirms access to an inbox; it is not equivalent to phishing-resistant MFA.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can a revoked link erase a file already downloaded?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Revocation can block subsequent access through the controlled link; it does not remove copies that a recipient already downloaded, printed, or photographed.'
            }
          },
          {
            '@type': 'Question',
            name: 'How long should file-sharing logs be retained?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'There is no universal retention period. Define a period based on contractual commitments, applicable regulations, investigation needs, privacy obligations, and storage cost; test that logs remain available during that period.'
            }
          },
          {
            '@type': 'Question',
            name: 'Does SOC 2 certification guarantee secure file sharing?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. A SOC 2 report provides an independent attestation about defined controls, scope, and a reporting period. Buyers should inspect the report scope, exceptions, complementary user controls, and coverage of the particular sharing service.'
            }
          }
        ]
      }
    ]
  };

  const tocItems = [
    { id: 'why-encrypted-sharing-is-not-enough', title: 'Why encrypted sharing is not enough' },
    { id: 'what-counts-as-enterprise-file-sharing', title: 'What counts as enterprise file sharing?' },
    { id: 'the-12-file-sharing-security-controls', title: 'The 12 file-sharing security controls' },
    { id: 'control-verification-matrix', title: 'Control verification matrix & scoring' },
    { id: 'interactive-audit-checklist', title: 'Practical audit checklist tool' },
    { id: 'practical-scenario-a-misdirected-board-pack', title: 'Practical scenario: a misdirected board pack' },
    { id: '30-day-implementation-plan', title: '30-day implementation plan' },
    { id: 'what-vendors-must-prove', title: 'What vendors must prove' },
    { id: 'common-mistakes-and-limitations', title: 'Common mistakes and limitations' },
    { id: 'frequently-asked-questions', title: 'Frequently asked questions (FAQ)' },
    { id: 'related-reading', title: 'Related reading & internal guides' }
  ];

  const faqItems: FaqItem[] = [
    {
      q: 'Is an encrypted file-sharing link safe by itself?',
      a: 'No. Encryption protects data in transit or storage, but a forwarded link can still grant access if there is no recipient identity check, scope restriction, or expiration.'
    },
    {
      q: 'Does disabling downloads prevent screenshots?',
      a: 'No. Browser restrictions may discourage routine downloading, but a recipient can still capture the visible content using screenshots, screen recording, or an external camera.'
    },
    {
      q: 'What is the difference between MFA and email verification?',
      a: 'MFA combines independent authentication factors to reduce account compromise risk. A one-time email code usually confirms access to an inbox; it is not equivalent to phishing-resistant MFA.'
    },
    {
      q: 'Can a revoked link erase a file already downloaded?',
      a: 'No. Revocation can block subsequent access through the controlled link; it does not remove copies that a recipient already downloaded, printed, or photographed.'
    },
    {
      q: 'How long should file-sharing logs be retained?',
      a: 'There is no universal retention period. Define a period based on contractual commitments, applicable regulations, investigation needs, privacy obligations, and storage cost; test that logs remain available during that period.'
    },
    {
      q: 'Does SOC 2 certification guarantee secure file sharing?',
      a: 'No. A SOC 2 report provides an independent attestation about defined controls, scope, and a reporting period. Buyers should inspect the report scope, exceptions, complementary user controls, and coverage of the particular sharing service.'
    }
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
          <span className="text-[#2563eb] font-semibold">Security Guide</span>
          <span>•</span>
          <span>File Sharing &amp; Transfer</span>
        </div>

        {/* H1 Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] font-bold tracking-tight text-[#09090b] leading-[1.18] mb-4 font-geist">
          The Enterprise File Sharing Security Checklist: 12 Non-Negotiables
        </h1>

        {/* Author / Publication Meta */}
        <AuthorHeader 
          publishDate="October 26, 2026" 
          readTime="12 min read" 
        />

        {/* Hero Stock Image (Image 1) */}
        <div className="mb-7">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-[#e4e4e7] shadow-xs bg-[#f4f4f5]">
            <Image 
              src="/blog-images/enterprise-file-sharing-security-checklist-hero.jpg"
              alt="A padlock on a keyboard representing controlled access to enterprise files"
              fill
              sizes="(max-width: 840px) 100vw, 840px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* TL;DR Callout Box */}
        <div className="rounded-2xl border border-[#e4e4e7] bg-[#fbfbfb] p-5 sm:p-6 mb-7 shadow-2xs">
          <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-2.5">
            <Info className="w-4 h-4 text-[#2563eb] shrink-0" />
            <span>TL;DR / EXECUTIVE SUMMARY</span>
          </div>
          <p className="text-[14px] sm:text-[14.5px] text-[#27272a] leading-relaxed font-normal">
            Secure enterprise file sharing requires more than encryption. Organizations should classify information, verify recipients, limit privileges, enforce strong authentication, encrypt stored and transmitted data, maintain audit logs, reduce exfiltration, scan content, revoke access, manage retention, assess vendors and rehearse incidents. Every control below includes a practical test and a pass condition. <strong>These are a risk-based evaluation checklist, not a claim that every listed control is legally mandatory for every business.</strong>
          </p>
        </div>

        {/* Primary CTA Strip */}
        <div className="rounded-xl border border-[#09090b] bg-[#09090b] text-white p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="font-semibold text-[14px] sm:text-[15px] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#38bdf8]" />
              <span>Explore Verified Secure File Sharing Tools</span>
            </div>
            <p className="text-[12.5px] text-[#a1a1aa] mt-0.5">
              Compare audited file sharing platforms, client portals, and zero-knowledge transfer tools.
            </p>
          </div>
          <Link
            href="/categories/secure-file-sharing"
            className="px-4 py-2 rounded-lg bg-white text-[#09090b] hover:bg-[#f4f4f5] text-[13px] font-semibold transition-colors shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Category</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2. TABLE OF CONTENTS Box (Single Column, Line by Line!) */}
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
          <section id="why-encrypted-sharing-is-not-enough" className="scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4 pb-2 border-b border-[#e4e4e7]">
              Why encrypted sharing is not enough
            </h2>
            <p className="mb-4">
              A document can be encrypted in transit and at rest yet still land in the wrong hands. A permitted employee can paste a link into the wrong chat. A vendor can forward a link that has no recipient check. A departing contractor may retain a download. A publicly accessible link might remain active for months. Encryption addresses interception and storage exposure; it does not, by itself, verify that the right person is opening the right file for the right reason.
            </p>
            <p className="mb-4">
              A more useful definition of <em>secure sharing</em> is a verifiable series of decisions: what data may be shared, by whom, with which identity, for how long, under what rights, and with what evidence afterward. This approach is consistent with the risk-based control families described in{' '}
              <a 
                href="https://csrc.nist.gov/pubs/sp/800/53/r5/final" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#2563eb] hover:underline font-medium inline-flex items-center gap-0.5"
              >
                <span>NIST SP 800-53 Rev. 5</span>
                <ExternalLink className="w-3 h-3 text-[#71717a]" />
              </a>, including access control, identification/authentication, audit/accountability, system protection and incident response.
            </p>
            <div className="p-4 rounded-xl border border-[#fed7aa] bg-[#fff7ed] text-[13px] text-[#9a3412] leading-relaxed">
              <strong>A note about compliance:</strong> This checklist is not a substitute for jurisdiction-specific legal advice or a formal ISO 27001, HIPAA, GDPR, SOC 2, or financial-sector assessment. Those programs differ in scope and applicability; a vendor&apos;s compliance claim must be checked against its actual service, audit report and contractual obligations.
            </div>
          </section>

          {/* Section 2 */}
          <section id="what-counts-as-enterprise-file-sharing" className="scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4 pb-2 border-b border-[#e4e4e7]">
              What counts as enterprise file sharing?
            </h2>
            <p className="mb-4">
              The boundary includes cloud drives, secure link portals, customer document exchange, data rooms, collaborative workspaces, automated transfers, APIs and third-party integrations. It also includes <em>copies</em> created by viewers, synced endpoints and backups. A link-control system cannot reliably govern a copy after that copy leaves its control.
            </p>
            <p className="mb-5">
              Useful threat scenarios to model before choosing controls: the wrong recipient opens a contract; a legitimate recipient forwards a view link; a malicious employee downloads bulk files; an OAuth integration is over-permissioned; a breached admin account changes sharing policy; or sensitive files become stranded after staff departure.
            </p>

            {/* Stock Image 2 */}
            <div className="my-6">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-[#e4e4e7] shadow-xs bg-[#f4f4f5]">
                <Image 
                  src="/blog-images/secure-document-workflow.jpg"
                  alt="Office worker reviewing documents at a laptop before sharing sensitive files"
                  fill
                  sizes="(max-width: 840px) 100vw, 840px"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* Section 3: The 12 Controls */}
          <section id="the-12-file-sharing-security-controls" className="scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4 pb-2 border-b border-[#e4e4e7]">
              The 12 file-sharing security controls
            </h2>
            <p className="mb-6 text-[14.5px] text-[#52525b]">
              Each control below is structured with its foundational requirement, a verification test procedure, the pass criterion, and the accountable corporate function.
            </p>

            <div className="space-y-6">
              
              {/* Control 1 */}
              <div id="control-01-classify-data" className="p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                      01
                    </span>
                    <h3 className="text-[17px] font-bold text-[#09090b]">
                      Classify data before it leaves your tenant
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                    Data governance
                  </span>
                </div>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#09090b]">The requirement:</strong> Tag files Public, Internal, Confidential, or Restricted; default unknown external-sharing content to a review queue.</p>
                  <p><strong className="text-[#09090b]">How to verify:</strong> Upload a Restricted test file and attempt sharing to an unapproved external domain.</p>
                  <div className="flex items-start gap-2 pt-1 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pass condition:</strong> An enforced policy blocks it or routes it to an approved exception workflow.</span>
                  </div>
                </div>
              </div>

              {/* Control 2 */}
              <div id="control-02-verify-recipient" className="p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                      02
                    </span>
                    <h3 className="text-[17px] font-bold text-[#09090b]">
                      Verify every external recipient
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                    IAM
                  </span>
                </div>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#09090b]">The requirement:</strong> Require named identities, invitation-only access, or suitably strong verification; avoid anonymous bearer links for high-impact files.</p>
                  <p><strong className="text-[#09090b]">How to verify:</strong> Forward a confidential link to an unrelated browser and email identity.</p>
                  <div className="flex items-start gap-2 pt-1 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pass condition:</strong> Unauthorized identity cannot open the document.</span>
                  </div>
                </div>
              </div>

              {/* Control 3 */}
              <div id="control-03-least-privilege" className="p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                      03
                    </span>
                    <h3 className="text-[17px] font-bold text-[#09090b]">
                      Use least privilege and time-bound access
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                    Workspace admin
                  </span>
                </div>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#09090b]">The requirement:</strong> Separate view, comment, download, share, and administration rights. Set external access expiry appropriate to the deal or project.</p>
                  <p><strong className="text-[#09090b]">How to verify:</strong> Try downloading and resharing as a view-only guest, then retry after expiry.</p>
                  <div className="flex items-start gap-2 pt-1 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pass condition:</strong> Denied actions fail; expired grants stop working.</span>
                  </div>
                </div>
              </div>

              {/* Control 4 */}
              <div id="control-04-strong-authentication" className="p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                      04
                    </span>
                    <h3 className="text-[17px] font-bold text-[#09090b]">
                      Require strong authentication for privileged users
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                    IAM
                  </span>
                </div>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#09090b]">The requirement:</strong> Use SSO where appropriate and phishing-resistant MFA for administrators and high-risk staff; review device and session conditions.</p>
                  <p><strong className="text-[#09090b]">How to verify:</strong> Sign in with a test privileged account without its required second factor.</p>
                  <div className="flex items-start gap-2 pt-1 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pass condition:</strong> Access fails and creates an alert or auditable event.</span>
                  </div>
                </div>
              </div>

              {/* Control 5 */}
              <div id="control-05-encryption" className="p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                      05
                    </span>
                    <h3 className="text-[17px] font-bold text-[#09090b]">
                      Encrypt data in transit and at rest
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                    Security arch
                  </span>
                </div>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#09090b]">The requirement:</strong> Use modern TLS and encrypted storage; assess key custody, rotation, and tenant separation where justified.</p>
                  <p><strong className="text-[#09090b]">How to verify:</strong> Inspect transport configuration and vendor encryption/key-management documentation.</p>
                  <div className="flex items-start gap-2 pt-1 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pass condition:</strong> Approved ciphers/protocols, documented key ownership, and no plaintext public endpoints.</span>
                  </div>
                </div>
              </div>

              {/* Control 6 */}
              <div id="control-06-audit-trails" className="p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                      06
                    </span>
                    <h3 className="text-[17px] font-bold text-[#09090b]">
                      Preserve meaningful and tamper-resistant audit trails
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                    SOC / Compliance
                  </span>
                </div>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#09090b]">The requirement:</strong> Record access grants, document opens, failed authentication, downloads, revocations, configuration changes, and admin actions where supported.</p>
                  <p><strong className="text-[#09090b]">How to verify:</strong> Perform a share, failed view, download attempt, and link revocation; query exported logs.</p>
                  <div className="flex items-start gap-2 pt-1 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pass condition:</strong> Events identify actor, object, action, timestamp, and outcome; access to logs is restricted.</span>
                  </div>
                </div>
              </div>

              {/* Stock Image 3 */}
              <div className="my-6">
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-[#e4e4e7] shadow-xs bg-[#f4f4f5]">
                  <Image 
                    src="/blog-images/enterprise-document-access-governance.jpg"
                    alt="Business team discussing ownership and permissions for shared documents"
                    fill
                    sizes="(max-width: 840px) 100vw, 840px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Control 7 */}
              <div id="control-07-control-downloading" className="p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                      07
                    </span>
                    <h3 className="text-[17px] font-bold text-[#09090b]">
                      Control downloading and reduce leakage
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                    DLP
                  </span>
                </div>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#09090b]">The requirement:</strong> Set view-only defaults for sensitive material; consider visible recipient-specific watermarking and DLP rules.</p>
                  <p><strong className="text-[#09090b]">How to verify:</strong> Attempt browser download, print, copy and screen capture on representative devices.</p>
                  <div className="flex items-start gap-2 pt-1 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pass condition:</strong> Policy blocks supported actions, logs exceptions, and documents residual capture risks.</span>
                  </div>
                </div>
              </div>

              {/* Control 8 */}
              <div id="control-08-scan-uploads" className="p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                      08
                    </span>
                    <h3 className="text-[17px] font-bold text-[#09090b]">
                      Scan uploads and inspect outgoing content
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                    Endpoint / DLP
                  </span>
                </div>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#09090b]">The requirement:</strong> Scan for malware and identify sensitive identifiers or secrets before external delivery, accounting for encrypted files and archive limitations.</p>
                  <p><strong className="text-[#09090b]">How to verify:</strong> Upload a benign malware test artifact in an authorized environment and a dummy file with synthetic sensitive records.</p>
                  <div className="flex items-start gap-2 pt-1 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pass condition:</strong> Malware workflow quarantines and DLP policy blocks, warns, or logs as configured.</span>
                  </div>
                </div>
              </div>

              {/* Control 9 */}
              <div id="control-09-revoke-access" className="p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                      09
                    </span>
                    <h3 className="text-[17px] font-bold text-[#09090b]">
                      Revoke access fast and terminate orphaned links
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                    IT Operations
                  </span>
                </div>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#09090b]">The requirement:</strong> Provide one-click revoke, centralized inventory, owner reassignment and offboarding triggers.</p>
                  <p><strong className="text-[#09090b]">How to verify:</strong> Revoke a link and disable its owner, then attempt access from an existing and a new session.</p>
                  <div className="flex items-start gap-2 pt-1 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pass condition:</strong> Future server-mediated requests are denied within the documented propagation window.</span>
                  </div>
                </div>
              </div>

              {/* Control 10 */}
              <div id="control-10-retention-deletion" className="p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                      10
                    </span>
                    <h3 className="text-[17px] font-bold text-[#09090b]">
                      Define retention, deletion, and legal hold
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                    Legal / Records
                  </span>
                </div>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#09090b]">The requirement:</strong> Align content lifecycle, backup expiry, legal holds, and deletion requests to applicable law and business policy.</p>
                  <p><strong className="text-[#09090b]">How to verify:</strong> Place a sample file under hold, request deletion, then verify policy response.</p>
                  <div className="flex items-start gap-2 pt-1 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pass condition:</strong> The hold prevails where required; deletion/retention evidence is available.</span>
                  </div>
                </div>
              </div>

              {/* Control 11 */}
              <div id="control-11-vendor-risk" className="p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                      11
                    </span>
                    <h3 className="text-[17px] font-bold text-[#09090b]">
                      Review vendors, integrations and cross-border flows
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                    Procurement / Sec
                  </span>
                </div>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#09090b]">The requirement:</strong> Assess subprocessors, data residency, third-party OAuth apps, incident terms, contractual duties and least-privilege API scopes.</p>
                  <p><strong className="text-[#09090b]">How to verify:</strong> Inspect supplier documentation and test a third-party integration with minimal permissions.</p>
                  <div className="flex items-start gap-2 pt-1 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pass condition:</strong> Data flows and accountabilities are documented and risky scopes are rejected.</span>
                  </div>
                </div>
              </div>

              {/* Control 12 */}
              <div id="control-12-incident-response" className="p-5 sm:p-6 rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#2563eb]/10 text-[#2563eb] font-mono text-[13px] font-bold flex items-center justify-center shrink-0">
                      12
                    </span>
                    <h3 className="text-[17px] font-bold text-[#09090b]">
                      Practice incident response and access recertification
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                    IR lead
                  </span>
                </div>
                <div className="space-y-2 text-[14px]">
                  <p><strong className="text-[#09090b]">The requirement:</strong> Run a table-top exercise for a mistakenly shared confidential file; review external access on a recurring risk-based cadence.</p>
                  <p><strong className="text-[#09090b]">How to verify:</strong> Simulate misdirected sharing; time discovery, revocation, escalation, and notification decision.</p>
                  <div className="flex items-start gap-2 pt-1 text-[#15803d]">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Pass condition:</strong> Evidence supports playbook execution; deviations become tracked remediation tasks.</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Section 4: Control Verification Matrix */}
          <section id="control-verification-matrix" className="scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4 pb-2 border-b border-[#e4e4e7]">
              Control verification matrix
            </h2>
            <p className="mb-4">
              The fastest way to separate a vendor demo from an operating control is to ask for evidence. Mark each item <strong>Pass</strong>, <strong>Partial</strong>, <strong>Fail</strong> or <strong>Not applicable (with reason)</strong>. “Supported” is not the same as “enabled,” and “enabled” is not the same as “tested.”
            </p>

            {/* Matrix Table */}
            <div className="rounded-xl border border-[#e4e4e7] overflow-x-auto mb-6 shadow-2xs">
              <table className="w-full text-left text-[13px] border-collapse min-w-[620px]">
                <thead>
                  <tr className="bg-[#f4f4f5] border-b border-[#e4e4e7]">
                    <th className="py-3 px-3.5 font-bold text-[#09090b]">Control</th>
                    <th className="py-3 px-3.5 font-bold text-[#09090b]">Minimum evidence to retain</th>
                    <th className="py-3 px-3.5 font-bold text-[#09090b]">Typical failure signal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e4e7] bg-white">
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-[#09090b]">01 Data labels</td>
                    <td className="py-2.5 px-3.5 text-[#52525b]">Policy and blocked external-share test</td>
                    <td className="py-2.5 px-3.5 text-[#dc2626]">Restricted file shares publicly</td>
                  </tr>
                  <tr className="bg-[#fafafa]">
                    <td className="py-2.5 px-3.5 font-medium text-[#09090b]">02 Identity</td>
                    <td className="py-2.5 px-3.5 text-[#52525b]">Guest-authentication test record</td>
                    <td className="py-2.5 px-3.5 text-[#dc2626]">Forwarded link opens anonymously</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-[#09090b]">03 Least privilege</td>
                    <td className="py-2.5 px-3.5 text-[#52525b]">View/download/expiry test</td>
                    <td className="py-2.5 px-3.5 text-[#dc2626]">Guest can download or reshare</td>
                  </tr>
                  <tr className="bg-[#fafafa]">
                    <td className="py-2.5 px-3.5 font-medium text-[#09090b]">04 Authentication</td>
                    <td className="py-2.5 px-3.5 text-[#52525b]">Privileged sign-in evidence</td>
                    <td className="py-2.5 px-3.5 text-[#dc2626]">Admin signs in without enforced MFA</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-[#09090b]">05 Encryption</td>
                    <td className="py-2.5 px-3.5 text-[#52525b]">Transport and key-management evidence</td>
                    <td className="py-2.5 px-3.5 text-[#dc2626]">Unsupported transport or unclear key custody</td>
                  </tr>
                  <tr className="bg-[#fafafa]">
                    <td className="py-2.5 px-3.5 font-medium text-[#09090b]">06 Auditing</td>
                    <td className="py-2.5 px-3.5 text-[#52525b]">Exported event samples</td>
                    <td className="py-2.5 px-3.5 text-[#dc2626]">Cannot identify who accessed a file</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-[#09090b]">07 Leakage</td>
                    <td className="py-2.5 px-3.5 text-[#52525b]">DLP and viewer controls test</td>
                    <td className="py-2.5 px-3.5 text-[#dc2626]">Unrestricted download for high-risk files</td>
                  </tr>
                  <tr className="bg-[#fafafa]">
                    <td className="py-2.5 px-3.5 font-medium text-[#09090b]">08 Content scanning</td>
                    <td className="py-2.5 px-3.5 text-[#52525b]">Quarantine and DLP test</td>
                    <td className="py-2.5 px-3.5 text-[#dc2626]">Suspicious upload or sensitive content passes unchecked</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-[#09090b]">09 Revocation</td>
                    <td className="py-2.5 px-3.5 text-[#52525b]">Post-revoke access test</td>
                    <td className="py-2.5 px-3.5 text-[#dc2626]">Old link remains accessible</td>
                  </tr>
                  <tr className="bg-[#fafafa]">
                    <td className="py-2.5 px-3.5 font-medium text-[#09090b]">10 Retention</td>
                    <td className="py-2.5 px-3.5 text-[#52525b]">Policy, hold and deletion test</td>
                    <td className="py-2.5 px-3.5 text-[#dc2626]">No provable lifecycle action</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-medium text-[#09090b]">11 Vendor risk</td>
                    <td className="py-2.5 px-3.5 text-[#52525b]">Subprocessor/integration risk review</td>
                    <td className="py-2.5 px-3.5 text-[#dc2626]">Unknown data flows or excessive permissions</td>
                  </tr>
                  <tr className="bg-[#fafafa]">
                    <td className="py-2.5 px-3.5 font-medium text-[#09090b]">12 Response</td>
                    <td className="py-2.5 px-3.5 text-[#52525b]">Exercise log and remediation tracker</td>
                    <td className="py-2.5 px-3.5 text-[#dc2626]">No timely escalation or owner</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Stock Image 4 */}
            <div className="my-6">
              <div className="relative w-full aspect-[3/2] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-[#e4e4e7] shadow-xs bg-[#f4f4f5]">
                <Image 
                  src="/blog-images/enterprise-file-audit-evidence.jpg"
                  alt="Organized office records illustrating the importance of file-sharing audit evidence"
                  fill
                  sizes="(max-width: 840px) 100vw, 840px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa] text-[13.5px]">
              <h4 className="font-bold text-[#09090b] mb-1.5">Downloadable-style scoring method</h4>
              <p className="text-[#52525b] leading-relaxed">
                For your internal audit spreadsheet, allocate <strong>2 points for tested pass</strong>, <strong>1 for partial</strong>, and <strong>0 for fail</strong> across 12 controls (maximum 24). Do <strong>not</strong> treat the total as an official certification or risk score. A single severe failure—such as anonymously accessible restricted data—may outweigh a good aggregate score. Record a named owner, evidence link, remediation date and retest outcome for every partial/fail.
              </p>
            </div>
          </section>

          {/* Interactive Practical Audit Checklist Tool */}
          <section id="interactive-audit-checklist" className="scroll-mt-20">
            <div className="p-5 sm:p-6 rounded-2xl border border-[#2563eb]/30 bg-[#eff6ff]/30 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#dbeafe]">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#2563eb]" />
                    <h3 className="text-lg font-bold text-[#09090b]">
                      Interactive 12-Control Audit Evaluator
                    </h3>
                  </div>
                  <p className="text-[13px] text-[#52525b] mt-0.5">
                    Click to test your organization&apos;s current compliance state against the 12 criteria.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-lg bg-white border border-[#bfdbfe] text-center shadow-2xs">
                    <span className="text-[11px] font-mono text-[#64748b] block uppercase">Live Score</span>
                    <span className="text-[17px] font-bold font-mono text-[#2563eb]">{calculatedScore} / 24</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {auditChecklistData.map((item) => {
                  const current = assessmentStatus[item.control];
                  return (
                    <div 
                      key={item.control}
                      className="p-3.5 rounded-xl bg-white border border-[#e2e8f0] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[13px]"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#2563eb]">#{item.control}</span>
                          <span className="font-semibold text-[#0f172a]">{item.requirement}</span>
                          <span className="text-[11px] font-mono text-[#94a3b8]">({item.owner})</span>
                        </div>
                        <p className="text-[12px] text-[#64748b] mt-1 line-clamp-2 md:line-clamp-1">
                          <strong>Test:</strong> {item.test}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => setStatus(item.control, 'pass')}
                          className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                            current === 'pass'
                              ? 'bg-[#16a34a] text-white shadow-2xs font-semibold'
                              : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>Pass (2)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(item.control, 'partial')}
                          className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                            current === 'partial'
                              ? 'bg-[#eab308] text-white shadow-2xs font-semibold'
                              : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                          }`}
                        >
                          <MinusCircle className="w-3 h-3" />
                          <span>Partial (1)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(item.control, 'fail')}
                          className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                            current === 'fail'
                              ? 'bg-[#dc2626] text-white shadow-2xs font-semibold'
                              : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                          }`}
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Fail (0)</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#dbeafe] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#64748b]">
                <span>Scoring rubric: 2 points for tested pass · 1 point for partial · 0 for unverified/fail.</span>
                <span className="font-mono text-[#2563eb]">12 controls · 24 maximum points</span>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="practical-scenario-a-misdirected-board-pack" className="scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4 pb-2 border-b border-[#e4e4e7]">
              Practical scenario: a misdirected board pack
            </h2>
            <p className="mb-4">
              Imagine a finance manager shares a board PDF with an external advisor and accidentally selects the wrong contact. A weak setup allows any holder of the URL to access the entire deck indefinitely. With layered controls, the classified document requires an approved guest identity, the link expires shortly after the meeting, downloading is restricted, and an administrator can revoke access when the mistake is found. Logs show whether the unintended recipient authenticated or viewed the document. This is a <strong>hypothetical walkthrough</strong>, not a reported incident or a product test.
            </p>
            <div className="p-4 rounded-xl border border-[#fed7aa] bg-[#fff7ed] text-[13.5px] text-[#9a3412] leading-relaxed">
              <strong>Crucial limitation:</strong> If a legitimate recipient already downloaded or photographed a page, revoking the URL cannot delete that copy. Dynamic visible watermarks may deter leaks or help attribution, but they cannot guarantee prevention of photos, screenshots, or malicious recording.
            </div>
          </section>

          {/* Section 6 */}
          <section id="30-day-implementation-plan" className="scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4 pb-2 border-b border-[#e4e4e7]">
              30-day implementation plan
            </h2>
            <div className="rounded-xl border border-[#e4e4e7] overflow-x-auto mb-4 shadow-2xs">
              <table className="w-full text-left text-[13px] border-collapse min-w-[580px]">
                <thead>
                  <tr className="bg-[#f4f4f5] border-b border-[#e4e4e7]">
                    <th className="py-3 px-3.5 font-bold text-[#09090b] w-[140px]">Period</th>
                    <th className="py-3 px-3.5 font-bold text-[#09090b]">Action</th>
                    <th className="py-3 px-3.5 font-bold text-[#09090b]">Output and exit criteria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e4e7] bg-white">
                  <tr>
                    <td className="py-3 px-3.5 font-bold text-[#09090b] whitespace-nowrap">Days 1–7</td>
                    <td className="py-3 px-3.5 text-[#52525b]">Inventory tools, shared links, external identities, sensitivity classes and owners</td>
                    <td className="py-3 px-3.5 text-[#52525b]">List of systems and high-risk exposures; accountable owners named</td>
                  </tr>
                  <tr className="bg-[#fafafa]">
                    <td className="py-3 px-3.5 font-bold text-[#09090b] whitespace-nowrap">Days 8–14</td>
                    <td className="py-3 px-3.5 text-[#52525b]">Enforce named recipients, role limits, expiry, MFA and encrypted transport</td>
                    <td className="py-3 px-3.5 text-[#52525b]">Controlled test files pass the access/expiry matrix</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3.5 font-bold text-[#09090b] whitespace-nowrap">Days 15–21</td>
                    <td className="py-3 px-3.5 text-[#52525b]">Enable logs, DLP, content scanning, revocation and lifecycle rules</td>
                    <td className="py-3 px-3.5 text-[#52525b]">Exportable evidence and tested exception process</td>
                  </tr>
                  <tr className="bg-[#fafafa]">
                    <td className="py-3 px-3.5 font-bold text-[#09090b] whitespace-nowrap">Days 22–30</td>
                    <td className="py-3 px-3.5 text-[#52525b]">Review vendors and run mistaken-share tabletop</td>
                    <td className="py-3 px-3.5 text-[#52525b]">Written incident timeline, gaps, remediation owners and retest dates</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[13.5px] text-[#52525b]">
              Start with the riskiest flows, not with a blanket migration. For example, fundraising documents, HR records, legal discovery files, customer personal data and source-code secrets each have different lifecycle and monitoring requirements.
            </p>
          </section>

          {/* Section 7 */}
          <section id="what-vendors-must-prove" className="scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4 pb-2 border-b border-[#e4e4e7]">
              What vendors must prove
            </h2>
            <p className="mb-4">
              Request evidence rather than accepting the words “enterprise grade.” Ask for the relevant audit scope (if available), encryption and key-management documentation, guest-authentication behavior, downloadable event logs, data-location/subprocessor disclosures, deletion and retention procedures, service-level details, and a test environment. Confirm which capabilities are included in the actual contract tier. If you cannot test something directly, classify it as vendor-attested rather than independently verified.
            </p>
            <p>
              The choice between a collaboration suite, governed content platform and controlled external-sharing portal should depend on workflow. Authoring and co-editing, retention governance and external viewer analytics are different requirements; no single tool automatically covers every one of them.
            </p>
          </section>

          {/* Section 8 */}
          <section id="common-mistakes-and-limitations" className="scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4 pb-2 border-b border-[#e4e4e7]">
              Common mistakes and limitations
            </h2>
            <div className="space-y-3 text-[14px]">
              <div className="p-3.5 rounded-lg border border-[#e4e4e7] bg-[#fafafa]">
                <strong className="text-[#09090b]">Mistake 1 — Equating a password-protected URL with verified identity:</strong> Shared passwords may circulate; use named recipient verification for sensitive workflows.
              </div>
              <div className="p-3.5 rounded-lg border border-[#e4e4e7] bg-[#fafafa]">
                <strong className="text-[#09090b]">Mistake 2 — Claiming screenshots are impossible:</strong> Viewer controls and watermarks are deterrents. Never promise absolute containment of displayed information.
              </div>
              <div className="p-3.5 rounded-lg border border-[#e4e4e7] bg-[#fafafa]">
                <strong className="text-[#09090b]">Mistake 3 — Counting logged events without testing them:</strong> If a log omits identity, object, outcome or reliable timestamps, investigators may be unable to reconstruct an incident.
              </div>
              <div className="p-3.5 rounded-lg border border-[#e4e4e7] bg-[#fafafa]">
                <strong className="text-[#09090b]">Mistake 4 — Applying one retention period to everything:</strong> Business records, contractual obligations, litigation holds and privacy deletion rules can conflict. Put legal and records owners in the decision loop.
              </div>
              <div className="p-3.5 rounded-lg border border-[#e4e4e7] bg-[#fafafa]">
                <strong className="text-[#09090b]">Mistake 5 — Treating “SOC 2 compliant” as a universal stamp:</strong> Inspect the actual report, control coverage, exceptions and service boundaries; SOC 2 is an attestation framework, not a catch-all security guarantee.
              </div>
            </div>
          </section>

          {/* Section 9: FAQ */}
          <section id="frequently-asked-questions" className="scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4 pb-2 border-b border-[#e4e4e7]">
              Frequently asked questions
            </h2>
            <BlogFaqAccordion items={faqItems} defaultOpenIndex={0} />
          </section>

          {/* Section: Related Reading */}
          <section id="related-reading" className="scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4 pb-2 border-b border-[#e4e4e7]">
              Related reading &amp; internal guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              <Link
                href="/blog/best-document-management-systems"
                className="p-4 rounded-xl border border-[#e4e4e7] bg-white hover:border-[#2563eb] transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-[#2563eb] font-semibold uppercase">Cornerstone Comparison</span>
                  <h4 className="font-bold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mt-1">
                    Best Document Management Systems (2026)
                  </h4>
                  <p className="text-[12px] text-[#71717a] mt-1 line-clamp-2">
                    DocSend vs SendNow vs Box vs Google Drive: pricing, audit logs, and verified reviews.
                  </p>
                </div>
                <div className="mt-3 text-[12px] font-medium text-[#2563eb] flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                href="/blog/setting-up-virtual-data-room-seed-series-a-due-diligence"
                className="p-4 rounded-xl border border-[#e4e4e7] bg-white hover:border-[#2563eb] transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-[#2563eb] font-semibold uppercase">Due Diligence Guide</span>
                  <h4 className="font-bold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mt-1">
                    Virtual Data Room for Seed &amp; Series A
                  </h4>
                  <p className="text-[12px] text-[#71717a] mt-1 line-clamp-2">
                    VDR folder taxonomy, watermarking checklists, and investor engagement workflows.
                  </p>
                </div>
                <div className="mt-3 text-[12px] font-medium text-[#2563eb] flex items-center gap-1">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                href="/categories/secure-file-sharing"
                className="p-4 rounded-xl border border-[#e4e4e7] bg-white hover:border-[#2563eb] transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-[#71717a] font-semibold uppercase">Category Directory</span>
                  <h4 className="font-bold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mt-1">
                    Secure File Sharing Directory
                  </h4>
                  <p className="text-[12px] text-[#71717a] mt-1 line-clamp-2">
                    Browse all audited and verified client portal and encrypted transfer platforms.
                  </p>
                </div>
                <div className="mt-3 text-[12px] font-medium text-[#2563eb] flex items-center gap-1">
                  <span>Explore Category</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                href="/categories/virtual-data-rooms"
                className="p-4 rounded-xl border border-[#e4e4e7] bg-white hover:border-[#2563eb] transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-[#71717a] font-semibold uppercase">Category Directory</span>
                  <h4 className="font-bold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mt-1">
                    Virtual Data Rooms Directory
                  </h4>
                  <p className="text-[12px] text-[#71717a] mt-1 line-clamp-2">
                    Compare M&amp;A and fundraising data room software with granular permissions.
                  </p>
                </div>
                <div className="mt-3 text-[12px] font-medium text-[#2563eb] flex items-center gap-1">
                  <span>Explore Category</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>
          </section>

          {/* Bottom Author Card */}
          <AuthorCard 
            name="Mohamed Siraj"
            role="Founder, SecureTools.live"
            bio="Mohamed is the founder of SecureTools.live. He leads the team in building secure, compliant, and privacy-first directory tooling for software teams, finance professionals, and enterprise security leaders worldwide."
            avatarUrl="/images/authors/mohamed-siraj.png"
            linkedinUrl="https://www.linkedin.com/in/mohamed-siraj-1a1910234/"
          />

        </div>
      </div>
    </div>
  );
}
