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
  FolderLock, 
  Briefcase, 
  BookOpen 
} from 'lucide-react';
import { BlogFaqAccordion, FaqItem } from '@/components/blog/BlogFaqAccordion';
import { AuthorHeader } from '@/components/blog/AuthorHeader';
import { AuthorCard } from '@/components/blog/AuthorCard';

export function AnonymizeCustomerDataBeforeSharingArticle() {
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    'c1': false,
    'c2': false,
    'c3': false,
    'c4': false,
    'c5': false,
    'c6': false,
    'c7': false,
    'c8': false,
    'c9': false,
    'c10': false,
    'c11': false,
  });

  const toggleCheck = (id: string) => {
    setChecklistState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": "https://securetools.live/blog/anonymize-customer-data-before-sharing#article",
      "headline": "How to Anonymize Customer Data Before Sharing It",
      "description": "Sharing a dataset safely requires reducing re-identification risk, not merely removing names from a spreadsheet. Treat anonymity as a risk assessment tied to data context, not a single redaction action.",
      "datePublished": "2026-10-27",
      "dateModified": "2026-10-27",
      "mainEntityOfPage": {
        "@id": "https://securetools.live/blog/anonymize-customer-data-before-sharing"
      },
      "image": "/blog-images/anonymize-customer-data-before-sharing-cover.jpg",
      "citation": [
        "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/",
        "https://www.nist.gov/privacy-framework"
      ],
      "author": {
        "@type": "Person",
        "name": "Mohamed Siraj",
        "url": "https://www.linkedin.com/in/mohamed-siraj-1a1910234/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SecureTools.live",
        "url": "https://securetools.live"
      },
      "inLanguage": "en",
      "isAccessibleForFree": true
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://securetools.live/blog/anonymize-customer-data-before-sharing#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://securetools.live"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://securetools.live/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Document Workflow & Automation",
          "item": "https://securetools.live/categories/document-workflow-automation"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "How to Anonymize Customer Data Before Sharing It",
          "item": "https://securetools.live/blog/anonymize-customer-data-before-sharing"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://securetools.live/blog/anonymize-customer-data-before-sharing#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the fastest safe first step?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Treat anonymity as a risk assessment tied to data context, not a single redaction action. Write down the minimum required disclosure before selecting any product setting. Test that narrow path on a harmless file and ensure a teammate can explain the result."
          }
        },
        {
          "@type": "Question",
          "name": "Which problem does a restriction not solve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It does not by itself solve linking quasi-identifiers to individuals using outside knowledge. Rules applied to a file or link cannot undo all information a legitimate recipient has already seen. Equally, a feature name does not establish the architecture, operating-system behavior, or legal enforceability of a given implementation."
          }
        },
        {
          "@type": "Question",
          "name": "When do the checks need repeating?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Reassess when a small segment contains a unique purchase and location combination, the intended recipient set changes, or the document has materially new contents. A review of the latest version is better evidence than relying indefinitely on the approval of the first file."
          }
        }
      ]
    }
  ]
};

  const tocItems = [
  {
    "title": "Inventory the purpose and fields",
    "id": "inventory-the-purpose-and-fields"
  },
  {
    "title": "Identify direct and indirect identifiers",
    "id": "identify-direct-and-indirect-identifiers"
  },
  {
    "title": "Choose the release unit",
    "id": "choose-the-release-unit"
  },
  {
    "title": "Handle rare combinations",
    "id": "handle-rare-combinations"
  },
  {
    "title": "Separate tokenization from anonymization",
    "id": "separate-tokenization-from-anonymization"
  },
  {
    "title": "Consider linkage attacks",
    "id": "consider-linkage-attacks"
  },
  {
    "title": "Measure utility after transformation",
    "id": "measure-utility-after-transformation"
  },
  {
    "title": "Review free-text fields",
    "id": "review-free-text-fields"
  },
  {
    "title": "Control the transformation process",
    "id": "control-the-transformation-process"
  },
  {
    "title": "Assess residual risk honestly",
    "id": "assess-residual-risk-honestly"
  },
  {
    "title": "Prepare the recipient agreement",
    "id": "prepare-the-recipient-agreement"
  },
  {
    "title": "Review again before updates",
    "id": "review-again-before-updates"
  },
  {
    "title": "Comparison and decision table",
    "id": "comparison-and-decision-table"
  },
  {
    "title": "Practical release checklist",
    "id": "practical-release-checklist"
  },
  {
    "title": "Questions to ask",
    "id": "questions-to-ask"
  },
  {
    "title": "Keep reading",
    "id": "keep-reading"
  },
  {
    "title": "Authoritative sources & standards",
    "id": "sources-and-references"
  }
];

  const faqItems: FaqItem[] = [
  {
    "q": "What is the fastest safe first step?",
    "a": "Treat anonymity as a risk assessment tied to data context, not a single redaction action. Write down the minimum required disclosure before selecting any product setting. Test that narrow path on a harmless file and ensure a teammate can explain the result."
  },
  {
    "q": "Which problem does a restriction not solve?",
    "a": "It does not by itself solve linking quasi-identifiers to individuals using outside knowledge. Rules applied to a file or link cannot undo all information a legitimate recipient has already seen. Equally, a feature name does not establish the architecture, operating-system behavior, or legal enforceability of a given implementation."
  },
  {
    "q": "When do the checks need repeating?",
    "a": "Reassess when a small segment contains a unique purchase and location combination, the intended recipient set changes, or the document has materially new contents. A review of the latest version is better evidence than relying indefinitely on the approval of the first file."
  }
];

  const checklistItems = [
  {
    "id": "c1",
    "text": "State the real recipient task in one sentence."
  },
  {
    "id": "c2",
    "text": "Check for unnecessary sensitive material, comments, attached files, and metadata."
  },
  {
    "id": "c3",
    "text": "Assign a person accountable for the release."
  },
  {
    "id": "c4",
    "text": "Confirm the intended recipient and access route."
  },
  {
    "id": "c5",
    "text": "Use a sanitized test file before sharing live content."
  },
  {
    "id": "c6",
    "text": "Verify the authorized recipient experience."
  },
  {
    "id": "c7",
    "text": "Test a denial or expired-access scenario where applicable."
  },
  {
    "id": "c8",
    "text": "Record version identifiers and dates."
  },
  {
    "id": "c9",
    "text": "Check that recipients with accessibility needs can complete the task."
  },
  {
    "id": "c10",
    "text": "Document residual risk, including legitimate saved or photographed copies."
  },
  {
    "id": "c11",
    "text": "Prepare a correction or incident contact."
  }
];

  const sources = [
  {
    "organization": "Information Commissioner's Office (UK ICO)",
    "title": "ICO Guidance on Data Sharing & Anonymisation Code of Practice",
    "url": "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/",
    "description": "Regulatory guidance on differential privacy, pseudonymisation, k-anonymity, and the motivated intruder re-identification test."
  },
  {
    "organization": "National Institute of Standards and Technology (NIST)",
    "title": "NIST Privacy Framework: Data Processing and De-Identification Principles",
    "url": "https://www.nist.gov/privacy-framework",
    "description": "Standards for managing re-identification risks and managing data processing lifecycles across external parties."
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
          <Link href="/blog" className="inline-flex items-center gap-1.5 font-medium hover:text-[#09090b] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="SecureTools" width={16} height={16} className="w-4 h-4 rounded-sm object-contain" />
            <span className="font-geist">securetools.live • October 2026</span>
          </div>
        </div>

        {/* Category & Badge */}
        <div className="flex items-center gap-2 mb-3 text-[11px] font-mono uppercase tracking-wider text-[#71717a]">
          <Link href="/categories/document-workflow-automation" className="text-[#2563eb] font-semibold hover:underline">
            Document Workflow & Automation
          </Link>
          <span>•</span>
          <span>Data Privacy Guide</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] font-bold tracking-tight text-[#09090b] leading-[1.18] mb-4 font-geist">
          How to Anonymize Customer Data Before Sharing It
        </h1>

        <AuthorHeader publishDate="October 27, 2026" readTime="14 min read" />

        {/* Hero Cover Stock Image */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-7 border border-[#e4e4e7] shadow-xs bg-[#f4f4f5]">
          <Image src="/blog-images/anonymize-customer-data-before-sharing-cover.jpg" alt="Data privacy compliance and customer record anonymization" fill sizes="(max-width: 840px) 100vw, 840px" className="object-cover" priority />
        </div>

        <div className="rounded-2xl border border-[#e4e4e7] bg-[#fbfbfb] p-5 sm:p-6 mb-7 shadow-2xs">
          <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-2.5">
            <Info className="w-4 h-4 text-[#2563eb] shrink-0" />
            <span>TL;DR / EXECUTIVE SUMMARY</span>
          </div>
          <p className="text-[14px] sm:text-[14.5px] text-[#27272a] leading-relaxed font-normal">
            Sharing a dataset safely requires reducing re-identification risk, not merely removing names from a spreadsheet. Treat anonymity as a risk assessment tied to data context, not a single redaction action.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e4e4e7] bg-[#fafafa] p-5 sm:p-6 mb-10 shadow-2xs">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#e4e4e7]">
            <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b]">
              <List className="w-4 h-4 text-[#71717a]" />
              <span>TABLE OF CONTENTS</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
              17 sections
            </span>
          </div>
          <div className="flex flex-col space-y-2 text-[13.5px]">
            {tocItems.map((item, idx) => (
              <a key={item.id} href={'#' + item.id} className="text-[#3f3f46] hover:text-[#09090b] hover:underline flex items-baseline gap-2.5 py-1 border-b border-[#f4f4f5] last:border-b-0 transition-colors">
                <span className="font-mono text-[11px] text-[#a1a1aa] shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                <span className="leading-snug">{item.title}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed text-[#27272a]">
          <section id="why-this-question-matters" className="space-y-4 pt-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              Why this question matters
            </h2>
            <p>This guide focuses on <strong className="text-zinc-900 font-semibold">customer data anonymization workflow</strong>, not on every possible document-security feature. The reader is an analyst preparing a customer-data sample for outside review handling a row-level export with purchase dates, postal codes, and account metadata. The decision is consequential because linking quasi-identifiers to individuals using outside knowledge. A useful answer must separate what the team can control before release, what a recipient can legitimately do after access, and what evidence will remain if something needs to be corrected.</p>
            <p>Imagine this as a hypothetical review, not a report of an actual customer incident: a small segment contains a unique purchase and location combination. The immediate temptation is to add another restriction or resend a file quickly. A better first action is to clarify the intended disclosure and verify what was already shared. That distinction shapes the examples and review steps below. No service or format can promise that an authorized human will never copy information.</p>
            <p><strong className="text-zinc-900 font-semibold">What this article does not claim:</strong> it does not certify any tool, test a vendor, offer legal advice, or promise that encryption, permissions, or watermarking makes a recipient incapable of extracting content. Configuration and endpoint behavior matter.</p>
          </section>

          <section id="inventory-the-purpose-and-fields" className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              1. Inventory the purpose and fields
            </h2>
            <p className="text-[15px] leading-relaxed">
              <strong className="text-[#09090b] font-semibold">How to apply this step:</strong> Write down why each column is needed and who will receive it. Remove fields with no legitimate analytical value before anonymizing anything. A minimized dataset is easier to protect and easier to explain.
            </p>
            <div className="rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-4.5 my-3 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span>PRACTICAL REVIEW RECORD</span>
              </div>
              <p className="text-[13.5px] text-[#3f3f46] leading-relaxed">
                For this stage, write down the decision made, the file/version used, the reader role, and an observed result. Anchor that record to this concrete question: Remove fields with no legitimate analytical value before anonymizing anything. If the recipient’s task cannot be completed under the proposed restriction, design a narrowly scoped exception and retest with a sanitized copy.
              </p>
            </div>
          </section>

          <section id="identify-direct-and-indirect-identifiers" className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              2. Identify direct and indirect identifiers
            </h2>
            <p className="text-[15px] leading-relaxed">
              <strong className="text-[#09090b] font-semibold">How to apply this step:</strong> Names, emails, and account numbers are obvious identifiers. Combinations of age, date, location, transaction amount, or rare behavior can also identify a person. A dataset may become recognizable when compared with outside information.
            </p>
            <div className="rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-4.5 my-3 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span>PRACTICAL REVIEW RECORD</span>
              </div>
              <p className="text-[13.5px] text-[#3f3f46] leading-relaxed">
                For this stage, write down the decision made, the file/version used, the reader role, and an observed result. Anchor that record to this concrete question: Combinations of age, date, location, transaction amount, or rare behavior can also identify a person. If the recipient’s task cannot be completed under the proposed restriction, design a narrowly scoped exception and retest with a sanitized copy.
              </p>
            </div>
            <div className="my-8 rounded-2xl overflow-hidden border border-[#e4e4e7] shadow-xs">
              <Image src="/blog-images/anonymize-customer-data-before-sharing-img1.jpg" alt="Auditing direct identifiers and quasi-identifiers in enterprise databases" width={840} height={472} className="w-full h-auto object-cover" loading="lazy" />
            </div>
          </section>

          <section id="choose-the-release-unit" className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              3. Choose the release unit
            </h2>
            <p className="text-[15px] leading-relaxed">
              <strong className="text-[#09090b] font-semibold">How to apply this step:</strong> Decide whether the recipient truly needs individual rows. Aggregates, ranges, synthetic examples, and summary statistics may answer the question with lower risk. The appropriate unit of disclosure is a strategic decision, not merely a file setting.
            </p>
            <div className="rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-4.5 my-3 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span>PRACTICAL REVIEW RECORD</span>
              </div>
              <p className="text-[13.5px] text-[#3f3f46] leading-relaxed">
                For this stage, write down the decision made, the file/version used, the reader role, and an observed result. Anchor that record to this concrete question: Aggregates, ranges, synthetic examples, and summary statistics may answer the question with lower risk. If the recipient’s task cannot be completed under the proposed restriction, design a narrowly scoped exception and retest with a sanitized copy.
              </p>
            </div>
          </section>

          <section id="handle-rare-combinations" className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              4. Handle rare combinations
            </h2>
            <p className="text-[15px] leading-relaxed">
              <strong className="text-[#09090b] font-semibold">How to apply this step:</strong> Small groups create high re-identification risk. Generalize precise dates to broader periods, group sparse locations, suppress extreme outliers where appropriate, and assess the effect on analytical usefulness. Preserve a record of tradeoffs.
            </p>
            <div className="rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-4.5 my-3 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span>PRACTICAL REVIEW RECORD</span>
              </div>
              <p className="text-[13.5px] text-[#3f3f46] leading-relaxed">
                For this stage, write down the decision made, the file/version used, the reader role, and an observed result. Anchor that record to this concrete question: Generalize precise dates to broader periods, group sparse locations, suppress extreme outliers where appropriate, and assess the effect on analytical usefulness. If the recipient’s task cannot be completed under the proposed restriction, design a narrowly scoped exception and retest with a sanitized copy.
              </p>
            </div>
          </section>

          <section id="separate-tokenization-from-anonymization" className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              5. Separate tokenization from anonymization
            </h2>
            <p className="text-[15px] leading-relaxed">
              <strong className="text-[#09090b] font-semibold">How to apply this step:</strong> Replacing names with random IDs can help reduce immediate exposure, but if a lookup table exists or data patterns remain linkable the dataset may still be personal. Use the correct description and control access to mapping materials.
            </p>
          </section>

          <section id="consider-linkage-attacks" className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              6. Consider linkage attacks
            </h2>
            <p className="text-[15px] leading-relaxed">
              <strong className="text-[#09090b] font-semibold">How to apply this step:</strong> Ask what a recipient could infer using public records, social media, other customer data, or its own transaction history. Test plausible combinations rather than considering each column in isolation. Document the attacker knowledge assumptions.
            </p>
            <div className="rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-4.5 my-3 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span>PRACTICAL REVIEW RECORD</span>
              </div>
              <p className="text-[13.5px] text-[#3f3f46] leading-relaxed">
                For this stage, write down the decision made, the file/version used, the reader role, and an observed result. Anchor that record to this concrete question: Test plausible combinations rather than considering each column in isolation. If the recipient’s task cannot be completed under the proposed restriction, design a narrowly scoped exception and retest with a sanitized copy.
              </p>
            </div>
            <div className="my-8 rounded-2xl overflow-hidden border border-[#e4e4e7] shadow-xs">
              <Image src="/blog-images/anonymize-customer-data-before-sharing-img2.jpg" alt="Applying k-anonymity, suppression, and tokenization to customer datasets" width={840} height={472} className="w-full h-auto object-cover" loading="lazy" />
            </div>
          </section>

          <section id="measure-utility-after-transformation" className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              7. Measure utility after transformation
            </h2>
            <p className="text-[15px] leading-relaxed">
              <strong className="text-[#09090b] font-semibold">How to apply this step:</strong> Anonymization can distort totals, cohorts, trends, and rare-event analysis. Compare the transformed output with the source on approved metrics. If an analytic answer changes substantially, disclose that limitation instead of silently reporting false precision.
            </p>
            <div className="rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-4.5 my-3 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span>PRACTICAL REVIEW RECORD</span>
              </div>
              <p className="text-[13.5px] text-[#3f3f46] leading-relaxed">
                For this stage, write down the decision made, the file/version used, the reader role, and an observed result. Anchor that record to this concrete question: Compare the transformed output with the source on approved metrics. If the recipient’s task cannot be completed under the proposed restriction, design a narrowly scoped exception and retest with a sanitized copy.
              </p>
            </div>
          </section>

          <section id="review-free-text-fields" className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              8. Review free-text fields
            </h2>
            <p className="text-[15px] leading-relaxed">
              <strong className="text-[#09090b] font-semibold">How to apply this step:</strong> Support tickets, notes, survey responses, and document titles may include identifiers unexpectedly. Simple column removal is not enough when narrative fields remain. Manual review or narrowly scoped transformation is often necessary.
            </p>
            <div className="rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-4.5 my-3 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span>PRACTICAL REVIEW RECORD</span>
              </div>
              <p className="text-[13.5px] text-[#3f3f46] leading-relaxed">
                For this stage, write down the decision made, the file/version used, the reader role, and an observed result. Anchor that record to this concrete question: Simple column removal is not enough when narrative fields remain. If the recipient’s task cannot be completed under the proposed restriction, design a narrowly scoped exception and retest with a sanitized copy.
              </p>
            </div>
          </section>

          <section id="control-the-transformation-process" className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              9. Control the transformation process
            </h2>
            <p className="text-[15px] leading-relaxed">
              <strong className="text-[#09090b] font-semibold">How to apply this step:</strong> Keep raw source access restricted, separate input and output storage, record scripts and parameters, and use review approvals before release. A transformation file should not silently travel with the shared export.
            </p>
            <div className="my-8 rounded-2xl overflow-hidden border border-[#e4e4e7] shadow-xs">
              <Image src="/blog-images/anonymize-customer-data-before-sharing-img3.jpg" alt="Drafting data sharing agreements and managing re-identification risk" width={840} height={472} className="w-full h-auto object-cover" loading="lazy" />
            </div>
          </section>

          <section id="assess-residual-risk-honestly" className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              10. Assess residual risk honestly
            </h2>
            <p className="text-[15px] leading-relaxed">
              <strong className="text-[#09090b] font-semibold">How to apply this step:</strong> Anonymity is contextual and can change as outside data becomes available. Record recipients, likely linkage information, dataset uniqueness, and any controls on further sharing. Avoid claiming zero risk unless that claim can be defended.
            </p>
            <div className="rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-4.5 my-3 shadow-2xs">
              <div className="flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-wider text-[#09090b] mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span>PRACTICAL REVIEW RECORD</span>
              </div>
              <p className="text-[13.5px] text-[#3f3f46] leading-relaxed">
                For this stage, write down the decision made, the file/version used, the reader role, and an observed result. Anchor that record to this concrete question: Record recipients, likely linkage information, dataset uniqueness, and any controls on further sharing. If the recipient’s task cannot be completed under the proposed restriction, design a narrowly scoped exception and retest with a sanitized copy.
              </p>
            </div>
          </section>

          <section id="prepare-the-recipient-agreement" className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              11. Prepare the recipient agreement
            </h2>
            <p className="text-[15px] leading-relaxed">
              <strong className="text-[#09090b] font-semibold">How to apply this step:</strong> Explain approved use, onward disclosure limits, retention, deletion, and whom to contact if an identity is suspected. Legal or contractual controls complement technical anonymization; they do not retroactively make identifiable data anonymous.
            </p>
          </section>

          <section id="review-again-before-updates" className="space-y-4 pt-2 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              12. Review again before updates
            </h2>
            <p className="text-[15px] leading-relaxed">
              <strong className="text-[#09090b] font-semibold">How to apply this step:</strong> Repeating releases can expose patterns even if each extract looked safe independently. Track which versions were shared, whether identifiers stay stable, and whether cumulative disclosures increase the likelihood of linking a record to a person.
            </p>
          </section>

          <section id="comparison-and-decision-table" className="space-y-4 pt-4 border-t border-[#e4e4e7] scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-2">
              Comparison and decision table
            </h2>
            <div className="overflow-x-auto rounded-xl border border-[#e4e4e7] my-4 shadow-2xs">
              <table className="w-full text-left border-collapse border border-[#e4e4e7] text-[13.5px]">
                <thead className="bg-[#f4f4f5] text-[#09090b] font-semibold text-[13px]">
                  <tr>
                    <th className="p-3 border border-[#e4e4e7]">Reader situation</th>
                    <th className="p-3 border border-[#e4e4e7]">Starting approach</th>
                    <th className="p-3 border border-[#e4e4e7]">What to verify</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e4e7] bg-white text-[#3f3f46]">
                  <tr>
                    <td className="p-3 border border-[#e4e4e7]">Routine controlled review</td>
                    <td className="p-3 border border-[#e4e4e7]">Minimize columns, aggregate rare values, and test plausible re-identification</td>
                    <td className="p-3 border border-[#e4e4e7]">A named reader can complete the narrow task</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-[#e4e4e7]">Unexpected new recipient</td>
                    <td className="p-3 border border-[#e4e4e7]">Pause and reassess permissions</td>
                    <td className="p-3 border border-[#e4e4e7]">Identity, purpose, inherited access, and version</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-[#e4e4e7]">Sensitive exception</td>
                    <td className="p-3 border border-[#e4e4e7]">Record approval for the exception only</td>
                    <td className="p-3 border border-[#e4e4e7]">Who approved it and when it ends</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-[#e4e4e7]">Updated or incorrect document</td>
                    <td className="p-3 border border-[#e4e4e7]">Issue a clearly labeled version</td>
                    <td className="p-3 border border-[#e4e4e7]">Who has the older copy and what can be revoked</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-[#e4e4e7]">Use the table to start a discussion, not as a claim that every team has the same confidentiality, legal, or accessibility obligations. The final choice should be proportional to the document, the recipient, and the reasonably foreseeable misuse.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="practical-release-checklist" className="space-y-4 pt-4 border-t border-[#e4e4e7] scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-2">
              Practical release checklist
            </h2>
            <div className="rounded-2xl border border-[#e4e4e7] bg-[#fbfbfb] p-5 sm:p-6 my-4 shadow-2xs">
              <div className="space-y-3">
                {checklistItems.map(item => (
                  <label key={item.id} className="flex items-start gap-3 cursor-pointer group select-none text-[14px] text-[#27272a]">
                    <input type="checkbox" checked={checklistState[item.id] || false} onChange={() => toggleCheck(item.id)} className="mt-1 h-4 w-4 rounded-xs border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    <span className={checklistState[item.id] ? 'line-through text-[#a1a1aa]' : 'group-hover:text-[#09090b]'}>{item.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section id="questions-to-ask" className="space-y-4 pt-4 border-t border-[#e4e4e7] scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] border-b border-[#e4e4e7] pb-2.5">
              Questions to ask (FAQ)
            </h2>
            <BlogFaqAccordion items={faqItems} />
          </section>

          {/* Authoritative Sources & Technical References */}
          <section id="sources-and-references" className="space-y-4 pt-4 border-t border-[#e4e4e7] scroll-mt-20">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-[#2563eb]" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b]">
                Authoritative sources & standards
              </h2>
            </div>
            <p className="text-[14px] text-[#71717a] leading-relaxed">
              The technical controls, cryptographic standards, and procedural recommendations in this guide are informed by verified industry frameworks and official documentation:
            </p>
            <div className="grid grid-cols-1 gap-3 pt-2">
              {sources.map((src, idx) => (
                <a 
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between p-4 rounded-xl border border-[#e4e4e7] bg-[#fafafa] hover:bg-[#f4f4f5] hover:border-[#d4d4d8] transition-all group shadow-2xs"
                >
                  <div className="pr-4 space-y-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#2563eb] font-semibold">
                      {src.organization}
                    </div>
                    <div className="font-semibold text-[14.5px] text-[#09090b] group-hover:text-[#2563eb] transition-colors leading-snug">
                      {src.title}
                    </div>
                    <p className="text-[12.5px] text-[#71717a] leading-relaxed">
                      {src.description}
                    </p>
                    <div className="text-[11.5px] font-mono text-[#a1a1aa] group-hover:text-[#71717a] transition-colors pt-1 flex items-center gap-1 break-all">
                      <span>{src.url}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#71717a] group-hover:text-[#2563eb] transition-colors shrink-0 mt-1" />
                </a>
              ))}
            </div>
          </section>

          <section id="keep-reading" className="space-y-4 pt-6 border-t border-[#e4e4e7] scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090b] mb-4">
              Keep reading
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/blog/share-protected-pdfs-with-screen-reader-users" className="p-4 rounded-xl border border-[#e4e4e7] hover:border-[#09090b] transition-colors bg-white block group shadow-2xs">
                <div className="font-semibold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mb-1">
                  How to Share Protected PDFs With Screen-Reader Users
                </div>
                <p className="text-[12.5px] text-[#71717a] line-clamp-2">
                  Explore practical operational workflows and security controls in our verified knowledge base.
                </p>
              </Link>
              <Link href="/blog/share-financial-model-investors-securely" className="p-4 rounded-xl border border-[#e4e4e7] hover:border-[#09090b] transition-colors bg-white block group shadow-2xs">
                <div className="font-semibold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mb-1">
                  How to Share a Financial Model With Investors Securely
                </div>
                <p className="text-[12.5px] text-[#71717a] line-clamp-2">
                  Explore practical operational workflows and security controls in our verified knowledge base.
                </p>
              </Link>
              <Link href="/blog/e2ee-vs-encryption-at-rest-ma-teams" className="p-4 rounded-xl border border-[#e4e4e7] hover:border-[#09090b] transition-colors bg-white block group shadow-2xs">
                <div className="font-semibold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mb-1">
                  End-to-End Encryption vs Encryption at Rest for Deal Teams
                </div>
                <p className="text-[12.5px] text-[#71717a] line-clamp-2">
                  Explore practical operational workflows and security controls in our verified knowledge base.
                </p>
              </Link>
              <Link href="/blog/check-whether-your-pdf-is-encrypted" className="p-4 rounded-xl border border-[#e4e4e7] hover:border-[#09090b] transition-colors bg-white block group shadow-2xs">
                <div className="font-semibold text-[14px] text-[#09090b] group-hover:text-[#2563eb] transition-colors mb-1">
                  How to Check Whether a PDF Is Encrypted
                </div>
                <p className="text-[12.5px] text-[#71717a] line-clamp-2">
                  Explore practical operational workflows and security controls in our verified knowledge base.
                </p>
              </Link>
            </div>
          </section>

          <div className="pt-6">
            <AuthorCard />
          </div>
        </div>
      </div>
    </div>
  );
}
